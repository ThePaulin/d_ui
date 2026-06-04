import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePosition } from '../usePosition';
import { DraggableUI } from '../../components/DraggableUI';

function TestComponent({
  id,
  defaultPosition,
  onRender,
}: {
  id: string;
  defaultPosition?: { x: number; y: number };
  onRender?: (ctrl: ReturnType<typeof usePosition>) => void;
}) {
  const ctrl = usePosition(id, defaultPosition);
  onRender?.(ctrl);
  return (
    <div data-testid="pos">
      ({ctrl.x}, {ctrl.y})
    </div>
  );
}

describe('usePosition', () => {
  it('returns the initial position from context or default', () => {
    render(
      <DraggableUI storageKey="test">
        <TestComponent id="a" defaultPosition={{ x: 10, y: 20 }} />
      </DraggableUI>
    );
    expect(screen.getByTestId('pos')).toHaveTextContent('(10, 20)');
  });

  it('setPosition updates the position and re-renders', async () => {
    let ctrl!: ReturnType<typeof usePosition>;
    render(
      <DraggableUI storageKey="test">
        <TestComponent
          id="a"
          defaultPosition={{ x: 0, y: 0 }}
          onRender={(c) => {
            ctrl = c;
          }}
        />
      </DraggableUI>
    );

    ctrl.setPosition({ x: 50, y: 100 });

    await waitFor(() =>
      expect(screen.getByTestId('pos')).toHaveTextContent('(50, 100)')
    );
  });

  it('resetPosition restores the default position', async () => {
    let ctrl!: ReturnType<typeof usePosition>;
    render(
      <DraggableUI storageKey="test">
        <TestComponent
          id="a"
          defaultPosition={{ x: 10, y: 20 }}
          onRender={(c) => {
            ctrl = c;
          }}
        />
      </DraggableUI>
    );

    ctrl.setPosition({ x: 999, y: 999 });

    await waitFor(() =>
      expect(screen.getByTestId('pos')).toHaveTextContent('(999, 999)')
    );

    ctrl.resetPosition();

    await waitFor(() =>
      expect(screen.getByTestId('pos')).toHaveTextContent('(10, 20)')
    );
  });
});
