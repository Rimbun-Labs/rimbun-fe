import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import type { FundProfileFitDto } from '@/lib/api/types/funds';
import { fundFitScoreToPercent } from '@/lib/utils/fundFormatters';

interface FundScoreIndicatorProps {
  /** Score 0–100 (use fundFitScoreToPercent(profileFit.score) when passing from API) */
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showInfoIcon?: boolean;
  /** When provided and showInfoIcon, opens dialog with reasons and matchDetails */
  profileFit?: FundProfileFitDto | null;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-20 h-20 text-base',
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

/** Dialog content for fund profile fit explanation */
function FundProfileFitExplanationDialog({
  profileFit,
  open,
  onOpenChange,
}: {
  profileFit: FundProfileFitDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const scorePct = fundFitScoreToPercent(profileFit.score);
  const details = profileFit.matchDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Score Explanation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(scorePct)}`}>
              {scorePct}%
            </div>
            <p className="text-sm text-muted-foreground">Overall match to your profile</p>
          </div>
          {profileFit.reasons.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Why this fund fits</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {profileFit.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="font-semibold text-sm">Breakdown</h4>
            <div className="space-y-2 text-sm">
              {details.risk && (
                <div>
                  <span className="font-medium text-foreground">Risk: </span>
                  <span className={details.risk.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                    {details.risk.reason}
                  </span>
                </div>
              )}
              {details.horizon && (
                <div>
                  <span className="font-medium text-foreground">Horizon: </span>
                  <span className={details.horizon.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                    {details.horizon.reason}
                  </span>
                </div>
              )}
              {details.shariah != null && (
                <div>
                  <span className="font-medium text-foreground">Shariah: </span>
                  <span className={details.shariah.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                    {details.shariah.reason}
                  </span>
                </div>
              )}
              {details.assetClassAlignment != null && (
                <div>
                  <span className="font-medium text-foreground">Asset class: </span>
                  <span className={details.assetClassAlignment.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                    {details.assetClassAlignment.reason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Circular match score indicator for funds (aligned with banking ScoreIndicator) */
export const FundScoreIndicator: React.FC<FundScoreIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
  showInfoIcon = false,
  profileFit,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="18"
            cy="18"
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
      {(showLabel || (showInfoIcon && profileFit)) && (
        <div className="flex items-center gap-1.5 min-h-[1.5rem]">
          {showLabel && (
            <span className="text-sm text-muted-foreground font-medium">Match</span>
          )}
          {showInfoIcon && profileFit && (
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
              aria-label="Match score explanation"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {showInfoIcon && profileFit && (
        <FundProfileFitExplanationDialog
          profileFit={profileFit}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
};
