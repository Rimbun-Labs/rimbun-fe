import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useParams } from 'react-router-dom';
import { BarChart, BookOpen, Lightbulb, MoreHorizontal } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session } = useSession();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-6 border-b border-border">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Investment Profile</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          View your personalized investment recommendations and portfolio allocation
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Primary Action */}
        <Button 
          size="lg"
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Link to={session?.id ? `/learning-path/${session.id}` : '/learning'}>
            <Lightbulb className="h-5 w-5 mr-2" />
            Continue Learning
          </Link>
        </Button>

        {/* Secondary Actions in Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-border hover:bg-muted">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/assessment?mode=retake" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Retake Assessment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/learning" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Library
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
