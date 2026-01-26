import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  BookOpen,
  GitCompare,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { AssetSearch } from './AssetSearch';
import { AssetAnalysis } from './AssetAnalysis';
import { ScoreCards } from './ScoreCards';
import { MetricsGrid } from './MetricsGrid';
import { EducationalMode } from './EducationalMode';
import { ComparisonView } from './ComparisonView';
import { EmptyState } from './EmptyState';
import { assetAnalyzerApi, AssetAnalysisResponse, ComparisonResponse } from '@/lib/api/assetAnalyzerApi';
import { handleApiError } from '@/lib/utils/assetAnalyzerUtils';

interface AssetAnalyzerTabProps {
  className?: string;
}

export const AssetAnalyzerTab: React.FC<AssetAnalyzerTabProps> = ({ className }) => {
  const { session } = useSession();
  
  // State management
  const [activeTab, setActiveTab] = useState<'search' | 'analysis' | 'educational' | 'compare'>('search');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [comparisonSymbols, setComparisonSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis data state - single source of truth
  const [analysisData, setAnalysisData] = useState<AssetAnalysisResponse['data'] | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse['data'] | null>(null);

  // Fetch analysis data when symbol changes
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!selectedSymbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use educational endpoint if we're on the educational tab
        const response = (activeTab === 'educational' && session?.responseGroupId)
          ? await assetAnalyzerApi.analyzeAssetEducational(selectedSymbol, session.responseGroupId)
          : await assetAnalyzerApi.analyzeAsset(selectedSymbol);
        
        if (response.success) {
          setAnalysisData(response.data);
        } else {
          setError('Failed to load analysis data');
        }
      } catch (error) {
        setError(handleApiError(error));
        console.error('Analysis fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [selectedSymbol, activeTab, session?.responseGroupId]);

  // Fetch comparison data when comparison symbols change
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!comparisonSymbols.length) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await assetAnalyzerApi.compareAssets(comparisonSymbols);
        if (response.success) {
          setComparisonData(response.data);
        } else {
          setError('Failed to load comparison data');
        }
      } catch (error) {
        setError(handleApiError(error));
        console.error('Comparison fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [comparisonSymbols]);
  // Handle asset selection from search
  const handleAssetSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('analysis');
    setError(null);
  };

  // Handle comparison selection
  const handleCompareAssets = (symbols: string[]) => {
    setComparisonSymbols(symbols);
    setActiveTab('compare');
    setError(null);
  };

  // Handle back to search
  const handleBackToSearch = () => {
    setActiveTab('search');
    setSelectedSymbol(null);
    setComparisonSymbols([]);
    setAnalysisData(null);
    setComparisonData(null);
    setError(null);
  };

  // Get recommendation color
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toUpperCase()) {
      case 'BUY':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      case 'SELL':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  // Get recommendation icon
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation?.toUpperCase()) {
      case 'BUY':
        return TrendingUp;
      case 'HOLD':
        return Minus;
      case 'SELL':
        return TrendingDown;
      default:
        return BarChart3;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Asset Analyzer</h2>
            <p className="text-muted-foreground">
              Analyze any asset with personalized insights
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
          <TabsTrigger value="search" className="flex items-center justify-center gap-2 flex-1">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center justify-center gap-2 flex-1">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="educational" className="flex items-center justify-center gap-2 flex-1">
            <BookOpen className="h-4 w-4" />
            Learn
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center justify-center gap-2 flex-1">
            <GitCompare className="h-4 w-4" />
            Compare
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <AssetSearch
            onAssetSelect={handleAssetSelect}
            onCompareAssets={handleCompareAssets}
            sessionId={session?.sessionId!}
            onError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {selectedSymbol ? (
            <>
              {/* Asset Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedSymbol}</CardTitle>
                        <p className="text-muted-foreground">Asset Analysis</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleBackToSearch}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      New Search
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Score Cards - Pass only analysis data */}
              <ScoreCards
                data={analysisData?.analysis}
                isLoading={isLoading}
              />

              {/* Metrics Grid - Pass only metrics data */}
              <MetricsGrid
                data={analysisData?.metrics}
                isLoading={isLoading}
              />

              {/* Analysis Details - Pass full data */}
              <AssetAnalysis
                data={analysisData}
                isLoading={isLoading}
              />
            </>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="Asset Analysis"
              description="Search for any asset to see comprehensive analysis including risk scores, financial metrics, and investment recommendations."
              actionText="Start Searching"
              onAction={() => setActiveTab('search')}
            />
          )}
        </TabsContent>

        {/* Educational Tab */}
        <TabsContent value="educational" className="space-y-6">
          {selectedSymbol ? (
            <EducationalMode
              data={analysisData}
              isLoading={isLoading}
            />
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Educational Insights"
              description="Get personalized learning content based on your investment profile and risk tolerance. Learn about financial concepts while analyzing real assets."
              actionText="Search for an Asset"
              onAction={() => setActiveTab('search')}
            />
          )}
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-6">
          {comparisonSymbols.length > 0 ? (
            <ComparisonView
              data={comparisonData}
              isLoading={isLoading}
              onBackToSearch={handleBackToSearch}
            />
          ) : (
            <EmptyState
              icon={GitCompare}
              title="Asset Comparison"
              description="Compare multiple assets side-by-side to make informed investment decisions. See how different assets stack up against each other."
              actionText="Add Assets to Compare"
              onAction={() => setActiveTab('search')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
