import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingUp, 
  Building2, 
  DollarSign,
  Shield,
  Globe,
  BarChart3,
  Loader2,
  Clock,
  Star,
  GitCompare
} from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { assetAnalyzerApi, AssetSearchResult } from '@/lib/api/assetAnalyzerApi';

interface AssetSearchProps {
  onAssetSelect: (symbol: string) => void;
  onCompareAssets: (symbols: string[]) => void;
  sessionId: string;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Use AssetSearchResult from API instead of local interface

interface SuggestedSearch {
  symbol: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({
  onAssetSelect,
  onCompareAssets,
  sessionId,
  onError,
  isLoading,
  setIsLoading
}) => {
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AssetSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get suggested searches based on user profile
  const getSuggestedSearches = (): SuggestedSearch[] => {
    const profile = session?.metadata?.profile;
    
    const baseSuggestions: SuggestedSearch[] = [
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        description: 'Broad market exposure with low cost',
        icon: BarChart3,
        category: 'ETF'
      },
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        description: 'Technology growth exposure',
        icon: TrendingUp,
        category: 'ETF'
      },
      {
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        description: 'Total US stock market exposure',
        icon: Globe,
        category: 'ETF'
      },
      {
        symbol: 'AGG',
        name: 'iShares Core U.S. Aggregate Bond ETF',
        description: 'Diversified bond exposure',
        icon: Shield,
        category: 'Bond ETF'
      }
    ];

    if (profile === 'conservative') {
      return [
        {
          symbol: 'BND',
          name: 'Vanguard Total Bond Market ETF',
          description: 'Diversified bond exposure',
          icon: Shield,
          category: 'Bond ETF'
        },
        {
          symbol: 'TLT',
          name: 'iShares 20+ Year Treasury Bond ETF',
          description: 'Long-term government bonds',
          icon: Shield,
          category: 'Bond ETF'
        },
        {
          symbol: 'MONEY_MARKET',
          name: 'Money Market Fund',
          description: 'Low-risk cash equivalent',
          icon: DollarSign,
          category: 'Cash'
        },
        {
          symbol: 'CD_1_YEAR',
          name: '1-Year Certificate of Deposit',
          description: 'Guaranteed return investment',
          icon: DollarSign,
          category: 'Cash'
        }
      ];
    } else if (profile === 'aggressive') {
      return [
        {
          symbol: 'ARKK',
          name: 'ARK Innovation ETF',
          description: 'High-growth innovation companies',
          icon: TrendingUp,
          category: 'Growth ETF'
        },
        {
          symbol: 'QQQ',
          name: 'Invesco QQQ Trust',
          description: 'Technology growth exposure',
          icon: TrendingUp,
          category: 'ETF'
        },
        {
          symbol: 'VWO',
          name: 'Vanguard FTSE Emerging Markets ETF',
          description: 'Emerging markets exposure',
          icon: Globe,
          category: 'ETF'
        },
        {
          symbol: 'VNQ',
          name: 'Vanguard Real Estate ETF',
          description: 'Real estate investment trust',
          icon: Building2,
          category: 'REIT ETF'
        }
      ];
    }

    return baseSuggestions;
  };

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

  const suggestedSearches = getSuggestedSearches();

  return (
    <div className="space-y-6">
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
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
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
                        <Badge variant="outline" className="text-xs">
                          {result.currency}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
              {recentSearches.map((symbol, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssetClick(symbol)}
                  className="flex items-center gap-2"
                >
                  <Star className="h-3 w-3" />
                  {symbol}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Suggested for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedSearches.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              const isSelected = selectedForComparison.includes(suggestion.symbol);
              
              return (
                <div
                  key={index}
                  className="relative p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer group"
                  onClick={() => handleAssetClick(suggestion.symbol)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {suggestion.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Comparison Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComparisonToggle(suggestion.symbol);
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
                  onClick={() => setSelectedForComparison([])}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompareClick}
                  disabled={selectedForComparison.length < 2}
                >
                  Compare Assets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
