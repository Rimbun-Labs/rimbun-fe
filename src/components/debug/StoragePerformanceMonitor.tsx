import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { storagePerformanceMonitor } from '@/lib/storage/performance';
import { storageCache } from '@/lib/storage/cache';

export const StoragePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState(storagePerformanceMonitor.getMetrics());
  const [cacheStats, setCacheStats] = useState(storageCache.getStats());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(storagePerformanceMonitor.getMetrics());
      setCacheStats(storageCache.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const clearMetrics = () => {
    storagePerformanceMonitor.clear();
    setMetrics(storagePerformanceMonitor.getMetrics());
  };

  const getPerformanceColor = (duration: number) => {
    if (duration < 10) return 'text-green-600';
    if (duration < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate > 0.95) return 'text-green-600';
    if (rate > 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          📊 Storage Monitor
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Storage Performance</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={clearMetrics}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 px-2 text-xs"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 text-xs">
          {/* Cache Stats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cache</span>
              <Badge variant="outline" className="text-xs">
                {cacheStats.size}/{cacheStats.maxSize}
              </Badge>
            </div>
            <Progress value={(cacheStats.size / cacheStats.maxSize) * 100} className="h-1" />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Avg Duration</span>
              <div className={`font-mono ${getPerformanceColor(metrics.averageDuration)}`}>
                {metrics.averageDuration.toFixed(1)}ms
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Success Rate</span>
              <div className={`font-mono ${getSuccessRateColor(metrics.successRate)}`}>
                {(metrics.successRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Operation Counts */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent Ops</span>
              <span className="font-mono">{metrics.recentOperations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slow Ops</span>
              <span className="font-mono text-red-600">{metrics.slowOperations}</span>
            </div>
          </div>

          {/* Operation Types */}
          <div className="space-y-1">
            <div className="text-muted-foreground">Operation Types</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <span className="text-blue-600">GET</span>
                <div className="font-mono">{metrics.operationsByType.get}</div>
              </div>
              <div>
                <span className="text-green-600">SET</span>
                <div className="font-mono">{metrics.operationsByType.set}</div>
              </div>
              <div>
                <span className="text-red-600">DEL</span>
                <div className="font-mono">{metrics.operationsByType.remove}</div>
              </div>
            </div>
          </div>

          {/* Top Keys */}
          {metrics.topKeys.length > 0 && (
            <div className="space-y-1">
              <div className="text-muted-foreground">Top Keys</div>
              <div className="space-y-1">
                {metrics.topKeys.slice(0, 3).map((key, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="truncate">{key.key}</span>
                    <span className="font-mono">{key.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          {metrics.averageDuration > 20 && (
            <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
              ⚠️ Consider caching frequently accessed keys
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 