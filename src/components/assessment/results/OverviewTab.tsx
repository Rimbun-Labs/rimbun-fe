import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { Users, TrendingUp, ArrowRight, ChevronDown, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import ScoreCard from '../ScoreCard';
import { MetricDetails, getMetricInsights } from './MetricDetails';
import { AssessmentResult } from '@/lib/api/types/assessment';

interface OverviewTabProps {
  result: AssessmentResult['scoreData'];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const metrics = [
    {
      key: 'riskProfile',
      title: 'Risk Profile',
      description: 'Your risk tolerance and investment preferences',
      score: result.riskProfile,
      confidence: result.confidenceMetrics.riskProfileConfidence
    },
    {
      key: 'knowledgeLevel',
      title: 'Knowledge Level',
      description: 'Your understanding of investment concepts',
      score: result.knowledgeLevel,
      confidence: result.confidenceMetrics.knowledgeLevelConfidence
    },
    {
      key: 'decisionStyle',
      title: 'Decision Style',
      description: 'Your approach to making investment decisions',
      score: result.decisionStyleScore,
      confidence: result.confidenceMetrics.decisionStyleConfidence
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Profile Visualization</CardTitle>
              <CardDescription>Your investment preferences and risk tolerance</CardDescription>
            </div>
            <Badge variant="outline" className={getConfidenceColor(result.overallConfidence)}>
              {Math.round(result.overallConfidence * 100)}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[350px]">
            <RiskProfileChart 
              data={{
                riskProfile: result.riskProfile / 10,
                knowledgeLevel: result.knowledgeLevel / 10,
                leverageAptitude: result.leverageAptitude / 10,
                decisionStyleScore: result.decisionStyleScore / 10,
                personalityScore: result.personalityScore / 10
              }}
              confidenceMetrics={result.confidenceMetrics}
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Compare with Others
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              View Trends
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Dialog key={metric.key}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <ScoreCard
                  title={metric.title}
                  score={metric.score}
                  maxScore={100}
                  confidence={metric.confidence}
                  description={metric.description}
                />
              </div>
            </DialogTrigger>
            <MetricDetails 
              title={metric.title}
              score={metric.score}
              average={75} // You might want to get this from somewhere
              trend="increasing"
              recommendation="Based on your profile, consider exploring more diversified investment options."
            />
          </Dialog>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Recommended actions based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Complete Learning Modules</h4>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on your knowledge level ({result.knowledgeLevel.toFixed(1)}), we recommend completing our investment basics modules
                    </p>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Investment Basics</span>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Management</span>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portfolio Diversification</span>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to="/learning">View All Modules <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
