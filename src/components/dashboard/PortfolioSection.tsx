
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { CircleChevronRight } from "lucide-react";
import PortfolioAllocation from './PortfolioAllocation';

interface PortfolioSectionProps {
  portfolioData: any;
  recommendationsData: any;
  portfolioLoading: boolean;
  recommendationsLoading: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  portfolioData, 
  recommendationsData, 
  portfolioLoading,
  recommendationsLoading
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommended Portfolio</CardTitle>
        <CardDescription>Optimal asset allocation based on your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          {portfolioLoading || recommendationsLoading ? (
            <div className="h-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (portfolioData && recommendationsData) ? (
            <PortfolioAllocation 
              allocations={portfolioData} 
              recommendedMetrics={recommendationsData.recommendedMetrics}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>No portfolio data available</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/40 pt-4">
        <Button variant="link" className="ml-auto flex items-center gap-1 p-0">
          Customize Portfolio <CircleChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortfolioSection;
