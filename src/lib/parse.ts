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
            name: `${container.title.replace(/\s+/g, '_')}_factura_${timestamp}`,
            content: htmlContent
        };

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
    const textContent = `FACTURA: ${container.title}
${container.description || ''}

${container.columns.map(col => col.name).join(' | ')}
${container.data.map(row =>
        container.columns.map(col =>
            col.type === 'number' && typeof row[col.id] === 'number'
                ? row[col.id].toFixed(2)
                : row[col.id] || ''
        ).join(' | ')
    ).join('\n')}

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
    }
): Promise<string> {
    // Función auxiliar para formatear números
    const formatNumber = (value: any, isNumber: boolean): string => {
        if (!isNumber || value === undefined || value === null) {
            return String(value || '');
        }
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numValue);
    };

    // Función auxiliar para calcular sumas de columnas
    const calculateColumnSum = (columnId: string): number => {
        const column = container.columns.find(col => col.id === columnId);
        if (!column || column.type !== 'number' || !column.sum) return 0;

        return container.data.reduce((sum, row: any) => {
            const value = row[columnId];
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            return sum + numValue;
        }, 0);
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

    // Crear información del cliente
    const clientInfo = `
        <div class="client-info">
            <div class="client-section">${container.title}</div>
            <div class="client-details">
                ${container.email ? `<strong>Email:</strong> ${container.email}<br>` : ''}
                ${container.phone ? `<strong>Teléfono:</strong> ${container.phone}<br>` : ''}
                ${container.textField ? `<strong>Información:</strong> ${container.textField}` : ''}
            </div>
            <div class="date-badge">${new Date().toLocaleDateString('es-ES')}</div>
        </div>`;

    // Crear sección de totales
    let totalsSection = '';
    if (totalInfo) {
        totalsSection = `
        <div class="totals-section">
            <div class="totals-grid">
                <div class="totals-row">
                    <div class="totals-label subtotal-label">Subtotal</div>
                    <div class="totals-value subtotal-value">${formatNumber(totalInfo.subtotal, true)}</div>
                </div>
                ${totalInfo.hasPercentage && totalInfo.percentage && totalInfo.percentageAmount ? `
                <div class="totals-row">
                    <div class="totals-label tax-label">${totalInfo.percentage}%</div>
                    <div class="totals-value tax-value">${formatNumber(totalInfo.percentageAmount, true)}</div>
                </div>` : ''}
                <div class="totals-row total-row">
                    <div class="totals-label total-label">Total</div>
                    <div class="totals-value total-value">${formatNumber(totalInfo.finalTotal, true)}</div>
                </div>
            </div>
        </div>`;
    }

    // Crear sección de información de pago
    const paymentInfo = `
        <div class="payment-info">
            <div class="payment-title">Información de Pago</div>
            <div class="payment-card">
                <div class="payment-details">
                    <strong>EFECTIVO / TRANSFERENCIA</strong><br><br>
                    ${container.email ? `<strong>Email:</strong> ${container.email}<br>` : ''}
                    ${container.phone ? `<strong>Teléfono:</strong> ${container.phone}<br>` : ''}
                    <strong>Factura #:</strong> <span class="payment-highlight">${container.id}</span>
                </div>
            </div>
            <div class="decorative-element"></div>
        </div>`;

    // Construir el HTML completo
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>${container.title}</title>
    <meta name="description" content="${container.description || 'Factura generada automáticamente'}">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <div class="logo">
                    <div class="logo-icon">${container.title.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="logo-text">${container.title}</div>
                        <div class="logo-subtitle">${container.description || 'AUTOMATIZACIONES'}</div>
                    </div>
                </div>
            </div>
            ${container.image ? `
            <div class="image-container">
                <img src="${container.image}" alt="Imagen del presupuesto" class="header-image">
            </div>` : ''}
            <h1 class="main-title">PRESUPUESTO</h1>
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
        
        ${paymentInfo}
    </div>
</body>
</html>`;

    // Solo compartir si se solicita explícitamente
    if (shouldShare) {
        await shareInvoiceFile(container, html);
    }

    return html;
}