import { Container } from '@/pages/Menu';
import { shareFile } from 'tauri-plugin-share';
import { writeTextFile, writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir, join, documentDir } from '@tauri-apps/api/path';

// Función separada para compartir archivos
export async function shareInvoiceFile(container: Container, htmlContent: string): Promise<void> {
    const timestamp = Date.now();

    try {
        console.log('🔄 Generando PDF en servidor...');

        // Preparar el payload para la API
        const payload = {
            template: container.template,
            name: `${container.title.replace(/\s+/g, '_')}_factura_${timestamp}`,
            content: htmlContent
        };
        console.log('Payload para generación de PDF:', JSON.stringify(payload, null, 2));
        // Generar PDF en el servidor
        const response = await fetch('https://pdfconvertor.hermesbackend.xyz/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor PDF: ${response.status} ${response.statusText}`);
        }

        // Obtener el binario del PDF
        const pdfBlob = await response.blob();
        console.log('✅ PDF generado exitosamente');

        // Estrategias para guardar y compartir el PDF
        const strategies = [
            {
                name: 'Documents Directory PDF',
                async execute() {
                    const fileName = `factura_${container.id}_${timestamp}.pdf`;

                    // Convertir blob a array buffer para escribir
                    const arrayBuffer = await pdfBlob.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Escribir el PDF en Documents
                    await writeFile(fileName, uint8Array, {
                        baseDir: BaseDirectory.Document
                    });

                    const docPath = await documentDir();
                    return await join(docPath, fileName);
                }
            },
            {
                name: 'App Data Directory PDF',
                async execute() {
                    const fileName = `factura_${container.id}_${timestamp}.pdf`;

                    const arrayBuffer = await pdfBlob.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);

                    await writeFile(fileName, uint8Array, {
                        baseDir: BaseDirectory.AppData
                    });

                    const appPath = await appDataDir();
                    return await join(appPath, fileName);
                }
            }
        ];

        // Intentar cada estrategia
        for (const strategy of strategies) {
            try {
                console.log(`📁 Intentando guardar PDF con: ${strategy.name}`);
                const filePath = await strategy.execute();
                console.log(`✅ PDF guardado en: ${filePath}`);

                // Compartir el PDF
                await shareFile(filePath, 'application/pdf');
                console.log(`🎉 PDF compartido exitosamente usando: ${strategy.name}`);

                // Limpiar PDF del servidor después del éxito
                try {
                    await cleanupServerPDF(payload.name);
                } catch (cleanupError) {
                    console.warn('⚠️ No se pudo limpiar el PDF del servidor:', cleanupError);
                }

                return; // Éxito, salir

            } catch (error) {
                console.error(`❌ Error en estrategia ${strategy.name}:`, JSON.stringify(error, null, 2));
            }
        }

        throw new Error('No se pudo guardar el PDF en ninguna ubicación');

    } catch (error) {
        console.error('❌ Error al generar/compartir PDF:', JSON.stringify(error, null, 2));

        // Fallback: compartir como texto si el PDF falla
        console.log('📝 Usando fallback de texto...');
        await shareTextFallback(container, timestamp);
    }
}

// Función auxiliar para limpiar PDF del servidor
async function cleanupServerPDF(pdfName: string): Promise<void> {
    try {
        const response = await fetch('https://pdfconvertor.hermesbackend.xyz/eliminate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: pdfName })
        });

        if (response.ok) {
            console.log('🗑️ PDF eliminado del servidor');
        }
    } catch (error) {
        console.warn('⚠️ Error al eliminar PDF del servidor:', error);
    }
}

// Función auxiliar para fallback de texto
async function shareTextFallback(container: Container, timestamp: number): Promise<void> {
    let textContent = `FACTURA: ${container.title}${container.description || ''}

PRODUCTOS/SERVICIOS:
${container.columns.map(col => col.name).join(' | ')}
${container.data.map(row =>
        container.columns.map(col =>
            col.type === 'number' && typeof row[col.id] === 'number'
                ? row[col.id].toFixed(2)
                : row[col.id] || ''
        ).join(' | ')
    ).join('\n')}`;
console.log(textContent)
    // Agregar transferencias si existen
    if (container.transferColumns && container.transferColumns.length > 0 &&
        container.transferData && container.transferData.length > 0) {
        textContent += `

TRANSFERENCIAS:
${container.transferColumns.map(col => col.name).join(' | ')}
${container.transferData.map(row =>
            container.transferColumns!.map(col =>
                col.type === 'number' && typeof row[col.id] === 'number'
                    ? row[col.id].toFixed(2)
                    : row[col.id] || ''
            ).join(' | ')
        ).join('\n')}`;
    }

    textContent += `

Generado: ${new Date().toLocaleDateString('es-ES')}`;

    const textFileName = `factura_${container.id}_${timestamp}.txt`;

    try {
        await writeTextFile(textFileName, textContent, {
            baseDir: BaseDirectory.Document
        });

        const docPath = await documentDir();
        const textPath = await join(docPath, textFileName);

        await shareFile(textPath, 'text/plain');
        console.log('📝 Compartido como texto plano exitosamente');

    } catch (textError) {
        console.error('❌ Error también con texto:', textError);
        throw new Error('No se pudo compartir ni como PDF ni como texto');
    }
}

