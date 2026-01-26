import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, Target, AlertCircle, ChevronDown, ChevronUp, Shield, CheckCircle } from "lucide-react";
import { SpendingRecommendationDto, SpendingAnalysisDto } from '@/lib/api/spendingApi';
import { useFormatters } from '@/hooks/useFormatters';

interface SpendingRecommendationsProps {
  recommendations?: SpendingRecommendationDto;
  spendingData?: SpendingAnalysisDto;
  loading: boolean;
}

const SpendingRecommendations: React.FC<SpendingRecommendationsProps> = ({ 
  recommendations, 
  spendingData,
  loading 
}) => {
  const { formatCurrency } = useFormatters();
  const [isSavingsRateExpanded, setIsSavingsRateExpanded] = useState(false);
  const [isEmergencyFundExpanded, setIsEmergencyFundExpanded] = useState(false);
  // Format primary action for user readability
  const formatPrimaryAction = (action: string): string => {
    switch (action) {
      case 'increase_savings':
        return 'Increase Savings';
      case 'adjust_strategy':
        return 'Adjust Strategy';
      case 'extend_timeline':
        return 'Extend Timeline';
      case 'on_track':
        return 'On Track';
      default:
        // Fallback: convert snake_case to Title Case
        return action
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground mt-2">Loading recommendations...</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recommendations available yet</p>
          <p className="text-sm text-muted-foreground">
            Complete your spending analysis to get personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    currentSavingsRate,
    recommendedSavingsRate,
    potentialMonthlySavings,
    spendingAdjustments,
    emergencyFundActions,
    combinedRecommendations
  } = recommendations;

  // Determine status color based on primary action
  const getStatusColor = () => {
    if (!combinedRecommendations?.primaryAction) return '';
    
    switch (combinedRecommendations.primaryAction) {
      case 'on_track':
        return 'border-green-500 border-l-4 bg-green-50/50 dark:bg-green-950/20';
      case 'increase_savings':
        return 'border-yellow-500 border-l-4 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'adjust_strategy':
        return 'border-orange-500 border-l-4 bg-orange-50/50 dark:bg-orange-950/20';
      case 'extend_timeline':
        return 'border-red-500 border-l-4 bg-red-50/50 dark:bg-red-950/20';
      default:
        return '';
    }
  };

  const statusColor = getStatusColor();

  // Check if goal is achieved (recommendedSavingsRate is 0, null, undefined, or < 0.1 means goal already reached)
  // Also check if current rate exceeds recommended (user is saving more than needed)
  const isGoalAchieved = 
    (recommendedSavingsRate === 0 || recommendedSavingsRate == null || recommendedSavingsRate < 0.1) && 
    currentSavingsRate > 0;

  return (
    <div className="space-y-6">
      {/* Savings Rate Analysis - Compact with Expandable Details */}
      <Card className={statusColor}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Savings Rate
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSavingsRateExpanded(!isSavingsRateExpanded)}
              className="h-8 w-8 p-0"
            >
              {isSavingsRateExpanded ? (
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
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  Current: <span className="font-bold">{currentSavingsRate?.toFixed(1) || '0.0'}%</span>
                </p>
                {isGoalAchieved ? (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Goal target reached - Continue saving for other goals
                  </p>
                ) : recommendedSavingsRate && recommendedSavingsRate > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Recommended: {recommendedSavingsRate.toFixed(1)}%
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    General recommendation: 20% (50/30/20 rule)
                  </p>
                )}
              </div>
            </div>
            {!isGoalAchieved && potentialMonthlySavings && potentialMonthlySavings > 0 && (
              <div className="text-right">
                <p className="text-sm font-bold">${potentialMonthlySavings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Potential</p>
              </div>
            )}
            {isGoalAchieved && (
              <div className="text-right">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            )}
          </div>

          {/* Expanded Details - Only when expanded */}
          {isSavingsRateExpanded && (
            <div className="space-y-4 pt-4 border-t">
              {isGoalAchieved ? (
                // Goal Achieved State - Never show "Recommended: 0%"
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">
                          Goal Target Reached! 🎉
                        </h5>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          Your current savings rate of <strong>{currentSavingsRate?.toFixed(1)}%</strong> has already met or exceeded your goal target. No additional savings are needed for this specific goal.
                        </p>
                        <div className="p-3 bg-green-100/50 dark:bg-green-900/30 rounded-md mb-3">
                          <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">
                            ⚠️ Important: This does NOT mean stop saving!
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Continue maintaining your {currentSavingsRate?.toFixed(1)}% savings rate. This recommendation only applies to this specific goal - you still need savings for emergencies, other goals, and long-term wealth building.
                          </p>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                          What this means:
                        </p>
                        <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 mb-3 list-disc list-inside">
                          <li>Your {currentSavingsRate?.toFixed(1)}% savings rate is excellent</li>
                          <li>You've exceeded the required savings for this specific goal</li>
                          <li>Keep saving - this applies only to this goal, not your overall savings strategy</li>
                        </ul>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                          Consider next steps:
                        </p>
                        <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                          <li>Set a higher target for this goal to continue growing</li>
                          <li>Allocate savings to other financial goals</li>
                          <li>Build or maintain your emergency fund (3-6 months expenses)</li>
                          <li>Invest excess savings for long-term wealth building</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Show current rate info - emphasize continuing to save */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/30 dark:bg-green-900/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-medium text-sm">Your Current Savings Rate</h4>
                        <p className="text-xs text-muted-foreground">Keep maintaining this excellent rate!</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentSavingsRate?.toFixed(1)}%</p>
                  </div>
                </div>
              ) : (
                // Normal State - Show comparison (only when recommended > 0)
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Current Rate</h4>
                        </div>
                      </div>
                      <p className="text-lg font-bold">{currentSavingsRate?.toFixed(1) || '0.0'}%</p>
                    </div>
                    {recommendedSavingsRate && recommendedSavingsRate > 0 && (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <div>
                            <h4 className="font-medium text-sm text-primary">Recommended</h4>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">{recommendedSavingsRate.toFixed(1)}%</p>
                      </div>
                    )}
                    {potentialMonthlySavings && potentialMonthlySavings > 0 && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Potential Savings</h4>
                          </div>
                        </div>
                        <p className="text-lg font-bold">${potentialMonthlySavings.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {currentSavingsRate && recommendedSavingsRate && currentSavingsRate < recommendedSavingsRate && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Opportunity for Improvement</h5>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You could potentially save an additional ${potentialMonthlySavings?.toLocaleString() || '0'} 
                        per month by optimizing your spending.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Fund Analysis - Compact with Expandable Details */}
      {spendingData && spendingData.emergencyFundStatus && (() => {
        const emergencyFundStatus = spendingData.emergencyFundStatus;
        const currentEmergencyFund = emergencyFundStatus?.currentAmount || 0;
        const recommendedEmergencyFund = emergencyFundStatus?.recommendedTarget || 0;
        const monthlySpending = spendingData.monthlySpending || 0;
        const progressPercentage = recommendedEmergencyFund > 0 
          ? Math.min((currentEmergencyFund / recommendedEmergencyFund) * 100, 100)
          : 0;
        const monthsOfExpenses = emergencyFundStatus?.monthsOfExpenses || 
          (monthlySpending > 0 ? currentEmergencyFund / monthlySpending : 0);
        const targetMonths = recommendedEmergencyFund > 0 && monthlySpending > 0
          ? recommendedEmergencyFund / monthlySpending
          : 0;

        const getStatusInfo = (status: string, months: number) => {
          switch (status) {
            case 'adequate':
              return { 
                color: 'text-green-600', 
                icon: CheckCircle, 
                message: `Adequate (${months.toFixed(1)} months)` 
              };
            case 'insufficient':
              return { 
                color: 'text-yellow-600', 
                icon: AlertCircle, 
                message: `Insufficient (${months.toFixed(1)} months)` 
              };
            case 'excessive':
              return { 
                color: 'text-blue-600', 
                icon: Shield, 
                message: `Well-funded (${months.toFixed(1)} months)` 
              };
            default:
              return { 
                color: 'text-gray-600', 
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
                  onClick={() => setIsEmergencyFundExpanded(!isEmergencyFundExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isEmergencyFundExpanded ? (
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
                  <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
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
              {isEmergencyFundExpanded && (
                <div className="space-y-4 pt-4 border-t">
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
      })()}

      {/* Spending Adjustments */}
      {spendingAdjustments && spendingAdjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spendingAdjustments.map((adjustment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm">{adjustment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Fund Actions */}
      {emergencyFundActions && emergencyFundActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Fund Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyFundActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-1 bg-green-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm">{action}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Optimizations from combined recommendations */}
      {combinedRecommendations?.spendingOptimizations && combinedRecommendations.spendingOptimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {combinedRecommendations.spendingOptimizations.map((optimization, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-sm">{optimization}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Alignment from combined recommendations */}
      {combinedRecommendations?.goalAlignment && combinedRecommendations.goalAlignment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goal Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {combinedRecommendations.goalAlignment.map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <p className="text-sm">{goal}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingRecommendations;
