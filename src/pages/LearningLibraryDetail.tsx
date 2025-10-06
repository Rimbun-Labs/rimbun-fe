import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import { 
  ChevronLeft,
  BookOpen,
  Clock,
  Lightbulb,
  Trophy
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LearningLibraryDetail: React.FC = () => {
  const { folderId, assetClass } = useParams<{ folderId: string; assetClass: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const content = learningPathsContent[assetClass || ''];
  
  if (!content) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold">Module not found</h1>
          <Button 
            variant="link" 
            onClick={() => navigate('/learning/asset-classes')}
            className="mt-4"
          >
            Return to Asset Classes
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const renderSectionContent = (content: string) => {
    const paragraphs = content.split('. ').filter(p => p.trim());
    const keyPoints = paragraphs.filter(p => 
      p.includes('`') || 
      p.toLowerCase().includes('for example') ||
      p.toLowerCase().includes('like') ||
      /\d+%/.test(p)
    );
    const practicalTips = paragraphs.filter(p => 
      p.toLowerCase().includes('try') ||
      p.toLowerCase().includes('learn') ||
      p.toLowerCase().includes('use')
    );

    return (
      <div className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="text-foreground leading-relaxed">
            {paragraphs[0]}
          </p>
        </div>

        {keyPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key Points & Examples
            </h4>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {practicalTips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Practical Tips
            </h4>
            <ul className="space-y-2">
              {practicalTips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/learning/asset-classes')}
                className="hover:bg-accent"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <p className="text-muted-foreground mt-1">
                  {content.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card shadow rounded-lg overflow-hidden">
            <Card className="border-border">
              <CardHeader className="bg-gradient-to-b from-card to-muted/50">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-3xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {content.title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 text-muted-foreground">
                      {content.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {content.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-card rounded-lg border border-border overflow-hidden"
                    >
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedSections(prev => 
                          prev.includes(index) 
                            ? prev.filter(i => i !== index)
                            : [...prev, index]
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground">{section.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  getDifficultyColor(section.difficulty)
                                )}
                              >
                                {section.difficulty}
                              </Badge>
                              {section.relatedMetrics && (
                                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                                  {section.relatedMetrics.length} metrics
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {expandedSections.includes(index) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4"
                          >
                            {renderSectionContent(section.content)}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryDetail; 