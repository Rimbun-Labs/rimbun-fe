import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { ScoreExplanationDialog } from './ScoreExplanationDialog';
import type { BankingProduct } from '@/lib/api/types/banking';

interface ScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showInfoIcon?: boolean;
  product?: BankingProduct;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-20 h-20 text-base',
};

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
  showInfoIcon = false,
  product,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="50%"
            cy="50%"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={getScoreColor(score)}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}%
          </span>
        </div>
      </div>
      {showInfoIcon && product && (
        <>
          <button
            className="absolute -top-1 -right-1 z-10 rounded-full bg-background border border-border p-0.5 hover:bg-muted transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setDialogOpen(true);
            }}
          >
            <Info className="h-3 w-3 text-muted-foreground" />
          </button>
          <ScoreExplanationDialog 
            product={product} 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </>
      )}
      {showLabel && (
        <span className="ml-2 text-xs text-muted-foreground">Match</span>
      )}
    </div>
  );
};

