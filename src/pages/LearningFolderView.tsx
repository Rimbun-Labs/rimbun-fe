import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import { metricContent, MetricExplanation } from '@/lib/api/types/metricContent';
import { MetricCategory } from '@/lib/api/types/metrics';
import LibraryModuleCard from '@/components/learning/library/LibraryModuleCard';
import MetricLibraryCard from '@/components/learning/library/MetricLibraryCard';
import MetricCategoryFilter from '@/components/learning/library/MetricCategoryFilter';

// Asset class images mapping
const assetClassImages = {
  equities: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000",
  bonds: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=1000",
  realestate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
  cash: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000"
} as const;

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
  },
  'metrics': {
    id: 'metrics',
    title: 'Investment Metrics',
    description: 'Learn about key metrics used in investment analysis',
    icon: <BarChart className="h-6 w-6" />
  }
};

interface MetricModule {
  id: string;
  title: string;
  description: string;
  category: MetricCategory;
  content: MetricExplanation;
}

interface AssetClassModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  imageUrl: string;
  metrics: Array<{
    name: string;
    category: MetricCategory;
  }>;
}

type Module = MetricModule | AssetClassModule;

const LearningFolderView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<MetricCategory[]>([]);

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

  // Get unique categories for metrics
  const categories = React.useMemo(() => {
    if (folderId === 'metrics') {
      return Array.from(new Set(
        Object.values(metricContent).map(metric => metric.category)
      ));
    }
    return [];
  }, [folderId]);

  // Handle category selection
  const handleCategorySelect = (category: MetricCategory | 'all') => {
    if (category === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  // Get modules for this folder
  const modules: Module[] = folderId === 'metrics'
    ? Object.entries(metricContent).map(([metricName, content]) => ({
        id: metricName,
        title: metricName,
        description: content.content.overview,
        category: content.category,
        content: content.content
      }))
    : folderId === 'asset-classes' 
      ? Object.entries(learningPathsContent).map(([assetClass, content]) => ({
          id: assetClass,
          title: content.title,
          description: content.description,
          duration: content.sections.length * 5,
          difficulty: content.sections[0].difficulty.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
          imageUrl: assetClassImages[assetClass as keyof typeof assetClassImages] || assetClassImages.equities,
          metrics: content.keyMetrics.map(metric => ({
            name: metric,
            category: metricContent[metric]?.category || 'Growth'
          }))
        }))
      : [];

  // Filter modules based on search query and selected categories
  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      (folderId === 'metrics' && 'category' in module && selectedCategories.includes(module.category));

    return matchesSearch && matchesCategory;
  });

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
              className="hover:bg-slate-100"
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
              className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Category Filter - Only show for metrics */}
        {folderId === 'metrics' && (
          <MetricCategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
            className="mb-4"
          />
        )}

        {/* Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            folderId === 'metrics' ? (
              <MetricLibraryCard
                key={module.id}
                metric={module as any}
                onStart={() => navigate(`/learning/metrics/${module.id}`)}
              />
            ) : (
              <LibraryModuleCard
                key={module.id}
                module={module as any}
                onStart={() => navigate(`/learning/asset-classes/${module.id}`)}
              />
            )
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No modules found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningFolderView; 