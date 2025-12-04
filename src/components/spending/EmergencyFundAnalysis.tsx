import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
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
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Fund Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badge */}
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Badge className={`${statusInfo.color} text-lg px-4 py-2`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusInfo.message}
              </Badge>
            </div>
            
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

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="font-medium">Recommendations</h4>
            {emergencyFundStatus?.status === 'insufficient' && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Build Your Emergency Fund</h5>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  You currently have {monthsOfExpenses.toFixed(1)} months of expenses covered. 
                  Aim for at least 3-6 months for adequate coverage.
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Target: {formatCurrency(recommendedEmergencyFund)} ({targetMonths > 0 ? `${targetMonths.toFixed(1)} months` : '6 months recommended'})</li>
                  <li>• Set up automatic transfers to a high-yield savings account</li>
                  <li>• Consider reducing discretionary spending temporarily</li>
                </ul>
              </div>
            )}

            {emergencyFundStatus?.status === 'adequate' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">Great Job!</h5>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You have {monthsOfExpenses.toFixed(1)} months of expenses covered, which is adequate. 
                  {recommendedEmergencyFund > currentEmergencyFund && (
                    <span> Continue building toward your {targetMonths > 0 ? `${targetMonths.toFixed(1)}-month` : ''} target of {formatCurrency(recommendedEmergencyFund)}.</span>
                  )}
                  {recommendedEmergencyFund <= currentEmergencyFund && (
                    <span> Consider investing excess funds or increasing your retirement contributions.</span>
                  )}
                </p>
              </div>
            )}

            {emergencyFundStatus?.status === 'excessive' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Consider Optimizing</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You have {monthsOfExpenses.toFixed(1)} months of expenses covered, which exceeds the recommended 6 months. 
                  Consider investing excess funds for better long-term returns.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Fund Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Fund Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyFundAnalysis;
