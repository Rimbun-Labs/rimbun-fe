import { useCallback, useRef, useEffect } from 'react';
import { storageCache } from '@/lib/storage/cache';
import { storagePerformanceMonitor } from '@/lib/storage/performance';

interface BatchOperation {
  key: string;
  value: any;
  operation: 'set' | 'remove';
}

export function useLocalStorageBatch() {
  const batchRef = useRef<BatchOperation[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout>();
  const flushDelay = 500; // 500ms batch delay

  const addToBatch = useCallback((operation: BatchOperation) => {
    // Remove any existing operation for the same key
    batchRef.current = batchRef.current.filter(op => op.key !== operation.key);
    
    // Add new operation
    batchRef.current.push(operation);

    // Schedule flush
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }

    flushTimeoutRef.current = setTimeout(() => {
      flushBatch();
    }, flushDelay);
  }, []);

  const flushBatch = useCallback(() => {
    if (batchRef.current.length === 0) return;

    const startTime = performance.now();
    const operations = [...batchRef.current];
    batchRef.current = [];

    try {
      // Process all operations
      operations.forEach(op => {
        if (op.operation === 'set') {
          storageCache.set(op.key, op.value);
        } else {
          storageCache.remove(op.key);
        }
      });

      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(
        `batch-${operations.length}`,
        'set',
        duration,
        true
      );

      console.log(`Batch processed ${operations.length} localStorage operations in ${duration.toFixed(2)}ms`);
    } catch (error) {
      const duration = performance.now() - startTime;
      storagePerformanceMonitor.trackOperation(
        `batch-${operations.length}`,
        'set',
        duration,
        false
      );
      console.error('Batch localStorage operation failed:', error);
    }
  }, []);

  const setValue = useCallback((key: string, value: any) => {
    addToBatch({ key, value, operation: 'set' });
  }, [addToBatch]);

  const removeValue = useCallback((key: string) => {
    addToBatch({ key, value: null, operation: 'remove' });
  }, [addToBatch]);

  const setMultiple = useCallback((values: Record<string, any>) => {
    Object.entries(values).forEach(([key, value]) => {
      addToBatch({ key, value, operation: 'set' });
    });
  }, [addToBatch]);

  const removeMultiple = useCallback((keys: string[]) => {
    keys.forEach(key => {
      addToBatch({ key, value: null, operation: 'remove' });
    });
  }, [addToBatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
        flushBatch(); // Flush any pending operations
      }
    };
  }, [flushBatch]);

  // Force flush on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (batchRef.current.length > 0) {
        flushBatch();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flushBatch]);

  return {
    setValue,
    removeValue,
    setMultiple,
    removeMultiple,
    flushBatch,
    pendingCount: batchRef.current.length
  };
} 