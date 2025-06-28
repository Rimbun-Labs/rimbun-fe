interface StorageOperation {
  key: string;
  operation: 'get' | 'set' | 'remove';
  duration: number;
  timestamp: number;
  success: boolean;
}

class StoragePerformanceMonitor {
  private operations: StorageOperation[] = [];
  private readonly MAX_OPERATIONS = 1000; // Keep last 1000 operations
  private readonly SLOW_THRESHOLD = 50; // 50ms threshold for "slow" operations

  trackOperation(key: string, operation: 'get' | 'set' | 'remove', duration: number, success: boolean = true) {
    const op: StorageOperation = {
      key,
      operation,
      duration,
      timestamp: Date.now(),
      success
    };

    this.operations.push(op);

    // Keep only the last MAX_OPERATIONS
    if (this.operations.length > this.MAX_OPERATIONS) {
      this.operations = this.operations.slice(-this.MAX_OPERATIONS);
    }

    // Log slow operations
    if (duration > this.SLOW_THRESHOLD) {
      console.warn(`Slow localStorage operation: ${operation} on key "${key}" took ${duration}ms`);
    }
  }

  getMetrics() {
    const now = Date.now();
    const recentOps = this.operations.filter(op => now - op.timestamp < 5 * 60 * 1000); // Last 5 minutes

    const metrics = {
      totalOperations: this.operations.length,
      recentOperations: recentOps.length,
      averageDuration: this.calculateAverage(recentOps.map(op => op.duration)),
      slowOperations: recentOps.filter(op => op.duration > this.SLOW_THRESHOLD).length,
      successRate: this.calculateSuccessRate(recentOps),
      operationsByType: this.groupByOperation(recentOps),
      topKeys: this.getTopKeys(recentOps, 10)
    };

    return metrics;
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateSuccessRate(operations: StorageOperation[]): number {
    if (operations.length === 0) return 1;
    const successful = operations.filter(op => op.success).length;
    return successful / operations.length;
  }

  private groupByOperation(operations: StorageOperation[]) {
    const groups = { get: 0, set: 0, remove: 0 };
    operations.forEach(op => {
      groups[op.operation]++;
    });
    return groups;
  }

  private getTopKeys(operations: StorageOperation[], limit: number) {
    const keyCounts = new Map<string, number>();
    operations.forEach(op => {
      keyCounts.set(op.key, (keyCounts.get(op.key) || 0) + 1);
    });

    return Array.from(keyCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([key, count]) => ({ key, count }));
  }

  optimize() {
    const metrics = this.getMetrics();
    const suggestions: string[] = [];

    if (metrics.averageDuration > 20) {
      suggestions.push('Consider implementing caching for frequently accessed keys');
    }

    if (metrics.slowOperations > 5) {
      suggestions.push('Investigate slow localStorage operations - consider batching');
    }

    if (metrics.operationsByType.set > metrics.operationsByType.get * 2) {
      suggestions.push('High write-to-read ratio detected - consider debouncing writes');
    }

    const topKey = metrics.topKeys[0];
    if (topKey && topKey.count > 50) {
      suggestions.push(`Key "${topKey.key}" is accessed frequently - consider caching`);
    }

    return suggestions;
  }

  clear() {
    this.operations = [];
  }
}

// Singleton instance
export const storagePerformanceMonitor = new StoragePerformanceMonitor(); 