import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useParams } from 'react-router-dom';
import { BarChart, BookOpen, Lightbulb } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

const DashboardHeader = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session } = useSession();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-2 border-b">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <BarChart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Investment Profile</h1>
        </div>
        <p className="text-muted-foreground">
          View your personalized investment recommendations and portfolio allocation
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/assessment">
            <BarChart className="h-4 w-4 mr-2" />
            Retake Assessment
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/learning">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Library
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={session?.id ? `/learning-path/${session.id}` : '/learning'}>
            <Lightbulb className="h-4 w-4 mr-2" />
            View Learning Path
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
