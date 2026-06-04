# @thepaulin/d_u

A lightweight React drag-and-drop library with position persistence. Built for any JS metaframework (Next.js, Remix, Gatsby, etc.).

```bash
npm install @thepaulin/d_u
```

## Usage

```tsx
import { DraggableUI, Draggable } from '@thepaulin/d_u';

function App() {
  return (
    <DraggableUI>
      <Draggable id="card-1" defaultPosition={{ x: 100, y: 200 }}>
        <div>Drag me</div>
      </Draggable>
    </DraggableUI>
  );
}
```

Persistence and drag context are configured via `DraggableUI`. Drop-in `Draggable` makes any child element movable.

## Features

- **Position persistence** — positions saved to `localStorage` by default; survives page reloads
- **Custom storage** — supply your own `StorageAdapter` for server/DB-backed persistence
- **Two positioning modes** — `transform` (no layout shift) or `absolute`
- **Axis constraint** — restrict dragging to `x`, `y`, or `both`
- **Grid snapping** — snap to any `[column, row]` grid
- **Drag handles** — restrict drag start to a specific handle element
- **Full event callbacks** — `onDragStart`, `onDrag`, `onDragEnd`
- **Headless hook** — `useDraggable` for completely custom rendering
- **Imperative control** — `usePosition` to read or update positions outside of drag
- **SSR-safe** — no `window` references on the server
- **Zero runtime deps** — only peer dependency on React 16.8+

## API

### `<DraggableUI>`

Root provider. Must wrap all `Draggable` instances.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'default'` | Key for persisting positions |
| `storageAdapter` | `StorageAdapter` | `localStorage` adapter | Custom persistence backend |
| `positioningMode` | `'transform' \| 'absolute'` | `'transform'` | CSS strategy for positioning |
| `className` | `string` | — | Class for the wrapper element |
| `style` | `CSSProperties` | — | Inline styles for the wrapper |
| `as` | `ElementType` | `'div'` | Wrapper element tag |

### `<Draggable>`

Makes its single child element draggable.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | required | Unique identifier |
| `defaultPosition` | `{ x: number, y: number }` | `{ x: 0, y: 0 }` | Initial position |
| `disabled` | `boolean` | `false` | Disables dragging |
| `axis` | `'both' \| 'x' \| 'y'` | `'both'` | Restrict movement axis |
| `grid` | `[number, number]` | — | Snap grid `[column, row]` |
| `zIndex` | `number` | — | Z-index while dragging (via style) |
| `handle` | `RefObject<HTMLElement>` | — | Element that must be clicked to drag |
| `onDragStart` | `(event) => void` | — | Called on drag start |
| `onDrag` | `(event) => void` | — | Called on each drag move |
| `onDragEnd` | `(event) => void` | — | Called on drag end |

### `useDraggable(options)`

Headless hook — returns `{ ref, style, onPointerDown, attributes }` for fully custom rendering.

### `usePosition(id, defaultPosition?)`

Read and update a draggable's position imperatively. Returns `{ x, y, setPosition, resetPosition }`.

### `useDragContext()`

Access the nearest `DraggableUI` context. Throws if called outside a provider.

### Types

| Export | Description |
|--------|-------------|
| `Position` | `{ x: number, y: number }` |
| `StorageAdapter` | `{ getItem, setItem, removeItem }` |
| `PositioningMode` | `'transform' \| 'absolute'` |
| `DragStartEvent` | Event payload on drag start |
| `DragMoveEvent` | Event payload during drag |
| `DragEndEvent` | Event payload on drag end |

---

## Developing

```bash
git clone https://github.com/thepaulin/d_ui.git
cd d_ui
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Watch mode rebuild |
| `npm run build` | Production build via tsup |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Watch mode tests |
| `npm run test:coverage` | Test coverage report |
| `npm run typecheck` | TypeScript type check |

### Project structure

```
src/
  components/   — DraggableUI, Draggable
  context/      — DragContext provider
  hooks/        — useDraggable, usePosition, useDragContext
  utils/        — storage, coordinates, guards
  types/        — TypeScript interfaces
  constants.ts  — shared constants
```

### Contributing

1. Fork the repo and create a feature branch.
2. Run `npm install` and `npm run dev` to start the build watcher.
3. Write or update tests under `src/**/__tests__/`.
4. Run `npm test` and `npm run typecheck` — all must pass.
5. Open a pull request.

The library aims to be minimal. New features should justify their weight. When in doubt, open an issue first to discuss.
