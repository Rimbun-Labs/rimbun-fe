import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { SpendingAnalysisDto } from '@/lib/api/spendingApi';
import { useFormatters } from '@/hooks/useFormatters';

interface EmergencyFundAnalysisProps {
  data: SpendingAnalysisDto | undefined;
  loading: boolean;
}

const EmergencyFundAnalysis: React.FC<EmergencyFundAnalysisProps> = ({ 
  data, 
  loading 
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground mt-2">Loading emergency fund analysis...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No spending data available</p>
      </div>
    );
  }

  const {
    emergencyFundStatus,
    monthlySpending
  } = data;

  // Extract emergency fund data from the status object
  const currentEmergencyFund = emergencyFundStatus?.currentAmount || 0;
  const recommendedEmergencyFund = emergencyFundStatus?.recommendedTarget || 0;
  const progressPercentage = recommendedEmergencyFund > 0 
    ? Math.min((currentEmergencyFund / recommendedEmergencyFund) * 100, 100)
    : 0;
  
  // Calculate months of coverage (use backend value if available, otherwise calculate)
  const monthsOfExpenses = emergencyFundStatus?.monthsOfExpenses || 
    (monthlySpending > 0 ? currentEmergencyFund / monthlySpending : 0);
  
  // Calculate target months if target is set
  const targetMonths = recommendedEmergencyFund > 0 && monthlySpending > 0
    ? recommendedEmergencyFund / monthlySpending
    : 0;

  const getStatusInfo = (status: string, months: number) => {
    switch (status) {
      case 'adequate':
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', 
          icon: CheckCircle, 
          message: `Adequate (${months.toFixed(1)} months)` 
        };
      case 'insufficient':
        return { 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', 
          icon: AlertCircle, 
          message: `Insufficient (${months.toFixed(1)} months)` 
        };
      case 'excessive':
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
          icon: Shield, 
          message: `Well-funded (${months.toFixed(1)} months)` 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', 
          icon: AlertCircle, 
          message: 'Status unknown' 
        };
    }
  };

  const statusInfo = getStatusInfo(emergencyFundStatus?.status || 'unknown', monthsOfExpenses);
  const StatusIcon = statusInfo.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Fund
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact Summary - Always Visible */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-5 w-5 ${statusInfo.color.includes('green') ? 'text-green-600' : statusInfo.color.includes('yellow') ? 'text-yellow-600' : statusInfo.color.includes('blue') ? 'text-blue-600' : 'text-gray-600'}`} />
            <div>
              <p className="text-sm font-medium">{statusInfo.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(currentEmergencyFund)} / {recommendedEmergencyFund > 0 ? formatCurrency(recommendedEmergencyFund) : 'Target not set'}
              </p>
            </div>
          </div>
          {recommendedEmergencyFund > 0 && (
            <div className="text-right">
              <p className="text-sm font-bold">{isNaN(progressPercentage) ? '0' : progressPercentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          )}
        </div>

        {/* Expanded Details - Only when expanded */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Coverage Information */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Current coverage: <span className="font-semibold text-foreground">
                  {monthsOfExpenses.toFixed(1)} months
                </span> of expenses
              </p>
              {recommendedEmergencyFund > 0 && targetMonths > 0 && (
                <p className="text-xs text-muted-foreground">
                  Target: {formatCurrency(recommendedEmergencyFund)} 
                  ({targetMonths.toFixed(1)} months)
                </p>
              )}
            </div>

          {/* Progress Bar */}
          {recommendedEmergencyFund > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress Toward Target</span>
                <span className="text-sm font-bold">{isNaN(progressPercentage) ? '0' : progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={isNaN(progressPercentage) ? 0 : Math.min(progressPercentage, 100)} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(currentEmergencyFund)}</span>
                <span>{formatCurrency(recommendedEmergencyFund)}</span>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1 text-foreground">Understanding your status:</p>
            <p>
              <strong>Status</strong> is based on months of expenses covered (3-6 months = adequate). 
              {recommendedEmergencyFund > 0 && targetMonths > 6 && (
                <span> Your target ({targetMonths.toFixed(1)} months) is higher for extra security.</span>
              )}
            </p>
          </div>

          {/* Emergency Fund Calculator */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Emergency Fund Calculator</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">3 Months</h4>
                  <p className="text-xs text-muted-foreground">Minimum</p>
                </div>
              </div>
              <p className="text-lg font-bold">{formatCurrency(monthlySpending * 3)}</p>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <h4 className="font-medium text-sm text-primary">6 Months</h4>
                  <p className="text-xs text-muted-foreground">Recommended</p>
                </div>
              </div>
              <p className="text-lg font-bold text-primary">{formatCurrency(monthlySpending * 6)}</p>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">12 Months</h4>
                  <p className="text-xs text-muted-foreground">Conservative</p>
                </div>
              </div>
              <p className="text-lg font-bold">{formatCurrency(monthlySpending * 12)}</p>
            </div>
          </div>
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyFundAnalysis;
