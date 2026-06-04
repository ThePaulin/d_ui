import type { Position } from '../types';

function snapToGrid(value: number, grid: number): number {
  return Math.round(value / grid) * grid;
}

export function applyGrid(position: Position, grid: [number, number]): Position {
  return {
    x: snapToGrid(position.x, grid[0]),
    y: snapToGrid(position.y, grid[1]),
  };
}
