
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ActionItemsProps {
  recommendations: any[];
  loading: boolean;
}

const ActionItems: React.FC<ActionItemsProps> = ({ recommendations, loading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Action Items</CardTitle>
        <CardDescription>Recommended next steps for your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="mt-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div key={rec.id} className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-medium text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{rec.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No action items available</p>
          )}

          <div className="flex gap-3 items-start mt-6 pt-4 border-t">
            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-medium text-sm">
              {(recommendations.length || 0) + 1}
            </div>
            <div>
              <h4 className="font-medium">Complete Your First Module</h4>
              <p className="text-sm text-muted-foreground mt-0.5">Continue your investment education by completing the "Investment Basics" module</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link to="/recommendations">
            View All Recommendations <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionItems;
