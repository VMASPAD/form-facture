import { Container } from '@/pages/Menu';

export function ParseTable(container: Container): string {
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
                return `          <td><strong>€${formatNumber(sum, true)}</strong></td>`;
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

    return html;
}