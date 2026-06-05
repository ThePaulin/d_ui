import React from 'react';
import { DragProvider } from '../context/DragContext';
import { AutoModeWrapper } from './AutoModeWrapper';
import type { DraggableUIProps } from '../types';

export function DraggableUI({
  children,
  storageKey,
  storageAdapter,
  positioningMode,
  className,
  style,
  as: Tag = 'div',
  autoMode,
}: DraggableUIProps) {
  const inner = autoMode ? (
    <AutoModeWrapper options={typeof autoMode === 'boolean' ? {} : autoMode}>
      {children}
    </AutoModeWrapper>
  ) : (
    children
  );

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
        {inner}
      </Tag>
    </DragProvider>
  );
}
