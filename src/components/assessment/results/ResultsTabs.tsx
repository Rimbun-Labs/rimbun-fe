import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from './OverviewTab';
import { DetailsTab } from './DetailsTab';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Card, CardContent } from '@/components/ui/card';

interface ResultsTabsProps {
  result: AssessmentResult['scoreData'];
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Create category scores from the available metrics
  const categoryScores = {
    'Risk Profile': {
      score: result.riskProfile,
      confidence: result.confidenceMetrics.riskProfileConfidence,
      description: 'Your risk tolerance and investment preferences'
    },
    'Knowledge Level': {
      score: result.knowledgeLevel,
      confidence: result.confidenceMetrics.knowledgeLevelConfidence,
      description: 'Your understanding of investment concepts and markets'
    },
    'Leverage Aptitude': {
      score: result.leverageAptitude,
      confidence: result.confidenceMetrics.leverageAptitudeConfidence,
      description: 'Your comfort level with using leverage in investments'
    },
    'Risk Capacity': {
      score: result.riskCapacity,
      confidence: result.confidenceMetrics.riskCapacityConfidence,
      description: 'Your financial ability to take on investment risks'
    },
    'Decision Style': {
      score: result.decisionStyleScore,
      confidence: result.confidenceMetrics.decisionStyleConfidence,
      description: 'Your approach to making investment decisions'
    },
    'Personality': {
      score: result.personalityScore,
      confidence: result.confidenceMetrics.personalityConfidence,
      description: 'How your personality traits influence your investment style'
    }
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
        <div className="grid gap-6">
          {Object.entries(categoryScores).map(([category, data]) => (
            <Card key={category}>
              <CardContent className="py-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <div className="text-sm text-muted-foreground">
                      Score: {data.score.toFixed(1)} ({(data.confidence * 100).toFixed(0)}% confidence)
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <DetailsTab result={result} />
      </TabsContent>
    </Tabs>
  );
};
