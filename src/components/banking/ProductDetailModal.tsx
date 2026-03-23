import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ExternalLink, 
  Plus,
  CreditCard,
  Landmark,
  PiggyBank,
  Wallet,
  TrendingUp,
  DollarSign,
  Target,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Clock,
  DollarSign as DollarSignIcon,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  Scale,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingRecommendations } from '@/hooks/useBankingProducts';
import { BankingProduct } from '@/lib/api/types/banking';
import { ScoreIndicator } from '@/components/banking/ScoreIndicator';
import { EligibilityBadge } from '@/components/banking/EligibilityBadge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const typeIcons: Record<string, React.ElementType> = {
  savings: PiggyBank,
  credit_card: CreditCard,
  checking: Wallet,
  cd: Landmark,
  money_market: TrendingUp,
  loan: DollarSign,
};

const typeLabels: Record<string, string> = {
  savings: 'Savings',
  credit_card: 'Credit Card',
  checking: 'Checking',
  cd: 'Fixed Deposit',
  money_market: 'Money Market',
  loan: 'Loan',
};

interface ProductDetailModalProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompare?: (product: BankingProduct) => void;
}

export const ProductDetailModal = ({ 
  productId, 
  open, 
  onOpenChange,
  onCompare 
}: ProductDetailModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firebaseId = user?.uid;

  // Fetch recommendations and find the specific product
  const { data: recommendationsData, isLoading } = useBankingRecommendations();

  const product = useMemo(() => {
    if (!recommendationsData?.products || !productId) return null;
    return recommendationsData.products.find(p => p.id === productId || p.productId === productId);
  }, [recommendationsData, productId]);

  const formatFeatureLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const [isPortfolioFitOpen, setIsPortfolioFitOpen] = useState(false);
  const [isAlternativeOpen, setIsAlternativeOpen] = useState(false);

  const handleCompare = () => {
    if (product && onCompare) {
      onCompare(product);
    }
    onOpenChange(false);
    navigate('/banking-products?tab=compare');
  };

  const handleApplyNow = () => {
    if (product?.eligibilityStatus === 'eligible') {
      window.open(`https://${product.bank.toLowerCase().replace(/\s+/g, '')}.com`, '_blank');
    } else {
      window.open(`https://${product?.bank.toLowerCase().replace(/\s+/g, '')}.com`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Loading Product Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product not found</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Button onClick={() => onOpenChange(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const Icon = typeIcons[product.type] || PiggyBank;
  const primaryGoal = product.goalDetails?.[0]?.goalName || product.alignedGoals[0] || 'Financial Goals';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:z-50">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="px-6 space-y-6 py-4">
            {/* Product Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{typeLabels[product.type]}</Badge>
                          {product.matchScore >= 90 && (
                            <Badge className="bg-primary text-primary-foreground">
                              <Star className="h-3 w-3 mr-1" />
                              Top Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-lg mt-1">{product.bank}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <EligibilityBadge status={product.eligibilityStatus} showInfoIcon />
                      <ScoreIndicator score={product.matchScore} size="sm" showInfoIcon />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {onCompare && (
                      <Button
                        variant="outline"
                        onClick={handleCompare}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Compare
                      </Button>
                    )}
                    <Button onClick={handleApplyNow}>
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Main Explanation */}
            {product.explanation?.mainExplanation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Why This Works For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {product.explanation.mainExplanation}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Goal Benefits */}
            {product.explanation?.goalBenefits && product.explanation.goalBenefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Goal Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.explanation.goalBenefits.map((benefit) => (
                    <Card key={benefit.goalId} className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{benefit.goalName}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-foreground">{benefit.benefit}</p>
                        {(benefit.timeline || benefit.monthlyContribution) && (
                          <div className="flex flex-wrap gap-4 pt-2 border-t border-primary/10">
                            {benefit.timeline && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">{benefit.timeline}</span>
                              </div>
                            )}
                            {benefit.monthlyContribution && (
                              <div className="flex items-center gap-2">
                                <DollarSignIcon className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">{benefit.monthlyContribution}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Cash Flow Impact */}
            {product.explanation?.cashFlowImpact && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    Cost & Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{product.explanation.cashFlowImpact}</p>
                </CardContent>
              </Card>
            )}

            {/* Key Features Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.features)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => {
                      const valueStr = value?.toString().toLowerCase() || '';
                      const isHighlight = 
                        valueStr.includes('no fee') ||
                        valueStr.includes('waived') ||
                        valueStr.includes('free') ||
                        (key === 'interestRate' && parseFloat(valueStr) > 5) ||
                        (key === 'apy' && parseFloat(valueStr) > 0.5);
                      
                      return (
                        <div
                          key={key}
                          className={cn(
                            "border rounded-lg p-4 transition-all",
                            isHighlight 
                              ? "border-primary/50 bg-primary/5 hover:border-primary shadow-sm" 
                              : "hover:border-primary/50"
                          )}
                        >
                          {isHighlight && (
                            <Badge variant="secondary" className="mb-2 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Standout
                            </Badge>
                          )}
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              {formatFeatureLabel(key)}
                            </span>
                            <p className="text-lg font-semibold text-foreground">{value}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Key Strengths */}
            {product.explanation?.keyStrengths && product.explanation.keyStrengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.explanation.keyStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* People like you */}
            {product.insight && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    People like you
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-foreground leading-relaxed">
                    {product.insight.percentage}% of people like you {product.insight.copy}
                  </p>
                  {product.insight.segmentDescription && (
                    <p className="text-sm text-muted-foreground">{product.insight.segmentDescription}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Important Notes */}
            {product.explanation?.importantNotes && product.explanation.importantNotes.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notes</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {product.explanation.importantNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Comparison Context */}
            {product.explanation?.comparisonContext && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    vs. Your Current Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.explanation.comparisonContext.vsExistingProducts && (
                    <p className="text-foreground">
                      {product.explanation.comparisonContext.vsExistingProducts}
                    </p>
                  )}
                  {product.explanation.comparisonContext.improvement && (
                    <div className="flex items-start gap-2 pt-2 border-t">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Improvement:</p>
                        <p className="text-foreground">{product.explanation.comparisonContext.improvement}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Portfolio Fit */}
            {product.portfolioFitDetails && (
              <Collapsible open={isPortfolioFitOpen} onOpenChange={setIsPortfolioFitOpen}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Portfolio Fit
                        </CardTitle>
                        {isPortfolioFitOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      {product.explanation?.portfolioFitExplanation ? (
                        <p className="text-foreground">{product.explanation.portfolioFitExplanation}</p>
                      ) : (
                        <p className="text-muted-foreground">Portfolio fit analysis is not available for this product.</p>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Why Alternative Is Good */}
            {product.explanation?.whyAlternativeIsGood && (
              <Collapsible open={isAlternativeOpen} onOpenChange={setIsAlternativeOpen}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Alternative Consideration
                        </CardTitle>
                        {isAlternativeOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-foreground">{product.explanation.whyAlternativeIsGood}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

