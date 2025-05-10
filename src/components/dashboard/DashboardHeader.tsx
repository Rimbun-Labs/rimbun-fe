
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { BarChart, BookOpen, GraduationCap } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-2 border-b">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Track your investment education progress and get personalized learning recommendations
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
            Continue Learning
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