export async function ParseTable(
    container: Container,
    shouldShare: boolean = false,
    totalInfo?: {
        subtotal: number;
        percentage?: number;
        percentageAmount?: number;
        finalTotal: number;
        hasPercentage: boolean;
    },
    transferData?: {
        transferColumns: any[];
        transferRows: any[];
    }
): Promise<string> {
    // Función auxiliar para formatear números
    const formatNumber = (value: any, isNumber: boolean): string => {
        if (!isNumber || value === undefined || value === null) {
            return String(value || '');
        }
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return `${numValue}`
    };

    // Función auxiliar para calcular sumas de columnas
    /*     const calculateColumnSum = (columnId: string): number => {
            const column = container.columns.find(col => col.id === columnId);
            if (!column || column.type !== 'number' || !column.sum) return 0;
    
            return container.data.reduce((sum, row: any) => {
                const value = row[columnId];
                const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
                return sum + numValue;
            }, 0);
        }; */

    // Función auxiliar para generar tabla de transferencias
    const generateTransferTable = (): string => {
        if (!transferData || !transferData.transferColumns.length || !transferData.transferRows.length) {
            return '';
        }

        // Generar las filas de transferencia según template.html
        const transferDetails = transferData.transferRows.map(row => {
            const rowData = transferData.transferColumns.map(column => {
                const value = row[column.id];
                const formattedValue = column.type === 'number' ? formatNumber(value, true) : String(value || '');
                return `<strong>${column.name}:</strong> ${formattedValue}`;
            }).join('<br>');

            return rowData;
        }).join('<br><br>');

        return transferDetails;
    };

    // Crear headers de la tabla
    const tableHeaders = container.columns.map(column =>
        `                        <th>${column.name}</th>`
    ).join('\n');

    // Crear filas de datos
    const tableRows = container.data.map(row => {
        const cells = container.columns.map(column => {
            const value = row[column.id];
            const formattedValue = column.type === 'number' ? formatNumber(value, true) : String(value || '');
            return `                        <td>${formattedValue}</td>`;
        }).join('\n');

        return `                    <tr>\n${cells}\n                    </tr>`;
    }).join('\n');

    // Crear sección de información del cliente según template.html
    const clientInfo = `
        <div class="client-info">
            <div class="client-section">Datos del cliente</div>
            <div class="client-section"> </div>
            <div class="client-details">
                ${container.clientName ? `<strong>Cliente/Razon social:</strong> ${container.clientName}<br>` : '<strong>Cliente/Razon social:</strong> <br>'}
                ${container.clientTaxId ? `<strong>CUIT:</strong> ${container.clientTaxId}<br>` : '<strong>CUIT:</strong> <br>'}
                ${container.clientAddress ? `<strong>Ubicación:</strong> ${container.clientAddress}<br>` : '<strong>Ubicación:</strong> <br>'}
                ${container.clientPhone ? `<strong>Telefono:</strong> ${container.clientPhone}<br>` : '<strong>Telefono:</strong> <br>'}
                ${container.clientEmail ? `<strong>Email:</strong> ${container.clientEmail}<br>` : ''}
                ${container.clientDocument ? `<strong>Documento:</strong> ${container.clientDocument}<br>` : ''}
                ${container.description ? `<strong>Información Adicional:</strong> ${container.description}<br>` : ''}
            </div>
            <div class="date-badge">${new Date().toLocaleDateString('es-ES')}</div>
        </div>`;

    // Crear sección de footer con datos de la empresa según template.html
    const footerInfo = `
        <div class="footer">
            <div class="footer-content">
                <div class="company-info">
                    <div class="company-name">${container.companyName || 'Nombre de la Empresa'}</div>
                    <div class="company-details">
                        <span>Dirección: ${container.companyAddress || 'Calle Ejemplo 123, Ciudad'}</span><br>
                        <span>Teléfono: ${container.companyPhone || '+54 11 1234-5678'}</span><br>
                        <span>Email: ${container.companyEmail || 'contacto@empresa.com'}</span>
                        ${container.companyTaxId ? `<br><span>CUIT: ${container.companyTaxId}</span>` : ''}
                    </div>
                </div>
                <div class="footer-right">
                    <div class="footer-note">Gracias por su confianza</div>
                    <div class="footer-website">${container.companyWebsite || 'www.empresa.com'}</div>
                </div>
            </div>
        </div>`;

    // Crear sección de totales según template.html
    let totalsSection = '';
    if (totalInfo) {
        const transferInfo = generateTransferTable();
        
        totalsSection = `
        <div class="totals-section">
            <div class="payment-info">
                <div class="payment-title">Información de Pago</div>
                <div class="payment-card">
                    <div class="payment-details">
                        <strong>EFECTIVO / TRANSFERENCIA</strong><br><br>
                        ${transferInfo || `<strong>Cuenta:</strong> 058-214570/7<br>
                        <strong>CUIT/CUIL:</strong> ${container.companyTaxId || '23317324830'}<br>
                        <strong>CBU:</strong> 0720058880000214570721<br>
                        <strong>Alias:</strong> <span class="payment-highlight">${container.companyName ? container.companyName.replace(/\s+/g, '.').toUpperCase() : 'EMPRESA.NOMBRE'}</span>`}
                    </div>
                </div> 
            </div>
            <div class="totals-grid">
                <div class="totals-row">
                    <div class="totals-label subtotal-label">Subtotal</div>
                    <div class="totals-value subtotal-value">$${formatNumber(totalInfo.subtotal, false)}</div>
                </div>
                ${totalInfo.hasPercentage && totalInfo.percentage && totalInfo.percentageAmount ? `
                <div class="totals-row">
                    <div class="totals-label tax-label">IVA (${totalInfo.percentage}%)</div>
                    <div class="totals-value tax-value">$${formatNumber(totalInfo.percentageAmount, false)}</div>
                </div>` : ''}
                <div class="totals-row total-row">
                    <div class="totals-label total-label">Total</div>
                    <div class="totals-value total-value">$${formatNumber(totalInfo.finalTotal, false)}</div>
                </div>
            </div>
        </div>`;
    }

    // Construir el HTML completo
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        .image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            text-align: center;
            margin: 10px 0;
        }
        .header-image {
            width: 300px !important;
            height: 100px !important;
            object-fit: cover !important;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 300px !important;
            max-height: 100px !important;
            display: block;
            margin: 0 auto;
        }
        .payment-info {
            margin-top: 20px;
        }
        .payment-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
        .payment-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: transparent;
        }
        .payment-details {
            line-height: 1.6;
            background-color: transparent;
        }
        .payment-highlight {
            background-color: transparent;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        .decorative-element {
            height: 3px;
            background: linear-gradient(90deg, #007bff, #28a745);
            border-radius: 2px;
            margin-top: 15px;
        }
        
        /* Estilos para información de cliente según template.html */
        .client-info {
            display: grid;
            grid-template-columns: 1fr 1fr auto auto;
            gap: 10px;
            align-items: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .client-section {
            font-weight: bold;
            font-size: 16px;
            color: #333;
        }
        
        .client-details {
            grid-column: span 2;
            line-height: 1.6;
            font-size: 14px;
            background-color: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #28a745;
        }
        
        .date-badge {
            background-color: #007bff;
            color: white;
            padding: 8px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
        }
        
        /* Estilos para footer según template.html */
        .footer {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 18px;
            font-weight: bold; 
            margin-bottom: 10px;
        }
        
        .company-details {
            line-height: 1.6;
            font-size: 14px; 
        }
        
        .footer-right {
            text-align: right;
        }
        
        .footer-note {
            font-size: 14px; 
            margin-bottom: 5px;
        }
        
        .footer-website {
            font-size: 12px;
            color: #007bff;
        }
        
        /* Estilos para totals-section según template.html */
        .totals-section {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin: 30px 0;
        }
        
        .payment-info {
            flex: 1;
        }
        
        .payment-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        
        .payment-card {
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .payment-details {
            line-height: 1.6;
            font-size: 14px;
        }
        
        .payment-highlight {
            color: #007bff;
            font-weight: bold;
        }
        
        .totals-grid {
            flex: 1;
            max-width: 300px;
        }
        
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .totals-row.total-row {
            border-bottom: none;
            border-top: 2px solid #333;
            font-weight: bold;
            font-size: 16px;
        }
        
        .totals-label {
            color: #333;
        }
        
        .totals-value {
            font-weight: bold;
            color: #333;
        }
        
        .total-value {
            color: #007bff;
        }
        
        @media (max-width: 768px) {
            .client-info {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .client-details {
                grid-column: span 1;
            }
            
            .footer-content {
                flex-direction: column;
                gap: 20px;
            }
            
            .footer-right {
                text-align: left;
            }
            
            .totals-section {
                flex-direction: column;
            }
            
            .totals-grid {
                max-width: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"> 
            <h1 class="main-title">${container.title || 'PRESUPUESTO'}</h1>
        </div>
        
        ${clientInfo}
        
        <div class="table-container">
            <table class="content-table">
                <thead>
                    <tr>
${tableHeaders}
                    </tr>
                </thead>
                <tbody>
${tableRows}
                </tbody>
            </table>
        </div>
        
        ${totalsSection}
        
        ${footerInfo}
        
    </div>
</body>
</html>`;

    // Solo compartir si se solicita explícitamente
    if (shouldShare) {
        await shareInvoiceFile(container, html);
    }

    return html;
}