import React from 'react';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import ScoreCard from './ScoreCard';
import CategoryScores from './CategoryScores';
import ProfileDetermination from './ProfileDetermination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Share2, BookOpen, ChevronDown, ChevronUp, Info, BarChart2, Users, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onClose?: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setExpandedSection(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getMetricInsights = (metric: string) => {
    const insights = {
      riskProfile: {
        title: "Risk Profile Insights",
        description: "Your risk tolerance level compared to other investors",
        average: 65,
        trend: "up",
        recommendation: "Consider diversifying your portfolio to match your risk profile"
      },
      knowledgeLevel: {
        title: "Knowledge Level Insights",
        description: "Your understanding of investment concepts",
        average: 70,
        trend: "up",
        recommendation: "Complete our investment basics modules to improve your knowledge"
      },
      decisionStyle: {
        title: "Decision Style Insights",
        description: "Your approach to financial decisions",
        average: 75,
        trend: "stable",
        recommendation: "Your decision-making style is well-balanced"
      }
    };
    return insights[metric as keyof typeof insights];
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized investment profile analysis
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download your assessment results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share your results with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Risk Profile Visualization</CardTitle>
                      <CardDescription>Your investment preferences and risk tolerance</CardDescription>
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(
                      Object.values(result.confidenceMetrics).reduce((a, b) => a + b, 0) / 
                      Object.values(result.confidenceMetrics).length
                    )}>
                      {Math.round(
                        Object.values(result.confidenceMetrics).reduce((a, b) => a + b, 0) / 
                        Object.values(result.confidenceMetrics).length * 100
                      )}% Confidence
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
                {['riskProfile', 'knowledgeLevel', 'decisionStyle'].map((metric) => {
                  const insights = getMetricInsights(metric);
                  return (
                    <Dialog key={metric}>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer">
                          <ScoreCard
                            title={insights.title}
                            score={result[metric as keyof AssessmentResult] as number}
                            maxScore={100}
                            confidence={result.confidenceMetrics[`${metric}Confidence` as keyof typeof result.confidenceMetrics]}
                            description={insights.description}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{insights.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Your Score</span>
                            <span className="font-bold">{result[metric as keyof AssessmentResult]}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Average Score</span>
                            <span className="font-bold">{insights.average}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Trend</span>
                            <Badge variant="outline" className={
                              insights.trend === 'up' ? 'bg-green-100 text-green-800' :
                              insights.trend === 'down' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {insights.trend === 'up' ? 'Increasing' :
                               insights.trend === 'down' ? 'Decreasing' :
                               'Stable'}
                            </Badge>
                          </div>
                          <div className="pt-4">
                            <h4 className="font-medium mb-2">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{insights.recommendation}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
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
                              Based on your knowledge level, we recommend completing our investment basics modules
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Direct Inputs</CardTitle>
                    <CardDescription>Your provided information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.directInputs ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Risk Capacity</span>
                            <span className="font-medium">{result.directInputs.riskCapacity}/10</span>
                          </div>
                          <Progress 
                            value={result.directInputs.riskCapacity * 10} 
                            className="h-2"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Your ability to take on financial risk based on your current situation
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Investment Horizon</span>
                            <span className="font-medium">{result.directInputs.investmentHorizon} years</span>
                          </div>
                          <Progress 
                            value={Math.min(result.directInputs.investmentHorizon * 5, 100)} 
                            className="h-2"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Your expected timeframe for investment before needing the funds
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No direct input data available
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Confidence Analysis</CardTitle>
                    <CardDescription>Reliability of your assessment results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(result.confidenceMetrics).map(([key, value]) => (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace('Confidence', '').trim()}</span>
                            <Badge variant="outline" className={getConfidenceColor(value)}>
                              {Math.round(value * 100)}%
                            </Badge>
                          </div>
                          <Progress 
                            value={value * 100} 
                            className="h-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ProfileDetermination 
            profile={result.profile}
            finalScore={result.finalScore}
            confidenceMetrics={result.confidenceMetrics}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
