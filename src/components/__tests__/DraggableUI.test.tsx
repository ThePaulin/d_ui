import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DraggableUI } from '../DraggableUI';

describe('DraggableUI', () => {
  it('renders children in a position: relative container', () => {
    render(
      <DraggableUI>
        <div data-testid="child">hello</div>
      </DraggableUI>
    );
    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child.parentElement).toHaveStyle('position: relative');
  });

  it('renders with a custom element type via the as prop', () => {
    const { container } = render(
      <DraggableUI as="section">
        <div>content</div>
      </DraggableUI>
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('forwards className and style to the container', () => {
    render(
      <DraggableUI className="my-class" style={{ background: 'red' }}>
        <div>content</div>
      </DraggableUI>
    );
    const container = screen.getByText('content').parentElement;
    expect(container).toHaveClass('my-class');
    expect(container).toHaveStyle('background: red');
  });

  describe('autoMode', () => {
    async function simulateAutoDrag(
      testId: string,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      pointerId = 1
    ) {
      const element = screen.getByTestId(testId);
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

    it('wraps direct children with draggable attributes when autoMode is true', () => {
      render(
        <DraggableUI storageKey="auto-test-1" autoMode>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </DraggableUI>
      );
      const el1 = screen.getByTestId('child-1');
      const el2 = screen.getByTestId('child-2');

      expect(el1).toHaveAttribute('data-draggable-id');
      expect(el2).toHaveAttribute('data-draggable-id');
      expect(el1).toHaveStyle('transform: translate(0px, 0px)');
      expect(el2).toHaveStyle('transform: translate(0px, 0px)');
    });

    it('generates different IDs for different children', () => {
      render(
        <DraggableUI storageKey="auto-test-2" autoMode>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </DraggableUI>
      );
      const id1 = screen.getByTestId('child-1').getAttribute('data-draggable-id');
      const id2 = screen.getByTestId('child-2').getAttribute('data-draggable-id');

      expect(id1).not.toBe(id2);
    });

    it('applies draggable styles (touchAction, cursor, userSelect) to children', () => {
      render(
        <DraggableUI storageKey="auto-test-3" autoMode>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );
      const el = screen.getByTestId('child');
      expect(el).toHaveStyle('touch-action: none');
      expect(el).toHaveStyle('cursor: grab');
      expect(el).toHaveStyle('user-select: none');
    });

    it('forwards axis option to auto-wrapped children', () => {
      render(
        <DraggableUI storageKey="auto-test-4" autoMode={{ axis: 'x' }}>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );
      const el = screen.getByTestId('child');
      expect(el).toHaveAttribute('data-draggable-id');
      expect(el).toHaveStyle('transform: translate(0px, 0px)');
    });

    it('forwards zIndex option to auto-wrapped children', () => {
      render(
        <DraggableUI storageKey="auto-test-5" autoMode={{ zIndex: 100 }}>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );
      const el = screen.getByTestId('child');
      expect(el).toHaveStyle('z-index: 100');
    });

    it('maintains stable IDs across re-renders', () => {
      function TestHarness() {
        const [_, forceUpdate] = useState(0);
        return (
          <>
            <button data-testid="re-render" onClick={() => forceUpdate((c) => c + 1)} />
            <DraggableUI storageKey="auto-test-6" autoMode>
              <div data-testid="child">stable</div>
            </DraggableUI>
          </>
        );
      }

      render(<TestHarness />);
      const before = screen.getByTestId('child').getAttribute('data-draggable-id');

      screen.getByTestId('re-render').click();

      const after = screen.getByTestId('child').getAttribute('data-draggable-id');
      expect(after).toBe(before);
    });

    it('moves child position on drag', async () => {
      render(
        <DraggableUI storageKey="auto-drag-1" autoMode>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      await simulateAutoDrag('child', 0, 0, 100, 50);
      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(100px, 50px)'
        )
      );
    });

    it('snaps to grid on drag when grid option is set', async () => {
      render(
        <DraggableUI storageKey="auto-drag-2" autoMode={{ grid: [50, 50] }}>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      await simulateAutoDrag('child', 0, 0, 123, 78);
      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(100px, 100px)'
        )
      );
    });

    it('constrains movement to axis when axis option is set', async () => {
      render(
        <DraggableUI storageKey="auto-drag-3" autoMode={{ axis: 'x' }}>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      await simulateAutoDrag('child', 0, 0, 100, 50);
      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(100px, 0px)'
        )
      );
    });

    it('persists position across unmount and remount', async () => {
      const { unmount } = render(
        <DraggableUI storageKey="auto-persist" autoMode>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      await simulateAutoDrag('child', 0, 0, 100, 50);
      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(100px, 50px)'
        )
      );

      unmount();

      render(
        <DraggableUI storageKey="auto-persist" autoMode>
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(100px, 50px)'
        )
      );
    });

    it('persists multiple children positions independently', async () => {
      render(
        <DraggableUI storageKey="auto-persist-multi" autoMode>
          <div data-testid="child-a">A</div>
          <div data-testid="child-b">B</div>
        </DraggableUI>
      );

      await simulateAutoDrag('child-a', 0, 0, 80, 20);
      await waitFor(() =>
        expect(screen.getByTestId('child-a')).toHaveStyle(
          'transform: translate(80px, 20px)'
        )
      );

      const elB = screen.getByTestId('child-b');
      expect(elB).toHaveStyle('transform: translate(0px, 0px)');
    });

    it('renders with no children without error', () => {
      expect(() =>
        render(
          <DraggableUI storageKey="auto-empty" autoMode />
        )
      ).not.toThrow();
    });

    it('maintains IDs for children with explicit keys when order changes', () => {
      function OrderedTest() {
        const [swapped, setSwapped] = useState(false);
        return (
          <>
            <button data-testid="swap" onClick={() => setSwapped((s) => !s)} />
            <DraggableUI storageKey="auto-keys" autoMode>
              {swapped
                ? [
                    <div key="b" data-testid="child-b">
                      B
                    </div>,
                    <div key="a" data-testid="child-a">
                      A
                    </div>,
                  ]
                : [
                    <div key="a" data-testid="child-a">
                      A
                    </div>,
                    <div key="b" data-testid="child-b">
                      B
                    </div>,
                  ]}
            </DraggableUI>
          </>
        );
      }

      render(<OrderedTest />);
      const idA = screen.getByTestId('child-a').getAttribute('data-draggable-id');
      const idB = screen.getByTestId('child-b').getAttribute('data-draggable-id');

      screen.getByTestId('swap').click();

      const idA2 = screen.getByTestId('child-a').getAttribute('data-draggable-id');
      const idB2 = screen.getByTestId('child-b').getAttribute('data-draggable-id');

      expect(idA2).toBe(idA);
      expect(idB2).toBe(idB);
    });

    it('works with absolute positioningMode', () => {
      render(
        <DraggableUI
          storageKey="auto-absolute"
          autoMode
          positioningMode="absolute"
        >
          <div data-testid="child">drag me</div>
        </DraggableUI>
      );

      const el = screen.getByTestId('child');
      expect(el).toHaveStyle('position: absolute');
      expect(el).toHaveStyle('left: 0px');
      expect(el).toHaveStyle('top: 0px');
    });

    it('forwards existing onPointerDown handler on child', async () => {
      const handlePointerDown = vi.fn();

      render(
        <DraggableUI storageKey="auto-fwd" autoMode>
          <div data-testid="child" onPointerDown={handlePointerDown}>
            drag me
          </div>
        </DraggableUI>
      );

      await simulateAutoDrag('child', 0, 0, 50, 25);

      expect(handlePointerDown).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(screen.getByTestId('child')).toHaveStyle(
          'transform: translate(50px, 25px)'
        )
      );
    });

    it('handles dynamic add and remove of children', async () => {
      function DynamicTest() {
        const [items, setItems] = useState<{ id: string; label: string }[]>([
          { id: 'a', label: 'A' },
        ]);
        return (
          <>
            <button
              data-testid="add"
              onClick={() => setItems((prev) => [...prev, { id: 'b', label: 'B' }])}
            />
            <button
              data-testid="remove"
              onClick={() => setItems((prev) => prev.slice(0, -1))}
            />
            <DraggableUI storageKey="auto-dynamic" autoMode>
              {items.map((item) => (
                <div key={item.id} data-testid={`child-${item.id}`}>
                  {item.label}
                </div>
              ))}
            </DraggableUI>
          </>
        );
      }

      render(<DynamicTest />);
      const idA = screen.getByTestId('child-a').getAttribute('data-draggable-id');

      await act(async () => {
        screen.getByTestId('add').click();
      });

      await waitFor(() =>
        expect(screen.getByTestId('child-b')).toBeInTheDocument()
      );
      const idB = screen.getByTestId('child-b').getAttribute('data-draggable-id');
      const idA2 = screen.getByTestId('child-a').getAttribute('data-draggable-id');

      expect(idA2).toBe(idA);
      expect(idB).toBeTruthy();

      await act(async () => {
        screen.getByTestId('remove').click();
      });
      expect(screen.queryByTestId('child-b')).not.toBeInTheDocument();
      expect(screen.getByTestId('child-a')).toBeInTheDocument();
    });
  });
});
