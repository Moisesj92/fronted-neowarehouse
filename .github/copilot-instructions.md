# NeoWarehouse Frontend - Copilot Instructions

## Project Overview

Inventory management SPA built with **React 19 + TypeScript + Vite + Tailwind CSS 4**. Uses pnpm as package manager.

## Architecture

### Directory Structure

- `src/api/` - API service layer with typed DTOs (axios-based)
- `src/components/ui/` - Reusable Headless UI-based components (barrel export via `index.ts`)
- `src/pages/` - Feature pages (Products, Categories, Inventory, Dashboard)
- `src/layouts/` - App shell with sidebar navigation and dark mode toggle

### Data Flow Pattern

1. Pages fetch data via API services (`src/api/*.api.ts`)
2. Each API module exports typed interfaces + CRUD methods using shared axios instance
3. State is local to pages (useState/useEffect) - no global state management

## Key Conventions

### API Services

Create new APIs following the established pattern in [products.api.ts](src/api/products.api.ts):

```typescript
// Always define interfaces for entities and DTOs
export interface Entity { id: string; /* ... */ }
export interface CreateEntityDto { /* ... */ }
export interface UpdateEntityDto { /* ... */ }

// Export as object with typed async methods
export const entityApi = {
  getAll: async (): Promise<Entity[]> => { /* ... */ },
  create: async (data: CreateEntityDto): Promise<Entity> => { /* ... */ },
  // ...
};
```

### UI Components

- Import from barrel file: `import { Button, Dialog, Table, Input } from "../components/ui"`
- Components wrap `@headlessui/react` with Tailwind styling
- Use `clsx` for conditional classes
- All components support dark mode via `dark:` variants

### Page Structure Pattern

Pages in `src/pages/` follow this structure:

1. State for data, loading, error, form, and modal visibility
2. `useEffect` for initial data loading
3. CRUD handlers calling API services
4. Dialog-based forms for create/edit operations
5. Table display with action buttons

### Styling

- **Mobile-first approach**: Default styles target mobile, use `md:` breakpoint for desktop adaptations
- Tailwind CSS 4 with `@tailwindcss/vite` plugin
- Dark mode: class-based (`dark:` prefix), toggled via `document.documentElement.classList`
- Color palette: zinc-based neutrals with contextual colors (blue, red, amber, etc.)

### Responsive Layout

- Mobile: Hamburger menu with slide-out navigation drawer
- Desktop (`md:` and up): Fixed sidebar visible
- Main content padding: `p-4` mobile, `md:p-8` desktop

### Dialog/Modal Behavior

- Mobile: Bottom sheet sliding up, max 80% viewport height, rounded top corners
- Desktop: Centered modal with scale animation
- `DialogBody`: Scrollable when content overflows
- `DialogActions`: Sticky at bottom, always visible (with border on mobile)

## Development Commands

```bash
pnpm dev      # Dev server on port 3001
pnpm build    # TypeScript check + Vite build
pnpm lint     # ESLint
```

## Environment Variables

Configure in `.env` file:

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3000/api`)
- `VITE_API_KEY` - API authentication key

## Routing

Routes defined in [App.tsx](src/App.tsx) - all nested under `Layout` with sidebar:

- `/` → Dashboard
- `/products` → Products CRUD
- `/categories` → Categories CRUD
- `/inventory` → Inventory movements

## When Adding New Features

1. **New entity**: Create `src/api/{entity}.api.ts` with interfaces + API object
2. **New page**: Create `src/pages/{Entity}.tsx`, add route in `App.tsx`, add sidebar link in `layout.tsx`
3. **New UI component**: Add to `src/components/ui/`, export from `index.ts`
