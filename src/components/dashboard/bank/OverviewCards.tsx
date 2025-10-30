import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Activity, CheckCircle2, TrendingUp } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import type { BankCustomerInsights } from '@/lib/api/types/bankInsights';

interface OverviewCardsProps {
  data: BankCustomerInsights;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
  const { formatNumber } = useFormatters();

  const cards = [
    {
      title: 'Total Customers',
      value: formatNumber(data.totalCustomers),
      icon: Users,
      description: 'Registered users in your organization',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Health Score',
      value: `${data.financialHealth.overallHealthScore.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Average financial health score',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Active Users (30d)',
      value: formatNumber(data.engagement.activeUsers.last30Days),
      icon: Activity,
      description: 'Users active in the last 30 days',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Assessment Completion',
      value: `${data.engagement.assessmentCompletion.completionRate.toFixed(1)}%`,
      icon: CheckCircle2,
      description: 'Percentage of completed assessments',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

