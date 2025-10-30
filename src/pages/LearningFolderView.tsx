import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, BarChart, GraduationCap, Lightbulb, Trophy, Star, Leaf, Heart, Wallet, TrendingUp, Globe2, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import { metricContent, MetricExplanation } from '@/lib/api/types/metricContent';
import { MetricCategory } from '@/lib/api/types/metrics';
import LibraryModuleCard from '@/components/learning/library/LibraryModuleCard';
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
  },
  'risk-management': {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Understand risk assessment and portfolio protection strategies',
    icon: <GraduationCap className="h-6 w-6" />
  },
  'market-analysis': {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Learn fundamental and technical analysis techniques',
    icon: <Lightbulb className="h-6 w-6" />
  },
  'portfolio-optimization': {
    id: 'portfolio-optimization',
    title: 'Portfolio Optimization',
    description: 'Master portfolio construction and rebalancing strategies',
    icon: <Trophy className="h-6 w-6" />
  },
  'islamic-finance': {
    id: 'islamic-finance',
    title: 'Islamic Finance',
    description: 'Learn about Sharia-compliant investment principles and ethical finance',
    icon: <Star className="h-6 w-6" />
  },
  'esg-investing': {
    id: 'esg-investing',
    title: 'ESG Investing',
    description: 'Explore Environmental, Social, and Governance investing principles',
    icon: <Leaf className="h-6 w-6" />
  },
  'retirement-planning': {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Build your retirement strategy with systematic savings and smart withdrawal planning',
    icon: <Heart className="h-6 w-6" />
  },
  'financial-planning': {
    id: 'financial-planning',
    title: 'Financial Planning',
    description: 'Build a solid financial foundation before investing',
    icon: <Wallet className="h-6 w-6" />
  },
  'value-growth-investing': {
    id: 'value-growth-investing',
    title: 'Value vs Growth Investing',
    description: 'Compare different investment styles and learn when to use each strategy',
    icon: <TrendingUp className="h-6 w-6" />
  },
  'economic-fundamentals': {
    id: 'economic-fundamentals',
    title: 'Economic Fundamentals',
    description: 'Understand how economic factors affect your investments',
    icon: <Globe2 className="h-6 w-6" />
  },
  'behavioral-finance': {
    id: 'behavioral-finance',
    title: 'Behavioral Finance',
    description: 'Master the psychology of investing to avoid common mistakes',
    icon: <Brain className="h-6 w-6" />
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
      <div className="w-full py-8">
        <div className="w-full">
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
    ? Object.entries(learningPathsContent)
        .filter(([key]) => [
          'historicalReturn', 'appreciation', 'volatility', 'beta', 'peRatio', 'dividendYield',
          'sharpeRatio', 'trackingError', 'expenseRatio', 'creditRating', 'duration', 'ytm',
          'couponRate', 'aum', 'tradingVolume', 'capRate', 'cashFlow', 'noi', 'accessibility',
          'interestRate', 'inflationRisk'
        ].includes(key))
        .map(([metricName, content]) => ({
          id: metricName,
          title: content.title,
          description: content.description,
          duration: content.sections.length * 5,
          difficulty: content.sections[0].difficulty.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
          imageUrl: assetClassImages.equities, // Use default image for metrics
          metrics: content.keyMetrics.map(metric => ({
            name: metric,
            category: metricContent[metric]?.category || 'Growth'
          }))
        }))
    : folderId === 'asset-classes' 
      ? Object.entries(learningPathsContent)
          .filter(([key]) => ['equities', 'bonds', 'realestate', 'cash'].includes(key))
          .map(([assetClass, content]) => ({
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
    : folderId === 'islamic-finance' || folderId === 'esg-investing'
      ? Object.entries(learningPathsContent)
          .filter(([key]) => key === folderId.replace('-', ''))
          .map(([assetClass, content]) => ({
            id: assetClass,
            title: content.title,
            description: content.description,
            duration: content.sections.length * 5,
            difficulty: content.sections[0].difficulty.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
            imageUrl: assetClassImages.equities, // Use default image for now
            metrics: content.keyMetrics.map(metric => ({
              name: metric,
              category: metricContent[metric]?.category || 'Growth'
            }))
          }))
    : ['risk-management', 'market-analysis', 'portfolio-optimization', 'retirement-planning', 'financial-planning', 'value-growth-investing', 'economic-fundamentals', 'behavioral-finance'].includes(folderId)
      ? Object.entries(learningPathsContent)
          .filter(([key]) => key === folderId)
          .map(([assetClass, content]) => ({
            id: assetClass,
            title: content.title,
            description: content.description,
            duration: content.sections.length * 5,
            difficulty: content.sections[0].difficulty.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
            imageUrl: assetClassImages.equities, // Use default image for now
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
            <LibraryModuleCard
              key={module.id}
              module={module as any}
              onStart={() => navigate(`/learning/${folderId}/${module.id}`)}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">No modules found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningFolderView; 