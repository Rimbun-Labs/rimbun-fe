
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

interface ProgressTrackerProps {
  progress: {
    completed: number;
    total: number;
    currentModule?: string;
    nextModule?: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    unlocked: boolean;
  }>;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  achievements
}) => {
  const percentComplete = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;
    
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Your Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-2xl font-bold">{percentComplete}% Complete</div>
            <div className="text-sm text-muted-foreground">
              {progress.completed} of {progress.total} modules completed
            </div>
          </div>
          
          <Progress value={percentComplete} className="h-2.5" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="font-medium text-sm">Completed</div>
                <div className="text-2xl font-bold">{progress.completed}</div>
                <div className="text-xs text-muted-foreground">modules</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="font-medium text-sm">In Progress</div>
                <div className="text-2xl font-bold">{progress.currentModule ? 1 : 0}</div>
                <div className="text-xs text-muted-foreground">modules</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="font-medium text-sm">Next Up</div>
                <div className="text-2xl font-bold">{progress.nextModule ? 1 : 0}</div>
                <div className="text-xs text-muted-foreground">modules</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-gray-400">
              <CardContent className="p-4">
                <div className="font-medium text-sm">Remaining</div>
                <div className="text-2xl font-bold">{progress.total - progress.completed - (progress.currentModule ? 1 : 0)}</div>
                <div className="text-xs text-muted-foreground">modules</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Current & Next Modules */}
        <div className="space-y-3">
          {progress.currentModule && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm font-medium">Currently Learning</div>
                  <div className="text-xs text-muted-foreground">{progress.currentModule}</div>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link to="/learning/current">
                  Continue
                </Link>
              </Button>
            </div>
          )}
          
          {progress.nextModule && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="text-sm font-medium">Up Next</div>
                  <div className="text-xs text-muted-foreground">{progress.nextModule}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/learning/next">
                  Start
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium text-sm">Achievements</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {unlockedAchievements.length} / {achievements.length} unlocked
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {achievements.slice(0, 3).map((achievement) => (
              <div 
                key={achievement.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded border",
                  achievement.unlocked
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/30"
                    : "bg-gray-50 border-gray-200 opacity-60 dark:bg-gray-800/50 dark:border-gray-700/30"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  achievement.unlocked 
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                )}>
                  <Trophy className="h-4 w-4" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  achievement.unlocked ? "" : "text-muted-foreground"
                )}>
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
          
          {achievements.length > 3 && (
            <div className="mt-2 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/achievements">
                  View All
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
