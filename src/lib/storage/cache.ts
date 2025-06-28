class StorageCache {
  private cache = new Map<string, { value: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Prevent memory leaks

  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.value;
    }
    
    // Cache miss or expired, try localStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const value = JSON.parse(stored);
        this.setCache(key, value);
        return value;
      }
    } catch (error) {
      console.warn(`Failed to read from localStorage for key: ${key}`, error);
    }
    
    return null;
  }

  set(key: string, value: any): void {
    try {
      // Update cache first
      this.setCache(key, value);
      
      // Then localStorage
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to write to localStorage for key: ${key}`, error);
      // Remove from cache if localStorage fails
      this.cache.delete(key);
    }
  }

  remove(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from localStorage for key: ${key}`, error);
    }
  }

  clear(pattern?: string): void {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
      
      // Clear localStorage entries matching pattern
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.includes(pattern)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn(`Failed to clear localStorage with pattern: ${pattern}`, error);
      }
    } else {
      // Clear everything
      this.cache.clear();
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Failed to clear localStorage', error);
      }
    }
  }

  private setCache(key: string, value: any): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  // Get cache statistics for monitoring
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.TTL
    };
  }
}

// Singleton instance
export const storageCache = new StorageCache(); 