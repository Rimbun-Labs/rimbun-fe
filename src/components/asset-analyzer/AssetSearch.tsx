import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  Building2, 
  BarChart3,
  Loader2,
  Clock,
  Star,
  GitCompare,
  Library,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetAnalyzerApi, AssetSearchResult } from '@/lib/api/assetAnalyzerApi';
import { useFundCatalog } from '@/hooks/useFunds';
import { useAuth } from '@/contexts/AuthContext';
import type { FundListItem, FundAssetClass, FundSource } from '@/lib/api/types/funds';
import { formatFundPerformance, formatFundValue, fundFitScoreToPercent } from '@/lib/utils/fundFormatters';
import { FundScoreIndicator } from './FundScoreIndicator';

const FUND_SOURCES: FundSource[] = ['baiduri', 'bibd'];
const FUND_ASSET_CLASSES: FundAssetClass[] = [
  'Equity',
  'Bond',
  'Multi-Asset',
  'REIT',
  'Money Market',
  'Fixed Income',
  'Other',
];

interface AssetSearchProps {
  onAssetSelect: (symbol: string) => void;
  onCompareAssets: (symbols: string[]) => void;
  onFundSelect?: (fundId: string) => void;
  sessionId: string;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  /** Fund compare from Search (fund list) */
  comparisonFundIds?: string[];
  onAddFundToCompare?: (fundId: string) => void;
  onRemoveFundFromCompare?: (fundId: string) => void;
  totalCompareCount?: number;
  onViewCompare?: () => void;
  addingFundToCompareId?: string | null;
}

