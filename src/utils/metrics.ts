import { MetricCategory, MetricPriority } from '@/lib/api/types/metrics';

/**
 * Returns consistent color classes for metric categories
 * Used across all components to maintain visual consistency
 */
export const getCategoryColor = (category: MetricCategory) => {
  switch (category) {
    case 'Growth':
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800";
    case 'Risk':
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800";
    case 'Income':
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800";
    case 'Value':
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800";
    case 'Technical':
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800";
    case 'Valuation':
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:border-indigo-800";
    case 'Return':
      return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-200 dark:border-cyan-800";
    case 'Cost':
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-800";
    case 'ETF Liquidity':
    case 'Liquidity':
      return "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/20 dark:text-sky-200 dark:border-sky-800";
    case 'Performance':
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-200 dark:border-violet-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const getPriorityColor = (priority: MetricPriority | string) => {
  switch (priority) {
    case 'Primary': return "bg-primary/10 text-primary border-primary/20";
    case 'Secondary': return "bg-primary/5 text-primary border-primary/10";
    case 'Tertiary': return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
}; 