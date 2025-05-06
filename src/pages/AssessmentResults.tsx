import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const AssessmentResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  console.log(sessionId)

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['assessmentResults', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('No session ID provided');
      return getAssessmentResults(sessionId);
    },
    enabled: !!sessionId,
    retry: 1, // Only retry once if there's an error
  });

  const handleBack = () => {
    navigate('/assessment');
  };

  console.log(results)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !sessionId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
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
    );
  }

  if (!results) return null;

  console.log(results)

  const scoreCategories = [
    { label: 'Risk Profile', value: results.scoreData.riskProfile, confidence: results.scoreData.confidenceMetrics.riskProfileConfidence },
    { label: 'Knowledge Level', value: results.scoreData.knowledgeLevel, confidence: results.scoreData.confidenceMetrics.knowledgeLevelConfidence },
    { label: 'Leverage Aptitude', value: results.scoreData.leverageAptitude, confidence: results.scoreData.confidenceMetrics.leverageAptitudeConfidence },
    { label: 'Risk Capacity', value: results.scoreData.riskCapacity, confidence: results.scoreData.confidenceMetrics.riskCapacityConfidence },
    { label: 'Decision Style', value: results.scoreData.decisionStyleScore, confidence: results.scoreData.confidenceMetrics.decisionStyleConfidence },
    { label: 'Personality', value: results.scoreData.personalityScore, confidence: results.scoreData.confidenceMetrics.personalityConfidence },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
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

              <div className="grid gap-4">
                {scoreCategories.map((category) => (
                  <div key={category.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.value.toFixed(1)} ({(category.confidence * 100).toFixed(1)}% confidence)
                      </span>
                    </div>
                    <Progress value={category.value} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Direct Inputs</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(results.scoreData.directInputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
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
  );
};

export default AssessmentResults;
