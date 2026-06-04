import { useCallback, useEffect, useRef, useState } from 'react';
import type { Position, UseDraggableOptions, UseDraggableReturn } from '../types';
import { useDragContext } from './useDragContext';
import { applyGrid } from '../utils/coordinates';

export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const {
    id,
    defaultPosition,
    disabled = false,
    axis = 'both',
    grid,
    zIndex,
    handle,
    onDragStart,
    onDrag,
    onDragEnd,
    positioningMode: localPositioningMode,
  } = options;

  const context = useDragContext();
  const positioningMode = localPositioningMode ?? context.positioningMode;

  const nodeRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef(-1);
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const startPointerRef = useRef<Position>({ x: 0, y: 0 });
  const currentPosRef = useRef<Position>({ x: 0, y: 0 });

  const onDragStartRef = useRef(onDragStart);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  onDragStartRef.current = onDragStart;
  onDragRef.current = onDrag;
  onDragEndRef.current = onDragEnd;

  const [position, setPosition] = useState<Position>(() => {
    return context.getPosition(id) ?? defaultPosition ?? { x: 0, y: 0 };
  });

  useEffect(() => {
    const existing = context.getPosition(id);
    if (existing === undefined && defaultPosition) {
      context.register(id, defaultPosition);
    }
    return () => context.unregister(id);
  }, [id]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      const el = nodeRef.current;
      if (!el) return;

      if (handle?.current && !handle.current.contains(e.target as Node)) return;

      e.preventDefault();

      const currentPos = context.getPosition(id) ?? defaultPosition ?? { x: 0, y: 0 };

      isDraggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      startPosRef.current = { ...currentPos };
      startPointerRef.current = { x: e.clientX, y: e.clientY };
      currentPosRef.current = { ...currentPos };

      onDragStartRef.current?.({
        id,
        position: { ...currentPos },
        nativeEvent: e.nativeEvent,
      });

      const onPointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current || e.pointerId !== pointerIdRef.current) return;

        const deltaX = e.clientX - startPointerRef.current.x;
        const deltaY = e.clientY - startPointerRef.current.y;

        let newX = startPosRef.current.x;
        let newY = startPosRef.current.y;

        if (axis === 'x' || axis === 'both') newX += deltaX;
        if (axis === 'y' || axis === 'both') newY += deltaY;

        const snapped = grid ? applyGrid({ x: newX, y: newY }, grid) : { x: newX, y: newY };

        currentPosRef.current = snapped;
        setPosition(snapped);

        onDragRef.current?.({
          id,
          position: snapped,
          delta: { x: snapped.x - startPosRef.current.x, y: snapped.y - startPosRef.current.y },
          nativeEvent: e,
        });
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDraggingRef.current || e.pointerId !== pointerIdRef.current) return;

        isDraggingRef.current = false;

        const finalPos = currentPosRef.current;

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);

        context.setPosition(id, finalPos);

        onDragEndRef.current?.({
          id,
          position: finalPos,
          nativeEvent: e,
        });
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    },
    [disabled, id, axis, grid, handle, context, defaultPosition]
  );

  const style: React.CSSProperties = {
    ...(positioningMode === 'absolute'
      ? {
          position: 'absolute',
          left: position.x,
          top: position.y,
        }
      : {
          transform: `translate(${position.x}px, ${position.y}px)`,
        }),
    ...(zIndex != null ? { zIndex } : {}),
    ...(disabled ? {} : { touchAction: 'none', cursor: 'grab' }),
    userSelect: 'none',
  };

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  return {
    ref,
    style,
    onPointerDown: handlePointerDown,
    attributes: {
      'data-draggable-id': id,
    },
  };
}
