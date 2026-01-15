import React, { useState, useMemo } from 'react';
import { ComparisonTable } from './ComparisonTable';
import { useCompareProducts, useProductCatalog, useBankingRecommendations } from '@/hooks/useBankingProducts';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Scale, Plus, Search, Sparkles } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductCategorySection } from './ProductCategorySection';
import { ProductCard } from './ProductCard';
import type { BankingProduct } from '@/lib/api/types/banking';

interface CompareTabProps {
  firebaseId?: string;
  products: BankingProduct[];
  onAddToCompare: (product: BankingProduct) => void;
  onRemove: (productId: string) => void;
}

export const CompareTab: React.FC<CompareTabProps> = ({
  firebaseId,
  products,
  onAddToCompare,
  onRemove,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Fetch both catalog and recommendations
  const { data: catalogData, isLoading: isLoadingCatalog } = useProductCatalog({ search: searchQuery });
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useBankingRecommendations();
  
  // Merge catalog with recommendations (like BrowseAllTab does)
  // Prioritize recommended products, then show all by category
  const allAvailableProducts = useMemo(() => {
    if (!catalogData?.products) return [];
    
    // Create map of recommendations by productId for quick lookup
    const recommendationsMap = new Map<string, BankingProduct>();
    if (recommendationsData?.products) {
      recommendationsData.products.forEach(rec => {
        if (rec.productId) recommendationsMap.set(rec.productId, rec);
        if (rec.id) recommendationsMap.set(rec.id, rec);
      });
    }
    
    // Merge catalog with recommendations
    const merged = catalogData.products.map(catalogProduct => {
      const recommendation = recommendationsMap.get(catalogProduct.productId || catalogProduct.id);
      
      if (recommendation) {
        // Merge: Use catalog product as base, overlay recommendation data
        return {
          ...catalogProduct,
          matchScore: recommendation.matchScore,
          eligibilityStatus: recommendation.eligibilityStatus,
          alignedGoals: recommendation.alignedGoals || [],
          scoreBreakdown: recommendation.scoreBreakdown || [],
          explanation: recommendation.explanation,
        };
      }
      
      return catalogProduct;
    });
    
    // Filter out products already in compare
    const compareProductIds = new Set(products.map(p => p.productId || p.id));
    return merged.filter(p => !compareProductIds.has(p.productId || p.id));
  }, [catalogData, recommendationsData, products]);
  
  // Separate recommended and non-recommended products
  const { recommendedProducts, otherProducts } = useMemo(() => {
    const recommended: BankingProduct[] = [];
    const other: BankingProduct[] = [];
    
    allAvailableProducts.forEach(product => {
      if (product.matchScore > 0 && recommendationsData?.products?.some(r => 
        (r.productId || r.id) === (product.productId || product.id)
      )) {
        recommended.push(product);
      } else {
        other.push(product);
      }
    });
    
    // Sort recommended by match score (highest first)
    recommended.sort((a, b) => b.matchScore - a.matchScore);
    
    return { recommendedProducts: recommended, otherProducts: other };
  }, [allAvailableProducts, recommendationsData]);
  
  // Group products by type for category display
  const productsByType = useMemo(() => {
    const grouped: Record<string, BankingProduct[]> = {};
    allAvailableProducts.forEach(product => {
      if (!grouped[product.type]) {
        grouped[product.type] = [];
      }
      grouped[product.type].push(product);
    });
    return grouped;
  }, [allAvailableProducts]);
  
  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allAvailableProducts;
    const queryLower = searchQuery.toLowerCase();
    return allAvailableProducts.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.bank.toLowerCase().includes(queryLower) ||
      p.type.toLowerCase().includes(queryLower)
    );
  }, [allAvailableProducts, searchQuery]);
  
  const filteredProductsByType = useMemo(() => {
    const grouped: Record<string, BankingProduct[]> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.type]) {
        grouped[product.type] = [];
      }
      grouped[product.type].push(product);
    });
    return grouped;
  }, [filteredProducts]);
  
  const isLoadingProducts = isLoadingCatalog || isLoadingRecommendations;
  
  // Extract product IDs - BankingProduct has both id and productId (both set to same value)
  // Use productId first (the canonical ID), fallback to id
  const productIds = products
    .map(p => {
      // Both id and productId should be the same, but use productId as primary
      const productId = p.productId || p.id;
      if (!productId) {
        console.warn('[CompareTab] Product missing ID:', p);
      }
      return productId;
    })
    .filter((id): id is string => !!id && typeof id === 'string'); // Filter out undefined/null/non-string

  const { data: comparisonData, isLoading: isLoadingComparison, error } = useCompareProducts(productIds);

  if (products.length < 2) {
    if (isLoadingProducts) {
      return <LoadingState />;
    }
    
    return (
      <div className="space-y-6">
        <EnhancedEmptyState
          icon={Scale}
          title="Add Products to Compare"
          description="Select at least 2 products to compare them side by side. Recommended products are shown first."
          variant="default"
        />
        
        {/* Product Search/Add Section */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Products to Compare</h3>
                <Badge variant="secondary">{products.length} / 4</Badge>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or bank..."
                  className="pl-9"
                />
              </div>
              
              {/* Show Recommended Products First */}
              {!searchQuery && recommendedProducts.length > 0 && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Recommended for You</h4>
                    <Badge variant="secondary" className="text-xs">
                      {recommendedProducts.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedProducts.slice(0, 6).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onCompare={onAddToCompare}
                        isInCompare={false}
                        firebaseId={firebaseId}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show All Products by Category */}
              {Object.keys(filteredProductsByType).length > 0 ? (
                <div className="space-y-4 mt-6">
                  {!searchQuery && recommendedProducts.length > 0 && (
                    <div className="flex items-center gap-2 mt-6">
                      <h4 className="font-semibold text-sm">All Products</h4>
                    </div>
                  )}
                  {Object.entries(filteredProductsByType).map(([type, typeProducts]) => (
                    <ProductCategorySection
                      key={type}
                      type={type as BankingProduct['type']}
                      products={typeProducts}
                      onProductSelect={() => {}}
                      onAddToCompare={onAddToCompare}
                      isInCompare={(id) => products.some(p => (p.productId || p.id) === id)}
                      firebaseId={firebaseId}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? `No products found matching "${searchQuery}"` : 'No products available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (productIds.length < 2) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Some products are missing valid IDs. Please remove and re-add them to compare.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingComparison) {
    return <LoadingState />;
  }

  if (error) {
    console.error('[CompareTab] Error loading comparison:', error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn't load the product comparison. Check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!comparisonData) {
    return (
      <EnhancedEmptyState
        icon={Scale}
        title="Comparison Unavailable"
        description="We couldn't load the comparison data. Check your connection and try again."
        variant="default"
      />
    );
  }

  // Verify comparisonData has products
  if (!comparisonData.products || comparisonData.products.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No comparison data available. The products may not be available for comparison.
        </AlertDescription>
      </Alert>
    );
  }

  // Verify that returned products match requested products
  const returnedProductIds = comparisonData.products.map(p => p.productId || p.id);
  const missingProducts = productIds.filter(id => !returnedProductIds.includes(id));
  
  if (missingProducts.length > 0) {
    console.warn('[CompareTab] Some products not found in comparison response:', missingProducts);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Scale className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Compare Products</h2>
            <p className="text-sm text-muted-foreground">
              Compare {comparisonData.products.length} products side by side
            </p>
          </div>
        </div>
        
        {products.length < 4 && (
          <Button
            variant="outline"
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <ComparisonTable comparisonData={comparisonData} onRemove={onRemove} />
      
      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Product to Compare</DialogTitle>
            <DialogDescription>
              Search and select a product to add to your comparison ({products.length} / 4)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or bank..."
                className="pl-9"
              />
            </div>
            
            {isLoadingProducts ? (
              <LoadingState variant="compact" />
            ) : Object.keys(filteredProductsByType).length > 0 ? (
              <div className="space-y-4">
                {/* Show Recommended Products First */}
                {!searchQuery && recommendedProducts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Recommended for You</h4>
                      <Badge variant="secondary" className="text-xs">
                        {recommendedProducts.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendedProducts.slice(0, 6).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onCompare={(p) => {
                            onAddToCompare(p);
                            setShowAddDialog(false);
                            setSearchQuery('');
                          }}
                          isInCompare={false}
                          firebaseId={firebaseId}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show All Products by Category */}
                {(!searchQuery && recommendedProducts.length > 0) && (
                  <div className="flex items-center gap-2 mt-6">
                    <h4 className="font-semibold text-sm">All Products</h4>
                  </div>
                )}
                {Object.entries(filteredProductsByType).map(([type, typeProducts]) => (
                  <ProductCategorySection
                    key={type}
                    type={type as BankingProduct['type']}
                    products={typeProducts}
                    onProductSelect={() => {}}
                    onAddToCompare={(p) => {
                      onAddToCompare(p);
                      setShowAddDialog(false);
                      setSearchQuery('');
                    }}
                    isInCompare={(id) => products.some(p => (p.productId || p.id) === id)}
                    firebaseId={firebaseId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? `No products found matching "${searchQuery}"` : 'Start typing to search for products'}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
