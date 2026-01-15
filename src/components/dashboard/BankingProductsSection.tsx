import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, ChevronDown, ChevronUp, ChevronRight, Plus, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { useBankingProfile, useBankingFinancialSummary } from '@/hooks/useBankingProducts';
import { MyProductCard } from '@/components/banking/MyProductCard';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFormatters } from '@/hooks/useFormatters';
import type { UserProduct } from '@/lib/api/types/banking';

interface BankingProductsSectionProps {
  sessionId?: string;
  riskProfile?: number;
  investmentGoals?: {
    targetAmount?: number;
    monthlyContribution?: number;
    investmentHorizon?: number;
  };
  savingsRate?: number;
}

export const BankingProductsSection: React.FC<BankingProductsSectionProps> = ({
  sessionId,
  riskProfile,
  investmentGoals,
  savingsRate,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatCurrency } = useFormatters();

  // Fetch user's actual banking products
  const { data: userProducts, isLoading, error } = useBankingProfile();
  
  // Fetch financial summary
  const { data: summary, isLoading: summaryLoading } = useBankingFinancialSummary();

  const products = userProducts || [];
  const displayedProducts = isExpanded ? products : products.slice(0, 3);
  const totalProducts = products.length;

  const handleViewAll = () => {
    navigate('/banking-products');
  };

  const handleAddProduct = () => {
    navigate('/banking-products?tab=my-products');
  };

  const handleEdit = (product: UserProduct) => {
    // Navigate to banking products page with edit mode
    navigate(`/banking-products?tab=my-products&edit=${product.id}`);
  };

  const handleDelete = (productId: string) => {
    // This will be handled by the MyProductsTab component
    // For now, just navigate to the page
    navigate(`/banking-products?tab=my-products`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            My Banking Products
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="About my banking products"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your existing banking products that you've added to track your financial portfolio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {totalProducts > 0 && (
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
          {totalProducts > 3 && (
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
            icon={Wallet}
            title="Unable to Load Your Products"
            description="We couldn't load your banking products. Check your connection and try again."
            variant="compact"
          />
        ) : totalProducts === 0 ? (
          <div className="space-y-4">
            <EnhancedEmptyState
              icon={Wallet}
              title="No Banking Products Yet"
              description="Add your existing banking products to track them and get better insights into your financial portfolio"
              actionText="Add Your First Product"
              onAction={handleAddProduct}
              variant="compact"
            />
            {/* Preview/Teaser Content */}
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What you can track:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Savings accounts, checking accounts, and credit cards</li>
                  <li>Current balances and account details</li>
                  <li>How your banking products support your investment goals</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Financial Summary - Integrated at top */}
            {summary && !summaryLoading && (
              <div className="space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Net Worth */}
                  <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Net Worth</span>
                    </div>
                    <div className={`text-2xl font-bold ${summary.netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(summary.netWorth)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {summary.netWorth >= 0 ? 'Assets exceed liabilities' : 'Liabilities exceed assets'}
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div className="space-y-2 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-muted-foreground">What You Own</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(summary.totalAssets)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Savings + Fixed Deposits
                    </div>
                  </div>

                  {/* Total Liabilities */}
                  <div className="space-y-2 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-muted-foreground">What You Owe</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(summary.totalLiabilities)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Credit Cards + Loans
                    </div>
                  </div>
                </div>

                {/* Debt Ratios - If Available */}
                {(summary.debtToIncomeRatio !== undefined || summary.creditUtilizationRatio !== undefined) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {summary.debtToIncomeRatio !== undefined && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-muted-foreground">Debt-to-Income Ratio</div>
                          <div className="text-sm text-foreground">
                            {summary.debtToIncomeRatio > 40 ? (
                              <span className="text-red-600 dark:text-red-400 font-semibold">High</span>
                            ) : summary.debtToIncomeRatio > 30 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">Moderate</span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400 font-semibold">Healthy</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={summary.debtToIncomeRatio > 40 ? 'destructive' : 'secondary'}>
                          {summary.debtToIncomeRatio.toFixed(1)}%
                        </Badge>
                      </div>
                    )}

                    {summary.creditUtilizationRatio !== undefined && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-muted-foreground">Credit Utilization</div>
                          <div className="text-sm text-foreground">
                            {summary.creditUtilizationRatio > 30 ? (
                              <span className="text-red-600 dark:text-red-400 font-semibold">High</span>
                            ) : summary.creditUtilizationRatio > 20 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">Moderate</span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400 font-semibold">Healthy</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={summary.creditUtilizationRatio > 30 ? 'destructive' : 'secondary'}>
                          {summary.creditUtilizationRatio.toFixed(1)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* High Debt Warnings */}
                {((summary.debtToIncomeRatio && summary.debtToIncomeRatio > 40) || 
                  (summary.creditUtilizationRatio && summary.creditUtilizationRatio > 30)) && (
                  <Alert variant="destructive" className="py-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {summary.debtToIncomeRatio && summary.debtToIncomeRatio > 40 && (
                        <div>Your debt-to-income ratio is high ({summary.debtToIncomeRatio.toFixed(1)}%). Consider reducing debt or increasing income.</div>
                      )}
                      {summary.creditUtilizationRatio && summary.creditUtilizationRatio > 30 && (
                        <div className={summary.debtToIncomeRatio && summary.debtToIncomeRatio > 40 ? 'mt-1' : ''}>
                          Your credit utilization is high ({summary.creditUtilizationRatio.toFixed(1)}%). Try to keep it below 30% for better credit health.
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Divider */}
            {summary && !summaryLoading && <div className="border-t border-border" />}

            {/* Connection to Investment Goals */}
            {investmentGoals?.targetAmount && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">💡 Connection:</span> Your banking products provide liquidity and support for your investment goal of{' '}
                  <span className="font-semibold">{formatCurrency(investmentGoals.targetAmount)}</span>
                  {savingsRate !== undefined && savingsRate > 0 && (
                    <> with your current {savingsRate.toFixed(0)}% savings rate</>
                  )}
                </p>
              </div>
            )}

            {/* Products Grid */}
            {displayedProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Products</h3>
                  <div className="text-sm text-muted-foreground">
                    {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayedProducts.map((product) => (
                    <MyProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                {totalProducts > 3 && !isExpanded && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center gap-2 mx-auto"
                    >
                      Show All {totalProducts} Products
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

export default BankingProductsSection;

