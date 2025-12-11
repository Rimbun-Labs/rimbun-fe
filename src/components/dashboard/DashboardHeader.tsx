import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useParams } from 'react-router-dom';
import { BarChart, BookOpen, Lightbulb, MoreHorizontal, TrendingUp } from 'lucide-react';
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
    <div className="space-y-6 pb-6 mb-6 border-b border-border">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Wealth Planning Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete your assessment, learn, and start planning your financial future
          </p>
        </div>
        <div className="flex items-center gap-3">
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
                <Link to={session?.id ? `/learning-path/${session.id}` : '/learning'} className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Continue Learning
                </Link>
              </DropdownMenuItem>
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
    </div>
  );
};

export default DashboardHeader;
