import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ProductCategorySection } from './ProductCategorySection';
import { BankingProduct } from '@/lib/api/types/banking';
import { useProductCatalog, useBankingRecommendations } from '@/hooks/useBankingProducts';
import { Grid3x3 } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BrowseAllTabProps {
  firebaseId?: string;
  compareProducts: BankingProduct[];
  onAddToCompare: (product: BankingProduct) => void;
}

export const BrowseAllTab = ({
  firebaseId,
  compareProducts,
  onAddToCompare,
}: BrowseAllTabProps) => {
  const navigate = useNavigate();
  const { data: catalogData, isLoading: isLoadingCatalog, error: catalogError } = useProductCatalog();
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useBankingRecommendations();

  // Merge catalog products with recommendation data for consistency
  // If a product is recommended, use its score, eligibility, and explanation
  // If not recommended, keep catalog data (0% score is fine for non-recommended products)
  const products = useMemo(() => {
    if (!catalogData?.products) return [];
    
    // Create map of recommendations by productId for quick lookup
    const recommendationsMap = new Map<string, BankingProduct>();
    if (recommendationsData?.products) {
      recommendationsData.products.forEach(rec => {
        // Use both productId and id as keys to handle different formats
        if (rec.productId) recommendationsMap.set(rec.productId, rec);
        if (rec.id) recommendationsMap.set(rec.id, rec);
      });
    }
    
    return catalogData.products.map(catalogProduct => {
      // Try to find matching recommendation by productId or id
      const recommendation = recommendationsMap.get(catalogProduct.productId || catalogProduct.id);
      
      if (recommendation) {
        // Merge: Use catalog product as base, overlay recommendation data
        // This ensures consistency - same product shows same score/eligibility in both tabs
        return {
          ...catalogProduct, // Keep catalog data (name, bank, type, features, etc.)
          // Overlay recommendation data for personalization
          matchScore: recommendation.matchScore, // Use actual score instead of 0
          eligibilityStatus: recommendation.eligibilityStatus, // Use actual eligibility
          alignedGoals: recommendation.alignedGoals || [], // Use goal alignment
          scoreBreakdown: recommendation.scoreBreakdown || [], // Use score breakdown
          explanation: recommendation.explanation, // Use explanation if available
        };
      }
      
      // No recommendation found - keep catalog product as-is
      // This is fine - not all products will be recommended
      return catalogProduct;
    });
  }, [catalogData, recommendationsData]);

  const productsByType = useMemo(() => {
    const grouped: Record<string, BankingProduct[]> = {};
    products.forEach(product => {
      if (!grouped[product.type]) {
        grouped[product.type] = [];
      }
      grouped[product.type].push(product);
    });
    return grouped;
  }, [products]);

  const isInCompare = (productId: string) => compareProducts.some((p) => p.id === productId);

  const isLoading = isLoadingCatalog || isLoadingRecommendations;
  const error = catalogError;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn't load the product catalog. Check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Grid3x3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Browse All Products</h2>
          <p className="text-sm text-muted-foreground">
            Explore all available banking products
          </p>
        </div>
      </div>

      {Object.keys(productsByType).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(productsByType).map(([type, products]) => (
            <ProductCategorySection
              key={type}
              type={type as BankingProduct['type']}
              products={products}
              onProductSelect={(p) => navigate(`/banking-products/${p.id}`)}
              onAddToCompare={onAddToCompare}
              isInCompare={isInCompare}
              firebaseId={firebaseId}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No products available at the moment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
