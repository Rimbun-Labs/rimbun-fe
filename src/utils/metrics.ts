import { MetricCategory, MetricPriority } from '@/lib/api/types/metrics';

/**
 * Returns consistent color classes for metric categories
 * Used across all components to maintain visual consistency
 */
export const getCategoryColor = (category: MetricCategory) => {
  switch (category) {
    case 'Growth':
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case 'Risk':
      return "bg-rose-100 text-rose-800 border-rose-200";
    case 'Income':
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 'Value':
      return "bg-purple-100 text-purple-800 border-purple-200";
    case 'Technical':
      return "bg-amber-100 text-amber-800 border-amber-200";
    case 'Valuation':
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case 'Return':
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case 'Cost':
      return "bg-orange-100 text-orange-800 border-orange-200";
    case 'ETF Liquidity':
    case 'Liquidity':
      return "bg-sky-100 text-sky-800 border-sky-200";
    case 'Performance':
      return "bg-violet-100 text-violet-800 border-violet-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPriorityColor = (priority: MetricPriority | string) => {
  switch (priority) {
    case 'Primary': return "bg-blue-100 text-blue-800";
    case 'Secondary': return "bg-purple-100 text-purple-800";
    case 'Tertiary': return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
}; 