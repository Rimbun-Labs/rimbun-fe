
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
      <div>
        <h1 className="text-3xl font-bold">Your Financial Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and portfolio insights</p>
      </div>
      <Button onClick={() => navigate('/assessment')}>
        Retake Assessment
      </Button>
    </div>
  );
};

export default DashboardHeader;
