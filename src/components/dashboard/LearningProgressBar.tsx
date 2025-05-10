
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from 'lucide-react';

interface LearningProgressBarProps {
  completedModules: number;
  totalModules: number;
  loading: boolean;
}

const LearningProgressBar: React.FC<LearningProgressBarProps> = ({
  completedModules,
  totalModules,
  loading
}) => {
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your education journey</CardDescription>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>{completedModules} of {totalModules} modules completed</span>
              <span>{totalModules - completedModules} remaining</span>
            </div>
          </div>
        )}

        {!loading && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Next Module:</h4>
            <div className="bg-accent/50 p-3 rounded-md">
              <div className="font-medium">Portfolio Diversification</div>
              <div className="text-xs text-muted-foreground">
                Learn how to balance your investments across different assets
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link to="/learning">
            Go to Learning Center <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningProgressBar;
