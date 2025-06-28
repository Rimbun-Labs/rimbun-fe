import { useState, useEffect, useCallback, useRef } from 'react';
import { storageCache } from '@/lib/storage/cache';
import { storagePerformanceMonitor } from '@/lib/storage/performance';

interface UseLocalStorageOptions {
  debounceMs?: number;
  validate?: (value: any) => boolean;
  onError?: (error: Error) => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { debounceMs = 300, validate, onError } = options;
  const [storedValue, setStoredValue] = useState<T>(() => {
    const startTime = performance.now();
    try {
      const cached = storageCache.get(key);
      if (cached !== null) {
        const duration = performance.now() - startTime;
        storagePerformanceMonitor.trackOperation(key, 'get', duration, true);
        return cached;
      }
      
      // Fallback to localStorage if not in cache
      const item = localStorage.getItem(key);
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'get', duration, true);
      
      if (item !== null) {
        const parsed = JSON.parse(item);
        storageCache.set(key, parsed);
        return parsed;
      }
      
      return initialValue;
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'get', duration, false);
      onError?.(error as Error);
      return initialValue;
    }
  });

  const debounceRef = useRef<NodeJS.Timeout>();
  const lastValueRef = useRef<T>(storedValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const newValue = value instanceof Function ? value(storedValue) : value;
    
    // Validation
    if (validate && !validate(newValue)) {
      onError?.(new Error(`Invalid value for key: ${key}`));
      return;
    }

    // Update state immediately for responsive UI
    setStoredValue(newValue);
    lastValueRef.current = newValue;

    // Debounce localStorage write
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const startTime = performance.now();
      try {
        storageCache.set(key, newValue);
        const duration = performance.now() - startTime;
        storagePerformanceMonitor.trackOperation(key, 'set', duration, true);
      } catch (error) {
        const duration = performance.now() - startTime;
        storagePerformanceMonitor.trackOperation(key, 'set', duration, false);
        onError?.(error as Error);
      }
    }, debounceMs);
  }, [key, storedValue, debounceMs, validate, onError]);

  const removeValue = useCallback(() => {
    const startTime = performance.now();
    try {
      storageCache.remove(key);
      setStoredValue(initialValue);
      lastValueRef.current = initialValue;
      
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'remove', duration, true);
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'remove', duration, false);
      onError?.(error as Error);
    }
  }, [key, initialValue, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          if (JSON.stringify(newValue) !== JSON.stringify(lastValueRef.current)) {
            setStoredValue(newValue);
            lastValueRef.current = newValue;
          }
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, onError]);

  return [storedValue, setValue, removeValue];
} 