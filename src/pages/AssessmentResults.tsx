import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const AssessmentResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: results, isPending: resultsLoading, error: resultsError } = useQuery<AssessmentResult>({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !!sessionId
  });

  const handleBack = () => {
    navigate('/assessment');
  };

  // Consolidated return with conditional content
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Loading State */}
      {resultsLoading && (
        <div className="w-full py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      )}

      {/* Error State */}
      {!resultsLoading && (resultsError || !sessionId) && (
        <div className="w-full py-8">
          <div className="w-full space-y-4">
            <Card className="bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>
                    {!sessionId 
                      ? 'No assessment session ID provided.' 
                      : 'Failed to load assessment results. The assessment might not be complete yet.'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment
            </Button>
          </div>
        </div>
      )}

      {/* Main Results Content */}
      {!resultsLoading && !resultsError && sessionId && results && (
        <div className="w-full py-8">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Assessment Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{results.scoreData.profile}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">Overall Score:</span>
                      <span className="text-2xl font-bold">{results.scoreData.finalScore}</span>
                      <span className="text-sm text-muted-foreground">
                        ({(results.scoreData.overallConfidence * 100).toFixed(1)}% confidence)
                      </span>
                    </div>
                  </div>

                  {/* Score Categories */}
                  {(() => {
                    const scoreCategories = [
                      { label: 'Risk Profile', value: results.scoreData.riskProfile, confidence: results.scoreData.confidenceMetrics?.riskProfileConfidence ?? 0 },
                      { label: 'Knowledge Level', value: results.scoreData.knowledgeLevel, confidence: results.scoreData.confidenceMetrics?.knowledgeLevelConfidence ?? 0 },
                      { label: 'Leverage Aptitude', value: results.scoreData.leverageAptitude, confidence: results.scoreData.confidenceMetrics?.leverageAptitudeConfidence ?? 0 },
                      { label: 'Risk Capacity', value: results.scoreData.riskCapacity, confidence: results.scoreData.confidenceMetrics?.riskCapacityConfidence ?? 0 },
                      { label: 'Decision Style', value: results.scoreData.decisionStyleScore, confidence: results.scoreData.confidenceMetrics?.decisionStyleConfidence ?? 0 },
                      { label: 'Personality', value: results.scoreData.personalityScore, confidence: results.scoreData.confidenceMetrics?.personalityConfidence ?? 0 }
                    ];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {scoreCategories.map((category) => (
                          <Card key={category.label} className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{category.label}</span>
                                <span className="text-lg font-bold">{category.value}</span>
                              </div>
                              <Progress value={category.value} className="h-2" />
                              <div className="text-xs text-muted-foreground text-center">
                                Confidence: {(category.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw JSON Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResults;
