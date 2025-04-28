
import React from 'react';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import ScoreCard from './ScoreCard';
import CategoryScores from './CategoryScores';
import ProfileDetermination from './ProfileDetermination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AssessmentResultsProps {
  result: AssessmentResult;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result }) => {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Assessment Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Profile Visualization</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[350px]">
                    <RiskProfileChart 
                      data={{
                        riskProfile: result.riskProfile / 10, // Scale to 0-10
                        knowledgeLevel: result.knowledgeLevel / 10,
                        leverageAptitude: result.leverageAptitude / 10,
                        decisionStyleScore: result.decisionStyleScore / 10,
                        personalityScore: result.personalityScore / 10
                      }}
                      confidenceMetrics={{
                        riskProfileConfidence: result.confidenceMetrics.riskProfileConfidence,
                        knowledgeLevelConfidence: result.confidenceMetrics.knowledgeLevelConfidence,
                        leverageAptitudeConfidence: result.confidenceMetrics.leverageAptitudeConfidence,
                        decisionStyleConfidence: result.confidenceMetrics.decisionStyleConfidence,
                        personalityConfidence: result.confidenceMetrics.personalityConfidence
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard
                  title="Risk Profile"
                  score={result.riskProfile}
                  maxScore={100}
                  confidence={result.confidenceMetrics.riskProfileConfidence}
                  description="Your comfort level with investment risk"
                />
                <ScoreCard
                  title="Knowledge"
                  score={result.knowledgeLevel}
                  maxScore={100}
                  confidence={result.confidenceMetrics.knowledgeLevelConfidence}
                  description="Your understanding of investment concepts"
                />
                <ScoreCard
                  title="Decision Making"
                  score={result.decisionStyleScore}
                  maxScore={100}
                  confidence={result.confidenceMetrics.decisionStyleConfidence}
                  description="Your approach to financial decisions"
                />
              </div>
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
                  </CardHeader>
                  <CardContent>
                    {result.directInputs ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Risk Capacity</span>
                            <span className="font-medium">{result.directInputs.riskCapacity}/10</span>
                          </div>
                          <progress 
                            value={result.directInputs.riskCapacity * 10} 
                            max="100" 
                            className="w-full h-2 [&::-webkit-progress-value]:bg-blue-600"
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
                          <progress 
                            value={Math.min(result.directInputs.investmentHorizon * 5, 100)} 
                            max="100" 
                            className="w-full h-2 [&::-webkit-progress-value]:bg-green-600"
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
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(result.confidenceMetrics).map(([key, value]) => (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace('Confidence', '').trim()}</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100">
                              {Math.round(value * 100)}%
                            </span>
                          </div>
                          <progress 
                            value={value * 100} 
                            max="100" 
                            className={`w-full h-1.5 
                              ${value >= 0.8 ? '[&::-webkit-progress-value]:bg-green-600' : 
                                value >= 0.6 ? '[&::-webkit-progress-value]:bg-blue-600' :
                                value >= 0.4 ? '[&::-webkit-progress-value]:bg-yellow-500' :
                                '[&::-webkit-progress-value]:bg-red-600'}`
                            }
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
            confidenceMetrics={{
              riskProfileConfidence: result.confidenceMetrics.riskProfileConfidence,
              knowledgeLevelConfidence: result.confidenceMetrics.knowledgeLevelConfidence,
              leverageAptitudeConfidence: result.confidenceMetrics.leverageAptitudeConfidence,
              decisionStyleConfidence: result.confidenceMetrics.decisionStyleConfidence,
              personalityConfidence: result.confidenceMetrics.personalityConfidence
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
