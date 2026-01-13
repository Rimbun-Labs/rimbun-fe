import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Award } from 'lucide-react';
import { ProductComparison } from '@/lib/utils/bankingTransformers';
import { ScoreIndicator } from './ScoreIndicator';
import { EligibilityBadge } from './EligibilityBadge';

interface ComparisonTableProps {
  comparisonData: ProductComparison;
  onRemove: (productId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparisonData,
  onRemove,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [sortColumn, setSortColumn] = useState<'name' | 'score' | 'bank'>('score');

  const sortedProducts = [...comparisonData.products].sort((a, b) => {
    switch (sortColumn) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'score':
        return b.matchScore - a.matchScore;
      case 'bank':
        return a.bank.localeCompare(b.bank);
      default:
        return 0;
    }
  });

  const bestProduct = comparisonData.products.reduce((best, current) =>
    current.matchScore > best.matchScore ? current : best
  );

  return (
    <div className="space-y-6">
      {comparisonData.highlights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Best For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(comparisonData.highlights).map(([productId, highlights]) => {
                const product = comparisonData.products.find(p => p.id === productId);
                if (!product) return null;
                return (
                  <div key={productId} className="space-y-2">
                    <div className="font-medium text-sm">{product.name}</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {highlights.map((highlight, idx) => (
                        <li key={idx}>• {highlight}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Comparison</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="rounded"
                />
                Highlight Differences
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <button
                      onClick={() => setSortColumn('name')}
                      className="hover:text-primary transition-colors"
                    >
                      Product {sortColumn === 'name' && '▼'}
                    </button>
                  </th>
                  <th className="text-left p-3">
                    <button
                      onClick={() => setSortColumn('bank')}
                      className="hover:text-primary transition-colors"
                    >
                      Bank {sortColumn === 'bank' && '▼'}
                    </button>
                  </th>
                  <th className="text-left p-3">
                    <button
                      onClick={() => setSortColumn('score')}
                      className="hover:text-primary transition-colors"
                    >
                      Match Score {sortColumn === 'score' && '▼'}
                    </button>
                  </th>
                  <th className="text-left p-3">Eligibility</th>
                  <th className="text-left p-3">Key Features</th>
                  <th className="text-left p-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{product.name}</div>
                      {product.id === bestProduct.id && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Best Match
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">{product.bank}</td>
                    <td className="p-3">
                      <ScoreIndicator score={product.matchScore} size="sm" showLabel={false} />
                    </td>
                    <td className="p-3">
                      <EligibilityBadge status={product.eligibilityStatus} />
                    </td>
                    <td className="p-3">
                      <div className="text-sm space-y-1">
                        {product.features.apy && (
                          <div>APY: {product.features.apy}</div>
                        )}
                        {product.features.annualFee && (
                          <div>Annual Fee: {product.features.annualFee}</div>
                        )}
                        {product.features.interestRate && (
                          <div>Interest Rate: {product.features.interestRate}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

