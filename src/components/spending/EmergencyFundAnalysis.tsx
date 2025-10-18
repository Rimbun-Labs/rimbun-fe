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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'adequate':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle, 
          message: 'Your emergency fund is adequate' 
        };
      case 'insufficient':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: AlertCircle, 
          message: 'Your emergency fund needs attention' 
        };
      case 'excessive':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: Shield, 
          message: 'Your emergency fund is well-funded' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: AlertCircle, 
          message: 'Emergency fund status unknown' 
        };
    }
  };

  const statusInfo = getStatusInfo(emergencyFundStatus?.status || 'unknown');
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
          <div className="flex items-center justify-center">
            <Badge className={`${statusInfo.color} text-lg px-4 py-2`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusInfo.message}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Emergency Fund Progress</span>
              <span className="text-sm font-bold">{isNaN(progressPercentage) ? '0' : progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={isNaN(progressPercentage) ? 0 : Math.min(progressPercentage, 100)} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(currentEmergencyFund)}</span>
              <span>{formatCurrency(recommendedEmergencyFund)}</span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="font-medium">Recommendations</h4>
            {emergencyFundStatus === 'insufficient' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">Build Your Emergency Fund</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Aim for 3-6 months of expenses: {formatCurrency(recommendedEmergencyFund)}</li>
                  <li>• Set up automatic transfers to a high-yield savings account</li>
                  <li>• Consider reducing discretionary spending temporarily</li>
                </ul>
              </div>
            )}

            {emergencyFundStatus === 'adequate' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Great Job!</h5>
                <p className="text-sm text-green-700">
                  Your emergency fund is well-positioned. Consider investing excess funds 
                  or increasing your retirement contributions.
                </p>
              </div>
            )}

            {emergencyFundStatus === 'excessive' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Consider Optimizing</h5>
                <p className="text-sm text-blue-700">
                  Your emergency fund exceeds recommendations. Consider investing excess funds 
                  for better long-term returns.
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
