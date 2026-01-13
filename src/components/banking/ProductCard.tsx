import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreIndicator } from './ScoreIndicator';
import { EligibilityBadge } from './EligibilityBadge';
import { BankingProduct } from '@/lib/api/types/banking';
import { CreditCard, Landmark, PiggyBank, Wallet, TrendingUp, DollarSign, Plus, Star, Target, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Info, Clock, DollarSign as DollarSignIcon, TrendingDown, Check, Gift, Shield, Plane } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAddProduct } from '@/hooks/useBankingProducts';
import { useBankingProfile } from '@/hooks/useBankingProducts';

interface ProductCardProps {
  product: BankingProduct;
  onSelect?: (product: BankingProduct) => void;
  isSelected?: boolean;
  onCompare?: (product: BankingProduct) => void;
  isInCompare?: boolean;
  isTopRecommendation?: boolean;
  isUserProduct?: boolean;
  matchCount?: number;
  firebaseId?: string;
  isInMyProducts?: boolean;
  onAddToMyProducts?: (product: BankingProduct) => void;
}

const typeIcons: Record<BankingProduct['type'], React.ElementType> = {
  savings: PiggyBank,
  credit_card: CreditCard,
  checking: Wallet,
  cd: Landmark,
  money_market: TrendingUp,
  loan: DollarSign,
  debit_card: CreditCard,
  virtual_prepaid_card: CreditCard,
};

const typeLabels: Record<BankingProduct['type'], string> = {
  savings: 'Savings',
  credit_card: 'Credit Card',
  checking: 'Checking',
  cd: 'Fixed Deposit',
  money_market: 'Money Market',
  loan: 'Loan',
  debit_card: 'Debit Card',
  virtual_prepaid_card: 'Virtual Prepaid Card',
};

// Extract or generate a benefit statement
const getBenefitStatement = (product: BankingProduct): string => {
  if (product.type === 'loan') {
    if (product.features.monthlyFee === 'No monthly fee' || product.features.annualFee === 'No annual fee') {
      return 'No monthly or annual fees';
    }
    if (product.features.loanAmount) {
      return `Borrow up to ${product.features.loanAmount.split(' - ')[1] || product.features.loanAmount.split(' ')[1] || product.features.loanAmount}`;
    }
    if (product.explanation?.keyStrengths && product.explanation.keyStrengths.length > 0) {
      const noFeeStrength = product.explanation.keyStrengths.find(s => 
        s.toLowerCase().includes('no fee') || s.toLowerCase().includes('zero fee')
      );
      if (noFeeStrength) {
        return noFeeStrength;
      }
    }
  }

  if (product.type === 'credit_card') {
    if (product.features.annualFee === 'No annual fee') {
      return 'No annual fee';
    }
    if (product.features.signupBonus) {
      return `Get ${product.features.signupBonus} sign-up bonus`;
    }
    return 'Credit card benefits';
  }

  if (product.type === 'debit_card' || product.type === 'virtual_prepaid_card') {
    if (product.features.annualFee === 'No annual fee') {
      return 'No annual fee';
    }
    if (product.features.rewards) {
      return product.features.rewards;
    }
    if (product.features.cardInfo) {
      return `${product.features.cardInfo} card`;
    }
    return 'Debit card benefits';
  }

  if (product.type === 'cd') {
    if (product.features.interestRate) {
      return `Earn ${product.features.interestRate} interest`;
    }
    if (product.features.earlyWithdrawalPenalty === 'No penalty') {
      return 'No early closure penalty';
    }
  }

  if (product.type === 'savings' || product.type === 'checking' || product.type === 'money_market') {
    if (product.features.apy && !product.features.apy.includes('0%') && product.features.apy.trim() !== '') {
      return `Earn ${product.features.apy} APY`;
    }
    if (product.features.annualFee === 'No annual fee' || product.features.monthlyFee === 'No monthly fee') {
      return 'No monthly or annual fees';
    }
    if (product.features.signupBonus) {
      return `Get ${product.features.signupBonus} sign-up bonus`;
    }
    // Fallback for savings accounts with no specific features
    if (product.type === 'savings') {
      return 'Savings account for your financial goals';
    }
  }

  if (product.explanation?.mainExplanation) {
    const explanation = product.explanation.mainExplanation;
    const sentences = explanation.split('.');
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 10 && trimmed.length < 80) {
        if (trimmed.toLowerCase().includes('no fee') || 
            trimmed.toLowerCase().includes('earn') ||
            trimmed.toLowerCase().includes('save') ||
            trimmed.toLowerCase().includes('get')) {
          return trimmed;
        }
      }
    }
    const firstSentence = sentences[0]?.trim();
    if (firstSentence && firstSentence.length < 100) {
      return firstSentence;
    }
  }

  return `Perfect match for your financial goals`;
};

