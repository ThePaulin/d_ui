import { describe, it, expect, beforeEach } from 'vitest';
import { defaultStorageAdapter } from '../storage';

describe('defaultStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves a value', () => {
    defaultStorageAdapter.setItem('test-key', 'hello');
    expect(defaultStorageAdapter.getItem('test-key')).toBe('hello');
  });

  it('returns null for missing keys', () => {
    expect(defaultStorageAdapter.getItem('nonexistent')).toBeNull();
  });

  it('removes a stored value', () => {
    defaultStorageAdapter.setItem('test-key', 'hello');
    defaultStorageAdapter.removeItem('test-key');
    expect(defaultStorageAdapter.getItem('test-key')).toBeNull();
  });
});
