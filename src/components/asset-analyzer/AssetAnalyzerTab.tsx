import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Loader2,
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { AssetSearch } from './AssetSearch';
import { AssetAnalysis } from './AssetAnalysis';
import { ScoreCards } from './ScoreCards';
import { MetricsGrid } from './MetricsGrid';
import { EducationalMode } from './EducationalMode';
import { ComparisonView } from './ComparisonView';
import { EmptyState } from './EmptyState';
import { assetAnalyzerApi, AssetAnalysisResponse, ComparisonResponse } from '@/lib/api/assetAnalyzerApi';
import { handleApiError } from '@/lib/utils/assetAnalyzerUtils';
import { useFundDetail, useFundCompare, useFundGlossary } from '@/hooks/useFunds';
import { getFundDetail } from '@/lib/api/fundsApi';
import type { ShareClassListItem, FundCompareItem, GlossaryTerm, FundListItem } from '@/lib/api/types/funds';
import {
  formatFundPercent,
  formatFundAmount,
  formatFundDate,
  formatFundValue,
  formatFundPerformance,
  formatFundRatio,
  fundFitScoreToPercent,
  camelCaseToTitleCase,
} from '@/lib/utils/fundFormatters';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle, DollarSign, Target, Info, Sparkles } from 'lucide-react';
import { FundScoreIndicator } from './FundScoreIndicator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Human-readable labels for compare table rows */
const COMPARE_LABELS: Record<string, string> = {
  fundName: 'Fund name',
  className: 'Class name',
  currency: 'Currency',
  assetClass: 'Asset class',
  geography: 'Geography',
  shariahCompliant: 'Shariah compliant',
  minimumInitialAmount: 'Min. investment (amount)',
  minimumInitialCurrency: 'Min. investment (currency)',
  nav: 'NAV',
  navDate: 'NAV date',
  salesChargeCurrent: 'Sales charge',
  managementFee: 'Management fee',
  totalExpenseRatio: 'TER (annual)',
  performance1y: '1-year return',
  performance3y: '3-year return',
  volatility3y: 'Volatility (3Y)',
  riskRatingOfficial: 'Risk rating',
};

/** Grouped rows for compare table: Identity, Investment, Costs, Performance & risk */
const COMPARE_ROW_GROUPS: { groupLabel: string; keys: (keyof FundCompareItem)[] }[] = [
  { groupLabel: 'Identity', keys: ['fundName', 'className', 'currency', 'assetClass', 'geography', 'shariahCompliant'] },
  { groupLabel: 'Investment', keys: ['minimumInitialAmount', 'minimumInitialCurrency', 'nav', 'navDate'] },
  { groupLabel: 'Costs', keys: ['salesChargeCurrent', 'managementFee', 'totalExpenseRatio'] },
  { groupLabel: 'Performance & risk', keys: ['performance1y', 'performance3y', 'volatility3y', 'riskRatingOfficial'] },
];

/** Number of glossary terms to show before "Show more" in Learn tab */
const GLOSSARY_INITIAL_SHOW = 6;

/** Map compare row key to glossary term search (term.term) */
const COMPARE_KEY_TO_GLOSSARY: Partial<Record<keyof FundCompareItem, string>> = {
  nav: 'NAV',
  navDate: 'NAV',
  totalExpenseRatio: 'TER',
  managementFee: 'Management fee',
  salesChargeCurrent: 'Sales charge',
  minimumInitialAmount: 'Minimum investment',
  performance1y: 'Performance',
  performance3y: 'Performance',
  volatility3y: 'Volatility',
  riskRatingOfficial: 'Risk rating',
};

function findGlossaryTerm(terms: GlossaryTerm[], key: keyof FundCompareItem): GlossaryTerm | undefined {
  const search = COMPARE_KEY_TO_GLOSSARY[key];
  if (!search) return undefined;
  return terms.find((t) => t.term.toLowerCase().includes(search.toLowerCase()));
}

/** Label with optional glossary tooltip */
function CompareLabel({
  keyName,
  label,
  glossaryTerms,
}: {
  keyName: keyof FundCompareItem;
  label: string;
  glossaryTerms: GlossaryTerm[];
}) {
  const term = findGlossaryTerm(glossaryTerms, keyName);
  if (!term) return <>{label}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {label}
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium">{term.term}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{term.shortExplanation ?? term.definition}</p>
      </TooltipContent>
    </Tooltip>
  );
}

