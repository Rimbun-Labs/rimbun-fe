import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  PieChart,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useSpendingData, useSpendingCategories, useSpendingRecommendations, useSpendingHistory } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader, PageContainer } from '@/components/layout';

// Spending components
import SpendingOverviewCard from '@/components/spending/SpendingOverviewCard';
import TrendsInsightsCard from '@/components/spending/TrendsInsightsCard';
import SpendingHistory from '@/components/spending/SpendingHistory';
import SpendingInput from '@/components/spending/SpendingInput';
import SpendingCategories from '@/components/spending/SpendingCategories';
import SpendingRecommendations from '@/components/spending/SpendingRecommendations';

const SpendingPage: React.FC = () => {
  const { user } = useAuth();
  const userId = userService.getDatabaseUserId();
  
  // Spending Analysis state
  const [spendingSubTab, setSpendingSubTab] = useState('input');

  // Fetch spending data
  const { 
    data: spendingData, 
    isLoading: spendingLoading, 
    error: spendingError 
  } = useSpendingData();

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useSpendingCategories();

  const { 
    data: recommendations, 
    isLoading: recommendationsLoading 
  } = useSpendingRecommendations();

  // Fetch spending history
  const { 
    data: historyData 
  } = useSpendingHistory({ limit: 12 });

  // Show loading state
  if (spendingLoading && !spendingData) {
    return (
      <PageContainer>
        <div className="py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      </PageContainer>
    );
  }

  // Show error state
  if (spendingError) {
    return (
      <PageContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load spending data. Please try again later.
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={DollarSign}
        title="Spending"
        description="Track and analyze your spending patterns"
      />

      {/* Top Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingOverviewCard 
          data={spendingData}
          loading={spendingLoading}
        />
        <TrendsInsightsCard userId={userId || ''} />
      </div>

      {/* Main Content */}
      <div className="space-y-6 mt-6">
        {/* History Chart */}
        <SpendingHistory userId={userId || ''} />

        {/* Input and Categories */}
        <Tabs value={spendingSubTab} onValueChange={setSpendingSubTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="input" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <AlertCircle className="h-4 w-4" />
              Input
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" />
                Enter Your Spending Data
              </h3>
              <SpendingInput 
                userId={userId || ''}
                currentData={spendingData}
                onSuccess={() => {
                  // Data saved successfully, stay on input tab
                }}
              />
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Spending Categories</h3>
              <Card>
                <CardContent>
                  <SpendingCategories 
                    userId={userId || ''}
                    categories={categories || []}
                    loading={categoriesLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendations - Includes Savings Rate and Emergency Fund */}
        {recommendations && (
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              Recommendations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Personalized suggestions based on your spending patterns and financial goals. 
              These recommendations help optimize your savings rate, emergency fund progress, and goal achievement timeline.
            </p>
            <SpendingRecommendations 
              recommendations={recommendations}
              spendingData={spendingData}
              loading={recommendationsLoading}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SpendingPage;

