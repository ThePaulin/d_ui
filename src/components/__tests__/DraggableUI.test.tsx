import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
