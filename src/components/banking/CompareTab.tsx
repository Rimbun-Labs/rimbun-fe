import React from 'react';
import { ComparisonTable } from './ComparisonTable';
import { useCompareProducts } from '@/hooks/useBankingProducts';
import { transformComparisonResponse } from '@/lib/utils/bankingTransformers';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Scale } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import type { BankingProduct } from '@/lib/api/types/banking';

interface CompareTabProps {
  firebaseId?: string;
  products: BankingProduct[];
  onRemove: (productId: string) => void;
}

export const CompareTab: React.FC<CompareTabProps> = ({
  firebaseId,
  products,
  onRemove,
}) => {
  const productIds = products.map(p => p.productId || p.id);
  const { data: comparisonData, isLoading, error } = useCompareProducts(productIds);

  if (products.length < 2) {
    return (
      <EnhancedEmptyState
        icon={Scale}
        title="Add Products to Compare"
        description="Select at least 2 products from recommendations to compare them side by side."
        variant="default"
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Scale className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Compare Products</h2>
          <p className="text-sm text-muted-foreground">
            Compare {products.length} products side by side
          </p>
        </div>
      </div>

      <ComparisonTable comparisonData={comparisonData} onRemove={onRemove} />
    </div>
  );
};
