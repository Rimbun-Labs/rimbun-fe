import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, ChevronUp, ChevronRight, Plus } from 'lucide-react';
import { useBankingProfile } from '@/hooks/useBankingProducts';
import { MyProductCard } from '@/components/banking/MyProductCard';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
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

  const products = userProducts || [];
  const displayedProducts = isExpanded ? products : products.slice(0, 3);
  const totalProducts = products.length;
  const totalBalance = products.reduce((sum, product) => sum + (product.currentBalance || 0), 0);

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
          <div className="space-y-4">
            {/* Overview - Always Visible */}
            <div className="space-y-3">
              {/* Cross-section connection to Investment */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Products</div>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <div className="text-xs text-muted-foreground">banking products</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Balance</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                  <div className="text-xs text-muted-foreground">across all accounts</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Actions</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 w-full mt-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {displayedProducts.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Your Products</h3>
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