export const ProductCard = ({ 
  product, 
  onSelect, 
  isSelected, 
  onCompare, 
  isInCompare,
  isTopRecommendation = false,
  isUserProduct = false,
  matchCount = product.alignedGoals.length,
  firebaseId,
  isInMyProducts = false,
  onAddToMyProducts
}: ProductCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: userProducts } = useBankingProfile();
  const isAlreadyAdded = userProducts?.some(p => p.productId === product.productId || p.productId === product.id) || isInMyProducts;
  
  const addProductMutation = useAddProduct();
  
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlreadyAdded) {
      return;
    }
    
    // Quick add with default values based on product type
    const quickAddData: any = {
      productId: product.productId || product.id,
    };
    
    // Set default values based on product type
    if (product.type === 'savings' || product.type === 'cd') {
      quickAddData.currentBalance = 0;
    } else if (product.type === 'credit_card') {
      quickAddData.outstandingBalance = 0;
    } else if (product.type === 'loan') {
      quickAddData.loanAmount = 0;
      quickAddData.outstandingBalance = 0;
    }
    // Debit card has no balance fields
    
    addProductMutation.mutate(quickAddData);
    
    if (onAddToMyProducts) {
      onAddToMyProducts(product);
    }
  };
  
  const Icon = typeIcons[product.type] || PiggyBank;
  const benefitStatement = getBenefitStatement(product);
  const primaryGoal = product.alignedGoals[0] || 'Your Goals';

  return (
    <Card 
      className={`group transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-accent shadow-md' : ''
      } ${
        isTopRecommendation ? 'ring-2 ring-primary/30 bg-primary/5 border-primary/20' : ''
      }`}
    >
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {typeLabels[product.type]}
              </span>
              {isUserProduct && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Your Product
                </Badge>
              )}
            </div>
            <h3 
              className="font-semibold text-base text-foreground leading-tight cursor-pointer hover:text-primary mb-1"
              onClick={() => onSelect?.(product)}
              title={product.name}
            >
              {product.name || `${product.bank} ${typeLabels[product.type]}`}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-muted-foreground">{product.bank}</p>
              {(product.type === 'credit_card' || product.type === 'debit_card' || product.type === 'virtual_prepaid_card') && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {(() => {
                      const nameLower = product.name?.toLowerCase() || '';
                      const networks = ['visa', 'mastercard', 'amex', 'american express', 'discover', 'unionpay'];
                      const nameHasNetwork = networks.some(net => nameLower.includes(net));
                      
                      if (product.type === 'debit_card' || product.type === 'virtual_prepaid_card') {
                        if (product.features.cardInfo) {
                          return product.features.cardInfo;
                        }
                        return typeLabels[product.type];
                      }
                      
                      if (nameHasNetwork) {
                        if (product.features.tier && !nameLower.includes(product.features.tier.toLowerCase())) {
                          return `${product.features.tier.charAt(0).toUpperCase() + product.features.tier.slice(1)} Card`;
                        }
                        return typeLabels[product.type];
                      }
                      
                      if (product.features.tier && product.features.cardNetwork) {
                        return `${product.features.tier.charAt(0).toUpperCase() + product.features.tier.slice(1)} ${product.features.cardNetwork}`;
                      }
                      if (product.features.cardNetwork) {
                        return product.features.cardNetwork;
                      }
                      
                      return typeLabels[product.type];
                    })()}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2 flex-shrink-0">
            <ScoreIndicator 
              score={product.matchScore} 
              size="sm" 
              showInfoIcon 
              showLabel={false}
              product={product}
            />
            <div className="flex flex-col items-center gap-2">
              <EligibilityBadge status={product.eligibilityStatus} showInfoIcon />
              {firebaseId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isAlreadyAdded ? "secondary" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 ${
                        isAlreadyAdded 
                          ? "bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400" 
                          : "hover:bg-primary/10"
                      }`}
                      onClick={handleQuickAdd}
                      disabled={isAlreadyAdded || addProductMutation.isPending}
                    >
                      {isAlreadyAdded ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-sm">
                      {isAlreadyAdded ? 'Already in My Products' : 'Add to My Products'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Costs - Compact Inline */}
        {product.type === 'credit_card' && (product.features.apr || product.features.annualFee) && (
          <div className="flex items-center gap-4 text-sm mb-3 pb-3 border-b">
            {product.features.apr && (
              <div>
                <span className="text-muted-foreground text-xs">APR </span>
                <span className="font-semibold text-foreground">{product.features.apr}</span>
              </div>
            )}
            {product.features.annualFee && (
              <div>
                <span className="text-muted-foreground text-xs">Annual Fee </span>
                <span className="font-semibold text-foreground">
                  {product.features.annualFee === 'No annual fee' ? (
                    <span className="text-green-600 dark:text-green-400">Waived</span>
                  ) : (
                    product.features.annualFee
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {(product.type === 'debit_card' || product.type === 'virtual_prepaid_card') && product.features.annualFee && (
          <div className="flex items-center gap-4 text-sm mb-3 pb-3 border-b">
            <div>
              <span className="text-muted-foreground text-xs">Annual Fee </span>
              <span className="font-semibold text-foreground">
                {product.features.annualFee === 'No annual fee' ? (
                  <span className="text-green-600 dark:text-green-400">Waived</span>
                ) : (
                  product.features.annualFee
                )}
              </span>
            </div>
          </div>
        )}

        {product.type === 'loan' && (product.features.interestRate || product.features.processingFee) && (
          <div className="flex items-center gap-4 text-sm mb-3 pb-3 border-b">
            {product.features.interestRate && (
              <div>
                <span className="text-muted-foreground text-xs">Interest Rate </span>
                <span className="font-semibold text-foreground">{product.features.interestRate}</span>
              </div>
            )}
            {product.features.processingFee && (
              <div>
                <span className="text-muted-foreground text-xs">Processing Fee </span>
                <span className="font-semibold text-foreground">{product.features.processingFee}</span>
              </div>
            )}
          </div>
        )}

        {/* Benefit Statement - Large and Clear */}
        <div className="mb-3">
          <p className="text-lg font-bold text-foreground leading-tight">
            {benefitStatement}
          </p>
        </div>

        {product.alignedGoals.length > 0 && (
          <div className="mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              <Target className="h-3 w-3 mr-1" />
              Best for {product.alignedGoals[0]}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {/* Key Features - Product Type Specific */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* Loan-specific features */}
          {product.type === 'loan' && (
            <>
              {product.features.loanAmount && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Loan Amount</span>
                  <p className="font-semibold text-foreground">{product.features.loanAmount}</p>
                </div>
              )}
              {product.features.loanTerm && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Loan Term</span>
                  <p className="font-semibold text-foreground">{product.features.loanTerm}</p>
                </div>
              )}
            </>
          )}

          {/* Credit card-specific features */}
          {product.type === 'credit_card' && (
            <>
              {product.features.rewards && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Rewards</span>
                  <p className="font-semibold text-foreground">{product.features.rewards}</p>
                </div>
              )}
              
              {product.features.creditLimit && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Credit Limit</span>
                  <p className="font-semibold text-foreground">{product.features.creditLimit}</p>
                </div>
              )}
            </>
          )}

          {/* Debit card-specific features - Reorganized Layout */}
          {(product.type === 'debit_card' || product.type === 'virtual_prepaid_card') && (
            <>
              {/* Hero Section - Most Important Info */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg p-4 border border-primary/20 mb-3 col-span-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {product.features.cardInfo && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {product.features.cardInfo}
                      </Badge>
                    )}
                    <h4 className="font-semibold text-foreground text-sm mb-1">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.bank}</p>
                  </div>
                </div>
                
                {/* Key Highlights - 3 Column Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {/* Annual Fee */}
                  <div className="text-center bg-background/50 rounded-md py-2 px-1">
                    <p className="text-[10px] text-muted-foreground mb-1">Annual Fee</p>
                    <p className="font-bold text-foreground text-xs">
                      {product.features.annualFee === 'No annual fee' || product.features.annualFee?.toLowerCase().includes('free') ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        <span className="text-foreground">{product.features.annualFee?.split(' ')[0] || 'N/A'}</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Rewards */}
                  <div className="text-center bg-background/50 rounded-md py-2 px-1">
                    <p className="text-[10px] text-muted-foreground mb-1">Rewards</p>
                    <p className="font-bold text-foreground text-xs">
                      {product.features.rewards ? (
                        <span className="text-primary line-clamp-1">{product.features.rewards.split(' ')[0]}</span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Daily ATM Limit */}
                  <div className="text-center bg-background/50 rounded-md py-2 px-1">
                    <p className="text-[10px] text-muted-foreground mb-1">Daily ATM</p>
                    <p className="font-bold text-foreground text-xs">
                      {product.features.dailyAtmLimit ? (
                        <span className="text-foreground">{product.features.dailyAtmLimit.split(' ')[0]}</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Compact Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 col-span-2">
                {product.features.dailyPurchaseLimit && (
                  <div className="bg-muted/30 rounded-md px-3 py-2">
                    <p className="text-[10px] text-muted-foreground mb-1">Daily Purchase</p>
                    <p className="font-semibold text-xs text-foreground line-clamp-1">
                      {product.features.dailyPurchaseLimit.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                )}
                
                {product.features.contactlessLimit && (
                  <div className="bg-muted/30 rounded-md px-3 py-2">
                    <p className="text-[10px] text-muted-foreground mb-1">Contactless</p>
                    <p className="font-semibold text-xs text-foreground">
                      {product.features.contactlessLimit.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                )}
                
                {product.features.mobileWallets && (
                  <div className="bg-muted/30 rounded-md px-3 py-2 col-span-2">
                    <p className="text-[10px] text-muted-foreground mb-1">Mobile Wallets</p>
                    <p className="font-semibold text-xs text-foreground line-clamp-1">
                      {product.features.mobileWallets}
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Features - Badge Style */}
              {(product.features.premiumBenefits || product.features.travelInsurance || product.features.loungeAccess) && (
                <div className="flex flex-wrap gap-2 mb-3 col-span-2">
                  {product.features.premiumBenefits && Array.isArray(product.features.premiumBenefits) && product.features.premiumBenefits.length > 0 && (
                    <Badge variant="outline" className="bg-accent/10 text-xs py-1">
                      <Gift className="h-3 w-3 mr-1" />
                      Premium Benefits
                    </Badge>
                  )}
                  {product.features.travelInsurance && (
                    <Badge variant="outline" className="bg-blue-500/10 text-xs py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      Travel Insurance
                    </Badge>
                  )}
                  {product.features.loungeAccess && (
                    <Badge variant="outline" className="bg-purple-500/10 text-xs py-1">
                      <Plane className="h-3 w-3 mr-1" />
                      Lounge Access
                    </Badge>
                  )}
                </div>
              )}

            </>
          )}

          {/* Fixed deposit-specific features */}
          {product.type === 'cd' && (
            <>
              {product.features.interestRate && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <span className="text-muted-foreground text-xs">Interest Rate</span>
                  <p className="font-semibold text-foreground">{product.features.interestRate}</p>
                </div>
              )}
              {product.features.tenure && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <span className="text-muted-foreground text-xs">Tenure</span>
                  <p className="font-semibold text-foreground">{product.features.tenure}</p>
                </div>
              )}
              {product.features.minBalance && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Minimum Deposit</span>
                  <p className="font-semibold text-foreground">{product.features.minBalance}</p>
                </div>
              )}
              {product.features.earlyWithdrawalPenalty && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Early Withdrawal Penalty</span>
                  <p className="font-semibold text-foreground">{product.features.earlyWithdrawalPenalty}</p>
                </div>
              )}
            </>
          )}

          {/* Savings/Checking/Money Market features */}
          {(product.type === 'savings' || product.type === 'checking' || product.type === 'money_market') && (
            <>
              {product.features.apy && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <span className="text-muted-foreground text-xs">APY</span>
                  <p className="font-semibold text-foreground">{product.features.apy}</p>
                </div>
              )}
              {product.features.annualFee && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <span className="text-muted-foreground text-xs">Annual Fee</span>
                  <p className="font-semibold text-foreground">{product.features.annualFee}</p>
                </div>
              )}
              {product.features.monthlyFee && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Monthly Fee</span>
                  <p className="font-semibold text-foreground">{product.features.monthlyFee}</p>
                </div>
              )}
              {product.features.minBalance && (
                <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
                  <span className="text-muted-foreground text-xs">Min Balance</span>
                  <p className="font-semibold text-foreground">{product.features.minBalance}</p>
                </div>
              )}
            </>
          )}

          {/* Common features (shown for all types) */}
          {product.features.rewards && product.type !== 'credit_card' && (
            <div className="bg-muted/50 rounded-md px-2 py-1.5 col-span-2">
              <span className="text-muted-foreground text-xs">Rewards</span>
              <p className="font-semibold text-foreground">{product.features.rewards}</p>
            </div>
          )}
          {product.features.signupBonus && (
            <div className="bg-accent/10 rounded-md px-2 py-1.5 col-span-2 border border-accent/20">
              <span className="text-accent text-xs font-medium">Sign-up Bonus</span>
              <p className="font-semibold text-foreground">{product.features.signupBonus}</p>
            </div>
          )}
        </div>


        {/* Expandable Section - Show Why This Works */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground mt-3"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show Why This Works
            </>
          )}
        </Button>

        {/* EXPANDED VIEW - Detailed Explanation */}
        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-border">
            {/* What This Means For You - Using Goal Benefits */}
            {product.explanation?.goalBenefits && product.explanation.goalBenefits.length > 0 && (
              <div className="space-y-3 bg-primary/5 rounded-lg p-3 border border-primary/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">What This Means For You</h4>
                </div>
                <div className="space-y-2">
                  {product.explanation.goalBenefits.map((benefit) => (
                    <div key={benefit.goalId} className="space-y-1">
                      <p className="text-xs font-medium text-foreground">For Your {benefit.goalName} Goal:</p>
                      <p className="text-xs text-foreground">{benefit.benefit}</p>
                      {benefit.timeline && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {benefit.timeline}
                        </p>
                      )}
                      {benefit.monthlyContribution && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSignIcon className="h-3 w-3" />
                          {benefit.monthlyContribution}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cash Flow Impact - If Available */}
            {product.explanation?.cashFlowImpact && (
              <div className="space-y-2 bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Cost & Impact</h4>
                </div>
                <p className="text-xs text-foreground">{product.explanation.cashFlowImpact}</p>
              </div>
            )}

            {/* Comparison Context - If Available */}
            {product.explanation?.comparisonContext && (
              <div className="space-y-2 bg-gradient-to-r from-primary/10 to-background rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">vs. Your Current Products</h4>
                </div>
                {product.explanation.comparisonContext.vsExistingProducts && (
                  <p className="text-xs text-foreground">{product.explanation.comparisonContext.vsExistingProducts}</p>
                )}
                {product.explanation.comparisonContext.improvement && (
                  <p className="text-xs font-medium text-primary mt-1">
                    ✨ {product.explanation.comparisonContext.improvement}
                  </p>
                )}
              </div>
            )}

            {/* Main Explanation */}
            {product.explanation?.mainExplanation ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Why This Works For You</h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {product.explanation.mainExplanation}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Why This Works For You</h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  This product scored <span className="font-semibold text-primary">{product.matchScore}%</span> and aligns with {matchCount} of your financial goals. It fits your financial situation and complements your existing portfolio.
                </p>
              </div>
            )}

            {product.explanation?.keyStrengths && product.explanation.keyStrengths.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-foreground">Key Strengths</h5>
                <ul className="text-xs text-foreground space-y-1">
                  {product.explanation.keyStrengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onCompare && (
            <Button
              variant={isInCompare ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(product);
              }}
            >
              <Plus className={`h-4 w-4 mr-1 ${isInCompare ? 'rotate-45' : ''} transition-transform`} />
              {isInCompare ? 'Remove from Compare' : 'Add to Compare'}
            </Button>
          )}
          {onSelect && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
