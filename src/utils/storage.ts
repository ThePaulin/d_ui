import type { StorageAdapter } from '../types';
import { isBrowser } from './guards';

export const defaultStorageAdapter: StorageAdapter = {
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },
};
