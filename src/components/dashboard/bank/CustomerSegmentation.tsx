import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormatters } from '@/hooks/useFormatters';
import type { CustomerSegments } from '@/lib/api/types/bankInsights';

interface CustomerSegmentationProps {
  data: CustomerSegments;
}

export const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({ data }) => {
  const { formatNumber } = useFormatters();

  // Calculate totals and percentages for each segment
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  const ageTotal = data.byAge.genZ + data.byAge.millennials + data.byAge.genX + data.byAge.boomers;
  const incomeTotal = data.byIncome.low + data.byIncome.medium + data.byIncome.high;
  const healthTotal = data.byFinancialHealth.healthy + data.byFinancialHealth.moderate + data.byFinancialHealth.atRisk;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>
          Customer breakdown by different demographic and behavioral segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="age" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="age">By Age</TabsTrigger>
            <TabsTrigger value="income">By Income</TabsTrigger>
            <TabsTrigger value="risk">By Risk Profile</TabsTrigger>
            <TabsTrigger value="health">By Health</TabsTrigger>
          </TabsList>

          {/* By Age */}
          <TabsContent value="age" className="space-y-4 mt-4">
            <SegmentationBar
              label="Gen Z"
              value={data.byAge.genZ}
              percentage={calculatePercentage(data.byAge.genZ, ageTotal)}
              color="bg-blue-500"
            />
            <SegmentationBar
              label="Millennials"
              value={data.byAge.millennials}
              percentage={calculatePercentage(data.byAge.millennials, ageTotal)}
              color="bg-green-500"
            />
            <SegmentationBar
              label="Gen X"
              value={data.byAge.genX}
              percentage={calculatePercentage(data.byAge.genX, ageTotal)}
              color="bg-orange-500"
            />
            <SegmentationBar
              label="Boomers"
              value={data.byAge.boomers}
              percentage={calculatePercentage(data.byAge.boomers, ageTotal)}
              color="bg-purple-500"
            />
          </TabsContent>

          {/* By Income */}
          <TabsContent value="income" className="space-y-4 mt-4">
            <SegmentationBar
              label="Low Income"
              value={data.byIncome.low}
              percentage={calculatePercentage(data.byIncome.low, incomeTotal)}
              color="bg-red-500"
              description="< $4,000/month"
            />
            <SegmentationBar
              label="Medium Income"
              value={data.byIncome.medium}
              percentage={calculatePercentage(data.byIncome.medium, incomeTotal)}
              color="bg-yellow-500"
              description="$4,000 - $10,000/month"
            />
            <SegmentationBar
              label="High Income"
              value={data.byIncome.high}
              percentage={calculatePercentage(data.byIncome.high, incomeTotal)}
              color="bg-green-500"
              description="> $10,000/month"
            />
          </TabsContent>

          {/* By Risk Profile */}
          <TabsContent value="risk" className="space-y-4 mt-4">
            <SegmentationBar
              label="Conservative"
              value={data.byRiskProfile.conservative.count}
              percentage={data.byRiskProfile.conservative.percentage}
              color="bg-blue-500"
            />
            <SegmentationBar
              label="Moderate"
              value={data.byRiskProfile.moderate.count}
              percentage={data.byRiskProfile.moderate.percentage}
              color="bg-green-500"
            />
            <SegmentationBar
              label="Aggressive"
              value={data.byRiskProfile.aggressive.count}
              percentage={data.byRiskProfile.aggressive.percentage}
              color="bg-orange-500"
            />
          </TabsContent>

          {/* By Financial Health */}
          <TabsContent value="health" className="space-y-4 mt-4">
            <SegmentationBar
              label="Healthy"
              value={data.byFinancialHealth.healthy}
              percentage={calculatePercentage(data.byFinancialHealth.healthy, healthTotal)}
              color="bg-green-500"
            />
            <SegmentationBar
              label="Moderate"
              value={data.byFinancialHealth.moderate}
              percentage={calculatePercentage(data.byFinancialHealth.moderate, healthTotal)}
              color="bg-yellow-500"
            />
            <SegmentationBar
              label="At Risk"
              value={data.byFinancialHealth.atRisk}
              percentage={calculatePercentage(data.byFinancialHealth.atRisk, healthTotal)}
              color="bg-red-500"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface SegmentationBarProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
  description?: string;
}

const SegmentationBar: React.FC<SegmentationBarProps> = ({
  label,
  value,
  percentage,
  color,
  description,
}) => {
  const { formatNumber } = useFormatters();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">{label}</span>
          {description && (
            <span className="text-xs text-muted-foreground ml-2">({description})</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">{formatNumber(value)}</span>
          <span className="text-sm text-muted-foreground w-16 text-right">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="w-full bg-secondary rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

