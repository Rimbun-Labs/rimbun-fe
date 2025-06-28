import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useLocalStorageBatch } from './useLocalStorageBatch';

interface LearningProgress {
  completedSections: number[];
  lastViewedSection?: number;
  completedAt?: string;
}

interface MetricsProgress {
  completedMetrics: string[];
  showFinalActions: boolean;
  completedAt?: string;
}

interface UseLearningProgressOptions {
  sessionId: string;
  assetClass: string;
  validateRecommendations?: (metrics: string[]) => boolean;
}

export function useLearningProgress({ 
  sessionId, 
  assetClass, 
  validateRecommendations 
}: UseLearningProgressOptions) {
  const batch = useLocalStorageBatch();
  
  // Learning path progress
  const [learningProgress, setLearningProgress] = useLocalStorage<LearningProgress>(
    `learning-path-${sessionId}-${assetClass}`,
    { completedSections: [] },
    { debounceMs: 200 }
  );

  // Metrics progress
  const [metricsProgress, setMetricsProgress] = useLocalStorage<MetricsProgress>(
    `metrics-progress-${sessionId}-${assetClass}`,
    { completedMetrics: [], showFinalActions: false },
    { debounceMs: 200 }
  );

  // Computed values
  const completedSections = useMemo(() => learningProgress.completedSections, [learningProgress.completedSections]);
  const completedMetrics = useMemo(() => metricsProgress.completedMetrics, [metricsProgress.completedMetrics]);
  const showFinalActions = useMemo(() => metricsProgress.showFinalActions, [metricsProgress.showFinalActions]);

  // Optimized section completion
  const toggleSectionCompletion = useCallback((sectionIndex: number) => {
    setLearningProgress(prev => {
      const newCompleted = prev.completedSections.includes(sectionIndex)
        ? prev.completedSections.filter(i => i !== sectionIndex)
        : [...prev.completedSections, sectionIndex];

      return {
        ...prev,
        completedSections: newCompleted,
        completedAt: new Date().toISOString()
      };
    });
  }, [setLearningProgress]);

  // Optimized metric completion
  const toggleMetricCompletion = useCallback((metricName: string) => {
    if (validateRecommendations && !validateRecommendations([metricName])) {
      console.warn(`Invalid metric for asset class: ${metricName}`);
      return;
    }

    setMetricsProgress(prev => {
      const newCompleted = prev.completedMetrics.includes(metricName)
        ? prev.completedMetrics.filter(m => m !== metricName)
        : [...prev.completedMetrics, metricName];

      return {
        ...prev,
        completedMetrics: newCompleted,
        completedAt: new Date().toISOString()
      };
    });
  }, [setMetricsProgress, validateRecommendations]);

  // Batch operations for multiple updates
  const updateMultipleSections = useCallback((sectionIndices: number[], completed: boolean) => {
    setLearningProgress(prev => {
      const newCompleted = completed
        ? [...new Set([...prev.completedSections, ...sectionIndices])]
        : prev.completedSections.filter(i => !sectionIndices.includes(i));

      return {
        ...prev,
        completedSections: newCompleted,
        completedAt: new Date().toISOString()
      };
    });
  }, [setLearningProgress]);

  const updateMultipleMetrics = useCallback((metricNames: string[], completed: boolean) => {
    if (validateRecommendations && !validateRecommendations(metricNames)) {
      console.warn(`Invalid metrics for asset class: ${metricNames.join(', ')}`);
      return;
    }

    setMetricsProgress(prev => {
      const newCompleted = completed
        ? [...new Set([...prev.completedMetrics, ...metricNames])]
        : prev.completedMetrics.filter(m => !metricNames.includes(m));

      return {
        ...prev,
        completedMetrics: newCompleted,
        completedAt: new Date().toISOString()
      };
    });
  }, [setMetricsProgress, validateRecommendations]);

  // Clear progress
  const clearProgress = useCallback(() => {
    batch.setMultiple({
      [`learning-path-${sessionId}-${assetClass}`]: { completedSections: [] },
      [`metrics-progress-${sessionId}-${assetClass}`]: { completedMetrics: [], showFinalActions: false }
    });
  }, [batch, sessionId, assetClass]);

  // Export progress data
  const exportProgress = useCallback(() => {
    return {
      learning: learningProgress,
      metrics: metricsProgress,
      sessionId,
      assetClass,
      exportedAt: new Date().toISOString()
    };
  }, [learningProgress, metricsProgress, sessionId, assetClass]);

  // Import progress data
  const importProgress = useCallback((data: any) => {
    if (data.sessionId === sessionId && data.assetClass === assetClass) {
      if (data.learning) {
        setLearningProgress(data.learning);
      }
      if (data.metrics) {
        setMetricsProgress(data.metrics);
      }
    }
  }, [sessionId, assetClass, setLearningProgress, setMetricsProgress]);

  return {
    // State
    completedSections,
    completedMetrics,
    showFinalActions,
    learningProgress,
    metricsProgress,

    // Actions
    toggleSectionCompletion,
    toggleMetricCompletion,
    updateMultipleSections,
    updateMultipleMetrics,
    clearProgress,
    exportProgress,
    importProgress,

    // Utilities
    isSectionCompleted: (index: number) => completedSections.includes(index),
    isMetricCompleted: (name: string) => completedMetrics.includes(name),
    getProgressPercentage: (totalSections: number) => 
      totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0,
    getMetricsProgressPercentage: (totalMetrics: number) =>
      totalMetrics > 0 ? Math.round((completedMetrics.length / totalMetrics) * 100) : 0
  };
} 