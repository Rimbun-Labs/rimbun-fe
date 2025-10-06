import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { debounceMs?: number }
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { debounceMs = 0 } = options || {};
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get from localStorage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state immediately
      setStoredValue(valueToStore);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce localStorage write if debounceMs is set
      if (debounceMs > 0) {
        timeoutRef.current = setTimeout(() => {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
          }
        }, debounceMs);
      } else {
        // Write to localStorage immediately if no debouncing
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, debounceMs]);

  const removeValue = useCallback(() => {
    try {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, setValue, removeValue];
} 