function FundCardRow({
  fund,
  onClick,
  onAddToCompare,
  onRemoveFromCompare,
  isInCompare,
  isAddingToCompare,
}: {
  fund: FundListItem;
  onClick: () => void;
  onAddToCompare?: (fundId: string) => void;
  onRemoveFromCompare?: (fundId: string) => void;
  isInCompare?: boolean;
  isAddingToCompare?: boolean;
}) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground">{fund.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{fund.fundHouse}</span>
              <span>·</span>
              <span>{fund.geography}</span>
            </div>
            {(fund.description != null && fund.description !== '') && (
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{fund.description}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {fund.assetClass}
              </Badge>
              {fund.shariahCompliant && (
                <Badge variant="secondary" className="text-xs">
                  Shariah
                </Badge>
              )}
              {(fund.investmentHorizonOfficial != null && fund.investmentHorizonOfficial !== '') && (
                <Badge variant="outline" className="text-xs">
                  {fund.investmentHorizonOfficial}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right text-sm shrink-0 space-y-0.5 flex flex-col items-end">
            {onAddToCompare != null && onRemoveFromCompare != null && (
              <Button
                variant={isInCompare ? 'secondary' : 'outline'}
                size="sm"
                className="mb-2 gap-1"
                disabled={isAddingToCompare}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInCompare) onRemoveFromCompare(fund.fundId);
                  else onAddToCompare(fund.fundId);
                }}
              >
                {isAddingToCompare ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <GitCompare className="h-3 w-3" />
                )}
                {isInCompare ? 'Remove from compare' : 'Add to compare'}
              </Button>
            )}
            {fund.profileFit != null && (
              <div className="flex items-center gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                <FundScoreIndicator
                  score={fundFitScoreToPercent(fund.profileFit.score)}
                  size="sm"
                  showLabel
                  showInfoIcon
                  profileFit={fund.profileFit}
                />
                {fundFitScoreToPercent(fund.profileFit.score) >= 90 && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Top Match
                  </Badge>
                )}
              </div>
            )}
            <div>1Y: {formatFundPerformance(fund.performance1y)}</div>
            <div>3Y: {formatFundPerformance(fund.performance3y)}</div>
            {(fund.performance5y != null && fund.performance5y !== '') && (
              <div>5Y: {formatFundPerformance(fund.performance5y)}</div>
            )}
            {(fund.volatility3y != null && fund.volatility3y !== '') && (
              <div className="text-muted-foreground">Vol: {formatFundPerformance(fund.volatility3y)}</div>
            )}
            {(fund.riskLevel != null && fund.riskLevel !== '') && (
              <div className="text-muted-foreground">Risk: {fund.riskLevel}</div>
            )}
            {(fund.riskLevel == null || fund.riskLevel === '') && (fund.riskRatingOfficial != null && fund.riskRatingOfficial !== '') && (
              <div className="text-muted-foreground">Risk: {formatFundValue(fund.riskRatingOfficial)}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const AssetSearch: React.FC<AssetSearchProps> = ({
  onAssetSelect,
  onCompareAssets,
  onFundSelect,
  sessionId,
  onError,
  isLoading,
  setIsLoading,
  comparisonFundIds = [],
  onAddFundToCompare,
  onRemoveFundFromCompare,
  totalCompareCount = 0,
  onViewCompare,
  addingFundToCompareId = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AssetSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Funds mode state
  const [fundSource, setFundSource] = useState<FundSource | 'all'>('all');
  const [fundAssetClass, setFundAssetClass] = useState<FundAssetClass | 'all'>('all');
  const [fundSearch, setFundSearch] = useState('');
  const [fundShariahOnly, setFundShariahOnly] = useState(false);
  const { user } = useAuth();

  const fundListParams = useMemo(() => {
    const params: Parameters<typeof useFundCatalog>[0] = { limit: 50, offset: 0 };
    if (fundSource !== 'all') params.source = fundSource;
    if (fundAssetClass !== 'all') params.assetClass = fundAssetClass;
    if (fundSearch.trim()) params.search = fundSearch.trim();
    if (fundShariahOnly) params.shariahCompliant = true;
    if (user) params.includeFit = true;
    return params;
  }, [fundSource, fundAssetClass, fundSearch, fundShariahOnly, user]);

  const { data: fundCatalogData, isLoading: fundsLoading } = useFundCatalog(fundListParams);
  const funds = fundCatalogData?.funds ?? [];
  const fundsTotal = fundCatalogData?.total ?? 0;

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('asset-analyzer-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (symbol: string) => {
    const updated = [symbol, ...recentSearches.filter(s => s !== symbol)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('asset-analyzer-recent-searches', JSON.stringify(updated));
  };

  // Handle search input change
  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await assetAnalyzerApi.searchAssets(value);
      if (response.success) {
        setSearchResults(response.data.results);
        setShowResults(true);
      } else {
        onError('Search failed. Please try again.');
      }
    } catch (error) {
      onError('Failed to search assets. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle asset selection
  const handleAssetClick = (symbol: string) => {
    saveRecentSearch(symbol);
    onAssetSelect(symbol);
    setSearchQuery('');
    setShowResults(false);
  };

  // Handle comparison selection
  const handleComparisonToggle = (symbol: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol].slice(0, 3); // Max 3 for comparison
      }
    });
  };

  // Handle compare button click
  const handleCompareClick = () => {
    if (selectedForComparison.length >= 2) {
      onCompareAssets(selectedForComparison);
      setSelectedForComparison([]);
    }
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="symbol" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="symbol" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            By symbol
          </TabsTrigger>
          <TabsTrigger value="fund" className="gap-2">
            <Library className="h-4 w-4" />
            By fund
          </TabsTrigger>
        </TabsList>

        <TabsContent value="symbol" className="space-y-6 mt-0">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for stocks, ETFs, bonds..."
                className="pl-10 pr-4"
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {searchResults.map((result, index) => {
                    const isSelected = selectedForComparison.includes(result.symbol);
                    return (
                      <div
                        key={index}
                        className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0 relative group"
                        onClick={() => handleAssetClick(result.symbol)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{result.symbol}</div>
                              <div className="text-sm text-muted-foreground">{result.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {result.type} • {result.region}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {result.currency}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleComparisonToggle(result.symbol);
                              }}
                            >
                              <GitCompare className={`h-3 w-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((symbol, index) => {
                const isSelected = selectedForComparison.includes(symbol);
                return (
                  <div key={index} className="relative group">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssetClick(symbol)}
                      className="flex items-center gap-2 pr-8"
                    >
                      <Star className="h-3 w-3" />
                      {symbol}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="absolute right-0 top-0 p-1 h-full w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleComparisonToggle(symbol);
                      }}
                    >
                      <GitCompare className={`h-3 w-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Actions */}
      {selectedForComparison.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedForComparison.length} asset(s) selected for comparison
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedForComparison([]);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCompareClick();
                  }}
                  disabled={selectedForComparison.length < 2}
                >
                  Compare Assets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="fund" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Browse Funds
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a fund to see analysis, costs, and plain-language explanations.
                {!user && (
                  <span className="block mt-1 text-muted-foreground/90">
                    Sign in to see profile match scores and &quot;Top Match&quot; badges on each fund.
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={fundSource} onValueChange={(v) => setFundSource(v as FundSource | 'all')}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {FUND_SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Asset class</Label>
                  <Select value={fundAssetClass} onValueChange={(v) => setFundAssetClass(v as FundAssetClass | 'all')}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {FUND_ASSET_CLASSES.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Fund name..."
                      value={fundSearch}
                      onChange={(e) => setFundSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fund-shariah"
                      checked={fundShariahOnly}
                      onCheckedChange={(c) => setFundShariahOnly(c === true)}
                    />
                    <Label htmlFor="fund-shariah" className="text-sm font-normal cursor-pointer">
                      Shariah only
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {fundsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : funds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">No funds found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting filters. Total in catalog: {fundsTotal}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {funds.length} of {fundsTotal} funds. Click a fund to analyze or add to compare.
              </p>
              {totalCompareCount >= 2 && onViewCompare && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">
                      {totalCompareCount} fund(s) in compare
                    </span>
                    <Button size="sm" onClick={onViewCompare}>
                      <GitCompare className="h-4 w-4 mr-2" />
                      View comparison
                    </Button>
                  </CardContent>
                </Card>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {funds.map((fund) => (
                  <FundCardRow
                    key={fund.fundId}
                    fund={fund}
                    onClick={() => onFundSelect?.(fund.fundId)}
                    onAddToCompare={onAddFundToCompare}
                    onRemoveFromCompare={onRemoveFundFromCompare}
                    isInCompare={comparisonFundIds.includes(fund.fundId)}
                    isAddingToCompare={addingFundToCompareId === fund.fundId}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
