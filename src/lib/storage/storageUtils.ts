/**
 * Simplified localStorage utilities for non-React contexts
 * Removed complex performance monitoring and caching to fix assessment flow
 */
export const storageUtils = {
  /**
   * Get item from localStorage
   * @param key - Storage key
   * @returns The stored value or null if not found
   */
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}; 