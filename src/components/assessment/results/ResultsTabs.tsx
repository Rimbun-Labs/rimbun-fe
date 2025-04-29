
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from './OverviewTab';
import { DetailsTab } from './DetailsTab';
import CategoryScores from '../CategoryScores';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Card, CardContent } from '@/components/ui/card';

interface ResultsTabsProps {
  result: AssessmentResult;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab result={result} />
      </TabsContent>

      <TabsContent value="categories" className="space-y-6">
        {result.categoryScores ? (
          <CategoryScores categoryScores={result.categoryScores} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Category breakdown is not available for this assessment.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <DetailsTab result={result} />
      </TabsContent>
    </Tabs>
  );
};
