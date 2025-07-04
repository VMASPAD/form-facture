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

export async function ParseTable(container: Container, shouldShare: boolean = false): Promise<string> {
    // Función auxiliar para formatear números
    const formatNumber = (value: any, isNumber: boolean): string => {
        if (!isNumber || value === undefined || value === null) {
            return String(value || '');
        }
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return new Intl.NumberFormat("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
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
        `          <th>${column.name}</th>`
    ).join('\n');

    // Crear filas de datos
    const tableRows = container.data.map(row => {
        const cells = container.columns.map(column => {
            const value = row[column.id];
            const formattedValue = formatNumber(value, column.type === 'number');
            return `          <td>${formattedValue}</td>`;
        }).join('\n');
        
        return `        <tr>\n${cells}\n        </tr>`;
    }).join('\n');

    // Crear fila de totales si hay columnas con suma
    const sumColumns = container.columns.filter(col => col.type === 'number' && col.sum);
    let totalRow = '';
    if (sumColumns.length > 0) {
        const totalCells = container.columns.map(column => {
            if (column.type === 'number' && column.sum) {
                const sum = calculateColumnSum(column.id);
                return `          <td><strong>$${formatNumber(sum, true)}</strong></td>`;
            } else if (container.columns.indexOf(column) === 0) {
                return `          <td><strong>Total</strong></td>`;
            } else {
                return `          <td></td>`;
            }
        }).join('\n');
        
        totalRow = `        <tr>\n${totalCells}\n        </tr>`;
    }

    // Crear tabla de información adicional si existe
    const hasAdditionalInfo = container.email || container.phone || container.textField;
    let additionalInfoTable = '';
    
    if (hasAdditionalInfo) {
        const infoRows = [];
        
        if (container.email) {
            infoRows.push(`      <dt>Email</dt>\n      <dd>${container.email}</dd>`);
        }
        if (container.phone) {
            infoRows.push(`      <dt>Teléfono</dt>\n      <dd>${container.phone}</dd>`);
        }
        if (container.textField) {
            infoRows.push(`      <dt>Información Adicional</dt>\n      <dd>${container.textField}</dd>`);
        }
        
        additionalInfoTable = `
    <dl id="informations">
      <dt>Número de Factura</dt>
      <dd>${container.id}</dd>
      <dt>Fecha de Creación</dt>
      <dd>${new Date(container.createdAt).toLocaleDateString('es-ES')}</dd>
      <dt>Plantilla</dt>
      <dd>Plantilla ${container.template}</dd>
${infoRows.map(row => `      ${row}`).join('\n')}
    </dl>`;
    }

    // Crear dirección desde la información del contenedor
    const addressSection = container.email || container.phone ? `
    <aside>
      <address id="from">
        ${container.title}
        ${container.description ? container.description : ''}
        ${container.email ? container.email : ''}
        ${container.phone ? container.phone : ''}
      </address>
    </aside>` : '';

    // Crear sección de imagen si existe
    const imageSection = container.image ? `
    <div id="company-logo">
      <img src="${container.image}" alt="Logo de la empresa" style="max-width: 200px; max-height: 100px;">
    </div>` : '';

    // Construir el HTML completo
    const html = `<html>
  <head>
    <meta charset="utf-8">
    <link href="invoice.css" media="print" rel="stylesheet">
    <title>${container.title}</title>
    <meta name="description" content="${container.description || 'Factura generada automáticamente'}">
  </head>

  <body>
    <h1>${container.title}</h1>
${imageSection}${addressSection}${additionalInfoTable}

    <table>
      <thead>
        <tr>
${tableHeaders}
        </tr>
      </thead>
      <tbody>
${tableRows}${totalRow ? '\n' + totalRow : ''}
      </tbody>
    </table>

    <footer>
      <table id="summary">
        <thead>
          <tr>
            <th>Total de Filas</th>
            <th>Total de Columnas</th>
            <th>Fecha de Generación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${container.data.length}</td>
            <td>${container.columns.length}</td>
            <td>${new Date().toLocaleDateString('es-ES')}</td>
          </tr>
        </tbody>
      </table>
    </footer>
  </body>
</html>`;

    // Solo compartir si se solicita explícitamente
    if (shouldShare) {
        await shareInvoiceFile(container, html);
    }

    return html;
}