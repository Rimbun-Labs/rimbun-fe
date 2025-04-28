
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radar } from "lucide-react";

interface ProfileDeterminationProps {
  profile: string;
  finalScore: number;
  confidenceMetrics: {
    riskProfileConfidence: number;
    knowledgeLevelConfidence: number;
    leverageAptitudeConfidence: number;
    decisionStyleConfidence: number;
    personalityConfidence: number;
  };
}

const ProfileDetermination: React.FC<ProfileDeterminationProps> = ({
  profile,
  finalScore,
  confidenceMetrics
}) => {
  // Calculate average confidence
  const confidenceValues = Object.values(confidenceMetrics);
  const avgConfidence = confidenceValues.reduce((sum, val) => sum + val, 0) / confidenceValues.length;
  const avgConfidencePercentage = Math.round(avgConfidence * 100);
  
  const getProfileDescription = (profileType: string): string => {
    switch(profileType) {
      case "CONSERVATIVE":
        return "You prefer stability and are more concerned with protecting your investment than growth. You're uncomfortable with significant market fluctuations.";
      case "MODERATE_CONSERVATIVE":
        return "You value security but are willing to accept some risk for better returns. You can tolerate mild market fluctuations for moderate growth.";
      case "MODERATE":
        return "You balance risk and return, seeking moderate growth while limiting extreme volatility. You can handle some market fluctuations.";
      case "MODERATE_AGGRESSIVE":
        return "You focus on growth and can accept higher volatility. You understand market fluctuations are part of investing for better long-term returns.";
      case "AGGRESSIVE":
        return "You prioritize maximum growth and can tolerate significant volatility. You have a long-term outlook and can withstand substantial market fluctuations.";
      default:
        return "Your investment profile balances your risk tolerance, knowledge level, and investment goals to create a suitable strategy.";
    }
  };
  
  const getProfileColor = (profileType: string): string => {
    switch(profileType) {
      case "CONSERVATIVE":
        return "bg-blue-100 text-blue-800";
      case "MODERATE_CONSERVATIVE":
        return "bg-cyan-100 text-cyan-800";
      case "MODERATE":
        return "bg-green-100 text-green-800";
      case "MODERATE_AGGRESSIVE":
        return "bg-amber-100 text-amber-800";
      case "AGGRESSIVE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getReadableProfile = (profileType: string): string => {
    return profileType
      .replace(/_/g, '-')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Investment Profile</CardTitle>
          <Badge className={getProfileColor(profile)}>
            {getReadableProfile(profile)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Radar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="font-medium">Final Score: {finalScore}/100</div>
              <div className="text-sm text-muted-foreground">
                Overall confidence: {avgConfidencePercentage}%
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {getProfileDescription(profile)}
          </p>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Profile Characteristics:</h4>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                </span>
                <span>Risk tolerance: {profile === "CONSERVATIVE" ? "Low" : profile === "AGGRESSIVE" ? "High" : "Medium"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                </span>
                <span>Time horizon: {profile === "CONSERVATIVE" ? "Short" : profile === "AGGRESSIVE" ? "Long" : "Medium"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                </span>
                <span>Investment focus: {
                  profile === "CONSERVATIVE" 
                    ? "Capital preservation" 
                    : profile === "AGGRESSIVE" 
                      ? "Maximum growth" 
                      : "Balanced growth"
                }</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetermination;
