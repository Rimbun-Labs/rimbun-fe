import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { learningPathsContent, assetClassImages } from '@/data/learning-paths';
import { metricContent, MetricCategory } from '@/data/metrics';
import { ModuleCard } from './ModuleCard';

interface LearningFolder {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const folders: Record<string, LearningFolder> = {
  'asset-classes': {
    id: 'asset-classes',
    title: 'Asset Classes',
    description: 'Learn about different types of investments and their characteristics',
    icon: <BookOpen className="h-6 w-6" />
  }
  // We can add more folders here later
};

export const LearningFolderView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const folder = folders[folderId || ''];
  
  if (!folder) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Folder not found</h1>
          <Button 
            variant="link" 
            onClick={() => navigate('/learning')}
            className="mt-4"
          >
            Return to Learning Library
          </Button>
        </div>
      </div>
    );
  }

  // Get modules for this folder
  const modules = folderId === 'asset-classes' 
    ? Object.entries(learningPathsContent).map(([assetClass, content]) => ({
        id: assetClass,
        title: content.title,
        description: content.description,
        progress: 0, // We'll calculate this from localStorage
        totalLessons: content.sections.length + content.keyMetrics.length,
        completedLessons: 0, // We'll calculate this from localStorage
        duration: content.sections.length * 5,
        difficulty: content.sections[0].difficulty.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        isLocked: false,
        imageUrl: assetClassImages[assetClass as keyof typeof assetClassImages] || assetClassImages.equities,
        metrics: content.keyMetrics.map(metric => ({
          name: metric,
          category: metricContent[metric] ? Object.keys(metricContent[metric])[0] as MetricCategory : 'Growth',
          isRecommended: false
        }))
      }))
    : [];

  // Calculate progress for each module
  React.useEffect(() => {
    modules.forEach(module => {
      const savedProgress = localStorage.getItem(`learning-library-progress-${module.id}`);
      if (savedProgress) {
        try {
          const { completedSections = [], completedMetrics = [] } = JSON.parse(savedProgress);
          module.completedLessons = completedSections.length + completedMetrics.length;
          module.progress = Math.round((module.completedLessons / module.totalLessons) * 100);
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    });
  }, []);

  // Filter modules based on search query
  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-7xl py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/learning')}
              className="hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{folder.title}</h1>
              <p className="text-muted-foreground mt-1">
                {folder.description}
              </p>
            </div>
          </div>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-border">
          <CardHeader className="bg-gradient-to-b from-background to-muted/50">
            <CardTitle className="text-xl">Overall Progress</CardTitle>
            <CardDescription>
              Track your learning journey across all {folder.title} modules
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Completion</span>
                <span className="font-medium">
                  {Math.round(
                    modules.reduce((acc, m) => acc + m.progress, 0) / 
                    modules.length || 0
                  )}%
                </span>
              </div>
              <Progress 
                value={
                  modules.reduce((acc, m) => acc + m.progress, 0) / 
                  modules.length || 0
                } 
                className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{modules.filter(m => m.progress === 100).length} of {modules.length} modules completed</span>
                <span>{modules.length - modules.filter(m => m.progress === 100).length} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => navigate(`/learning/${folderId}/${module.id}`)}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No modules found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 