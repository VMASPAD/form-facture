# Ejemplos de Uso - Sistema Form Facture

## Ejemplo 1: Control de Inventario

### Configuración del Contenedor
```
Título: "Inventario de Oficina"
Descripción: "Control de productos y stock de la oficina"
Plantilla: 3 (Inventario)
```

### Columnas Configuradas
1. **Producto** (Texto) - Nombre del producto
2. **Categoría** (Texto) - Tipo de producto
3. **Cantidad** (Número) - Stock actual
4. **Precio Unitario** (Número, SIN suma) - Precio por unidad
5. **Valor Total** (Número, CON suma) - Cantidad × Precio

### Datos de Ejemplo
| Producto | Categoría | Cantidad | Precio Unitario | Valor Total |
|----------|-----------|----------|----------------|-------------|
| Laptop HP | Electrónicos | 5 | €800.00 | €4,000.00 |
| Mouse Logitech | Periféricos | 20 | €25.00 | €500.00 |
| Teclado Mecánico | Periféricos | 15 | €75.00 | €1,125.00 |
| Monitor 24" | Electrónicos | 8 | €200.00 | €1,600.00 |
| Silla Ergonómica | Mobiliario | 12 | €150.00 | €1,800.00 |

**Total Inventario: €9,025.00** (suma automática)

---

## Ejemplo 2: Control de Gastos Mensuales

### Configuración del Contenedor
```
Título: "Gastos Enero 2025"
Descripción: "Control de gastos personales del mes"
Plantilla: 2 (Financiera)
```

### Columnas Configuradas
1. **Fecha** (Texto) - Fecha del gasto
2. **Descripción** (Texto) - Detalle del gasto
3. **Categoría** (Texto) - Tipo de gasto
4. **Monto** (Número, CON suma) - Cantidad gastada
5. **Método Pago** (Texto) - Forma de pago

### Datos de Ejemplo
| Fecha | Descripción | Categoría | Monto | Método Pago |
|-------|-------------|-----------|-------|-------------|
| 05/01 | Supermercado Alcampo | Alimentación | €85.50 | Tarjeta |
| 07/01 | Gasolina | Transporte | €60.00 | Efectivo |
| 10/01 | Netflix | Entretenimiento | €12.99 | Domiciliación |
| 12/01 | Farmacia | Salud | €23.40 | Tarjeta |
| 15/01 | Restaurante | Alimentación | €45.00 | Tarjeta |

**Total Gastos: €226.89** (suma automática)

---

## Ejemplo 3: Lista de Tareas de Proyecto

### Configuración del Contenedor
```
Título: "Proyecto Web E-commerce"
Descripción: "Seguimiento de tareas y progreso del proyecto"
Plantilla: 1 (Básica)
```

### Columnas Configuradas
1. **Tarea** (Texto) - Descripción de la tarea
2. **Responsable** (Texto) - Persona asignada
3. **Estado** (Texto) - Estado actual
4. **Prioridad** (Texto) - Nivel de prioridad
5. **Horas Estimadas** (Número, CON suma) - Tiempo estimado
6. **Horas Reales** (Número, CON suma) - Tiempo real invertido

### Datos de Ejemplo
| Tarea | Responsable | Estado | Prioridad | Horas Estimadas | Horas Reales |
|-------|-------------|--------|-----------|----------------|--------------|
| Diseño UI/UX | María | Completado | Alta | 20.00 | 18.50 |
| Backend API | Carlos | En Progreso | Alta | 40.00 | 25.00 |
| Frontend React | Ana | Pendiente | Media | 35.00 | 0.00 |
| Base de Datos | Luis | Completado | Alta | 15.00 | 12.00 |
| Testing | Todo el equipo | Pendiente | Media | 25.00 | 0.00 |

**Total Estimado: 135.00 horas**
**Total Real: 55.50 horas**

---

## Ejemplo 4: Control de Ventas

### Configuración del Contenedor
```
Título: "Ventas Q1 2025"
Descripción: "Registro de ventas del primer trimestre"
Plantilla: 2 (Financiera)
```

### Columnas Configuradas
1. **Cliente** (Texto) - Nombre del cliente
2. **Producto** (Texto) - Producto vendido
3. **Cantidad** (Número, CON suma) - Unidades vendidas
4. **Precio Unitario** (Número) - Precio por unidad
5. **Descuento %** (Número) - Porcentaje de descuento
6. **Total Venta** (Número, CON suma) - Importe final

### Datos de Ejemplo
| Cliente | Producto | Cantidad | Precio Unitario | Descuento % | Total Venta |
|---------|----------|----------|----------------|-------------|-------------|
| Empresa A | Software Licencias | 10 | €500.00 | 10.00 | €4,500.00 |
| Empresa B | Consultoria | 1 | €2,000.00 | 0.00 | €2,000.00 |
| Empresa C | Soporte Técnico | 5 | €150.00 | 5.00 | €712.50 |
| Empresa D | Desarrollo Custom | 1 | €8,000.00 | 15.00 | €6,800.00 |

**Total Unidades: 17**
**Total Ventas: €14,012.50**

---

## Flujo de Trabajo Típico

### 1. Planificación
- Identificar qué tipo de datos necesitas gestionar
- Decidir qué columnas necesitas (texto vs números)
- Determinar qué columnas necesitan suma automática

### 2. Configuración
- Crear el contenedor con título descriptivo
- Agregar columnas una por una
- Configurar sumas para columnas numéricas relevantes

### 3. Uso Diario
- Agregar filas según sea necesario
- Editar datos haciendo click en el botón de edición
- Usar la búsqueda para encontrar información específica
- Aprovechar los totales automáticos

### 4. Mantenimiento
- Eliminar filas obsoletas
- Agregar nuevas columnas si es necesario
- Eliminar columnas que ya no uses

---

## Consejos de Uso

### Para Columnas Numéricas
- Activa la suma solo en columnas que tenga sentido sumar (totales, cantidades)
- No actives suma en campos como "Precio Unitario" o "Porcentaje"
- Los números se formatean automáticamente con separadores de miles

### Para Organización
- Usa nombres descriptivos para contenedores
- Agrupa información relacionada en el mismo contenedor
- Usa la función de búsqueda para tablas grandes

### Para Performance
- El sistema es local, así que puedes tener tantos contenedores como necesites
- Los datos se guardan automáticamente
- No hay límite de filas o columnas (salvo memoria del navegador)

---

## Casos de Uso Recomendados

1. **Pequeñas Empresas**: Control de inventario, gastos, ventas
2. **Freelancers**: Seguimiento de proyectos, facturas, tiempo
3. **Uso Personal**: Presupuestos, gastos familiares, colecciones
4. **Equipos**: Gestión de tareas, recursos, planificación
5. **Estudiantes**: Notas, horarios, proyectos académicos
