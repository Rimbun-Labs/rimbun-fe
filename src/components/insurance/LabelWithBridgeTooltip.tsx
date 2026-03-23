import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { BRIDGE_EXPLANATIONS } from '@/lib/constants/insuranceEducation';
import { cn } from '@/lib/utils';

interface LabelWithBridgeTooltipProps {
  /** The technical/legal label (e.g. "Waiver of premium") */
  label: string;
  /** Key in BRIDGE_EXPLANATIONS for the (i) tooltip. If missing or no text, no icon is shown. */
  bridgeKey?: string;
  className?: string;
}

/**
 * Renders a label with an optional (i) icon that shows a plain-English bridge explanation on hover/tap.
 * Keeps legal terms in the UI while giving users a "translation" in the tooltip.
 */
export const LabelWithBridgeTooltip: React.FC<LabelWithBridgeTooltipProps> = ({
  label,
  bridgeKey,
  className,
}) => {
  const explanation = bridgeKey ? BRIDGE_EXPLANATIONS[bridgeKey] : undefined;

  if (!explanation) {
    return <span className={cn(className)}>{label}</span>;
  }

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={`Explanation: ${label}`}
            >
              <Info className="h-3.5 w-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{explanation}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
};
