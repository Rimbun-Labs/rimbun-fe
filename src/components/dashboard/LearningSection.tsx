
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import LearningProgress from './LearningProgress';

interface LearningSectionProps {
  completedModules: number;
  totalModules: number;
  currentModule?: {
    id: string;
    title: string;
    progress: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
  }>;
  loading: boolean;
}

const LearningSection: React.FC<LearningSectionProps> = ({
  completedModules,
  totalModules,
  currentModule,
  achievements,
  loading
}) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Learning Progress</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/learning')}>
          View Courses
        </Button>
      </div>
      
      {loading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <LearningProgress 
          completedModules={completedModules}
          totalModules={totalModules}
          currentModule={currentModule && {
            id: currentModule.id,
            name: currentModule.title,
            progress: currentModule.progress
          }}
          achievements={achievements}
        />
      )}
    </div>
  );
};

export default LearningSection;
