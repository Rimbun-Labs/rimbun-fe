import { storageCache } from './cache';
import { storagePerformanceMonitor } from './performance';

/**
 * Optimized localStorage utilities for non-React contexts
 * Uses the same caching and performance monitoring as useLocalStorage hook
 */
export const storageUtils = {
  /**
   * Get item from localStorage with caching
   * @param key - Storage key
   * @returns The stored value or null if not found
   */
  getItem: (key: string): string | null => {
    const startTime = performance.now();
    try {
      // Check cache first
      const cached = storageCache.get(key);
      if (cached !== null) {
        const duration = performance.now() - startTime;
        storagePerformanceMonitor.trackOperation(key, 'get', duration, true);
        return cached;
      }
      
      // Fallback to localStorage
      const item = localStorage.getItem(key);
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'get', duration, true);
      
      if (item !== null) {
        // Cache the result for future use
        storageCache.set(key, item);
      }
      
      return item;
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'get', duration, false);
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage with caching
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem: (key: string, value: string): void => {
    const startTime = performance.now();
    try {
      // Update cache
      storageCache.set(key, value);
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'set', duration, true);
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'set', duration, false);
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage and cache
   * @param key - Storage key
   */
  removeItem: (key: string): void => {
    const startTime = performance.now();
    try {
      // Remove from cache
      storageCache.remove(key);
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'remove', duration, true);
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(key, 'remove', duration, false);
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all items from localStorage and cache
   */
  clear: (): void => {
    const startTime = performance.now();
    try {
      // Clear cache
      storageCache.clear();
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation('clear', 'clear', duration, true);
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation('clear', 'clear', duration, false);
      console.error('Error clearing localStorage', error);
    }
  }
}; 