/** Performance & risk metrics to show (label, key on FundListItem, format) */
const FUND_PERFORMANCE_FIELDS: { label: string; key: keyof FundListItem; format: 'performance' | 'value' | 'ratio' }[] = [
  { label: '1-year return', key: 'performance1y', format: 'performance' },
  { label: '3-year return', key: 'performance3y', format: 'performance' },
  { label: '5-year return', key: 'performance5y', format: 'performance' },
  { label: '10-year return', key: 'performance10y', format: 'performance' },
  { label: 'Return since inception', key: 'performanceInception', format: 'performance' },
  { label: 'Volatility (3Y)', key: 'volatility3y', format: 'performance' },
  { label: 'Beta (3Y)', key: 'beta3y', format: 'ratio' },
  { label: 'Sharpe ratio', key: 'sharpeRatio', format: 'ratio' },
  { label: 'Risk rating', key: 'riskRatingOfficial', format: 'value' },
  { label: 'Morningstar rating', key: 'morningstarRating', format: 'value' },
];

/** Portfolio & valuation metrics */
const FUND_PORTFOLIO_FIELDS: { label: string; key: keyof FundListItem; format: 'amount' | 'value' | 'ratio' | 'date' | 'performance' }[] = [
  { label: 'AUM', key: 'aum', format: 'amount' },
  { label: 'AUM currency', key: 'aumCurrency', format: 'value' },
  { label: 'AUM date', key: 'aumDate', format: 'date' },
  { label: 'Inception date', key: 'inceptionDate', format: 'date' },
  { label: 'Number of holdings', key: 'numberOfHoldings', format: 'value' },
  { label: 'P/E ratio', key: 'peRatio', format: 'ratio' },
  { label: 'P/B ratio', key: 'pbRatio', format: 'ratio' },
  { label: 'Yield', key: 'yield', format: 'performance' },
  { label: 'Distribution yield', key: 'distributionYield', format: 'performance' },
  { label: 'Yield to maturity', key: 'yieldToMaturity', format: 'performance' },
  { label: 'Effective duration (years)', key: 'effectiveDurationYears', format: 'value' },
  { label: 'Benchmark', key: 'benchmark', format: 'value' },
];

function formatFundField(
  fund: FundListItem,
  key: keyof FundListItem,
  format: 'performance' | 'value' | 'ratio' | 'amount' | 'date'
): string {
  const raw = fund[key];
  if (raw == null || raw === '') return '—';
  switch (format) {
    case 'performance':
      return formatFundPerformance(raw as string | number | null);
    case 'ratio':
      return formatFundRatio(raw as string | number | null);
    case 'amount':
      return formatFundAmount(raw as string | number | null);
    case 'date':
      return formatFundDate(raw as string | null);
    default:
      return formatFundValue(raw);
  }
}

/** Derive risk level label from risk rating (e.g. "5" → "Higher risk") */
function getRiskLevelLabel(rating: string | null | undefined): string {
  if (rating == null || rating === '') return '—';
  const n = parseFloat(String(rating));
  if (Number.isNaN(n)) return String(rating);
  if (n <= 2) return 'Lower risk';
  if (n <= 3) return 'Moderate risk';
  return 'Higher risk';
}

/** Whether performance value is positive (for color) */
function isPositivePerformance(value: string | number | null | undefined): boolean | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return null;
  return n > 0;
}

