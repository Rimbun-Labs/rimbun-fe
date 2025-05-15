import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen, Target } from "lucide-react";

interface AssetAllocations {
  EQUITIES: number;
  BONDS: number;
  REAL_ESTATE: number;
  CASH: number;
}

interface ActionItemsProps {
  recommendations: AssetAllocations | undefined;
  loading: boolean;
}

const ActionItems: React.FC<ActionItemsProps> = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  const formatAssetName = (name: string) => {
    return name.charAt(0) + name.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investment Allocation</CardTitle>
        <CardDescription>
          Based on your assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(recommendations).map(([asset, percentage]) => (
            <div key={asset} className="flex items-center justify-between">
              <span className="font-medium">{formatAssetName(asset)}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItems;
