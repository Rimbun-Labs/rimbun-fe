import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, PieChart, Shield, Lightbulb, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useSpendingData, useSpendingCategories, useSpendingRecommendations } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import components (we'll create these next)
import SpendingOverview from './SpendingOverview';
import SpendingInput from './SpendingInput';
import SpendingCategories from './SpendingCategories';
import EmergencyFundAnalysis from './EmergencyFundAnalysis';
import SpendingRecommendations from './SpendingRecommendations';

interface SpendingAnalysisTabProps {
  className?: string;
}

const SpendingAnalysisTab: React.FC<SpendingAnalysisTabProps> = ({ className }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get user ID for API calls
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
      <div className={className}>
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
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load spending data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show welcome state if no spending data exists
  if (!spendingData) {
    return (
      <div className={className}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Welcome to Spending Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Get insights into your spending habits and optimize your financial plan. 
              Start by entering your monthly spending information.
            </p>
            <Button 
              onClick={() => setActiveTab('input')}
              className="w-full"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="input" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Input
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Emergency Fund
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <SpendingOverview 
            data={spendingData}
            loading={spendingLoading}
          />
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <SpendingInput 
            userId={userId || ''}
            currentData={spendingData}
            onSuccess={() => setActiveTab('overview')}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <SpendingCategories 
            userId={userId || ''}
            categories={categories || []}
            loading={categoriesLoading}
          />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencyFundAnalysis 
            data={spendingData}
            loading={spendingLoading}
          />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <SpendingRecommendations 
            recommendations={recommendations}
            loading={recommendationsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpendingAnalysisTab;
