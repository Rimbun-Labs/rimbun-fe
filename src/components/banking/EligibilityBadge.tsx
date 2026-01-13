import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import type { EligibilityStatus } from '@/lib/api/types/banking';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  showInfoIcon?: boolean;
}

const statusConfig: Record<EligibilityStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  eligible: {
    label: 'Eligible',
    variant: 'default',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  },
  likely_eligible: {
    label: 'Likely Eligible',
    variant: 'secondary',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  may_qualify: {
    label: 'May Qualify',
    variant: 'secondary',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  },
  not_eligible: {
    label: 'Not Eligible',
    variant: 'outline',
    color: 'bg-muted text-muted-foreground',
  },
};

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status,
  showInfoIcon = false,
}) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1">
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
      {showInfoIcon && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-0.5 hover:bg-muted rounded transition-colors">
              <Info className="h-3 w-3 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {status === 'eligible' && 'You meet all requirements for this product'}
              {status === 'likely_eligible' && 'You likely meet most requirements'}
              {status === 'may_qualify' && 'You may qualify with minor adjustments'}
              {status === 'not_eligible' && 'You do not currently meet the requirements'}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

