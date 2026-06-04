import type { Position } from './draggable';

export interface DragStartEvent {
  id: string;
  position: Position;
  nativeEvent: PointerEvent;
}

export interface DragMoveEvent {
  id: string;
  position: Position;
  delta: Position;
  nativeEvent: PointerEvent;
}

export interface DragEndEvent {
  id: string;
  position: Position;
  nativeEvent: PointerEvent;
}
