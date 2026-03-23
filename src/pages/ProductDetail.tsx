import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronLeft, 
  ExternalLink, 
  Plus,
  CreditCard,
  Landmark,
  PiggyBank,
  Wallet,
  TrendingUp,
  DollarSign,
  Target,
  Info,
  CheckCircle2,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingRecommendations, useAddProduct, useBankingProfile } from '@/hooks/useBankingProducts';
import { bankingApi } from '@/lib/api/bankingApi';
import { BankingProduct } from '@/lib/api/types/banking';
import { mapProductType, formatProductFeatures, transformRecommendation } from '@/lib/utils/bankingTransformers';
import { useQuery } from '@tanstack/react-query';
import { ScoreIndicator } from '@/components/banking/ScoreIndicator';
import { EligibilityBadge } from '@/components/banking/EligibilityBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Component to render description with clickable links
const DescriptionWithLinks: React.FC<{ 
  description: string; 
  productName: string;
  bankName: string;
}> = ({ description, productName, bankName }) => {
  // URL regex pattern - matches http/https URLs
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  
  // Split description by URLs
  const parts = description.split(urlRegex);
  
  // Generate bank product URL (not tariff)
  const getProductUrl = (originalUrl: string): string => {
    try {
      const url = new URL(originalUrl);
      // If it's a tariff/schedule link, try to convert to product page
      if (url.pathname.includes('tariff') || url.pathname.includes('schedule')) {
        // Try to find product page path - remove tariff/schedule from path
        const productPath = url.pathname
          .replace(/\/tariff.*$/i, '')
          .replace(/\/schedule.*$/i, '')
          .replace(/\/rates.*$/i, '');
        return `${url.origin}${productPath || '/products'}`;
      }
      return originalUrl;
    } catch {
      return originalUrl;
    }
  };
  
  // Get clean link text
  const getLinkText = (url: string): string => {
    if (url.includes('tariff') || url.includes('schedule') || url.includes('rates')) {
      return `View ${productName} on ${bankName}`;
    }
    return `Learn More`;
  };
  
  return (
    <p className="text-muted-foreground leading-relaxed">
      {parts.map((part, index) => {
        // Check if this part is a URL
        if (urlRegex.test(part)) {
          const productUrl = getProductUrl(part);
          const linkText = getLinkText(part);
          
          return (
            <a
              key={index}
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
            >
              {linkText}
              <ExternalLink className="h-3 w-3" />
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

const typeIcons: Record<string, React.ElementType> = {
  savings: PiggyBank,
  credit_card: CreditCard,
  checking: Wallet,
  cd: Landmark,
  money_market: TrendingUp,
  loan: DollarSign,
  debit_card: CreditCard,
  virtual_prepaid_card: CreditCard,
};

const typeLabels: Record<string, string> = {
  savings: 'Savings',
  credit_card: 'Credit Card',
  checking: 'Checking',
  cd: 'Fixed Deposit',
  money_market: 'Money Market',
  loan: 'Loan',
  debit_card: 'Debit Card',
  virtual_prepaid_card: 'Virtual Prepaid Card',
};

// Group features by category
const categorizeFeatures = (features: BankingProduct['features'], productType: string) => {
  const categories = {
    costs: [] as Array<{ key: string; label: string; value: string }>,
    benefits: [] as Array<{ key: string; label: string; value: string }>,
    requirements: [] as Array<{ key: string; label: string; value: string }>,
    other: [] as Array<{ key: string; label: string; value: string }>,
  };

  Object.entries(features).forEach(([key, value]) => {
    if (!value) return;
    
    const item = {
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
      value: typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : String(value),
    };

    if (
      key === 'apr' ||
      key === 'annualFee' ||
      key === 'monthlyFee' ||
      key === 'processingFee' ||
      key === 'interestRate' ||
      key === 'earlyWithdrawalPenalty'
    ) {
      categories.costs.push(item);
    } else if (
      key === 'rewards' ||
      key === 'signupBonus' ||
      key === 'apy' ||
      key === 'creditLimit' ||
      key === 'loanAmount'
    ) {
      categories.benefits.push(item);
    } else if (
      key === 'minBalance' ||
      key === 'loanTerm' ||
      key === 'tenure'
    ) {
      categories.requirements.push(item);
    } else {
      categories.other.push(item);
    }
  });

  return categories;
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const firebaseId = user?.uid;

  // Prefer recommendation passed from list (keeps list and detail score/eligibility in sync)
  const productFromState = useMemo(() => {
    const rec = location.state?.recommendation as BankingProduct | undefined;
    if (!rec || !productId) return null;
    if (rec.id === productId || rec.productId === productId) return rec;
    return null;
  }, [location.state, productId]);

  // Try to get from recommendations cache (same product, different tab/query)
  const { data: recommendationsData, isLoading: recommendationsLoading } = useBankingRecommendations();
  const productFromRecommendations = useMemo(() => {
    if (!recommendationsData?.products || !productId) return null;
    return recommendationsData.products.find(p => p.id === productId || p.productId === productId);
  }, [recommendationsData, productId]);

  // If not in recommendations, try catalog (product-by-id API)
  const { data: catalogProduct, isLoading: catalogLoading } = useQuery({
    queryKey: ['banking', 'product', productId],
    queryFn: async () => {
      if (!productId) return null;
      try {
        const apiProduct = await bankingApi.getProductDetails(productId);
        return transformRecommendation(apiProduct);
      } catch {
        return null;
      }
    },
    enabled: !productFromState && !productFromRecommendations && !!productId,
  });

  const product = productFromState || productFromRecommendations || catalogProduct;
  const isLoading = !product && (recommendationsLoading || catalogLoading);

  const { data: userProducts } = useBankingProfile();
  const isAlreadyAdded = userProducts?.some(p => p.productId === product?.productId || p.productId === product?.id);
  const addProductMutation = useAddProduct();

  const handleAddToMyProducts = () => {
    if (!product || isAlreadyAdded) return;
    
    addProductMutation.mutate({
      productId: product.productId || product.id,
      currentBalance: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Product Not Found</AlertTitle>
          <AlertDescription>
            The product you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/banking-products')} className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Banking Products
        </Button>
      </div>
    );
  }

  const Icon = typeIcons[product.type] || PiggyBank;
  const featureCategories = categorizeFeatures(product.features, product.type);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/banking-products')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Banking Products
        </Button>

        {/* Product Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {typeLabels[product.type]}
                    </Badge>
                    <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                    <p className="text-muted-foreground text-lg">{product.bank}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <ScoreIndicator 
                    score={product.matchScore} 
                    size="md" 
                    showInfoIcon 
                    showLabel={true}
                    product={product}
                  />
                  <EligibilityBadge status={product.eligibilityStatus} showInfoIcon />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Description */}
        {product.description && (
          <Card>
            <CardHeader>
              <CardTitle>About This Product</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionWithLinks 
                description={product.description}
                productName={product.name}
                bankName={product.bank}
              />
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featureCategories.costs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureCategories.costs.map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {featureCategories.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureCategories.benefits.map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-primary/5 rounded-md">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {featureCategories.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureCategories.requirements.map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {featureCategories.other.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureCategories.other.map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground text-right flex-1 ml-4">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Explanation */}
        {product.explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Why This Works For You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.explanation.mainExplanation && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.explanation.mainExplanation}
                </p>
              )}

              {product.explanation.keyStrengths && product.explanation.keyStrengths.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Strengths</h4>
                  <ul className="space-y-2">
                    {product.explanation.keyStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              <p className="text-muted-foreground leading-relaxed">
                {product.insight.percentage}% of people like you {product.insight.copy}
              </p>
              {product.insight.segmentDescription && (
                <p className="text-sm text-muted-foreground">{product.insight.segmentDescription}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Important Notes */}
        {product.features.hariRayaP2pNote && (
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Important</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              {product.features.hariRayaP2pNote}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {firebaseId && (
            <Button
              variant={isAlreadyAdded ? "secondary" : "default"}
              onClick={handleAddToMyProducts}
              disabled={isAlreadyAdded || addProductMutation.isPending}
              className="flex-1"
            >
              {isAlreadyAdded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Already in My Products
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to My Products
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(`https://${product.bank.toLowerCase().replace(/\s+/g, '')}.com`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
