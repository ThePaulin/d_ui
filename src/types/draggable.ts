import type { StorageAdapter } from './storage';
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from './events';

export interface Position {
  x: number;
  y: number;
}

export type PositioningMode = 'transform' | 'absolute';

export interface DragContextType {
  storageAdapter: StorageAdapter;
  storageKey: string;
  positioningMode: PositioningMode;
  getPosition(id: string): Position | undefined;
  setPosition(id: string, position: Position): void;
  register(id: string, defaultPosition?: Position): void;
  unregister(id: string): void;
}

export interface AutoModeOptions {
  axis?: 'both' | 'x' | 'y';
  grid?: [number, number];
  zIndex?: number;
}

export interface DraggableUIProps {
  children?: React.ReactNode;
  storageKey?: string;
  storageAdapter?: StorageAdapter;
  positioningMode?: PositioningMode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  autoMode?: boolean | AutoModeOptions;
}

export interface DraggableProps {
  children: React.ReactElement;
  id: string;
  defaultPosition?: Position;
  disabled?: boolean;
  axis?: 'both' | 'x' | 'y';
  grid?: [number, number];
  zIndex?: number;
  handle?: React.RefObject<HTMLElement>;
  onDragStart?: (event: DragStartEvent) => void;
  onDrag?: (event: DragMoveEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export interface UseDraggableOptions {
  id: string;
  defaultPosition?: Position;
  disabled?: boolean;
  axis?: 'both' | 'x' | 'y';
  grid?: [number, number];
  zIndex?: number;
  handle?: React.RefObject<HTMLElement>;
  onDragStart?: (event: DragStartEvent) => void;
  onDrag?: (event: DragMoveEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  positioningMode?: PositioningMode;
}

export interface UseDraggableReturn {
  ref: React.RefCallback<HTMLElement>;
  style: React.CSSProperties;
  onPointerDown: (e: React.PointerEvent) => void;
  attributes: Record<string, string>;
}
