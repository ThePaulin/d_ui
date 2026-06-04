import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DraggableUI } from '../../components/DraggableUI';
import { useDraggable } from '../useDraggable';
import type { UseDraggableOptions } from '../../types';

function TestComponent({ options }: { options: UseDraggableOptions }) {
  const { ref, style, onPointerDown, attributes } = useDraggable(options);
  return (
    <div
      ref={ref}
      style={style}
      onPointerDown={onPointerDown}
      {...attributes}
      data-testid="draggable"
    >
      drag me
    </div>
  );
}

function renderTest(opts: Partial<UseDraggableOptions> = {}) {
  const options: UseDraggableOptions = { id: 'test', ...opts };
  return render(
    <DraggableUI storageKey="test">
      <TestComponent options={options} />
    </DraggableUI>
  );
}

async function simulateDrag(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  pointerId = 1
) {
  const element = screen.getByTestId('draggable');
  await act(async () => {
    fireEvent.pointerDown(element, {
      clientX: fromX,
      clientY: fromY,
      pointerId,
      bubbles: true,
    });
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: toX,
        clientY: toY,
        pointerId,
        bubbles: true,
      })
    );
    document.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: toX,
        clientY: toY,
        pointerId,
        bubbles: true,
      })
    );
  });
}

describe('useDraggable', () => {
  it('returns initial transform style at origin', () => {
    renderTest();
    const el = screen.getByTestId('draggable');
    expect(el).toHaveStyle('transform: translate(0px, 0px)');
  });

  it('applies defaultPosition in transform style', () => {
    renderTest({ defaultPosition: { x: 50, y: 100 } });
    expect(screen.getByTestId('draggable')).toHaveStyle(
      'transform: translate(50px, 100px)'
    );
  });

  it('updates position on drag', async () => {
    renderTest();
    await simulateDrag(0, 0, 100, 50);
    await waitFor(() =>
      expect(screen.getByTestId('draggable')).toHaveStyle(
        'transform: translate(100px, 50px)'
      )
    );
  });

  it('restricts to axis x when axis="x"', async () => {
    renderTest({ axis: 'x' });
    await simulateDrag(0, 0, 100, 50);
    await waitFor(() =>
      expect(screen.getByTestId('draggable')).toHaveStyle(
        'transform: translate(100px, 0px)'
      )
    );
  });

  it('restricts to axis y when axis="y"', async () => {
    renderTest({ axis: 'y' });
    await simulateDrag(0, 0, 100, 50);
    await waitFor(() =>
      expect(screen.getByTestId('draggable')).toHaveStyle(
        'transform: translate(0px, 50px)'
      )
    );
  });

  it('snaps to grid', async () => {
    renderTest({ grid: [50, 50] });
    await simulateDrag(0, 0, 123, 78);
    await waitFor(() =>
      expect(screen.getByTestId('draggable')).toHaveStyle(
        'transform: translate(100px, 100px)'
      )
    );
  });

  it('does not move when disabled', async () => {
    renderTest({ disabled: true });
    await simulateDrag(0, 0, 100, 50);
    await waitFor(() =>
      expect(screen.getByTestId('draggable')).toHaveStyle(
        'transform: translate(0px, 0px)'
      )
    );
  });

  it('fires onDragStart, onDrag, onDragEnd with correct payloads', async () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();

    renderTest({ onDragStart, onDrag, onDragEnd });
    await simulateDrag(0, 0, 100, 50);

    await waitFor(() => {
      expect(onDragStart).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test',
          position: { x: 0, y: 0 },
        })
      );
      expect(onDrag).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test',
          position: { x: 100, y: 50 },
        })
      );
      expect(onDragEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test',
          position: { x: 100, y: 50 },
        })
      );
    });
  });

  it('sets absolute positioning when positioningMode is absolute', () => {
    renderTest({
      positioningMode: 'absolute',
      defaultPosition: { x: 30, y: 60 },
    });
    const el = screen.getByTestId('draggable');
    expect(el).toHaveStyle('left: 30px');
    expect(el).toHaveStyle('top: 60px');
    expect(el).toHaveStyle('position: absolute');
  });

  it('applies touchAction: none and grab cursor when enabled', () => {
    renderTest();
    const el = screen.getByTestId('draggable');
    expect(el).toHaveStyle('touch-action: none');
    expect(el).toHaveStyle('cursor: grab');
  });
});
