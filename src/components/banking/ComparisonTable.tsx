import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Award, CheckCircle2, XCircle, DollarSign, Sparkles, Info, ChevronDown, ChevronUp, Target, FileText, BarChart3, Gift, Shield, AlertCircle } from 'lucide-react';
import { ProductComparison } from '@/lib/utils/bankingTransformers';
import type { ComparisonRow } from '@/lib/api/types/banking';
import { ScoreIndicator } from './ScoreIndicator';
import { EligibilityBadge } from './EligibilityBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  comparisonData: ProductComparison;
  onRemove: (productId: string) => void;
}

// Category configuration
const categoryConfig = {
  basicInfo: {
    title: 'Basic Information',
    icon: Info,
    defaultExpanded: true,
  },
  eligibility: {
    title: 'Eligibility Requirements',
    icon: Shield,
    defaultExpanded: true,
  },
  fees: {
    title: 'Fees & Costs',
    icon: DollarSign,
    defaultExpanded: true,
  },
  rates: {
    title: 'Rates & Interest',
    icon: TrendingUp,
    defaultExpanded: true,
  },
  features: {
    title: 'Features & Access',
    icon: Gift,
    defaultExpanded: true,
  },
  scores: {
    title: 'Compatibility Scores',
    icon: BarChart3,
    defaultExpanded: true,
  },
} as const;

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparisonData,
  onRemove,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    eligibility: true,
    fees: true,
    rates: true,
    features: true,
    scores: true,
    description: false,
    explanation: false,
  });

  const sortedProducts = [...comparisonData.products].sort((a, b) => 
    b.matchScore - a.matchScore
  );

  const bestProduct = comparisonData.products.reduce((best, current) =>
    current.matchScore > best.matchScore ? current : best
  );

  // Get product by ID
  const getProductById = (productId: string) => {
    return comparisonData.products.find(p => p.productId === productId || p.id === productId);
  };

  // Get product index for highlighting differences
  const getProductIndex = (productId: string) => {
    return sortedProducts.findIndex(p => p.productId === productId || p.id === productId);
  };

  // Check if a value differs from the first product
  const isDifferent = (productId: string, allValues: Array<{ productId: string; display: string }>): boolean => {
    if (!highlightDifferences || allValues.length === 0) return false;
    const firstValue = allValues[0].display;
    const currentValue = allValues.find(v => v.productId === productId)?.display;
    return currentValue !== firstValue;
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Render a comparison row
  const renderComparisonRow = (row: ComparisonRow, category: keyof typeof categoryConfig) => {
    const productOrder = sortedProducts.map(p => p.productId || p.id);
    
    return (
      <tr key={row.attribute} className="border-b border-border hover:bg-muted/20 transition-colors">
        <td className="p-4 font-medium text-sm border-r border-border bg-muted/10">
          <div className="flex items-center gap-2">
            {row.attribute}
            {row.unit && (
              <span className="text-xs text-muted-foreground">({row.unit})</span>
            )}
          </div>
        </td>
        {productOrder.map((productId) => {
          const value = row.values.find(v => v.productId === productId);
          const productIndex = getProductIndex(productId);
          const isDiff = isDifferent(productId, row.values);
          
          if (!value) {
            return (
              <td key={productId} className="p-4 text-center text-sm border-r border-border last:border-r-0">
                <span className="text-muted-foreground">—</span>
              </td>
            );
          }

          const isBoolean = typeof value.value === 'boolean';
          const displayValue = value.display;

          return (
            <td
              key={productId}
              className={cn(
                "p-4 text-center text-sm border-r border-border last:border-r-0",
                isDiff && highlightDifferences && "bg-amber-50 dark:bg-amber-900/20",
                value.isBest && !isBoolean && "bg-green-50 dark:bg-green-900/20",
                value.isWorst && !isBoolean && "bg-red-50 dark:bg-red-900/20"
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                {isBoolean ? (
                  value.value === true ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )
                ) : (
                  <>
                    <span className={cn(
                      value.isBest && "font-semibold text-green-600 dark:text-green-400",
                      value.isWorst && "font-semibold text-red-600 dark:text-red-400"
                    )}>
                      {displayValue}
                    </span>
                    {value.isBest && (
                      <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        Best
                      </Badge>
                    )}
                    {value.isWorst && (
                      <Badge variant="secondary" className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                        Worst
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  // Render a comparison category section
  const renderCategorySection = (
    categoryKey: keyof typeof categoryConfig,
    rows?: ComparisonRow[]
  ) => {
    if (!rows || rows.length === 0) return null;

    const config = categoryConfig[categoryKey];
    const Icon = config.icon;
    const isExpanded = expandedSections[categoryKey] ?? config.defaultExpanded;

    return (
      <>
        <tr className="bg-primary/5 border-t-2 border-border">
          <td colSpan={sortedProducts.length + 1} className="p-3 font-bold text-sm uppercase tracking-wide text-foreground border-r border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{config.title}</span>
              </div>
              {rows.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection(categoryKey)}
                  className="h-auto p-1 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show All ({rows.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </td>
        </tr>
        {(isExpanded ? rows : rows.slice(0, 5)).map(row => renderComparisonRow(row, categoryKey))}
      </>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Match</span>
              </div>
              <div className="font-bold text-lg">{bestProduct.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{bestProduct.bank}</div>
              <div className="mt-2">
                <ScoreIndicator score={bestProduct.matchScore} size="sm" showLabel={true} />
              </div>
            </CardContent>
          </Card>

          {comparisonData.highlights?.bestValue && (
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Value</span>
                </div>
                {(() => {
                  const bestValueProduct = getProductById(comparisonData.highlights.bestValue!);
                  if (!bestValueProduct) return null;
                  return (
                    <>
                      <div className="font-bold text-lg">{bestValueProduct.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{bestValueProduct.bank}</div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {comparisonData.highlights?.bestOverall && (
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Overall</span>
                </div>
                {(() => {
                  const bestOverallProduct = getProductById(comparisonData.highlights.bestOverall!);
                  if (!bestOverallProduct) return null;
                  return (
                    <>
                      <div className="font-bold text-lg">{bestOverallProduct.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{bestOverallProduct.bank}</div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Highlights Section */}
        {comparisonData.highlights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Key Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisonData.highlights.bestForGoals && comparisonData.highlights.bestForGoals.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Best For Goals</h4>
                  <div className="space-y-2">
                    {comparisonData.highlights.bestForGoals.map((item, idx) => {
                      const product = getProductById(item.productId);
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium">{item.goalName}:</span>
                          <span>{product?.name || 'Unknown Product'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {comparisonData.highlights.keyDifferences && comparisonData.highlights.keyDifferences.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Differences</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {comparisonData.highlights.keyDifferences.map((diff, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Section */}
        {comparisonData.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Recommendation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisonData.summary.recommendation && (
                <p className="text-sm leading-relaxed">{comparisonData.summary.recommendation}</p>
              )}
              
              {comparisonData.summary.winner && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">Winner</Badge>
                    <span className="font-semibold">
                      {getProductById(comparisonData.summary.winner)?.name || 'Unknown Product'}
                    </span>
                  </div>
                  {comparisonData.summary.winnerReason && (
                    <p className="text-sm text-muted-foreground">{comparisonData.summary.winnerReason}</p>
                  )}
                </div>
              )}
              
              {comparisonData.summary.considerations && comparisonData.summary.considerations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Considerations</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {comparisonData.summary.considerations.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Comparison Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Product Comparison</CardTitle>
              <div className="flex items-center gap-2">
                <label className="text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlightDifferences}
                    onChange={(e) => setHighlightDifferences(e.target.checked)}
                    className="rounded cursor-pointer"
                  />
                  <span>Highlight Differences</span>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-semibold sticky left-0 bg-background z-10 min-w-[220px] border-r border-border">
                      <span className="text-base">Feature</span>
                    </th>
                    {sortedProducts.map((product) => (
                      <th key={product.id} className="text-center p-4 font-semibold min-w-[220px] bg-muted/20 border-r border-border last:border-r-0">
                        <div className="space-y-3">
                          {/* Product Name & Bank */}
                          <div>
                            <div className="font-semibold text-base mb-1">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.bank}</div>
                          </div>
                          
                          {/* Best Badge */}
                          {comparisonData.highlights?.bestOverall === (product.productId || product.id) && (
                            <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Best Overall
                            </Badge>
                          )}
                          {comparisonData.highlights?.bestValue === (product.productId || product.id) && (
                            <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Best Value
                            </Badge>
                          )}
                          
                          {/* Match Score */}
                          <div className="flex items-center justify-center">
                            <ScoreIndicator score={product.matchScore} size="sm" showLabel={true} />
                          </div>
                          
                          {/* Eligibility */}
                          <EligibilityBadge status={product.eligibilityStatus} />
                          
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(product.id)}
                            className="mt-2 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Render each comparison category */}
                  {renderCategorySection('basicInfo', comparisonData.comparison.basicInfo)}
                  {renderCategorySection('eligibility', comparisonData.comparison.eligibility)}
                  {renderCategorySection('fees', comparisonData.comparison.fees)}
                  {renderCategorySection('rates', comparisonData.comparison.rates)}
                  {renderCategorySection('features', comparisonData.comparison.features)}
                  {renderCategorySection('scores', comparisonData.comparison.scores)}

                  {/* Empty state if no comparison data */}
                  {!comparisonData.comparison.basicInfo && 
                   !comparisonData.comparison.eligibility && 
                   !comparisonData.comparison.fees && 
                   !comparisonData.comparison.rates && 
                   !comparisonData.comparison.features && 
                   !comparisonData.comparison.scores && (
                    <tr>
                      <td colSpan={sortedProducts.length + 1} className="p-8 text-center text-muted-foreground">
                        No comparison data available. The products may not be available for comparison.
                      </td>
                    </tr>
                  )}

                  {/* Product Description Section */}
                  {sortedProducts.some(p => p.description) && (
                    <>
                      <tr className="bg-primary/5 border-t-2 border-border">
                        <td colSpan={sortedProducts.length + 1} className="p-3 font-bold text-sm uppercase tracking-wide text-foreground border-r border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Product Description</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSection('description')}
                              className="h-auto p-1 text-xs"
                            >
                              {expandedSections.description ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  Show Descriptions
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedSections.description && (
                        <tr className="border-b-2 border-border">
                          <td className="p-4 font-medium text-sm border-r border-border bg-muted/10 align-top">
                            Description
                          </td>
                          {sortedProducts.map((product) => (
                            <td key={product.id} className="p-4 text-sm border-r border-border last:border-r-0 align-top">
                              {product.description ? (
                                <p className="text-muted-foreground leading-relaxed">
                                  {product.description}
                                </p>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      )}
                    </>
                  )}

                  {/* Explanation Section */}
                  {sortedProducts.some(p => p.explanation) && (
                    <>
                      <tr className="bg-primary/5 border-t-2 border-border">
                        <td colSpan={sortedProducts.length + 1} className="p-3 font-bold text-sm uppercase tracking-wide text-foreground border-r border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              <span>Why This Works For You</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSection('explanation')}
                              className="h-auto p-1 text-xs"
                            >
                              {expandedSections.explanation ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  Show Explanation
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedSections.explanation && (
                        <>
                          {sortedProducts.some(p => p.explanation?.mainExplanation) && (
                            <tr className="border-b border-border">
                              <td className="p-4 font-medium text-sm border-r border-border bg-muted/10 align-top">
                                Main Explanation
                              </td>
                              {sortedProducts.map(product => (
                                <td key={product.id} className="p-4 text-sm border-r border-border last:border-r-0 align-top">
                                  {product.explanation?.mainExplanation ? (
                                    <p className="text-muted-foreground leading-relaxed">
                                      {product.explanation.mainExplanation}
                                    </p>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                          {sortedProducts.some(p => p.explanation?.keyStrengths && p.explanation.keyStrengths.length > 0) && (
                            <tr className="border-b border-border">
                              <td className="p-4 font-medium text-sm border-r border-border bg-muted/10 align-top">
                                Key Strengths
                              </td>
                              {sortedProducts.map(product => (
                                <td key={product.id} className="p-4 border-r border-border last:border-r-0 align-top">
                                  {product.explanation?.keyStrengths && product.explanation.keyStrengths.length > 0 ? (
                                    <ul className="space-y-1.5 text-sm">
                                      {product.explanation.keyStrengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                          <span className="text-muted-foreground">{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                          {sortedProducts.some(p => p.explanation?.goalBenefits && p.explanation.goalBenefits.length > 0) && (
                            <tr className="border-b border-border">
                              <td className="p-4 font-medium text-sm border-r border-border bg-muted/10 align-top">
                                Goal-Specific Benefits
                              </td>
                              {sortedProducts.map(product => (
                                <td key={product.id} className="p-4 border-r border-border last:border-r-0 align-top">
                                  {product.explanation?.goalBenefits && product.explanation.goalBenefits.length > 0 ? (
                                    <div className="space-y-2 text-sm">
                                      {product.explanation.goalBenefits.map((gb, idx) => (
                                        <div key={idx} className="space-y-1">
                                          <Badge variant="outline" className="text-xs">{gb.goalName}</Badge>
                                          <p className="text-muted-foreground">{gb.benefit}</p>
                                          {gb.timeline && (
                                            <p className="text-xs text-muted-foreground">Timeline: {gb.timeline}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                          {sortedProducts.some(p => p.explanation?.cashFlowImpact) && (
                            <tr className="border-b-2 border-border">
                              <td className="p-4 font-medium text-sm border-r border-border bg-muted/10 align-top">
                                Cash Flow Impact
                              </td>
                              {sortedProducts.map(product => (
                                <td key={product.id} className="p-4 text-sm border-r border-border last:border-r-0 align-top">
                                  {product.explanation?.cashFlowImpact ? (
                                    <p className="text-muted-foreground leading-relaxed">
                                      {product.explanation.cashFlowImpact}
                                    </p>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
