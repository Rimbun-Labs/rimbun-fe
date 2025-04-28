
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Sector, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PortfolioAllocationProps {
  allocations: {
    [key: string]: number;
  };
  recommendedMetrics?: {
    [key: string]: {
      weight: number;
      description: string;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PortfolioAllocation: React.FC<PortfolioAllocationProps> = ({ allocations, recommendedMetrics }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [view, setView] = useState<'pie' | 'details'>('pie');
  
  const data = Object.entries(allocations).map(([name, value], index) => ({
    name,
    value,
    description: recommendedMetrics?.[name]?.description || '',
    color: COLORS[index % COLORS.length]
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Configure chart colors
  const chartConfig = Object.fromEntries(
    data.map((entry, index) => [
      entry.name,
      { color: entry.color }
    ])
  );

  return (
    <div className="w-full h-full">
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'pie' | 'details')}
        className="w-full"
      >
        <div className="flex justify-end mb-4">
          <TabsList className="mb-2">
            <TabsTrigger value="pie">Chart View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pie" className="mt-0">
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="details" className="mt-0 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
              <div className="ml-5 w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground pl-5 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {recommendedMetrics && view === 'pie' && (
        <div className="mt-6 space-y-1">
          <h4 className="font-medium text-sm">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(recommendedMetrics).map(([key, metric], idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{key}</span>
                  <span className="text-primary">{metric.weight.toFixed(1)}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAllocation;
