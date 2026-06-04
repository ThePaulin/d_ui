import React, { useMemo } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import type { DraggableProps } from '../types';

export function Draggable({
  children,
  id,
  defaultPosition,
  disabled,
  axis,
  grid,
  zIndex,
  handle,
  onDragStart,
  onDrag,
  onDragEnd,
}: DraggableProps) {
  const { ref, style, onPointerDown, attributes } = useDraggable({
    id,
    defaultPosition,
    disabled,
    axis,
    grid,
    zIndex,
    handle,
    onDragStart,
    onDrag,
    onDragEnd,
  });

  const child = useMemo(
    () =>
      React.cloneElement(children, {
        ref,
        style: {
          ...children.props.style,
          ...style,
        },
        onPointerDown: (e: React.PointerEvent) => {
          children.props.onPointerDown?.(e);
          onPointerDown(e);
        },
        ...attributes,
      }),
    [children, ref, style, onPointerDown, attributes]
  );

  return child;
}
