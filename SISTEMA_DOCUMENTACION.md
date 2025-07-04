# Sistema de Gestión de Tablas Dinámicas - Form Facture

## Descripción del Sistema

Este sistema permite crear y gestionar contenedores con tablas dinámicas personalizables. Cada contenedor puede tener múltiples columnas de diferentes tipos y permite la edición completa de datos con persistencia en localStorage.

## Funcionalidades Implementadas

### 1. Gestión de Contenedores
- **Crear Contenedores**: Desde el menú principal, puedes crear nuevos contenedores con título, descripción y plantilla
- **Buscar Contenedores**: Sistema de búsqueda en tiempo real por título y descripción
- **Eliminar Contenedores**: Botón de eliminación con confirmación

### 2. Sistema de Columnas Dinámicas
- **Tipos de Columna**:
  - **Texto**: Para datos de texto libre
  - **Número**: Para datos numéricos con formato automático
- **Suma Automática**: Las columnas numéricas pueden configurarse para mostrar suma total
- **Gestión**: Agregar y eliminar columnas dinámicamente

### 3. Gestión de Filas
- **Agregar Filas**: Botón para crear nuevas filas vacías
- **Editar Filas**: Click en el botón de edición para modificar datos
- **Eliminar Filas**: Botón de eliminación individual
- **Validación**: Los campos numéricos solo aceptan números

### 4. Funcionalidades de Tabla
- **Búsqueda Global**: Buscar en todos los campos de la tabla
- **Ordenamiento**: Click en headers para ordenar columnas
- **Paginación**: Navegación automática para tablas grandes
- **Suma Automática**: Fila de totales para columnas numéricas configuradas

### 5. Persistencia de Datos
- **localStorage**: Todos los datos se guardan automáticamente
- **Auto-guardado**: Los cambios se persisten inmediatamente
- **Recuperación**: Los datos se mantienen entre sesiones

## Flujo de Uso

### Paso 1: Crear un Contenedor
1. Ir a `/menu`
2. Click en "Nuevo Contenedor"
3. Llenar título, descripción y seleccionar plantilla
4. Click en "Crear Contenedor"

### Paso 2: Configurar Columnas
1. Desde el contenedor, click en "Agregar Columna"
2. Especificar nombre y tipo (Texto/Número)
3. Para números, marcar si se debe sumar
4. Click en "Agregar Columna"

### Paso 3: Agregar Datos
1. Click en "Agregar Fila" para crear la primera fila
2. Click en el botón de edición (lápiz) para editar
3. Llenar los campos según el tipo de columna
4. Click en "Guardar Cambios"

### Paso 4: Gestionar Datos
- **Editar**: Click en el botón de edición en cualquier fila
- **Eliminar**: Click en el botón de basura para eliminar filas
- **Buscar**: Usar el campo de búsqueda para filtrar
- **Ver Totales**: Las columnas numéricas con suma habilitada mostrarán totales

## Estructura de Datos

```typescript
interface Container {
  id: string;
  title: string;
  description: string;
  template: number;
  data: DynamicRow[];
  columns: Column[];
  createdAt: string;
}

interface Column {
  id: string;
  name: string;
  type: 'text' | 'number';
  sum?: boolean;
}

interface DynamicRow {
  id: string;
  [key: string]: any;
}
```

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **TanStack Table** para gestión de tablas
- **Tailwind CSS** para estilos
- **Motion** para animaciones
- **Radix UI** para componentes base
- **Lucide React** para iconos
- **React Router** para navegación
- **localStorage** para persistencia

## Navegación

- `/` - Página principal con animaciones
- `/menu` - Gestión de contenedores
- `/editor?id={containerId}` - Editor de tabla específica

## Características Especiales

### Validación Inteligente
- Los campos numéricos solo aceptan números
- Validación en tiempo real
- Conversión automática de tipos

### Interfaz Responsiva
- Diseño adaptativo para móviles y desktop
- Animaciones suaves con Motion
- Componentes accesibles

### Suma Automática
- Las columnas numéricas pueden configurarse para suma
- Fila de totales al final de la tabla
- Formato numérico español (separadores de miles)

### Búsqueda Avanzada
- Búsqueda global en toda la tabla
- Filtros en tiempo real
- Destacado de resultados

## Ejemplo de Uso

1. **Crear Contenedor "Inventario"**
   - Plantilla: 3 (Inventario)
   - Descripción: "Control de productos"

2. **Agregar Columnas**:
   - "Producto" (Texto)
   - "Cantidad" (Número, sin suma)
   - "Precio" (Número, con suma)
   - "Total" (Número, con suma)

3. **Agregar Datos**:
   - Laptop, 5, 800.00, 4000.00
   - Mouse, 20, 25.00, 500.00
   - Teclado, 15, 50.00, 750.00

4. **Resultado**: Tabla con totales automáticos y gestión completa

## Seguridad y Rendimiento

- Datos almacenados localmente (sin servidor)
- Validación de tipos en tiempo real
- Optimización de re-renders con React
- Carga lazy de componentes pesados
