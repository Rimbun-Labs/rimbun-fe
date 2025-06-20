import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, GraduationCap, Lightbulb, Trophy, BarChart } from 'lucide-react';
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
  }
  // We can add more folders here later
];

const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredFolders = folders.filter(folder =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-7xl py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Learning Library</h1>
            <p className="text-muted-foreground mt-1">
              Explore our comprehensive learning resources
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learning content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map((folder) => (
            <Card 
              key={folder.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer"
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
