import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, PiggyBank, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useSpendingData, useSpendingCategories, useSpendingRecommendations } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SpendingInput from '@/components/spending/SpendingInput';
import SpendingCategories from '@/components/spending/SpendingCategories';
import EmergencyFundAnalysis from '@/components/spending/EmergencyFundAnalysis';
import SpendingRecommendations from '@/components/spending/SpendingRecommendations';

const SpendingAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const userId = userService.getDatabaseUserId();

  // Fetch spending data
  const { 
    data: spendingData, 
    isLoading: spendingLoading, 
    error: spendingError 
  } = useSpendingData(userId || '');

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useSpendingCategories(userId || '');

  const { 
    data: recommendations, 
    isLoading: recommendationsLoading 
  } = useSpendingRecommendations(userId || '');

  // Show loading state
  if (spendingLoading && !spendingData) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (spendingError) {
    return (
      <div className="container max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load spending data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Spending Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your spending habits and optimize your financial plan
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Categories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Enter Your Spending Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingInput 
                  userId={userId || ''}
                  currentData={spendingData}
                  onSuccess={() => {
                    // Data will be refreshed automatically via React Query
                  }}
                />
              </CardContent>
            </Card>

            {/* Spending Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Spending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingCategories 
                  userId={userId || ''}
                  categories={categories || []}
                  loading={categoriesLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis & Recommendations */}
          <div className="space-y-6">
            {/* Emergency Fund Analysis */}
            {spendingData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Emergency Fund
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmergencyFundAnalysis 
                    data={spendingData}
                    loading={spendingLoading}
                  />
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingRecommendations 
                    recommendations={recommendations}
                    loading={recommendationsLoading}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">💡 Quick Tips for Better Spending Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Track Everything</h4>
                <p className="text-sm text-muted-foreground">
                  Include all monthly expenses: housing, food, transportation, entertainment, and subscriptions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Be Consistent</h4>
                <p className="text-sm text-muted-foreground">
                  Update your spending data monthly to track trends and identify optimization opportunities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Set Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Use the analysis to set realistic savings goals and emergency fund targets.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Review Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  Check your spending analysis regularly to stay on track with your financial goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpendingAnalysisPage;
