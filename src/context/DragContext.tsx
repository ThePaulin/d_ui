import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import type { Position, DragContextType, StorageAdapter, PositioningMode } from '../types';
import { STORAGE_PREFIX } from '../constants';
import { defaultStorageAdapter } from '../utils/storage';

interface DragProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  storageAdapter?: StorageAdapter;
  positioningMode?: PositioningMode;
}

export const DragContext = createContext<DragContextType | null>(null);

export function DragProvider({
  children,
  storageKey = 'default',
  storageAdapter = defaultStorageAdapter,
  positioningMode = 'transform',
}: DragProviderProps) {
  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    try {
      const stored = storageAdapter.getItem(`${STORAGE_PREFIX}:${storageKey}`);
      if (typeof stored === 'string') {
        return JSON.parse(stored) as Record<string, Position>;
      }
    } catch {
      // invalid stored data, ignore
    }
    return {};
  });

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const fullKey = `${STORAGE_PREFIX}:${storageKey}`;

  useEffect(() => {
    const loadAsync = async () => {
      try {
        const stored = await storageAdapter.getItem(fullKey);
        if (typeof stored === 'string') {
          const parsed = JSON.parse(stored) as Record<string, Position>;
          setPositions(parsed);
        }
      } catch {
        // ignore
      }
    };
    loadAsync();
  }, [fullKey, storageAdapter]);

  const persist = useCallback(
    (positions: Record<string, Position>) => {
      try {
        storageAdapter.setItem(fullKey, JSON.stringify(positions));
      } catch {
        // storage write failed
      }
    },
    [fullKey, storageAdapter]
  );

  const getPosition = useCallback(
    (id: string): Position | undefined => {
      return positionsRef.current[id];
    },
    []
  );

  const setPosition = useCallback(
    (id: string, position: Position) => {
      setPositions((prev) => {
        const next = { ...prev, [id]: position };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const register = useCallback(
    (id: string, defaultPosition?: Position) => {
      setPositions((prev) => {
        if (prev[id] !== undefined) return prev;
        if (defaultPosition === undefined) return prev;
        return { ...prev, [id]: defaultPosition };
      });
    },
    []
  );

  const unregister = useCallback((id: string) => {
    setPositions((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const value: DragContextType = {
    storageAdapter,
    storageKey,
    positioningMode,
    getPosition,
    setPosition,
    register,
    unregister,
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
}
