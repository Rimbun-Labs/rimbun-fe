
import React from 'react';
import ModuleCard from '@/components/learning/ModuleCard';
import { mockLearningModules } from '@/lib/mock/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Learning: React.FC = () => {
  const modules = mockLearningModules;
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const completedModules = modules.filter(module => module.progress === 100);
  const inProgressModules = modules.filter(module => module.progress > 0 && module.progress < 100);
  const notStartedModules = modules.filter(module => module.progress === 0);
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Center</h1>
        <p className="text-muted-foreground mb-6">
          Expand your financial knowledge with our curated learning modules.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search modules..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Module Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {searchQuery && <p>Showing results for "{searchQuery}"</p>}
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                progress={module.progress}
                totalLessons={module.totalLessons}
                completedLessons={module.completedLessons}
                imageUrl={module.imageUrl}
              />
            ))}
          </div>
          
          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No modules found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressModules
              .filter(module => 
                searchQuery === '' || 
                module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                module.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  progress={module.progress}
                  totalLessons={module.totalLessons}
                  completedLessons={module.completedLessons}
                  imageUrl={module.imageUrl}
                />
              ))}
          </div>
          
          {inProgressModules.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No modules in progress</h3>
              <p className="text-muted-foreground">Start learning to see modules here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedModules
              .filter(module => 
                searchQuery === '' || 
                module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                module.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  progress={module.progress}
                  totalLessons={module.totalLessons}
                  completedLessons={module.completedLessons}
                  imageUrl={module.imageUrl}
                />
              ))}
          </div>
          
          {completedModules.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No completed modules</h3>
              <p className="text-muted-foreground">Complete modules to see them here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="not-started" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notStartedModules
              .filter(module => 
                searchQuery === '' || 
                module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                module.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  progress={module.progress}
                  totalLessons={module.totalLessons}
                  completedLessons={module.completedLessons}
                  imageUrl={module.imageUrl}
                />
              ))}
          </div>
          
          {notStartedModules.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No modules available</h3>
              <p className="text-muted-foreground">Check back later for new content</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Learning;
