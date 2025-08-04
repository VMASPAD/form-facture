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

    // Construir el HTML completo
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Pacifico&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<style>
* {  font-family: "Poppins", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  }
</style>
<body>
    <main class="invoice-container">
        <div class="invoice-wrapper">
            <div class="invoice-header">
                <div class="invoice-header-content clearfix">
                    <div class="header-left">
                        <h1 class="text-2xl font-bold mb-3">${container.title || 'FACTURA'}</h1>
                        <div class="company-info">
                            <p class="font-semibold text-base">${container.companyName || 'Tu Empresa S.A.'}</p>
                            <p class="opacity-90 text-sm">${container.companyAddress || 'Calle Principal 123'}</p>
                            <p class="opacity-90 text-sm">${container.companyPhone || 'Tel: (011) 1234-5678'}</p>
                            ${container.companyEmail ? `<p class="opacity-90 text-sm">${container.companyEmail}</p>` : ''}
                        </div>
                    </div>
                    ${container.companyLogo ? `
                    <div class="header-center">
                        <img alt="logo" class="max-h-24 rounded-2xl" src="${container.companyLogo}">
                    </div>` : ''}
                    <div class="header-right">
                        <div class="invoice-number">
                            <p class="text-xs font-medium opacity-80">FACTURA N°</p>
                            <p class="text-lg font-bold">${container.id || '001-0001234'}</p>
                        </div>
                    </div>
                </div>
                <div class="header-decoration"></div>
            </div>
            
            <div class="invoice-details">
                <div class="general-info">
                    <h3 class="text-lg font-semibold mb-3 text-secondary-foreground">Información General</h3>
                    <div class="info-card">
                        <div class="simple-grid">
                            <p><span class="font-medium text-primary">Fecha:</span></p>
                            <p>${new Date().toLocaleDateString('es-ES')}</p>
                            ${container.clientName ? `
                            <p><span class="font-medium text-primary">Cliente:</span></p>
                            <p>${container.clientName}</p>` : ''}
                            ${container.clientTaxId ? `
                            <p><span class="font-medium text-primary">CUIT:</span></p>
                            <p>${container.clientTaxId}</p>` : ''}
                            ${container.description ? `
                            <p><span class="font-medium text-primary">Descripción:</span></p>
                            <p>${container.description}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="products-section">
                <div class="products-header">
                    <h2 class="text-xl font-bold text-primary">Detalle de Productos</h2>
                </div>
                <table class="products-table">
                    <thead>
                        <tr class="table-header">
${container.columns.map(column => 
    `                            <th class="text-left py-3 px-3 font-bold text-primary ${column.type === 'number' ? 'text-right w-24' : ''}">${column.name}</th>`
).join('\n')}
                        </tr>
                    </thead>
                    <tbody>
${container.data.map(row => {
    const cells = container.columns.map(column => {
        const value = row[column.id];
        const formattedValue = column.type === 'number' ? formatNumber(value, true) : String(value || '');
        return `                            <td class="py-3 px-3 ${column.type === 'number' ? 'text-right font-bold text-chart-1' : 'font-medium text-card-foreground'}">${column.type === 'number' ? '$' + formattedValue : formattedValue}</td>`;
    }).join('\n');
    
    return `                        <tr class="table-row hover:bg-opacity-50">
${cells}
                        </tr>`;
}).join('\n')}
                    </tbody>
                </table>
            </div>
            
            ${totalInfo ? `
            <div class="totals-section">
                <div class="totals-content">
                    <div class="payment-info">
                        <h3 class="payment-header">Información de Pago</h3>
                        <div class="payment-card">
                            <div class="simple-grid text-card-foreground">
                                <p><span class="font-medium text-primary">Cuenta:</span></p>
                                <p>${container.paymentAccount || '058-214570/7'}</p>
                                <p><span class="font-medium text-primary">CUIT/CUIL:</span></p>
                                <p>${container.paymentCuit || container.companyTaxId || 'test'}</p>
                                <p><span class="font-medium text-primary">CBU:</span></p>
                                <p class="text-sm">${container.paymentCbu || '0720058880000214570721'}</p>
                                <p><span class="font-medium text-primary">Alias:</span></p>
                                <p>${container.paymentAlias || 'test'}</p>
                                ${generateTransferTable() ? `<br><p><strong>Transferencias:</strong></p><p>${generateTransferTable()}</p>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="summary-section">
                        <h3 class="summary-header">Resumen</h3>
                        <div class="summary-card">
                            <div class="summary-row">
                                <span class="font-medium text-muted-foreground">Subtotal:</span>
                                <span class="font-bold text-foreground">$${formatNumber(totalInfo.subtotal, false)}</span>
                            </div>
                            ${totalInfo.hasPercentage && totalInfo.percentage && totalInfo.percentageAmount ? `
                            <div class="summary-row">
                                <span class="font-medium text-muted-foreground">IVA (${totalInfo.percentage}%):</span>
                                <span class="font-bold text-chart-2">$${formatNumber(totalInfo.percentageAmount, false)}</span>
                            </div>` : ''}
                            <div class="summary-total">
                                <span class="text-lg font-bold text-primary">Total:</span>
                                <span class="total-amount">$${formatNumber(totalInfo.finalTotal, false)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>` : ''}
            
            <div class="invoice-footer">
                <div class="footer-content">
                    <p class="text-base font-semibold mb-2 text-primary">${container.companyAddress || 'Dirección'}</p>
                    <p class="text-base font-semibold mb-2 text-primary">${container.companyWebsite || 'Instagram'}</p>
                    <p class="text-base font-semibold mb-2 text-primary">${container.companyEmail || 'Contacto'}</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`;

    // Solo compartir si se solicita explícitamente
    if (shouldShare) {
        await shareInvoiceFile(container, html);
    }

    return html;
}