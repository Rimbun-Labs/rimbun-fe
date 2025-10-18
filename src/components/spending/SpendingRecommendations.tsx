import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Target, AlertCircle } from "lucide-react";
import { SpendingRecommendationDto } from '@/lib/api/spendingApi';

interface SpendingRecommendationsProps {
  recommendations?: SpendingRecommendationDto;
  loading: boolean;
}

const SpendingRecommendations: React.FC<SpendingRecommendationsProps> = ({ 
  recommendations, 
  loading 
}) => {
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

  return (
    <div className="space-y-6">
      {/* Savings Rate Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Savings Rate Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <h4 className="font-medium text-sm text-primary">Recommended</h4>
                </div>
              </div>
              <p className="text-lg font-bold text-primary">{recommendedSavingsRate?.toFixed(1) || '0.0'}%</p>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Potential Savings</h4>
                </div>
              </div>
              <p className="text-lg font-bold">${potentialMonthlySavings?.toLocaleString() || '0'}</p>
            </div>
          </div>

          {currentSavingsRate && recommendedSavingsRate && currentSavingsRate < recommendedSavingsRate && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Opportunity for Improvement</h5>
              <p className="text-sm text-yellow-700">
                You could potentially save an additional ${potentialMonthlySavings?.toLocaleString() || '0'} 
                per month by optimizing your spending.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Combined Recommendations */}
      {combinedRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Financial Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h5 className="font-medium text-primary mb-2">Primary Action</h5>
              <p className="text-sm">{combinedRecommendations.primaryAction}</p>
            </div>

            {combinedRecommendations.spendingOptimizations && combinedRecommendations.spendingOptimizations.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Spending Optimizations</h5>
                <div className="space-y-2">
                  {combinedRecommendations.spendingOptimizations.map((optimization, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-sm">{optimization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {combinedRecommendations.goalAlignment && combinedRecommendations.goalAlignment.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Goal Alignment</h5>
                <div className="space-y-2">
                  {combinedRecommendations.goalAlignment.map((goal, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <p className="text-sm">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingRecommendations;
