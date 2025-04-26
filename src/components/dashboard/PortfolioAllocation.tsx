
import React, { useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Sector, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recommended Portfolio Allocation</CardTitle>
        <CardDescription>
          Based on your risk profile and investment goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Allocation']}
                contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {recommendedMetrics && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Asset Class Insights</h4>
            <div className="space-y-3">
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
                    <span>{item.value}%</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground pl-5">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioAllocation;
