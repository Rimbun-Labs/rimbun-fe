import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const EducationalInsights: React.FC<EducationalInsightsProps> = ({ profile, profileLoading }) => {
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

  const getReadableProfile = (profile: string): string => {
    return profile.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Your Investment Profile</CardTitle>
        <CardDescription className="text-muted-foreground dark:text-[hsl(var(--card-description))]">
          Based on your assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Profile Summary</h3>
            <div className="text-sm text-foreground">
              <p className="mb-2">
                Your profile is classified as <span className="font-medium text-primary">{getReadableProfile(profile.profile)}</span>, with a 
                risk tolerance score of <span className="font-medium text-primary">{profile.riskProfile}</span> and 
                knowledge level of <span className="font-medium text-primary">{profile.knowledgeLevel}</span>.
              </p>
              <p className="text-muted-foreground dark:text-[hsl(var(--card-description))]">
                This means you're likely comfortable with {profile.profile === "CONSERVATIVE" ? "lower" : 
                  profile.profile === "AGGRESSIVE" ? "higher" : "moderate"} levels of investment risk.
                Your learning recommendations are tailored to your current knowledge level.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {profile.profile === "CONSERVATIVE" ? "Safety-focused" : 
                  profile.profile === "AGGRESSIVE" ? "Growth-oriented" : "Balanced approach"}
              </div>
              <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {profile.knowledgeLevel < 40 ? "Beginner" : 
                  profile.knowledgeLevel < 70 ? "Intermediate" : "Advanced"} knowledge
              </div>
            </div>
          </div>

          {/* Risk Profile Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Risk Profile Analysis</h3>
            <RiskProfileChart 
              data={profile}
              confidenceMetrics={profile.confidenceMetrics}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalInsights;
