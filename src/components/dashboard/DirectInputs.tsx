import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DirectInputsProps {
  inputs: {
    [key: string]: string | number;
  };
  loading?: boolean;
}

const DirectInputs: React.FC<DirectInputsProps> = ({ inputs, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inputs || Object.keys(inputs).length === 0) {
    return null;
  }

  const formatLabel = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assessment Inputs</CardTitle>
        <CardDescription>Your responses from the assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(inputs).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                {formatLabel(key)}
              </h4>
              <p className="text-sm">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectInputs; 