import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDragContext } from '../useDragContext';
import { DraggableUI } from '../../components/DraggableUI';

function InnerComponent() {
  const ctx = useDragContext();
  return <div data-testid="inner">{ctx.storageKey}</div>;
}

function OuterComponent() {
  const ctx = useDragContext();
  return <div data-testid="outer">{ctx.storageKey}</div>;
}

describe('useDragContext', () => {
  it('returns context when used inside DraggableUI', () => {
    render(
      <DraggableUI storageKey="my-app">
        <InnerComponent />
      </DraggableUI>
    );
    expect(screen.getByTestId('inner')).toHaveTextContent('my-app');
  });

  it('throws when used outside DraggableUI', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => render(<OuterComponent />)).toThrow(
      'useDragContext must be used within a <DraggableUI> component'
    );

    console.error = originalError;
  });
});
