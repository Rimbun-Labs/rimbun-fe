import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building2, Sparkles, Scale, Wallet, Grid3x3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BankingProduct } from '@/lib/api/types/banking';
import { RecommendationsTab } from '@/components/banking/RecommendationsTab';
import { CompareTab } from '@/components/banking/CompareTab';
import { MyProductsTab } from '@/components/banking/MyProductsTab';
import { BrowseAllTab } from '@/components/banking/BrowseAllTab';
import { PageHeader, PageContainer } from '@/components/layout';
import { SPACING } from '@/lib/constants/spacing';
import { cn } from '@/lib/utils';

const BankingProducts = () => {
  const { user } = useAuth();
  const firebaseId = user?.uid;
  const [compareProducts, setCompareProducts] = useState<BankingProduct[]>([]);
  const [activeTab, setActiveTab] = useState('recommendations');

  const handleAddToCompare = (product: BankingProduct) => {
    if (compareProducts.some((p) => p.id === product.id)) {
      setCompareProducts(compareProducts.filter((p) => p.id !== product.id));
    } else if (compareProducts.length >= 4) {
      return;
    } else {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter((p) => p.id !== productId));
  };

  return (
    <PageContainer>
      <PageHeader
        icon={Building2}
        title="Banking Products"
        description="Discover personalized banking products tailored to your financial goals"
      />

      {/* Main Content - wrapper forced full width so layout doesn't shrink to content */}
      <div className="space-y-6 mt-6 w-full min-w-0 block" style={{ width: '100%' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className={cn(SPACING.page.subsection, 'w-full min-w-0')}>
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="recommendations" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendations</span>
              <span className="sm:hidden">Recs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="browse-all" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Browse All</span>
              <span className="sm:hidden">Browse</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compare" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm relative"
            >
              <Scale className="h-4 w-4" />
              <span>Compare</span>
              {compareProducts.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground"
                >
                  {compareProducts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="my-products" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">My Products</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-6 w-full min-w-0 data-[state=inactive]:hidden" forceMount>
            <RecommendationsTab 
              firebaseId={firebaseId}
              compareProducts={compareProducts}
              onAddToCompare={handleAddToCompare}
            />
          </TabsContent>

          <TabsContent value="browse-all" className="mt-6 w-full min-w-0 data-[state=inactive]:hidden" forceMount>
            <BrowseAllTab 
              firebaseId={firebaseId}
              compareProducts={compareProducts}
              onAddToCompare={handleAddToCompare}
            />
          </TabsContent>

          <TabsContent value="compare" className="mt-6 w-full min-w-0 data-[state=inactive]:hidden" forceMount>
            <CompareTab 
              firebaseId={firebaseId}
              products={compareProducts}
              onAddToCompare={handleAddToCompare}
              onRemove={handleRemoveFromCompare}
            />
          </TabsContent>

          <TabsContent value="my-products" className="mt-6 w-full min-w-0 data-[state=inactive]:hidden" forceMount>
            <MyProductsTab firebaseId={firebaseId} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default BankingProducts;

