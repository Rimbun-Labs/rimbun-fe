import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ChevronDown, ChevronUp, ChevronRight, Plus } from 'lucide-react';
import { useInvestmentHoldings } from '@/hooks/useInvestmentHoldings';
import { InvestmentHoldingCard } from '@/components/investment/InvestmentHoldingCard';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import type { InvestmentHolding } from '@/lib/api/types/investment';

interface InvestmentHoldingsSectionProps {
  sessionId?: string;
}

export const InvestmentHoldingsSection: React.FC<InvestmentHoldingsSectionProps> = ({
  sessionId,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatCurrency } = useFormatters();

  // Fetch user's actual investment holdings
  const { data: holdingsData, isLoading, error } = useInvestmentHoldings();

  const holdings = holdingsData?.holdings || [];
  const displayedHoldings = isExpanded ? holdings : holdings.slice(0, 3);
  const totalHoldings = holdings.length;
  const totalValue = holdingsData?.totalValue || 0;
  const totalGainLoss = holdingsData?.totalGainLoss || 0;
  const totalGainLossPercent = holdingsData?.totalGainLossPercent || 0;

  const handleViewAll = () => {
    navigate(`/investment-explorer/${sessionId}`);
  };

  const handleAddHolding = () => {
    navigate(`/investment-explorer/${sessionId}?tab=holdings&action=add`);
  };

  const handleEdit = (holding: InvestmentHolding) => {
    navigate(`/investment-explorer/${sessionId}?tab=holdings&action=edit&id=${holding.id}`);
  };

  const handleDelete = (holdingId: string) => {
    // This will be handled by the Investment Explorer page
    navigate(`/investment-explorer/${sessionId}?tab=holdings`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            My Investment Holdings
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="About my investment holdings"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your actual investment holdings that you've added to track your portfolio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {totalHoldings > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              className="flex items-center gap-2"
            >
              Manage All
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {totalHoldings > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4">
            <LoadingState variant="compact" lines={2} />
          </div>
        ) : error ? (
          <EnhancedEmptyState
            icon={TrendingUp}
            title="Unable to Load Your Holdings"
            description="We couldn't load your investment holdings. Check your connection and try again."
            variant="compact"
          />
        ) : totalHoldings === 0 ? (
          <div className="space-y-4">
            <EnhancedEmptyState
              icon={TrendingUp}
              title="No Investment Holdings Yet"
              description="The ability to add investment holdings is currently unavailable. This feature will be available soon."
              variant="compact"
            />
            {/* Preview/Teaser Content */}
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What you can track:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Stocks, bonds, ETFs, mutual funds, and other investments</li>
                  <li>Current values, gain/loss, and performance metrics</li>
                  <li>How your actual holdings compare to your recommended portfolio</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overview - Always Visible */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Holdings</div>
                  <div className="text-2xl font-bold">{totalHoldings}</div>
                  <div className="text-xs text-muted-foreground">investments</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                  <div className="text-xs text-muted-foreground">portfolio value</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
                  <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(totalGainLoss))}
                  </div>
                  <div className={`text-xs ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Holdings Grid */}
            {displayedHoldings.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Your Holdings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayedHoldings.map((holding) => (
                    <InvestmentHoldingCard
                      key={holding.id}
                      holding={holding}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                {totalHoldings > 3 && !isExpanded && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center gap-2 mx-auto"
                    >
                      Show All {totalHoldings} Holdings
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentHoldingsSection;


