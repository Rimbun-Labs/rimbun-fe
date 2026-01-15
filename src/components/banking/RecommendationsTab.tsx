import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ProductFilters, SortOption, ProductTypeFilter } from './ProductFilters';
import { ProductCategorySection } from './ProductCategorySection';
import { ProductSearch } from './ProductSearch';
import { BankingProduct } from '@/lib/api/types/banking';
import { useBankingRecommendations } from '@/hooks/useBankingProducts';
import { Sparkles } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Target } from 'lucide-react';

interface RecommendationsTabProps {
  firebaseId?: string;
  compareProducts: BankingProduct[];
  onAddToCompare: (product: BankingProduct) => void;
}

const sortProducts = (products: BankingProduct[], sortOption: SortOption): BankingProduct[] => {
  const sorted = [...products];
  switch (sortOption) {
    case 'matchScore':
      return sorted.sort((a, b) => b.matchScore - a.matchScore);
    case 'eligibility':
      const eligibilityOrder = { eligible: 0, likely_eligible: 1, may_qualify: 2, not_eligible: 3 };
      return sorted.sort((a, b) => 
        eligibilityOrder[a.eligibilityStatus] - eligibilityOrder[b.eligibilityStatus]
      );
    case 'productType':
      return sorted.sort((a, b) => a.type.localeCompare(b.type));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

export const RecommendationsTab = ({ 
  firebaseId, 
  compareProducts, 
  onAddToCompare 
}: RecommendationsTabProps) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProductTypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('matchScore');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'product' | 'institution'>('product');

  const { data, isLoading, error } = useBankingRecommendations({
    productType: selectedType !== 'all' ? selectedType : undefined,
  });

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    let products = [...data.products];
    
    if (selectedType !== 'all') {
      products = products.filter(p => p.type === selectedType);
    }
    
    // Add search filtering
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(queryLower)) ||
        (p.bank && p.bank.toLowerCase().includes(queryLower)) ||
        p.type.toLowerCase().includes(queryLower)
      );
    }
    
    return sortProducts(products, sortBy);
  }, [data, selectedType, sortBy, searchQuery]);

  const productsByType = useMemo(() => {
    if (!filteredProducts.length) return {};
    const grouped: Record<string, BankingProduct[]> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.type]) {
        grouped[product.type] = [];
      }
      grouped[product.type].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  // Extract available product types and banks from actual data
  const availableTypes = useMemo(() => {
    if (!data?.products) return [];
    const types = new Set(data.products.map(p => p.type));
    return Array.from(types);
  }, [data]);

  const availableBanks = useMemo(() => {
    if (!data?.products) return [];
    const banks = new Set(data.products.map(p => p.bank).filter(Boolean));
    return Array.from(banks).sort();
  }, [data]);

  // Map product types to readable names for search presets
  const productTypeLabels: Record<string, string> = {
    savings: 'Savings Account',
    credit_card: 'Credit Card',
    checking: 'Checking Account',
    cd: 'Fixed Deposit',
    loan: 'Personal Loan',
    debit_card: 'Debit Card',
    virtual_prepaid_card: 'Virtual Prepaid Card',
  };

  const presetProducts = useMemo(() => {
    return availableTypes
      .map(type => productTypeLabels[type] || type)
      .slice(0, 6);
  }, [availableTypes]);

  const isInCompare = (productId: string) => compareProducts.some((p) => p.id === productId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn't fetch your banking recommendations. Check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <EnhancedEmptyState
        icon={Target}
        title="No Recommendations Yet"
        description="Complete your financial assessment to see personalized banking product recommendations."
        variant="default"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-accent">
          <Sparkles className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Personalized Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products matched to your financial goals
          </p>
        </div>
      </div>

      <ProductSearch
        onSearch={(query) => setSearchQuery(query)}
        onPresetSelect={(preset) => setSearchQuery(preset)}
        searchMode={searchMode}
        onModeChange={setSearchMode}
        availableProducts={presetProducts}
        availableInstitutions={availableBanks}
      />

      <ProductFilters
        selectedType={selectedType}
        selectedGoal="all"
        sortBy={sortBy}
        onTypeChange={setSelectedType}
        onGoalChange={() => {}}
        onSortChange={setSortBy}
        availableGoals={[]}
        availableTypes={availableTypes}
      />

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
        <EnhancedEmptyState
          icon={Target}
          title="No products match your filters"
          description="Try adjusting your filters to see more recommendations."
          variant="default"
        />
      )}
    </div>
  );
};

