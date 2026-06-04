import { useContext } from 'react';
import { DragContext } from '../context/DragContext';
import type { DragContextType } from '../types';

export function useDragContext(): DragContextType {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a <DraggableUI> component');
  }
  return context;
}
