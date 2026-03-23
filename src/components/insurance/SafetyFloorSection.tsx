import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyFloorSectionProps {
  className?: string;
}

/**
 * Placeholder for foundational protection (PA/Travel/Home) not tied to specific goals.
 * Can be wired to NICB/TBA PA/Medical data when available.
 */
export const SafetyFloorSection: React.FC<SafetyFloorSectionProps> = ({ className }) => {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5 text-muted-foreground" />
          Safety floor
        </CardTitle>
        <CardDescription>
          Foundational protection (e.g. PA, Travel, Home) not tied to a specific investment goal
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Personal accident, travel, and medical cover recommendations will appear here when available.
        </p>
      </CardContent>
    </Card>
  );
};
