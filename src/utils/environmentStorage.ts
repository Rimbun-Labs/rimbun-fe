/**
 * Environment-aware storage utilities
 * Separates localStorage data by environment to prevent conflicts between dev/prod
 */

export type Environment = 'development' | 'staging' | 'preview' | 'production';

/**
 * Detect the current environment based on hostname
 */
export const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  } else if (hostname.includes('staging')) {
    return 'staging';
  } else if (hostname.includes('preview') || hostname.includes('vercel.app')) {
    return 'preview';
  } else {
    return 'production';
  }
};

/**
 * Get environment-prefixed storage key
 */
export const getEnvironmentKey = (key: string): string => {
  const env = getEnvironment();
  return `${env}_${key}`;
};

/**
 * Environment-aware localStorage utilities
 */
export const environmentStorage = {
  /**
   * Get item from localStorage with environment prefix
   */
  getItem: (key: string): string | null => {
    try {
      const envKey = getEnvironmentKey(key);
      return localStorage.getItem(envKey);
    } catch (error) {
      console.error(`Error getting environment-aware localStorage key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage with environment prefix
   */
  setItem: (key: string, value: string): void => {
    try {
      const envKey = getEnvironmentKey(key);
      localStorage.setItem(envKey, value);
    } catch (error) {
      console.error(`Error setting environment-aware localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage with environment prefix
   */
  removeItem: (key: string): void => {
    try {
      const envKey = getEnvironmentKey(key);
      localStorage.removeItem(envKey);
    } catch (error) {
      console.error(`Error removing environment-aware localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all items for current environment
   */
  clearEnvironment: (): void => {
    try {
      const env = getEnvironment();
      const keysToRemove: string[] = [];
      
      // Find all keys that start with current environment prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${env}_`)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all environment-specific keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`🧹 Cleared ${keysToRemove.length} keys for environment: ${env}`);
    } catch (error) {
      console.error('Error clearing environment-specific localStorage:', error);
    }
  },

  /**
   * Get all keys for current environment
   */
  getEnvironmentKeys: (): string[] => {
    try {
      const env = getEnvironment();
      const keys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${env}_`)) {
          keys.push(key);
        }
      }
      
      return keys;
    } catch (error) {
      console.error('Error getting environment keys:', error);
      return [];
    }
  }
};

/**
 * Migrate data when environment changes
 * This handles the transition from old non-environment-aware storage
 */
export const migrateEnvironmentData = (): void => {
  try {
    const lastEnv = localStorage.getItem('lastEnvironment');
    const currentEnv = getEnvironment();
    
    // Always check for and clear non-prefixed data (legacy cleanup)
    const sensitiveKeys = [
      'assessmentSessionId',
      'databaseUserId', 
      'hasSeenWelcome'
    ];
    
    sensitiveKeys.forEach(key => {
      const nonPrefixedData = localStorage.getItem(key);
      if (nonPrefixedData) {
        console.log(`🧹 Found non-prefixed data for ${key}, clearing it`);
        localStorage.removeItem(key);
      }
    });
    
    if (lastEnv && lastEnv !== currentEnv) {
      console.log(`🔄 Environment changed from ${lastEnv} to ${currentEnv}`);
      
      // Clear environment-sensitive data when switching environments
      sensitiveKeys.forEach(key => {
        const oldKey = `${lastEnv}_${key}`;
        const newKey = `${currentEnv}_${key}`;
        
        // Remove old environment data
        localStorage.removeItem(oldKey);
        
        // If there's non-prefixed data, migrate it to new environment
        const nonPrefixedData = localStorage.getItem(key);
        if (nonPrefixedData) {
          localStorage.setItem(newKey, nonPrefixedData);
          localStorage.removeItem(key);
          console.log(`📦 Migrated ${key} from non-prefixed to ${currentEnv}`);
        }
      });
      
      console.log(`✅ Environment migration completed: ${lastEnv} → ${currentEnv}`);
    }
    
    // Update last environment
    localStorage.setItem('lastEnvironment', currentEnv);
  } catch (error) {
    console.error('Error during environment migration:', error);
  }
};

/**
 * Initialize environment-aware storage
 * Call this once when the app starts
 */
export const initializeEnvironmentStorage = (): void => {
  console.log(`🌍 Initializing environment-aware storage for: ${getEnvironment()}`);
  migrateEnvironmentData();
};

/**
 * Check if a key exists in current environment
 */
export const hasEnvironmentKey = (key: string): boolean => {
  return environmentStorage.getItem(key) !== null;
};

/**
 * Get storage info for debugging
 */
export const getStorageInfo = () => {
  const env = getEnvironment();
  const envKeys = environmentStorage.getEnvironmentKeys();
  
  return {
    environment: env,
    totalKeys: localStorage.length,
    environmentKeys: envKeys.length,
    keys: envKeys.map(key => key.replace(`${env}_`, ''))
  };
};
