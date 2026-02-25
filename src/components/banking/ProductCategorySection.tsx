import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './ProductCard';
import { BankingProduct } from '@/lib/api/types/banking';
import { ChevronDown, ChevronUp, CreditCard, Landmark, PiggyBank, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ProductCategorySectionProps {
  type: BankingProduct['type'];
  products: BankingProduct[];
  onProductSelect: (product: BankingProduct) => void;
  onAddToCompare: (product: BankingProduct) => void;
  isInCompare: (productId: string) => boolean;
  firebaseId?: string;
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
  savings: 'Savings Accounts',
  credit_card: 'Credit Cards',
  checking: 'Checking Accounts',
  cd: 'Fixed Deposits',
  money_market: 'Money Market',
  loan: 'Loans',
  debit_card: 'Debit Cards',
  virtual_prepaid_card: 'Virtual Prepaid Cards',
};

export const ProductCategorySection = ({
  type,
  products,
  onProductSelect,
  onAddToCompare,
  isInCompare,
  firebaseId,
}: ProductCategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = typeIcons[type] || PiggyBank;
  const label = typeLabels[type] || type;
  const topProduct = products[0];

  return (
    <div className="w-full min-w-0 block">
      <div className="block w-full min-w-0" style={{ width: '100%' }}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {products.length} {products.length === 1 ? 'product' : 'products'} available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {topProduct && !isOpen && (
                      <div className="text-right flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1" title={topProduct.name}>
                          {topProduct.name || `${topProduct.bank} ${typeLabels[topProduct.type]}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {topProduct.bank} • Match: {topProduct.matchScore}%
                        </p>
                      </div>
                    )}
                    <Badge variant="secondary" className="ml-2">
                      {products.length}
                    </Badge>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onProductSelect}
                      onCompare={onAddToCompare}
                      isInCompare={isInCompare(product.id)}
                      isTopRecommendation={product.matchScore >= 90}
                      matchCount={product.alignedGoals.length}
                      firebaseId={firebaseId}
                    />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};