/** Fund summary cards: Risk, Return, Cost, Key insights (borrowed from ScoreCards design) */
function FundSummaryCards({
  fund,
  shareClasses,
}: {
  fund: FundListItem;
  shareClasses: ShareClassListItem[];
}) {
  const interpretations = fund.interpretations ?? {};
  const interpEntries = Object.entries(interpretations).filter(([, v]) => v != null && v !== '');
  const minTer = shareClasses.reduce<number | null>((acc, sc) => {
    if (sc.totalExpenseRatio == null || sc.totalExpenseRatio === '') return acc;
    const n = parseFloat(String(sc.totalExpenseRatio));
    if (Number.isNaN(n)) return acc;
    return acc == null ? n : Math.min(acc, n);
  }, null);

  const hasRisk = fund.riskRatingOfficial != null && fund.riskRatingOfficial !== '';
  const hasReturn = (fund.performance1y != null && fund.performance1y !== '') || (fund.performance3y != null && fund.performance3y !== '');
  const hasCost = minTer != null || shareClasses.some((sc) => sc.totalExpenseRatio != null && sc.totalExpenseRatio !== '');
  const hasInsights = interpEntries.length > 0;

  if (!hasRisk && !hasReturn && !hasCost && !hasInsights) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">At a glance</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasRisk && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Risk</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {(fund.riskLevel != null && fund.riskLevel !== '') ? fund.riskLevel : getRiskLevelLabel(fund.riskRatingOfficial)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatFundValue(fund.riskRatingOfficial)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {interpretations.riskRatingOfficial ?? interpretations.volatility3y ?? 'Official risk rating'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {hasReturn && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className={cn(
              'border-l-4',
              isPositivePerformance(fund.performance1y ?? fund.performance3y) === true
                ? 'border-l-green-500'
                : isPositivePerformance(fund.performance1y ?? fund.performance3y) === false
                  ? 'border-l-red-500'
                  : 'border-l-muted-foreground/30'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={cn(
                      'h-4 w-4',
                      isPositivePerformance(fund.performance1y) === true ? 'text-green-500' : 'text-muted-foreground'
                    )} />
                    <span className="text-sm font-medium text-muted-foreground">Return</span>
                  </div>
                  <Badge variant="outline" className="text-xs">1Y / 3Y</Badge>
                </div>
                <div className={cn(
                  'text-2xl font-bold',
                  isPositivePerformance(fund.performance1y) === true ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                )}>
                  {formatFundPerformance(fund.performance1y) ?? formatFundPerformance(fund.performance3y)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {interpretations.performance1y ?? interpretations.performance3y ?? 'Fund performance'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {hasCost && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">Cost (TER)</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Lower is better</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {minTer != null ? formatFundPercent(String(minTer)) : (shareClasses[0]?.totalExpenseRatio != null ? formatFundPercent(shareClasses[0].totalExpenseRatio) : '—')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {shareClasses[0]?.interpretations?.totalExpenseRatio ?? 'Ongoing yearly cost; lower means more stays invested'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {hasInsights && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Key insights</span>
                  </div>
                </div>
                <ul className="text-sm space-y-1 mt-1">
                  {interpEntries.slice(0, 3).map(([, text]) => (
                    <li key={text} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground line-clamp-2">{text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Key takeaways card – plain-language summary from fund.interpretations (like recommendation reasoning) */
function FundKeyTakeaways({ fund }: { fund: FundListItem }) {
  const interpretations = fund.interpretations ?? {};
  const entries = Object.entries(interpretations).filter(([, v]) => v != null && v !== '');
  if (entries.length === 0) return null;
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          What this means
        </CardTitle>
        <CardDescription>Plain-language summary from the fund data</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {entries.map(([key, text]) => (
            <li key={key} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-sm text-muted-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** Performance & risk as individual metric cards with inline interpretation (MetricsGrid-style) */
function FundPerformanceCards({ fund }: { fund: FundListItem }) {
  const interpretations = fund.interpretations ?? {};
  const fields = FUND_PERFORMANCE_FIELDS.filter((f) => {
    const v = fund[f.key];
    return v != null && v !== '';
  });
  if (fields.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Performance & risk</h3>
      </div>
      <div className="space-y-4">
        {fields.map(({ label, key, format }, index) => {
          const value = formatFundField(fund, key, format);
          const interp = interpretations[key as string];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{label}</h4>
                      <div className="text-2xl font-bold text-primary mt-1">{value}</div>
                      {interp && (
                        <p className="text-sm text-muted-foreground mt-2">{interp}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Portfolio & valuation as cards with optional interpretation */
function FundPortfolioCards({ fund }: { fund: FundListItem }) {
  const fields = FUND_PORTFOLIO_FIELDS.filter((f) => {
    const v = fund[f.key];
    return v != null && v !== '';
  });
  if (fields.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Portfolio & valuation</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(({ label, key, format }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border border-border hover:border-primary/30 transition-colors h-full">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground text-sm">{label}</h4>
                <div className="text-xl font-bold text-primary mt-1">{formatFundField(fund, key, format)}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface AssetAnalyzerTabProps {
  className?: string;
}

export const AssetAnalyzerTab: React.FC<AssetAnalyzerTabProps> = ({ className }) => {
  const { session } = useSession();
  const { user } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<'search' | 'analysis' | 'educational' | 'compare'>('search');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [comparisonSymbols, setComparisonSymbols] = useState<string[]>([]);
  const [comparisonShareClassIds, setComparisonShareClassIds] = useState<string[]>([]);
  /** Funds added to compare from Search (fund list); each resolved to first share class */
  const [comparisonFromSearch, setComparisonFromSearch] = useState<Array<{ fundId: string; shareClassId: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingFundToCompareId, setAddingFundToCompareId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Analysis data state - single source of truth
  const [analysisData, setAnalysisData] = useState<AssetAnalysisResponse['data'] | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse['data'] | null>(null);

  const combinedShareClassIds = React.useMemo(
    () => [...comparisonShareClassIds, ...comparisonFromSearch.map((x) => x.shareClassId)],
    [comparisonShareClassIds, comparisonFromSearch]
  );
  const { data: fundDetailData, isLoading: fundDetailLoading } = useFundDetail(
    selectedFundId,
    { includeInterpretations: true, includeFit: !!user }
  );
  const { data: fundCompareData, isLoading: fundCompareLoading } = useFundCompare(
    combinedShareClassIds,
    { includeInterpretations: true }
  );
  const { data: glossaryData } = useFundGlossary();
  const glossaryTerms = glossaryData?.terms ?? [];

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
    setSelectedFundId(null);
    setActiveTab('analysis');
    setError(null);
  };

  const handleFundSelect = (fundId: string) => {
    setSelectedFundId(fundId);
    setSelectedSymbol(null);
    setActiveTab('analysis');
    setError(null);
  };

  const addShareClassToCompare = (shareClassId: string) => {
    if (!comparisonShareClassIds.includes(shareClassId)) {
      const total = comparisonShareClassIds.length + comparisonFromSearch.length;
      if (total >= 4) return;
      setComparisonShareClassIds((prev) => [...prev, shareClassId]);
    }
  };

  const removeShareClassFromCompare = (shareClassId: string) => {
    setComparisonShareClassIds((prev) => prev.filter((id) => id !== shareClassId));
  };

  const addFundToCompare = React.useCallback(
    async (fundId: string) => {
      if (comparisonFromSearch.some((x) => x.fundId === fundId)) return;
      const total = comparisonShareClassIds.length + comparisonFromSearch.length;
      if (total >= 4) return;
      setAddingFundToCompareId(fundId);
      setError(null);
      try {
        const { shareClasses } = await getFundDetail(fundId, { includeInterpretations: false });
        const first = shareClasses?.[0];
        if (first) {
          setComparisonFromSearch((prev) => [...prev, { fundId, shareClassId: first.shareClassId }]);
        } else {
          setError('This fund has no share classes to compare.');
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setAddingFundToCompareId(null);
      }
    },
    [comparisonFromSearch, comparisonShareClassIds.length]
  );

  const removeFundFromCompareByFundId = React.useCallback((fundId: string) => {
    setComparisonFromSearch((prev) => prev.filter((x) => x.fundId !== fundId));
  }, []);

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
    setSelectedFundId(null);
    setComparisonSymbols([]);
    setComparisonShareClassIds([]);
    setComparisonFromSearch([]);
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
    <TooltipProvider>
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
            onFundSelect={handleFundSelect}
            sessionId={session?.sessionId!}
            onError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            comparisonFundIds={comparisonFromSearch.map((x) => x.fundId)}
            onAddFundToCompare={addFundToCompare}
            onRemoveFundFromCompare={removeFundFromCompareByFundId}
            totalCompareCount={combinedShareClassIds.length}
            onViewCompare={() => setActiveTab('compare')}
            addingFundToCompareId={addingFundToCompareId}
          />
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {selectedFundId ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {fundDetailLoading ? 'Loading...' : fundDetailData?.fund?.name ?? 'Fund'}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1.5 mt-1">
                          {fundDetailData?.fund && (
                            <>
                              <div className="flex flex-wrap gap-x-3 gap-y-1">
                                <span>{fundDetailData.fund.fundHouse} · {fundDetailData.fund.assetClass} · {fundDetailData.fund.geography}</span>
                                {fundDetailData.fund.shariahCompliant && <span>Shariah compliant</span>}
                                {fundDetailData.fund.inceptionDate && (
                                  <span>Inception: {formatFundDate(fundDetailData.fund.inceptionDate)}</span>
                                )}
                                {fundDetailData.fund.fundManager && (
                                  <span>Manager: {fundDetailData.fund.fundManager}</span>
                                )}
                              </div>
                              {(fundDetailData.fund.description != null && fundDetailData.fund.description !== '') && (
                                <p className="max-w-2xl">{fundDetailData.fund.description}</p>
                              )}
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {(fundDetailData.fund.riskLevel != null && fundDetailData.fund.riskLevel !== '') && (
                                  <span><strong className="text-foreground">Risk:</strong> {fundDetailData.fund.riskLevel}</span>
                                )}
                                {(fundDetailData.fund.investmentHorizonOfficial != null && fundDetailData.fund.investmentHorizonOfficial !== '') && (
                                  <span><strong className="text-foreground">Recommended horizon:</strong> {fundDetailData.fund.investmentHorizonOfficial}</span>
                                )}
                              </div>
                              {fundDetailData.fund.profileFit ? (
                                <div className="flex items-center gap-3 flex-wrap mt-3 pt-3 border-t border-border">
                                  <FundScoreIndicator
                                    score={fundFitScoreToPercent(fundDetailData.fund.profileFit.score)}
                                    size="md"
                                    showLabel
                                    showInfoIcon
                                    profileFit={fundDetailData.fund.profileFit}
                                  />
                                  {fundFitScoreToPercent(fundDetailData.fund.profileFit.score) >= 90 && (
                                    <Badge className="bg-primary text-primary-foreground">
                                      <Star className="h-3 w-3 mr-1" />
                                      Top Match
                                    </Badge>
                                  )}
                                </div>
                              ) : user === null && (
                                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                                  Sign in to see how well this fund matches your profile (match score and &quot;Why this fund fits&quot;).
                                </p>
                              )}
                            </>
                          )}
                        </div>
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

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 shrink-0" />
                Open the <strong className="text-foreground">Learn</strong> tab for plain-language explanations and key terms.
              </p>

              {fundDetailLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : fundDetailData ? (
                <>
                  {fundDetailData.fund.profileFit && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Why this fund fits your profile
                        </CardTitle>
                        <CardDescription>How this fund matches your assessment (risk, horizon, preferences)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {fundDetailData.fund.profileFit.reasons.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground">Key strengths</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {fundDetailData.fund.profileFit.reasons.map((reason, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-0.5">✓</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="space-y-2 pt-2 border-t border-border">
                          <h4 className="text-sm font-semibold text-foreground">Breakdown</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {fundDetailData.fund.profileFit.matchDetails.risk && (
                              <div>
                                <span className="font-medium text-foreground">Risk: </span>
                                <span className={fundDetailData.fund.profileFit.matchDetails.risk.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                  {fundDetailData.fund.profileFit.matchDetails.risk.reason}
                                </span>
                              </div>
                            )}
                            {fundDetailData.fund.profileFit.matchDetails.horizon && (
                              <div>
                                <span className="font-medium text-foreground">Horizon: </span>
                                <span className={fundDetailData.fund.profileFit.matchDetails.horizon.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                  {fundDetailData.fund.profileFit.matchDetails.horizon.reason}
                                </span>
                              </div>
                            )}
                            {fundDetailData.fund.profileFit.matchDetails.shariah != null && (
                              <div>
                                <span className="font-medium text-foreground">Shariah: </span>
                                <span className={fundDetailData.fund.profileFit.matchDetails.shariah.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                  {fundDetailData.fund.profileFit.matchDetails.shariah.reason}
                                </span>
                              </div>
                            )}
                            {fundDetailData.fund.profileFit.matchDetails.assetClassAlignment != null && (
                              <div>
                                <span className="font-medium text-foreground">Asset class: </span>
                                <span className={fundDetailData.fund.profileFit.matchDetails.assetClassAlignment.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                  {fundDetailData.fund.profileFit.matchDetails.assetClassAlignment.reason}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <FundSummaryCards fund={fundDetailData.fund} shareClasses={fundDetailData.shareClasses} />
                  <FundKeyTakeaways fund={fundDetailData.fund} />
                  <FundPerformanceCards fund={fundDetailData.fund} />
                  <FundPortfolioCards fund={fundDetailData.fund} />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Share classes – NAV & costs</CardTitle>
                      <CardDescription>NAV, minimum investment, TER, sales charge, and management fee per share class. Add to compare in the Compare tab.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {fundDetailData.shareClasses.map((sc: ShareClassListItem) => {
                          const inCompare = comparisonShareClassIds.includes(sc.shareClassId);
                          const scInterpretations = sc.interpretations ?? {};
                          const hasInterp = Object.keys(scInterpretations).length > 0;
                          return (
                            <li
                              key={sc.shareClassId}
                              className="flex flex-col gap-3 rounded-lg border p-4 text-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="font-medium">{sc.className}</div>
                                  {sc.isin && (
                                    <div className="text-muted-foreground text-xs">ISIN: {sc.isin}</div>
                                  )}
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                                    <span>Currency: {sc.currency}</span>
                                    <span>NAV: {formatFundAmount(sc.nav)} ({formatFundDate(sc.navDate)})</span>
                                    <span>Min. investment: {sc.minimumInitialCurrency} {formatFundAmount(sc.minimumInitialAmount)}</span>
                                    <span>TER: {formatFundPercent(sc.totalExpenseRatio)}</span>
                                    <span>Sales charge: {formatFundPercent(sc.salesChargeCurrent)}</span>
                                    <span>Management fee: {formatFundPercent(sc.managementFee)}</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={inCompare ? 'secondary' : 'outline'}
                                  onClick={() => inCompare ? removeShareClassFromCompare(sc.shareClassId) : addShareClassToCompare(sc.shareClassId)}
                                >
                                  {inCompare ? 'Remove from compare' : 'Add to compare'}
                                </Button>
                              </div>
                              {hasInterp && (
                                <div className="pt-2 border-t border-border space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">What this means</p>
                                  <ul className="text-xs text-muted-foreground space-y-0.5">
                                    {Object.entries(scInterpretations)
                                      .filter(([, v]) => v != null && v !== '')
                                      .map(([k, v]) => (
                                        <li key={k} className="flex items-start gap-2">
                                          <span className="text-primary">•</span>
                                          <span>{v}</span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                  {combinedShareClassIds.length > 0 && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium">
                          {combinedShareClassIds.length} share class(es) selected for comparison
                        </span>
                        <Button size="sm" onClick={() => setActiveTab('compare')} disabled={combinedShareClassIds.length < 2}>
                          View comparison
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </>
          ) : selectedSymbol ? (
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
              description="Search by symbol or browse funds to see analysis, compare share classes, or learn."
              actionText="Start Searching"
              onAction={() => setActiveTab('search')}
            />
          )}
        </TabsContent>

        {/* Educational Tab */}
        <TabsContent value="educational" className="space-y-6">
          {selectedFundId && fundDetailLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : selectedFundId && fundDetailData?.fund ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Learn: {fundDetailData.fund.name}
                  </CardTitle>
                  <CardDescription>
                    Plain-language explanations for this fund
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fundDetailData.fund.interpretations && Object.keys(fundDetailData.fund.interpretations).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(fundDetailData.fund.interpretations).map(([key, value]) => (
                        <Collapsible key={key} className="group/insight w-full rounded-lg border">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex w-full items-center justify-between px-4 py-3 h-auto hover:bg-muted/50 rounded-lg rounded-b-none">
                              <span className="font-medium text-sm text-foreground text-left">{camelCaseToTitleCase(key)}</span>
                              <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/insight:rotate-90" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-3 pt-0 text-sm text-muted-foreground border-t">
                              {value}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      We&apos;re still adding plain-language insights for this fund. Below are key terms that apply to most funds.
                    </p>
                  )}
                </CardContent>
              </Card>
              {fundDetailData.shareClasses.some((sc) => sc.interpretations && Object.keys(sc.interpretations).length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <Collapsible defaultOpen={false} className="w-full">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group flex w-full items-center justify-between p-0 hover:bg-transparent">
                          <div className="text-left">
                            <CardTitle className="text-lg">Share class insights</CardTitle>
                            <CardDescription className="pt-0.5">Plain-language explanations for specific share classes</CardDescription>
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pt-4 space-y-2">
                          {fundDetailData.shareClasses
                            .filter((sc) => sc.interpretations && Object.keys(sc.interpretations).length > 0)
                            .map((sc) => (
                              <Collapsible key={sc.shareClassId} className="group/sc w-full rounded-lg border">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" className="flex w-full items-center justify-between px-4 py-3 h-auto hover:bg-muted/50 rounded-lg rounded-b-none">
                                    <span className="font-medium text-sm text-foreground text-left">{sc.className}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/sc:rotate-90" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="px-4 pb-3 pt-2 space-y-1 text-sm border-t">
                                    {sc.interpretations && Object.entries(sc.interpretations).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="text-muted-foreground">{camelCaseToTitleCase(key)}:</span> {value}
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardHeader>
                </Card>
              )}
              {glossaryTerms.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <Collapsible defaultOpen={false} className="w-full">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group flex w-full items-center justify-between p-0 hover:bg-transparent">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Fund terms explained
                          </CardTitle>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                      <CardDescription className="pt-1">
                        Definitions and short explanations for common fund terms
                      </CardDescription>
                      <CollapsibleContent>
                        <div className="pt-4 space-y-3">
                          {(glossaryTerms.length > GLOSSARY_INITIAL_SHOW
                            ? glossaryTerms.slice(0, GLOSSARY_INITIAL_SHOW)
                            : glossaryTerms
                          ).map((term) => (
                            <div key={term.termId} className="rounded-lg border p-3 text-sm">
                              <h4 className="font-medium text-foreground mb-1">{term.term}</h4>
                              <p className="text-muted-foreground">{term.shortExplanation ?? term.definition}</p>
                            </div>
                          ))}
                          {glossaryTerms.length > GLOSSARY_INITIAL_SHOW && (
                            <Collapsible className="group w-full">
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                  Show more terms ({glossaryTerms.length - GLOSSARY_INITIAL_SHOW} more)
                                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="pt-3 space-y-3">
                                  {glossaryTerms.slice(GLOSSARY_INITIAL_SHOW).map((term) => (
                                    <div key={term.termId} className="rounded-lg border p-3 text-sm">
                                      <h4 className="font-medium text-foreground mb-1">{term.term}</h4>
                                      <p className="text-muted-foreground">{term.shortExplanation ?? term.definition}</p>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardHeader>
                </Card>
              )}
            </>
          ) : selectedSymbol ? (
            <EducationalMode
              data={analysisData}
              isLoading={isLoading}
            />
          ) : (
            <>
              <Card>
                <CardContent className="flex flex-col items-center py-10 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Learn about funds</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    Select a fund above to see plain-language explanations and key terms for that fund. You can also browse the glossary below.
                  </p>
                  <Button onClick={() => setActiveTab('search')} variant="default">
                    Go to Search
                  </Button>
                </CardContent>
              </Card>
              {glossaryTerms.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <Collapsible defaultOpen={true} className="w-full">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group flex w-full items-center justify-between p-0 hover:bg-transparent">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Fund terms explained
                          </CardTitle>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                      <CardDescription className="pt-1">
                        Definitions and short explanations for common fund terms. Select a fund to see fund-specific insights too.
                      </CardDescription>
                      <CollapsibleContent>
                        <div className="pt-4 space-y-3">
                          {(glossaryTerms.length > GLOSSARY_INITIAL_SHOW
                            ? glossaryTerms.slice(0, GLOSSARY_INITIAL_SHOW)
                            : glossaryTerms
                          ).map((term) => (
                            <div key={term.termId} className="rounded-lg border p-3 text-sm">
                              <h4 className="font-medium text-foreground mb-1">{term.term}</h4>
                              <p className="text-muted-foreground">{term.shortExplanation ?? term.definition}</p>
                            </div>
                          ))}
                          {glossaryTerms.length > GLOSSARY_INITIAL_SHOW && (
                            <Collapsible className="group w-full">
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                  Show more terms ({glossaryTerms.length - GLOSSARY_INITIAL_SHOW} more)
                                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="pt-3 space-y-3">
                                  {glossaryTerms.slice(GLOSSARY_INITIAL_SHOW).map((term) => (
                                    <div key={term.termId} className="rounded-lg border p-3 text-sm">
                                      <h4 className="font-medium text-foreground mb-1">{term.term}</h4>
                                      <p className="text-muted-foreground">{term.shortExplanation ?? term.definition}</p>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardHeader>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-6">
          {combinedShareClassIds.length >= 2 ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5" />
                      Fund share class comparison
                    </CardTitle>
                    <Button variant="outline" onClick={handleBackToSearch} className="gap-2">
                      <Search className="h-4 w-4" />
                      New Search
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              {fundCompareLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : fundCompareData?.comparison?.length ? (
                <>
                  <Card>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-3 font-medium w-48">Field</th>
                            {fundCompareData.comparison.map((item: FundCompareItem) => (
                              <th key={item.shareClassId} className="text-left p-3 font-medium min-w-[140px]">
                                {item.fundName} · {item.className}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {COMPARE_ROW_GROUPS.map((group) => (
                            <React.Fragment key={group.groupLabel}>
                              <tr className="border-b bg-muted/30">
                                <td colSpan={fundCompareData.comparison.length + 1} className="p-2 pl-3 font-medium text-foreground">
                                  {group.groupLabel}
                                </td>
                              </tr>
                              {group.keys.map((key) => (
                                <tr key={key} className="border-b">
                                  <td className="p-3 text-muted-foreground pl-6">
                                    <CompareLabel
                                      keyName={key}
                                      label={COMPARE_LABELS[key] ?? camelCaseToTitleCase(key)}
                                      glossaryTerms={glossaryTerms}
                                    />
                                  </td>
                                  {fundCompareData.comparison.map((item: FundCompareItem) => {
                                    const raw = (item as Record<string, unknown>)[key];
                                    let display: string;
                                    if (key === 'shariahCompliant') {
                                      display = raw ? 'Yes' : 'No';
                                    } else if (key === 'minimumInitialAmount') {
                                      display = formatFundAmount(raw as string | number | null);
                                    } else if (key === 'nav' || key === 'navDate') {
                                      display = key === 'navDate' ? formatFundDate(raw as string | null) : formatFundAmount(raw as string | number | null);
                                    } else if (key === 'salesChargeCurrent' || key === 'managementFee' || key === 'totalExpenseRatio') {
                                      display = formatFundPercent(raw as string | number | null);
                                    } else if (key === 'performance1y' || key === 'performance3y' || key === 'volatility3y') {
                                      display = formatFundPerformance(raw as string | number | null);
                                    } else if (raw == null || raw === '') {
                                      display = '—';
                                    } else {
                                      display = String(raw);
                                    }
                                    return (
                                      <td key={item.shareClassId} className="p-3">
                                        {display}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                  {/* Interpretations when present */}
                  {(fundCompareData.comparison.some((i) => (i.fundInterpretations && Object.keys(i.fundInterpretations).length > 0) || (i.shareClassInterpretations && Object.keys(i.shareClassInterpretations!).length > 0))) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Insights</CardTitle>
                        <CardDescription>Plain-language interpretations for each fund and share class</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {fundCompareData.comparison.map((item: FundCompareItem) => (
                          <div key={item.shareClassId} className="rounded-lg border p-4 space-y-3">
                            <h4 className="font-medium">{item.fundName} · {item.className}</h4>
                            {item.fundInterpretations && Object.keys(item.fundInterpretations).length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Fund</p>
                                {Object.entries(item.fundInterpretations).map(([k, v]) => (
                                  <div key={k} className="text-sm"><span className="text-muted-foreground">{camelCaseToTitleCase(k)}:</span> {v}</div>
                                ))}
                              </div>
                            )}
                            {item.shareClassInterpretations && Object.keys(item.shareClassInterpretations).length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Share class</p>
                                {Object.entries(item.shareClassInterpretations).map(([k, v]) => (
                                  <div key={k} className="text-sm"><span className="text-muted-foreground">{camelCaseToTitleCase(k)}:</span> {v}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </>
          ) : comparisonSymbols.length > 0 ? (
            <ComparisonView
              data={comparisonData}
              isLoading={isLoading}
              onBackToSearch={handleBackToSearch}
            />
          ) : (
            <EmptyState
              icon={GitCompare}
              title="Asset Comparison"
              description="Compare symbols (from Search) or fund share classes (add from a fund's Analysis view)."
              actionText="Add Assets to Compare"
              onAction={() => setActiveTab('search')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
};
