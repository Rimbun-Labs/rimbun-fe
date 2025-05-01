
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import RiskProfileChart from './RiskProfileChart';

interface RiskProfileSectionProps {
  profile: any;
  profileLoading: boolean;
}

const RiskProfileSection: React.FC<RiskProfileSectionProps> = ({ profile, profileLoading }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Risk Profile</CardTitle>
        <CardDescription>Based on your assessment responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          {profileLoading ? (
            <div className="h-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : profile ? (
            <RiskProfileChart data={profile} confidenceMetrics={profile.confidenceMetrics} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>No risk profile data available</p>
            </div>
          )}
        </div>
      </CardContent>
      {profile && (
        <CardFooter className="border-t border-border/40 pt-4">
          <p className="text-sm text-muted-foreground">
            Profile: <span className="font-medium">{profile?.profile || 'Unknown'}</span> • 
            Final Score: <span className="font-medium">{profile?.finalScore || 'N/A'}</span>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default RiskProfileSection;
