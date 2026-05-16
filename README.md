# UI Component Library — Angular + TypeScript

Librería de componentes Angular reutilizables y aplicación demo que los consume usando la [Rick & Morty API](https://rickandmortyapi.com/). Tema visual inspirado en el universo de Rick & Morty: paleta verde portal sobre fondos oscuros.

## Arquitectura

```
ui-component-library/
  projects/
    ui-lib/       ← Librería de componentes (publicable)
    demo-app/     ← App Angular que consume la librería
  angular.json
  package.json
```

- **ui-lib**: Librería con 4 componentes standalone (Button, Card, Select, Table) exportados desde `public-api.ts`.
- **demo-app**: Aplicación demo que consume `ui-lib` y la Rick & Morty API. El estado se gestiona en `ResourceService` con Signals. Incluye paginación, stats en tiempo real y modal de detalle.

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Servidor de desarrollo
ng serve

# Build de la librería
ng build ui-lib

# Build de producción de la demo app
ng build demo-app

# Tests
ng test ui-lib
ng test demo-app
```

El servidor corre en `http://localhost:4200/`.

## Convenciones

- **Standalone + OnPush**: Todos los componentes usan `standalone: true` y `ChangeDetectionStrategy.OnPush`.
- **Signals API**: `input()`, `output()`, `model()` de Angular 17+. Sin decoradores `@Input` / `@Output`.
- **Prefijo `ui-`**: Todos los selectores usan el prefijo `ui-`.
- **Tipado estricto**: `strict: true` en `tsconfig.json`. Cero uso de `any`.
- **Public API**: La demo app importa exclusivamente desde `ui-lib`, no desde rutas internas.

---

## Tabla de API por Componente

### `<ui-button>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `label` | `string` | Texto visible del botón |
| `input()` | `variant` | `'primary' \| 'secondary' \| 'danger'` | Estilo visual (primary = verde sólido, secondary = borde verde, danger = rojo) |
| `input()` | `size` | `'sm' \| 'md' \| 'lg'` | Tamaño del botón |
| `input()` | `disabled` | `boolean` | Bloquea interacción |
| `input()` | `loading` | `boolean` | Muestra spinner animado y bloquea click |
| `output()` | `clicked` | `void` | Emite solo si no está disabled ni loading |

**Ejemplo:**

```html
<ui-button label="Guardar" variant="primary" (clicked)="onSave()" />
<ui-button label="Cargando..." [loading]="true" />
<ui-button label="Eliminar" variant="danger" size="sm" />
```

---

### `<ui-card>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `title` | `string` | Título del header |
| `input()` | `subtitle` | `string \| null` | Subtítulo opcional bajo el título |
| `input()` | `elevation` | `'flat' \| 'raised' \| 'outlined'` | Estilo del contenedor |
| `output()` | `headerClicked` | `void` | Emite al hacer clic en el header |
| `ng-content` | — | — | Proyecta contenido arbitrario en el body |

**Ejemplo:**

```html
<ui-card title="Rick Sanchez" subtitle="Human" elevation="raised" (headerClicked)="close()">
  <p>Contenido proyectado en el body...</p>
</ui-card>
```

---

### `<ui-select>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `options` | `SelectOption[]` | Lista de opciones `{ label, value }` |
| `input()` | `label` | `string` | Etiqueta visible sobre el select |
| `input()` | `placeholder` | `string` | Texto cuando no hay selección |
| `input()` | `loading` | `boolean` | Estado de carga (skeleton animado) |
| `input()` | `disabled` | `boolean` | Bloquea interacción |
| `model()` | `value` | `string \| null` | Two-way binding del valor seleccionado |
| `output()` | `selectionChange` | `SelectOption` | Emite el objeto `{ label, value }` al cambiar |

**Ejemplo:**

```html
<ui-select
  label="Recurso"
  [options]="opciones"
  [(value)]="seleccionado"
  (selectionChange)="onChange($event)">
</ui-select>
```

---

### `<ui-table>`

Componente genérico: `UiTableComponent<T extends Record<string, unknown>>`.

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `columns` | `TableColumn[]` | Columnas `{ key, header, type? }`. `type` acepta `'text'` (default) o `'image'` para renderizar img circular |
| `input()` | `rows` | `T[]` | Datos a renderizar (genérico) |
| `input()` | `loading` | `boolean` | Muestra 5 skeleton rows animadas |
| `input()` | `emptyMessage` | `string` | Mensaje cuando rows está vacío (default: "No hay resultados") |
| `input()` | `errorMessage` | `string \| null` | Mensaje de error de red visible en la tabla |
| `output()` | `actionTriggered` | `TableAction<T>` | Emite `{ action: 'view' \| 'delete', row: T }` |

**Ejemplo:**

```html
<ui-table
  [columns]="columns"
  [rows]="resourceService.rows()"
  [loading]="resourceService.loading()"
  [errorMessage]="resourceService.errorMessage()"
  emptyMessage="No se encontraron resultados en esta dimensión"
  (actionTriggered)="onAction($event)">
</ui-table>
```

**Ejemplo con columna de imagen:**

```typescript
columns: TableColumn[] = [
  { key: 'image', header: 'Avatar', type: 'image' },
  { key: 'name', header: 'Nombre' },
  { key: 'status', header: 'Status' }
];
```

---

## Flujo de la Demo App

1. **Hero**: Banner con imagen de fondo, logo de Rick & Morty, tagline y tarjetas de stats (Total / Vivos / Muertos).
2. **Select de Recurso**: Cambia entre Characters, Episodes y Locations. Dispara petición a la API.
3. **Select de Filtro**: Filtra por status (Alive, Dead, Unknown). Solo visible en Characters. Se resetea al cambiar de recurso.
4. **Tabla**: Muestra los resultados con avatar circular (en Characters), columnas dinámicas y botones Ver / Eliminar. Soporta paginación (Anterior / Siguiente).
5. **Modal de Detalle**: Abre al pulsar Ver. Muestra todos los campos del registro en un `ui-card` con indicador de status coloreado.
6. **Confirmación de Eliminación**: Diálogo modal antes de ejecutar la acción delete. Emite `{ action: 'delete', row }` correctamente.

## Decisiones de Diseño

- **Signals para estado**: `ResourceService` usa `signal()` y `computed()` para estado reactivo. Más simple y alineado con Angular moderno que `BehaviorSubject`.
- **Tabla genérica**: `UiTableComponent<T>` no conoce el dominio de los datos. Solo renderiza columnas (con soporte `type: 'image'` para avatares) y emite acciones. El padre interpreta cada acción.
- **Paleta verde portal**: Fondos `#060a06`/`#0a0f0a`, acentos `green-400`/`green-500`, bordes sutiles `green-900/30`. Evoca el estilo sci-fi de Rick & Morty.
- **Tailwind puro**: Todo el estilo en clases utilitarias. Sin archivos CSS externos ni librerías de componentes de terceros.
- **Sin `any`**: El select usa template reference variable (`#selectRef`) en vez de `$any()`. La tabla usa tipo genérico con constraint.
- **Paginación integrada**: El servicio maneja `info.next`/`info.prev` de la API. La UI muestra página actual y total.
- **Estados visuales completos**: Todos los componentes manejan default, hover, focus, disabled, loading y error con transiciones.

## Stack Técnico

| Tecnología | Versión |
|---|---|
| Angular | 21.2.x |
| TypeScript | 5.9.x |
| Tailwind CSS | 3.4.x |
| RxJS | 7.8.x |
| Vitest | 4.0.x |
| ng-packagr | 21.2.x |
