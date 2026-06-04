import React from 'react';
import { DragProvider } from '../context/DragContext';
import type { DraggableUIProps } from '../types';

export function DraggableUI({
  children,
  storageKey,
  storageAdapter,
  positioningMode,
  className,
  style,
  as: Tag = 'div',
}: DraggableUIProps) {
  return (
    <DragProvider
      storageKey={storageKey}
      storageAdapter={storageAdapter}
      positioningMode={positioningMode}
    >
      <Tag
        className={className}
        style={{
          position: 'relative',
          ...style,
        }}
      >
        {children}
      </Tag>
    </DragProvider>
  );
}
