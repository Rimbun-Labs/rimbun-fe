import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsivePie } from '@nivo/pie';
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedMetricsWithWeights } from '@/lib/api/types/metrics';

interface AssetAllocations {
  EQUITIES: number;
  BONDS: number;
  REAL_ESTATE: number;
  CASH: number;
}

interface PortfolioAllocationProps {
  allocations: AssetAllocations;
  recommendedMetrics?: RecommendedMetricsWithWeights;
  loading?: boolean;
}

const PortfolioAllocation: React.FC<PortfolioAllocationProps> = ({ 
  allocations, 
  recommendedMetrics,
  loading = false 
}) => {
  const [view, setView] = useState<'pie' | 'metrics'>('pie');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = Object.entries(allocations).map(([id, value]) => ({
    id,
    label: id,
    value: value || 0,
    color: getAssetColor(id)
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            Portfolio Allocation
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Optimal asset distribution based on your risk profile and market conditions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('pie')}
          >
            Allocation
          </Button>
          <Button
            variant={view === 'metrics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('metrics')}
          >
            Metrics
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'pie' ? (
          <div className="h-[400px]">
            <ResponsivePie
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'category10' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={true}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle'
                }
              ]}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedMetrics && Object.entries(recommendedMetrics).map(([assetClass, metrics]) => (
              <div key={assetClass} className="space-y-2">
                <h4 className="font-medium text-sm">{assetClass}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <div key={key} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-primary">{(metric.weight * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {metric.category} - {metric.priority}
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
};

const getAssetColor = (assetClass: string): string => {
  switch (assetClass) {
    case 'EQUITIES':
      return '#4f46e5';
    case 'BONDS':
      return '#10b981';
    case 'REAL_ESTATE':
      return '#f59e0b';
    case 'CASH':
      return '#6b7280';
    default:
      return '#94a3b8';
  }
};

export default PortfolioAllocation;
