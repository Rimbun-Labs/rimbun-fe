
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import RiskProfileChart from './RiskProfileChart';
import { ChevronRight } from 'lucide-react';

interface EducationalInsightsProps {
  profile: any;
  portfolioData: any;
  profileLoading: boolean;
  portfolioLoading: boolean;
}

const EducationalInsights: React.FC<EducationalInsightsProps> = ({
  profile,
  portfolioData,
  profileLoading,
  portfolioLoading
}) => {
  // Get risk profile readable name
  const getReadableProfile = (profileType: string = ""): string => {
    return profileType
      .replace(/_/g, '-')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Investment Profile</CardTitle>
        <CardDescription>Key insights to guide your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Risk Profile Visualization */}
          <div className="h-[240px]">
            {profileLoading ? (
              <Skeleton className="h-full w-full" />
            ) : profile ? (
              <RiskProfileChart data={{
                riskProfile: profile.scoreData.riskProfile,
                knowledgeLevel: profile.scoreData.knowledgeLevel,
                leverageAptitude: profile.scoreData.leverageAptitude,
                decisionStyleScore: profile.scoreData.decisionStyleScore,
                personalityScore: profile.scoreData.personalityScore
              }} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No profile data available</p>
              </div>
            )}
          </div>
          
          {/* Educational Explanation */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3">What This Means</h3>
            
            {profileLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : profile ? (
              <>
                <div className="text-sm">
                  <p className="mb-2">
                    Your profile is classified as <span className="font-medium">{getReadableProfile(profile.scoreData.profile)}</span>, with a 
                    risk tolerance score of <span className="font-medium">{profile.scoreData.riskProfile}</span> and 
                    knowledge level of <span className="font-medium">{profile.scoreData.knowledgeLevel}</span>.
                  </p>
                  <p>
                    This means you're likely comfortable with {profile.scoreData.profile === "CONSERVATIVE" ? "lower" : 
                      profile.scoreData.profile === "AGGRESSIVE" ? "higher" : "moderate"} levels of investment risk.
                    Your learning recommendations are tailored to your current knowledge level.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {profile.scoreData.profile === "CONSERVATIVE" ? "Safety-focused" : 
                      profile.scoreData.profile === "AGGRESSIVE" ? "Growth-oriented" : "Balanced approach"}
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {profile.scoreData.knowledgeLevel < 40 ? "Beginner" : 
                      profile.scoreData.knowledgeLevel < 70 ? "Intermediate" : "Advanced"} knowledge
                  </div>
                </div>
              </>
            ) : (
              <p>No profile data available</p>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="mt-2" asChild>
            <Link to="/assessment/results">
              View Full Profile <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalInsights;
