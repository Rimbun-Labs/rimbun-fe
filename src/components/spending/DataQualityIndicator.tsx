import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { DataQualityMetrics, getQualityColor, getQualityLabel } from '@/utils/dataQuality';

interface DataQualityIndicatorProps {
  quality: DataQualityMetrics;
  showDetails?: boolean;
  compact?: boolean;
}

/**
 * Component to display data quality indicators
 * Shows badge with tooltip explaining data quality
 */
const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({
  quality,
  showDetails = true,
  compact = false,
}) => {
  const colorClass = getQualityColor(quality.level);
  const label = getQualityLabel(quality.level);
  
  // Get icon based on quality level
  const getIcon = () => {
    switch (quality.level) {
      case 'high':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'medium':
        return <Info className="h-3 w-3" />;
      case 'low':
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  // Format missing months for display
  const formatMissingMonths = () => {
    if (quality.missingMonths.length === 0) return null;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return quality.missingMonths
      .map(m => `${monthNames[m.month - 1]} ${m.year}`)
      .join(', ');
  };

  const tooltipContent = (
    <div className="space-y-2 text-sm">
      <div className="font-semibold">{label}</div>
      
      {showDetails && (
        <>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Completeness:</span>
              <span className="font-medium">{Math.round(quality.completeness)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Consistency:</span>
              <span className="font-medium">{Math.round(quality.consistency)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Timeliness:</span>
              <span className="font-medium">{Math.round(quality.timeliness)}%</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-1">
              Based on {quality.monthsAvailable} of {quality.monthsExpected} months
            </div>
            {quality.missingMonths.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Missing: {formatMissingMonths()}
              </div>
            )}
          </div>
        </>
      )}
      
      {quality.recommendations.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs font-semibold mb-1">Recommendations:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {quality.recommendations.map((rec, index) => (
              <li key={index}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`${colorClass} border-0 cursor-help flex items-center gap-1`}
            >
              {getIcon()}
              <span>{label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <Badge 
              variant="outline" 
              className={`${colorClass} border-0 flex items-center gap-1`}
            >
              {getIcon()}
              <span>{label}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              Based on {quality.monthsAvailable} of {quality.monthsExpected} months
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataQualityIndicator;

