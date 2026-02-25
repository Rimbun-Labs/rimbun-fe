import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import RiskProfileChart from './RiskProfileChart';

interface ProfileData {
  profile: string;
  finalScore: number;
  riskProfile: number;
  knowledgeLevel: number;
  leverageAptitude: number;
  decisionStyleScore: number;
  personalityScore: number;
  riskCapacity: number;
  investmentHorizon: number;
  confidenceMetrics?: {
    riskProfileConfidence: number;
    knowledgeLevelConfidence: number;
    leverageAptitudeConfidence: number;
    decisionStyleConfidence: number;
    personalityConfidence: number;
    riskCapacityConfidence: number;
  };
}

interface EducationalInsightsProps {
  profile: ProfileData | undefined;
  profileLoading: boolean;
}

const EducationalInsights: React.FC<EducationalInsightsProps> = ({
  profile,
  profileLoading,
}) => {
  const [chartExplanationOpen, setChartExplanationOpen] = useState(false);

  if (profileLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  const getReadableProfile = (profileName: string): string => {
    return profileName.split(/[\s_]+/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const profileUpper = (profile.profile || '').toUpperCase();
  const riskLabel =
    profileUpper.includes('CONSERVATIVE') ? 'Safety-focused' :
    profileUpper.includes('AGGRESSIVE') || profileUpper.includes('OPPORTUNISTIC') ? 'Growth-oriented' :
    'Balanced approach';
  const knowledgeLabel =
    profile.knowledgeLevel < 40 ? 'Beginner' :
    profile.knowledgeLevel < 70 ? 'Intermediate' : 'Advanced';

  const explanationItems = [
    {
      key: 'Risk Profile',
      short: 'Comfort with market ups and downs',
      detail: 'How much volatility you can tolerate; higher means you’re more comfortable with swings for potential growth.',
    },
    {
      key: 'Knowledge',
      short: 'Where you are on your investing journey',
      detail: 'Your grasp of concepts and terms; we tailor learning and product explanations to this level.',
    },
    {
      key: 'Leverage',
      short: 'Comfort with borrowing to invest',
      detail: 'Whether using margin or loans to invest fits your style; higher means you’re more open to it when appropriate.',
    },
    {
      key: 'Decision Style',
      short: 'How you like to make choices',
      detail: 'Data-driven vs instinct; we emphasize metrics and comparisons or keep things concise accordingly.',
    },
    {
      key: 'Personality',
      short: 'How you approach money day to day',
      detail: 'Your natural tendencies with risk and planning; this shapes how we phrase recommendations.',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Your Investment Profile</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tailored to your risk, knowledge, and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Profile + chips (compact) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">You're a</span>
          <span className="font-semibold text-primary">{getReadableProfile(profile.profile)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {riskLabel}
          </span>
          <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {knowledgeLabel} knowledge
          </span>
        </div>

        {/* Radar chart - scores visible on hover via tooltip */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <RiskProfileChart
            data={profile}
            confidenceMetrics={profile.confidenceMetrics}
          />
        </div>

        {/* How to read this chart - collapsible, collapsed by default; theme-aligned */}
        <Collapsible open={chartExplanationOpen} onOpenChange={setChartExplanationOpen}>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-between p-4 h-auto font-medium hover:bg-primary/5 ${chartExplanationOpen ? 'text-primary border-l-2 border-primary' : 'text-foreground border-l-2 border-transparent'}`}
              >
                How to read this chart
                {chartExplanationOpen ? (
                  <ChevronUp className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border">
                <p className="text-sm text-muted-foreground pt-3">
                  Each axis is one dimension of your profile; the number is your score (0–100). The shape shows your balance across these five areas—we use it to tailor learning, banking products, and investment ideas to you.
                </p>
                <ul className="space-y-3 text-sm">
                  {explanationItems.map((item) => (
                    <li key={item.key} className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">{item.key}</span>
                      <span className="text-muted-foreground">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default EducationalInsights;
