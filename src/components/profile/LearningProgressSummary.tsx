
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const LearningProgressSummary = () => {
  const { profile, isLoading } = useProfile();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  if (!profile) return null;
  
  const { learningProgress } = profile;
  const progressPercentage = Math.round(
    (learningProgress.completedModules / learningProgress.totalModules) * 100
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <div className="flex-1">
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Track your financial education journey</CardDescription>
        </div>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{learningProgress.completedModules} of {learningProgress.totalModules} modules completed</span>
            <span>{learningProgress.totalModules - learningProgress.completedModules} remaining</span>
          </div>
        </div>
        
        {learningProgress.currentModule && (
          <div className="bg-primary/5 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                Current Module
              </h3>
              <Badge variant="outline" className="bg-primary/10">In Progress</Badge>
            </div>
            <p className="text-sm">{learningProgress.currentModule}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Recently Completed</h3>
          {learningProgress.completedModules > 0 ? (
            <div className="space-y-2">
              {[...Array(Math.min(2, learningProgress.completedModules))].map((_, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Module {i + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No modules completed yet</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/learning">Continue Learning</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningProgressSummary;
