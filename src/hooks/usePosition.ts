import { useCallback, useState } from 'react';
import { useDragContext } from './useDragContext';
import type { Position } from '../types';

export function usePosition(id: string, defaultPosition?: Position) {
  const context = useDragContext();
  const [position, setLocalPosition] = useState<Position>(
    () => context.getPosition(id) ?? defaultPosition ?? { x: 0, y: 0 }
  );

  const updatePosition = useCallback(
    (pos: Position) => {
      setLocalPosition(pos);
      context.setPosition(id, pos);
    },
    [id, context]
  );

  const resetPosition = useCallback(() => {
    if (defaultPosition) {
      setLocalPosition(defaultPosition);
      context.setPosition(id, defaultPosition);
    }
  }, [id, defaultPosition, context]);

  return {
    x: position.x,
    y: position.y,
    setPosition: updatePosition,
    resetPosition,
  } as const;
}
