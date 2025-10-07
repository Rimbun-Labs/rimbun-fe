import { environmentStorage } from '@/utils/environmentStorage';

/**
 * Environment-aware localStorage utilities for non-React contexts
 * Uses environment prefixes to separate dev/prod data
 */
export const storageUtils = {
  /**
   * Get item from localStorage with environment prefix
   * @param key - Storage key
   * @returns The stored value or null if not found
   */
  getItem: (key: string): string | null => {
    return environmentStorage.getItem(key);
  },

  /**
   * Set item in localStorage with environment prefix
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem: (key: string, value: string): void => {
    environmentStorage.setItem(key, value);
  },

  /**
   * Remove item from localStorage with environment prefix
   * @param key - Storage key
   */
  removeItem: (key: string): void => {
    environmentStorage.removeItem(key);
  },

  /**
   * Clear all items from localStorage for current environment
   */
  clear: (): void => {
    environmentStorage.clearEnvironment();
  },

  /**
   * Clear all items from localStorage (all environments)
   * Use with caution - this affects all environments
   */
  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing all localStorage', error);
    }
  }
}; 