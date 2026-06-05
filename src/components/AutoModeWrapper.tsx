import React, { useRef } from 'react';
import { Draggable } from './Draggable';
import type { AutoModeOptions } from '../types';

interface AutoModeWrapperProps {
  children: React.ReactNode;
  options: AutoModeOptions;
}

interface CacheEntry {
  element: React.ReactElement;
  child: React.ReactElement;
}

function AutoModeWrapperInner({ children, options }: AutoModeWrapperProps) {
  const idMapRef = useRef<Map<React.Key, string>>(new Map());
  const cacheRef = useRef<Map<React.Key, CacheEntry>>(new Map());
  const idCounterRef = useRef(0);

  const childrenArray = React.Children.toArray(children);

  const result: React.ReactElement[] = [];
  const newIdMap = new Map<React.Key, string>();
  const newCache = new Map<React.Key, CacheEntry>();

  for (let i = 0; i < childrenArray.length; i++) {
    const child = childrenArray[i] as React.ReactElement;
    const key = child.key !== null ? child.key : `.${i}`;

    let id = idMapRef.current.get(key);
    if (!id) {
      id = `auto-${idCounterRef.current++}`;
    }
    newIdMap.set(key, id);

    const cached = cacheRef.current.get(key);
    if (cached && cached.child === child) {
      result.push(cached.element);
      newCache.set(key, cached);
      continue;
    }

    const wrapped = (
      <Draggable key={key} id={id} {...options}>
        {child}
      </Draggable>
    );

    result.push(wrapped);
    newCache.set(key, { element: wrapped, child });
  }

  idMapRef.current = newIdMap;
  cacheRef.current = newCache;

  return <>{result}</>;
}

export const AutoModeWrapper = React.memo(AutoModeWrapperInner);
