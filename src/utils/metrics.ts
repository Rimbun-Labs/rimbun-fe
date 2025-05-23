import { MetricCategory, MetricPriority } from '@/lib/api/types/metrics';

export const getCategoryColor = (category: MetricCategory) => {
  switch (category) {
    case 'Growth': return "bg-green-100 text-green-800";
    case 'Risk': return "bg-red-100 text-red-800";
    case 'Income': return "bg-yellow-100 text-yellow-800";
    case 'Valuation': return "bg-indigo-100 text-indigo-800";
    case 'Return': return "bg-emerald-100 text-emerald-800";
    case 'Cost': return "bg-orange-100 text-orange-800";
    case 'ETF Liquidity':
    case 'Liquidity': return "bg-cyan-100 text-cyan-800";
    case 'Performance': return "bg-violet-100 text-violet-800";
    default: return "bg-gray-100 text-gray-800";
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