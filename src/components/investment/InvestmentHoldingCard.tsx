import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvestmentHolding } from '@/lib/api/types/investment';
import { Pencil, Trash2, TrendingUp, TrendingDown, BarChart3, Building2, Wallet, Coins, Landmark } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import { Badge } from '@/components/ui/badge';

interface InvestmentHoldingCardProps {
  holding: InvestmentHolding;
  onEdit: (holding: InvestmentHolding) => void;
  onDelete: (holdingId: string) => void;
}

const assetClassIcons: Record<InvestmentHolding['assetClass'], React.ElementType> = {
  equities: TrendingUp,
  bonds: BarChart3,
  real_estate: Building2,
  cash: Wallet,
  commodities: Coins,
  crypto: Coins,
  other: Landmark,
};

const assetClassLabels: Record<InvestmentHolding['assetClass'], string> = {
  equities: 'Equities',
  bonds: 'Bonds',
  real_estate: 'Real Estate',
  cash: 'Cash',
  commodities: 'Commodities',
  crypto: 'Crypto',
  other: 'Other',
};

const typeLabels: Record<InvestmentHolding['type'], string> = {
  stock: 'Stock',
  bond: 'Bond',
  mutual_fund: 'Mutual Fund',
  etf: 'ETF',
  real_estate_investment: 'Real Estate',
  savings_account: 'Savings',
  fixed_deposit: 'Fixed Deposit',
  commodity: 'Commodity',
  cryptocurrency: 'Cryptocurrency',
  other: 'Other',
};

export const InvestmentHoldingCard: React.FC<InvestmentHoldingCardProps> = ({
  holding,
  onEdit,
  onDelete,
}) => {
  const Icon = assetClassIcons[holding.assetClass] || Landmark;
  const { formatCurrency, formatPercentage } = useFormatters();
  const hasGainLoss = holding.gainLoss !== undefined && holding.totalCost !== undefined && holding.totalCost > 0;
  const isPositive = holding.gainLoss !== undefined && holding.gainLoss >= 0;

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{holding.name}</CardTitle>
              {holding.symbol && (
                <p className="text-sm text-muted-foreground">{holding.symbol}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[holding.type]}
                </Badge>
                <span className="text-xs text-muted-foreground">{assetClassLabels[holding.assetClass]}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
          <p className="text-lg font-semibold">{formatCurrency(holding.currentValue)}</p>
        </div>

        {hasGainLoss && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gain/Loss</p>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(holding.gainLoss!))} ({formatPercentage(holding.gainLossPercent! / 100)})
              </p>
            </div>
          </div>
        )}

        {holding.quantity !== undefined && holding.averageCost !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Quantity / Avg Cost</p>
            <p className="text-sm">
              {holding.quantity.toLocaleString()} @ {formatCurrency(holding.averageCost)}
            </p>
          </div>
        )}

        {holding.institution && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Institution</p>
            <p className="text-sm">{holding.institution}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(holding)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(holding.holdingId)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};



