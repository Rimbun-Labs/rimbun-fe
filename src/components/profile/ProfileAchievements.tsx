
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ProfileAchievements = () => {
  const { profile, isLoading } = useProfile();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) return null;
  
  const { achievements } = profile.learningProgress;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <div className="flex-1">
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            You've unlocked {unlockedCount} of {achievements.length} achievements
          </CardDescription>
        </div>
        <Trophy className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={cn(
                "border rounded-lg p-4 transition-all",
                achievement.unlocked ? "bg-primary/5" : "opacity-60 bg-secondary/30"
              )}
            >
              <div className="flex gap-3 items-start">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  achievement.unlocked 
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{achievement.name}</h3>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-[10px]">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs font-medium">
                      Achieved on {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAchievements;
