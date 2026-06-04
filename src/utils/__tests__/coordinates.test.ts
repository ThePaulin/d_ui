import { describe, it, expect } from 'vitest';
import { applyGrid } from '../coordinates';

describe('applyGrid', () => {
  it('snaps x and y to the nearest grid cell', () => {
    expect(applyGrid({ x: 37, y: 42 }, [20, 20])).toEqual({ x: 40, y: 40 });
    expect(applyGrid({ x: 11, y: 9 }, [10, 10])).toEqual({ x: 10, y: 10 });
  });

  it('rounds to the nearest grid multiple (not floor)', () => {
    expect(applyGrid({ x: 26, y: 74 }, [50, 50])).toEqual({ x: 50, y: 50 });
    expect(applyGrid({ x: 24, y: 24 }, [50, 50])).toEqual({ x: 0, y: 0 });
  });

  it('handles different grid values per axis', () => {
    expect(applyGrid({ x: 37, y: 102 }, [20, 50])).toEqual({ x: 40, y: 100 });
  });
});
