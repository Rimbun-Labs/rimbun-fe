import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, Label } from 'recharts';
import { LoadingState } from "@/components/dashboard/ui/LoadingState";
import { RecommendedMetricsWithWeights, AssetClass } from '@/lib/api/types/metrics';
import { getAssetClassDisplayName, getMetricDisplayName } from '@/lib/constants/displayNames';
import { useTheme } from '@/hooks/useTheme';
import { ComponentErrorBoundary } from '@/components/error/ComponentErrorBoundary';

interface AssetAllocations {
  equities: number;
  bonds: number;
  realEstate: number;
  cash: number;
}

interface PortfolioAllocationProps {
  allocations: AssetAllocations;
  recommendedMetrics?: RecommendedMetricsWithWeights;
  loading?: boolean;
}

const PortfolioAllocation: React.FC<PortfolioAllocationProps> = React.memo(({ 
  allocations, 
  recommendedMetrics,
  loading = false 
}) => {
  const [view, setView] = useState<'pie' | 'metrics'>('pie');
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark';

  // Memoize the color function to avoid recreating it on every render
  const getAssetColor = useMemo(() => (assetClass: string): string => {
    switch (assetClass) {
      case 'equities':
        return '#E9C46A';
      case 'bonds':
        return '#2A9D8F';
      case 'realEstate':
        return '#F4A261';
      case 'cash':
        return '#264653';
      case 'commodities':
        return '#E76F51';
      case 'alternatives':
        return '#E9C46A';
      default:
        return '#94a3b8';
    }
  }, []);

  // Memoize the chart data to prevent unnecessary recalculations
  const data = useMemo(() => 
    Object.entries(allocations).map(([id, value]) => ({
      id,
      label: getAssetClassDisplayName(id as AssetClass),
      value: value || 0,
      color: getAssetColor(id)
    })), [allocations, getAssetColor]
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={3} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">
            Portfolio Allocation
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Optimal asset distribution based on your risk profile and market conditions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('pie')}
            className={view === 'pie' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'border-border hover:bg-muted'}
          >
            Allocation
          </Button>
          <Button
            variant={view === 'metrics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('metrics')}
            className={view === 'metrics' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'border-border hover:bg-muted'}
          >
            Metrics
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'pie' ? (
          <div className="h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ value, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                          <p className="font-medium text-popover-foreground">
                            {payload[0].payload.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  payload={data.map(item => ({
                    value: item.label,
                    type: 'circle',
                    color: item.color
                  }))}
                  formatter={(value) => (
                    <span style={{ color: isDarkMode ? '#e2e8f0' : '#64748b' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendedMetrics && Object.entries(recommendedMetrics).map(([assetClass, metrics]) => (
              <div key={assetClass} className="space-y-3">
                <h4 className="font-medium text-sm text-foreground">{getAssetClassDisplayName(assetClass as AssetClass)}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <div key={key} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{getMetricDisplayName(key)}</span>
                        <span className="text-primary font-semibold">{(metric.weight * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-1">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PortfolioAllocation.displayName = 'PortfolioAllocation';

// Wrap the PortfolioAllocation component with ComponentErrorBoundary
const PortfolioAllocationWithErrorBoundary: React.FC<PortfolioAllocationProps> = (props) => {
  return (
    <ComponentErrorBoundary 
      componentName="PortfolioAllocation"
      variant="card"
      showDetails={false}
    >
      <PortfolioAllocation {...props} />
    </ComponentErrorBoundary>
  );
};

export default PortfolioAllocationWithErrorBoundary;
