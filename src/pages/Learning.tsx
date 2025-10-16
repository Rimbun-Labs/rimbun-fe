import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, GraduationCap, Lightbulb, Trophy, BarChart, Leaf, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { metricContent } from '@/lib/api/types/metricContent';

interface LearningFolder {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  moduleCount: number;
}

const folders: LearningFolder[] = [
  {
    id: 'asset-classes',
    title: 'Asset Classes',
    description: 'Learn about different types of investments and their characteristics',
    icon: <BookOpen className="h-6 w-6" />,
    moduleCount: 4 // Equities, Bonds, Real Estate, Cash
  },
  {
    id: 'metrics',
    title: 'Investment Metrics',
    description: 'Learn about key metrics used in investment analysis',
    icon: <BarChart className="h-6 w-6" />,
    moduleCount: Object.keys(metricContent).length
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Understand risk assessment and portfolio protection strategies',
    icon: <GraduationCap className="h-6 w-6" />,
    moduleCount: 6
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Learn fundamental and technical analysis techniques',
    icon: <Lightbulb className="h-6 w-6" />,
    moduleCount: 8
  },
  {
    id: 'portfolio-optimization',
    title: 'Portfolio Optimization',
    description: 'Master portfolio construction and rebalancing strategies',
    icon: <Trophy className="h-6 w-6" />,
    moduleCount: 5
  },
  {
    id: 'islamic-finance',
    title: 'Islamic Finance',
    description: 'Learn about Sharia-compliant investment principles and ethical finance',
    icon: <Star className="h-6 w-6" />,
    moduleCount: 6
  },
  {
    id: 'esg-investing',
    title: 'ESG Investing',
    description: 'Explore Environmental, Social, and Governance investing principles',
    icon: <Leaf className="h-6 w-6" />,
    moduleCount: 7
  }
];

const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredFolders = folders.filter(folder =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Center</h1>
        <p className="text-muted-foreground">
          Explore investment concepts and build your financial knowledge
        </p>
      </div>

      {/* Learning Paths */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-none">
          {filteredFolders.map((folder) => (
            <Card 
              key={folder.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer w-full"
              onClick={() => navigate(`/learning/${folder.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  {/* Folder Icon */}
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    {folder.icon}
                  </div>

                  {/* Folder Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{folder.title}</h3>
                    <p className="text-sm text-muted-foreground">{folder.description}</p>
                  </div>

                  {/* Module Count */}
                  <div className="mt-4 text-sm text-muted-foreground">
                    {folder.moduleCount} modules available
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No folders found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
