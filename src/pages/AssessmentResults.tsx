import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, Shield, BookOpen, TrendingUp, Brain, Zap, ChevronRight } from 'lucide-react';
import { formatScorePercent } from '@/lib/utils/scoreFormatters';
import { PageContainer } from '@/components/layout';

const AssessmentResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const { data: results, isPending: resultsLoading, error: resultsError } = useQuery<AssessmentResult>({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !!sessionId,
  });

  const handleBack = () => {
    navigate('/assessment');
  };

  const handleGoToDashboard = () => {
    navigate(sessionId ? `/dashboard/${sessionId}` : '/dashboard');
  };

  const handleStartLearning = () => {
    navigate(sessionId ? `/dashboard/${sessionId}` : '/dashboard');
  };

  // Build "What this means" bullets and subtitle from score data
  const getInsightBullets = (scoreData: AssessmentResult['scoreData']) => {
    const profileUpper = (scoreData.profile || '').toUpperCase();
    const risk = scoreData.riskProfile ?? 0;
    const knowledge = scoreData.knowledgeLevel ?? 0;
    const leverage = scoreData.leverageAptitude ?? 0;
    const decision = scoreData.decisionStyleScore ?? 0;

    const riskCopy =
      risk >= 70
        ? 'You’re comfortable with market ups and downs; we’ll suggest growth-oriented options.'
        : risk >= 40
          ? 'You prefer a balanced approach—some volatility is OK, but you like structure.'
          : 'You prefer safety and stability; we’ll focus on lower-risk options.';

    const knowledgeCopy =
      knowledge >= 70
        ? 'You’re at an advanced level; we’ll skip the basics and use proper terminology.'
        : knowledge >= 40
          ? 'You’re at an intermediate level; we’ll explain jargon and build on fundamentals.'
          : 'You’re at a beginner level; we’ll start with the basics and avoid jargon.';

    const leverageCopy =
      leverage >= 60
        ? 'Borrowing to invest fits your profile; we may suggest margin or loan products when relevant.'
        : leverage >= 30
          ? 'Use leverage only in small amounts; we’ll keep recommendations conservative.'
          : 'We’ll avoid leverage and margin; focus on unlevered investments for now.';

    const decisionCopy =
      decision >= 60
        ? 'You prefer data and research; we’ll emphasize metrics and clear comparisons.'
        : 'You like a mix of structure and intuition; we’ll keep explanations concise and actionable.';

    return [
      { icon: Shield, label: 'Risk & comfort', text: riskCopy },
      { icon: BookOpen, label: 'Knowledge level', text: knowledgeCopy },
      { icon: TrendingUp, label: 'Leverage', text: leverageCopy },
      { icon: Brain, label: 'Decision style', text: decisionCopy },
    ];
  };

  const getSubtitle = (profile: string) => {
    const p = (profile || '').toUpperCase();
    if (p.includes('CONSERVATIVE')) return 'Safety-focused, with a preference for stable returns.';
    if (p.includes('AGGRESSIVE') || p.includes('OPPORTUNISTIC')) return 'Growth-oriented, comfortable with volatility for higher potential returns.';
    return 'Balanced approach—you like structure with room for growth.';
  };

  const getProfileChips = (scoreData: AssessmentResult['scoreData']) => {
    const profileUpper = (scoreData.profile || '').toUpperCase();
    const knowledge = scoreData.knowledgeLevel ?? 0;
    const risk = scoreData.riskProfile ?? 0;

    const riskChip =
      risk >= 70 ? 'Growth-oriented' : risk >= 40 ? 'Balanced' : 'Safety-focused';
    const knowledgeChip =
      knowledge >= 70 ? 'Advanced' : knowledge >= 40 ? 'Intermediate' : 'Beginner';

    return [
      riskChip,
      knowledgeChip,
      ...(scoreData.investmentHorizon != null && scoreData.investmentHorizon >= 60
        ? ['Long-term focused']
        : []),
    ].slice(0, 3);
  };

  return (
    <PageContainer>
      {resultsLoading && (
        <div className="w-full py-8">
          <LoadingState variant="expanded" showTitle showSubtitle lines={3} />
        </div>
      )}

      {!resultsLoading && (resultsError || !sessionId) && (
        <div className="w-full py-8 space-y-4">
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
      )}

      {!resultsLoading && !resultsError && sessionId && results && (
        <div className="w-full py-6 space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment
            </Button>
          </div>

          {/* Hero: profile + subtitle + chips */}
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {results.scoreData.profile}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-4">
                  {getSubtitle(results.scoreData.profile)}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {getProfileChips(results.scoreData).map((chip) => (
                    <span
                      key={chip}
                      className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                  <span>Overall score</span>
                  <span className="font-semibold text-foreground">
                    {formatScorePercent(results.scoreData.finalScore)}
                  </span>
                  <span>
                    ({(results.scoreData.overallConfidence * 100).toFixed(0)}% confidence)
                  </span>
                </div>
              </div>

              {/* Scores at a glance */}
              <div className="border-t pt-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Your scores at a glance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Risk', value: results.scoreData.riskProfile },
                    { label: 'Knowledge', value: results.scoreData.knowledgeLevel },
                    { label: 'Leverage', value: results.scoreData.leverageAptitude },
                    { label: 'Capacity', value: results.scoreData.riskCapacity },
                    { label: 'Decision', value: results.scoreData.decisionStyleScore },
                    { label: 'Personality', value: results.scoreData.personalityScore },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg border bg-muted/30 p-3 space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground">{label}</span>
                        <span className="text-sm font-bold">{formatScorePercent(value ?? 0)}</span>
                      </div>
                      <Progress value={value ?? 0} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* What this means - short bullets */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-sm font-semibold text-foreground mb-3">What this means for you</h2>
                <ul className="space-y-3">
                  {getInsightBullets(results.scoreData).map(({ icon: Icon, label, text }) => (
                    <li key={label} className="flex gap-3 text-sm">
                      <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-md bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{label}</span>
                        <span className="text-muted-foreground"> — {text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                <Button
                  onClick={handleGoToDashboard}
                  className="flex-1 gap-2"
                >
                  Go to Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleStartLearning}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Start Learning Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

export default AssessmentResults;
