import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DraggableUI } from '../DraggableUI';
import { Draggable } from '../Draggable';

describe('Draggable', () => {
  it('renders its child with draggable attributes', () => {
    render(
      <DraggableUI storageKey="test">
        <Draggable id="drag-1">
          <div data-testid="child">drag me</div>
        </Draggable>
      </DraggableUI>
    );
    const child = screen.getByTestId('child');
    expect(child).toHaveAttribute('data-draggable-id', 'drag-1');
    expect(child).toHaveStyle('transform: translate(0px, 0px)');
  });

  it('applies defaultPosition style to the child', () => {
    render(
      <DraggableUI storageKey="test">
        <Draggable id="drag-2" defaultPosition={{ x: 25, y: 75 }}>
          <div data-testid="child2">drag me</div>
        </Draggable>
      </DraggableUI>
    );
    const child = screen.getByTestId('child2');
    expect(child).toHaveStyle('transform: translate(25px, 75px)');
  });

  it('forwards onPointerDown to the child', () => {
    const handlePointerDown = vi.fn();
    render(
      <DraggableUI storageKey="test">
        <Draggable id="drag-3">
          <div data-testid="child3" onPointerDown={handlePointerDown}>
            drag me
          </div>
        </Draggable>
      </DraggableUI>
    );
    const child = screen.getByTestId('child3');

    // fireEvent.pointerDown on child — both the child's original
    // handler and the Draggable-injected handler should fire
    const event = new PointerEvent('pointerdown', {
      bubbles: true,
      pointerId: 1,
    });
    child.dispatchEvent(event);

    expect(handlePointerDown).toHaveBeenCalledTimes(1);
  });
});
