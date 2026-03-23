import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Shield, TrendingUp, Percent } from 'lucide-react';
import type { PurposeStatus, PurposeId } from '@/lib/api/types/needsAndGaps';
import { cn } from '@/lib/utils';

const PURPOSE_LABELS: Record<PurposeId, string> = {
  liquidity_buffer: 'Liquidity buffer',
  protection_human_capital: 'Protection',
  growth_long_term: 'Growth',
  fee_optimization: 'Fees',
};

const PURPOSE_ICONS: Record<PurposeId, React.ElementType> = {
  liquidity_buffer: Target,
  protection_human_capital: Shield,
  growth_long_term: TrendingUp,
  fee_optimization: Percent,
};

function getCoverageStyle(isCovered: boolean, coveragePercent: number): string {
  if (isCovered || coveragePercent >= 1) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
  if (coveragePercent >= 0.5) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
  return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
}

interface PurposeScorecardProps {
  purposeStatus: PurposeStatus[];
}

export const PurposeScorecard: React.FC<PurposeScorecardProps> = ({ purposeStatus }) => {
  if (!purposeStatus?.length) return null;

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Purpose coverage</CardTitle>
        <CardDescription>
          How well your plan covers each financial purpose
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {purposeStatus.map((purpose) => {
            const label = PURPOSE_LABELS[purpose.purposeId] ?? purpose.purposeId;
            const Icon = PURPOSE_ICONS[purpose.purposeId];
            const styleClass = getCoverageStyle(purpose.isCovered, purpose.coveragePercent);
            const percentDisplay = Math.round(purpose.coveragePercent * 100);
            return (
              <div
                key={purpose.purposeId}
                className={cn(
                  'rounded-lg border p-4 flex flex-col gap-2',
                  styleClass
                )}
              >
                {Icon && (
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                )}
                <div className="text-2xl font-bold">
                  {percentDisplay}%
                </div>
                {purpose.isCovered && (
                  <span className="text-xs font-medium opacity-90">Covered</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurposeScorecard;
