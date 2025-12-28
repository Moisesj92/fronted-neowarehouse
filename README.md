# NeoWarehouse - Frontend

Sistema de gestión de inventario y productos construido con React, TypeScript y Vite.

## 📋 Descripción

NeoWarehouse es una aplicación web moderna para la gestión de inventarios que permite:

- Gestionar productos y categorías
- Registrar movimientos de inventario (entradas, salidas y ajustes)
- Visualizar estadísticas del inventario en tiempo real
- Interfaz con tema claro/oscuro

## 🚀 Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos
- **Framer Motion** - Animaciones

## 📦 Instalación

### Requisitos previos

- Node.js 22.x o superior (ver [.nvmrc](.nvmrc))
- pnpm 9.x o superior

### Pasos de instalación

## 🐳 Docker

### Usando Docker Compose (Recomendado)

```bash
docker compose up
```

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y servicios API
│   ├── axios.config.ts    # Configuración de Axios
│   ├── categories.api.ts  # API de categorías
│   ├── products.api.ts    # API de productos
│   └── inventoryMovements.api.ts # API de movimientos
├── components/
│   └── ui/                # Componentes de interfaz reutilizables
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ...
├── layouts/               # Layouts de la aplicación
│   └── layout.tsx        # Layout principal con sidebar
├── pages/                 # Páginas de la aplicación
│   ├── Dashboard.tsx     # Panel de estadísticas
│   ├── Products.tsx      # Gestión de productos
│   ├── Categories.tsx    # Gestión de categorías
│   └── Inventory.tsx     # Movimientos de inventario
├── App.tsx               # Configuración de rutas
├── main.tsx             # Punto de entrada
└── index.css            # Estilos globales
```

## 🎨 Características

### Dashboard

- Visualización de estadísticas clave:
  - Valor total del inventario
  - Total de productos
  - Unidades en stock
  - Productos con stock bajo

### Gestión de Productos

- CRUD completo de productos
- Campos: nombre, descripción, precio, categoría
- Asignación de categorías
- Validación de formularios
- Tabla con búsqueda y filtros

### Gestión de Categorías

- CRUD completo de categorías
- Organización de productos por categorías
- Validación de nombres únicos

### Movimientos de Inventario

- Registro de entradas, salidas y ajustes
- Historial completo de movimientos
- Razones obligatorias para ajustes
- Actualización automática de stock
- Trazabilidad completa

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview

# Linting
pnpm lint
```

## 🌐 API Endpoints

El frontend se comunica con los siguientes endpoints:

### Productos

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Categorías

- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Movimientos de Inventario

- `GET /api/inventory-movements` - Listar movimientos
- `POST /api/inventory-movements` - Crear movimiento

## 🎯 Componentes UI

El proyecto utiliza una biblioteca de componentes personalizados basados en Headless UI:

- **Button** - Botones con variantes de color y tamaño
- **Dialog** - Modales accesibles
- **Table** - Tablas responsivas con sorting
- **Input/Textarea** - Campos de formulario
- **Select** - Selectores personalizados
- **Badge** - Etiquetas de estado
- **Sidebar** - Navegación lateral
- Y más...

Todos los componentes están en [`src/components/ui/`](src/components/ui/) y son completamente accesibles y personalizables.

## 🚧 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Búsqueda avanzada y filtros
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Notificaciones en tiempo real
- [ ] Gráficos y estadísticas avanzadas
- [ ] Gestión de proveedores
- [ ] Código de barras/QR

## 📄 Licencia

ISC
