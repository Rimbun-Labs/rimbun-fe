import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown, PiggyBank, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { SpendingAnalysisDto } from '@/lib/api/spendingApi';
import { useFormatters } from '@/hooks/useFormatters';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface SpendingOverviewCardProps {
  data: SpendingAnalysisDto | undefined;
  loading: boolean;
}

const SpendingOverviewCard: React.FC<SpendingOverviewCardProps> = ({ data, loading }) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={2} />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">No spending data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    monthlyIncome,
    monthlySpending,
    savingsRate,
    emergencyFundStatus
  } = data;

  const recommendedEmergencyFund = emergencyFundStatus?.recommendedTarget || 0;
  const emergencyFundStatusString = emergencyFundStatus?.status || 'unknown';
  const remainingAmount = monthlyIncome - monthlySpending;
  
  // Calculate months of coverage
  const currentEmergencyFund = emergencyFundStatus?.currentAmount || 0;
  const monthsOfExpenses = emergencyFundStatus?.monthsOfExpenses || 
    (monthlySpending > 0 ? currentEmergencyFund / monthlySpending : 0);

  // Get status color and message
  const getSavingsRateStatus = (rate: number) => {
    if (rate >= 20) return { color: 'text-green-600', bgColor: 'bg-green-500/10', message: 'Excellent!' };
    if (rate >= 10) return { color: 'text-blue-600', bgColor: 'bg-blue-500/10', message: 'Good' };
    if (rate >= 0) return { color: 'text-yellow-600', bgColor: 'bg-yellow-500/10', message: 'Needs improvement' };
    return { color: 'text-red-600', bgColor: 'bg-red-500/10', message: 'Critical' };
  };

  const getEmergencyFundStatus = (status: string) => {
    switch (status) {
      case 'adequate':
        return { 
          color: 'bg-green-500/10 text-green-600 border-green-500/20', 
          icon: CheckCircle, 
          message: 'Adequate' 
        };
      case 'insufficient':
        return { 
          color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', 
          icon: AlertCircle, 
          message: 'Insufficient' 
        };
      case 'excessive':
        return { 
          color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', 
          icon: Shield, 
          message: 'Excessive' 
        };
      default:
        return { 
          color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', 
          icon: AlertCircle, 
          message: 'Unknown' 
        };
    }
  };

  const savingsStatus = getSavingsRateStatus(savingsRate);
  const emergencyStatus = getEmergencyFundStatus(emergencyFundStatusString);
  const EmergencyIcon = emergencyStatus.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Spending Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Month Spending */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Month</p>
          <p className="text-3xl font-bold">{formatCurrency(monthlySpending)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Income: {formatCurrency(monthlyIncome)} • Remaining: {formatCurrency(remainingAmount)}
          </p>
        </div>

        {/* Savings Rate */}
        <div className={`p-3 rounded-lg ${savingsStatus.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className={`h-4 w-4 ${savingsStatus.color}`} />
              <span className="text-sm font-medium">Savings Rate</span>
            </div>
            <span className={`text-lg font-bold ${savingsStatus.color}`}>
              {formatPercentage(savingsRate)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{savingsStatus.message}</p>
        </div>

        {/* Emergency Fund Status */}
        <div className={`p-3 rounded-lg border ${emergencyStatus.color}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <EmergencyIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Emergency Fund</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {emergencyStatus.message}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {monthsOfExpenses > 0 
              ? `${monthsOfExpenses.toFixed(1)} months coverage`
              : `Recommended: ${formatCurrency(recommendedEmergencyFund)}`
            }
            {recommendedEmergencyFund > 0 && monthsOfExpenses > 0 && (
              <span className="ml-2">• Target: {formatCurrency(recommendedEmergencyFund)}</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingOverviewCard;

