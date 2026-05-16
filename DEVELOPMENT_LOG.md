# Bitácora de Desarrollo — UI Component Library

## Proceso de Desarrollo

###  Configuración inicial del workspace
Se creó un Angular workspace con dos proyectos: `ui-lib` (library) y `demo-app` (application). Se configuró Tailwind CSS v3, TypeScript strict, y Vitest como test runner.

###  Componentes de la librería

**Button (`ui-button`)**: Primer componente implementado. Variantes `primary` (verde sólido), `secondary` (borde verde) y `danger` (rojo). El estado `loading` muestra un spinner CSS con `animate-spin`. El método `handleClick()` verifica `disabled` y `loading` antes de emitir.

**Card (`ui-card`)**: Implementa `ng-content` para proyección de contenido en el body. Elevaciones `flat`, `raised` y `outlined` con bordes y sombras distintas. Header clickeable.

**Select (`ui-select`)**: Usa `model()` para two-way binding. Incluye skeleton loading con `animate-pulse`. Template reference variable (`#selectRef`) para obtener el valor sin `$any()`.

**Table (`ui-table`)**: Componente genérico `UiTableComponent<T>`. Soporta columnas de tipo `text` e `image` (avatares circulares). Maneja estados: loading (5 skeleton rows), empty (mensaje + emoji), error (mensaje de red). Filas con borde verde al hover.

### 3. Demo app y servicio

`ResourceService` con Signals: recurso activo, filtro, registros, loading, error y paginación (`info.next`/`info.prev`). Los componentes no hacen llamadas HTTP directas.



## Decisiones Tomadas

1. **Signals sobre RxJS para estado**: `signal()` es más simple y alineado con Angular moderno. Para el estado local del explorer no se justifica RxJS.
2. **Tabla genérica con default**: `UiTableComponent<T extends Record<string, unknown> = Record<string, unknown>>` permite usarla con o sin tipo explícito.
3. **Columna `type: 'image'` en TableColumn**: Permite renderizar imágenes sin que la tabla conozca el dominio. Extensible a futuros tipos (`badge`, `link`, etc.).
4. **Paleta verde portal**: Fondos oscuros con verde como acento principal. Evoca Rick & Morty sin usar assets con derechos.
5. **Estructura de carpetas**: Cada componente en su propia carpeta (`button/`, `card/`, `select/`, `table/`) con template, lógica y spec.

## Retos y Soluciones

1. **`$any()` en el select**: Angular infiere `EventTarget` en eventos DOM. Solución: `#selectRef` en el `<select>` y pasar `selectRef.value` directamente al handler, eliminando el cast.
2. **Tabla genérica en tests**: Se usó un tipo por defecto que permite instanciar `UiTableComponent` sin parámetro de tipo.
3. **Paginación**: La API de Rick & Morty devuelve `info.next`/`info.prev` como URLs. El servicio parsea estas URLs para navegar entre páginas.
4. **Stats en el hero**: Los counts de Alive/Dead se calculan con `computed()` desde los datos visibles (`rows()`). Se actualizan reactivamente.
5. **Conexión de rutas**: `app.config.ts` no importaba `app.routes.ts`. Se corrigió para usar `provideRouter(routes)` correctamente.


