import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MetricCategory } from '@/lib/api/types/metrics';
import { getCategoryDisplayName } from '@/lib/constants/displayNames';
import { getCategoryColor } from '@/utils/metrics';
import { MetricExplanation } from '@/lib/api/types/metricContent';

// Category-based images for metrics
const categoryImages = {
  Growth: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  Risk: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000",
  Income: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000",
  Value: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=1000",
  Technical: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
  Valuation: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=1000",
  Return: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  Cost: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000",
  'ETF Liquidity': "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
  Liquidity: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
  Performance: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
} as const;

interface MetricLibraryCardProps {
  metric: {
    id: string;
    title: string;
    description: string;
    category: MetricCategory;
    content: MetricExplanation;
  };
  onStart: () => void;
}

const MetricLibraryCard: React.FC<MetricLibraryCardProps> = ({ metric, onStart }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* Header with image and badges */}
          <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
            <img 
              src={categoryImages[metric.category]} 
              alt={metric.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className={getCategoryColor(metric.category)}>
                {getCategoryDisplayName(metric.category)}
              </Badge>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-semibold text-foreground">{metric.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{metric.description}</p>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            className="w-full mt-auto group-hover:bg-muted"
            onClick={onStart}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Start Learning
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricLibraryCard; 