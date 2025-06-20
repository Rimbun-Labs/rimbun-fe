import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { metricContent } from '@/lib/api/types/metricContent';
import { MetricCategory } from '@/lib/api/types/metrics';
import { getCategoryDisplayName } from '@/lib/constants/displayNames';
import { getCategoryColor } from '@/utils/metrics';
import { cn } from '@/lib/utils';
import { PracticeQuestion } from '../quiz/PracticeQuestion';

const MetricLibraryDetail: React.FC = () => {
  const { metricId } = useParams<{ metricId: string }>();
  const navigate = useNavigate();

  if (!metricId || !metricContent[metricId]) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Metric not found</h1>
          <Button 
            variant="link" 
            onClick={() => navigate('/learning/metrics')}
            className="mt-4"
          >
            Return to Metrics Library
          </Button>
        </div>
      </div>
    );
  }

  const metric = metricContent[metricId];
  const { category, content } = metric;

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/learning/metrics')}
              className="hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{metricId}</h1>
                <Badge variant="outline" className={getCategoryColor(category)}>
                  {getCategoryDisplayName(category)}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {content.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-foreground">{content.overview}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <p className="text-foreground">{content.details}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Practice Question</h2>
              <PracticeQuestion
                data={content.practiceQuestion}
                mode="library"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricLibraryDetail; 