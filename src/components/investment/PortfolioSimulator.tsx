import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Save,
  AlertCircle,
  Info,
  Target,
  PieChart,
  Edit,
  Trash2,
  X,
  Maximize2,
  Minimize2,
  Zap,
  CloudRain,
  Sun
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';

interface AssetAllocations {
  equities: number;
  bonds: number;
  realEstate: number;
  cash: number;
}

interface PortfolioSimulatorProps {
  currentAllocations?: AssetAllocations;
  recommendedAllocations?: AssetAllocations;
  riskProfile?: number;
  targetAmount?: number;
  investmentHorizon?: number;
  monthlyContribution?: number;
  isLoading?: boolean;
}

interface Scenario {
  id: string;
  name: string;
  allocations: AssetAllocations;
  projectedReturn: number;
  projectedRisk: number;
  timeToGoal?: number;
}

interface MarketScenario {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  equityReturn: number; // Multiplier or absolute adjustment
  bondReturn: number;
  realEstateReturn: number;
  cashReturn: number;
  duration: number; // Years the scenario lasts
  probability?: string; // e.g., "Low", "Medium", "High"
}

export const PortfolioSimulator: React.FC<PortfolioSimulatorProps> = ({
  currentAllocations,
  recommendedAllocations,
  riskProfile = 50,
  targetAmount,
  investmentHorizon,
  monthlyContribution,
  isLoading,
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();
  
  // Initialize viewport size state first
  const [viewportSize, setViewportSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1024, height: 768 }; // Default fallback
  });
  
  // Initialize chart expansion state before chartConfig
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  
  // Track viewport size for responsive chart
  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);
  
  // Calculate responsive chart dimensions
  const chartConfig = useMemo(() => {
    const isMobile = viewportSize.width < 640;
    const isTablet = viewportSize.width >= 640 && viewportSize.width < 1024;
    const isDesktop = viewportSize.width >= 1024;
    
    // Chart height based on viewport and expansion state
    let height: number;
    if (isChartExpanded) {
      // Expanded: use more of the viewport
      height = Math.min(viewportSize.height * 0.7, 600);
    } else {
      // Normal: responsive based on screen size
      if (isMobile) {
        height = Math.max(viewportSize.height * 0.3, 200);
      } else if (isTablet) {
        height = 300;
      } else {
        height = 350;
      }
    }
    
    // Margins based on screen size
    const margins = {
      mobile: { top: 10, right: 10, bottom: 40, left: 50 },
      tablet: { top: 15, right: 20, bottom: 45, left: 60 },
      desktop: { top: 20, right: 30, bottom: 50, left: 70 },
    };
    
    const margin = isMobile ? margins.mobile : isTablet ? margins.tablet : margins.desktop;
    
    // Font sizes and tick counts
    const fontSize = isMobile ? 10 : isTablet ? 11 : 12;
    const tickCount = isMobile ? 5 : isTablet ? 8 : 10;
    
    // Y-axis width
    const yAxisWidth = isMobile ? 50 : isTablet ? 60 : 70;
    
    return {
      height,
      margin,
      fontSize,
      tickCount,
      yAxisWidth,
      isMobile,
      isTablet,
      isDesktop,
    };
  }, [viewportSize, isChartExpanded]);
  
  // Initialize with recommended allocations or defaults
  const defaultAllocations: AssetAllocations = recommendedAllocations || {
    equities: 60,
    bonds: 25,
    realEstate: 10,
    cash: 5,
  };

  const [allocations, setAllocations] = useState<AssetAllocations>(defaultAllocations);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [scenarioName, setScenarioName] = useState('');
  const [selectedMarketScenarios, setSelectedMarketScenarios] = useState<string[]>([]);
  const [showScenarioComparison, setShowScenarioComparison] = useState(false);

  // Calculate total allocation
  const totalAllocation = useMemo(() => {
    return allocations.equities + allocations.bonds + allocations.realEstate + allocations.cash;
  }, [allocations]);

  // Market scenario definitions (hardcoded based on historical patterns)
  const marketScenarios: MarketScenario[] = useMemo(() => [
    {
      id: 'baseline',
      name: 'Baseline (Normal Market)',
      description: 'Average historical returns - typical market conditions',
      icon: Sun,
      color: '#4f46e5',
      equityReturn: 0.08, // 8%
      bondReturn: 0.04, // 4%
      realEstateReturn: 0.06, // 6%
      cashReturn: 0.02, // 2%
      duration: 20,
      probability: 'High'
    },
    {
      id: 'bull',
      name: 'Bull Market',
      description: 'Strong economic growth - markets performing exceptionally well',
      icon: TrendingUp,
      color: '#22c55e',
      equityReturn: 0.15, // 15% (nearly double)
      bondReturn: 0.05, // 5%
      realEstateReturn: 0.12, // 12% (double)
      cashReturn: 0.02, // 2%
      duration: 3,
      probability: 'Medium'
    },
    {
      id: 'bear',
      name: 'Bear Market',
      description: 'Market downturn - similar to 2008 financial crisis',
      icon: TrendingDown,
      color: '#ef4444',
      equityReturn: -0.20, // -20%
      bondReturn: 0.03, // 3% (bonds as safe haven)
      realEstateReturn: -0.10, // -10%
      cashReturn: 0.02, // 2%
      duration: 2,
      probability: 'Low'
    },
    {
      id: 'recession',
      name: 'Recession',
      description: 'Economic contraction - moderate market decline',
      icon: CloudRain,
      color: '#f59e0b',
      equityReturn: -0.15, // -15%
      bondReturn: 0.04, // 4% (bonds hold value)
      realEstateReturn: -0.08, // -8%
      cashReturn: 0.02, // 2%
      duration: 2,
      probability: 'Low'
    },
    {
      id: 'high-inflation',
      name: 'High Inflation',
      description: 'Rising prices - real estate and equities outperform',
      icon: Zap,
      color: '#eab308',
      equityReturn: 0.10, // 10% (inflation hedge)
      bondReturn: -0.05, // -5% (bonds lose value)
      realEstateReturn: 0.15, // 15% (strong inflation hedge)
      cashReturn: -0.03, // -3% (cash loses purchasing power)
      duration: 3,
      probability: 'Medium'
    },
    {
      id: 'recovery',
      name: 'Post-Crisis Recovery',
      description: 'Market recovery after downturn - strong rebound',
      icon: TrendingUp,
      color: '#10b981',
      equityReturn: 0.18, // 18% (strong recovery)
      bondReturn: 0.01, // 1% (low rates)
      realEstateReturn: 0.08, // 8%
      cashReturn: 0.01, // 1% (low rates)
      duration: 2,
      probability: 'Medium'
    }
  ], []);

  // Calculate projected metrics based on allocation and selected scenarios
  const projectedMetrics = useMemo(() => {
    // Baseline returns
    const baselineEquityReturn = 0.08;
    const baselineBondReturn = 0.04;
    const baselineRealEstateReturn = 0.06;
    const baselineCashReturn = 0.02;

    const equityRisk = 0.18;
    const bondRisk = 0.06;
    const realEstateRisk = 0.12;
    const cashRisk = 0.01;

    // Calculate baseline weighted return
    const baselineWeightedReturn = 
      (allocations.equities / 100) * baselineEquityReturn +
      (allocations.bonds / 100) * baselineBondReturn +
      (allocations.realEstate / 100) * baselineRealEstateReturn +
      (allocations.cash / 100) * baselineCashReturn;

    const weightedRisk = 
      (allocations.equities / 100) * equityRisk +
      (allocations.bonds / 100) * bondRisk +
      (allocations.realEstate / 100) * realEstateRisk +
      (allocations.cash / 100) * cashRisk;

    // Calculate time to goal if we have target amount and monthly contribution
    let timeToGoal: number | undefined;
    if (targetAmount && monthlyContribution) {
      const monthlyReturn = baselineWeightedReturn / 12;
      const currentValue = 0; // Could be passed as prop
      let months = 0;
      let value = currentValue;
      
      while (value < targetAmount && months < 600) { // Max 50 years
        value = value * (1 + monthlyReturn) + monthlyContribution;
        months++;
      }
      timeToGoal = months;
    }

    return {
      projectedReturn: baselineWeightedReturn * 100, // Convert to percentage
      projectedRisk: weightedRisk * 100, // Convert to percentage
      riskAdjustedReturn: (baselineWeightedReturn / weightedRisk) * 100,
      timeToGoal,
    };
  }, [allocations, targetAmount, monthlyContribution]);

  // Generate projection data for chart with scenarios
  const projectionData = useMemo(() => {
    const years = investmentHorizon || 20;
    const monthlyContributionAmount = monthlyContribution || 1000;
    const data: Array<{ year: number; baseline: number; [key: string]: number | string }> = [];

    // Calculate baseline returns based on allocation
    const baselineEquityReturn = 0.08;
    const baselineBondReturn = 0.04;
    const baselineRealEstateReturn = 0.06;
    const baselineCashReturn = 0.02;
    
    const baselineWeightedReturn = 
      (allocations.equities / 100) * baselineEquityReturn +
      (allocations.bonds / 100) * baselineBondReturn +
      (allocations.realEstate / 100) * baselineRealEstateReturn +
      (allocations.cash / 100) * baselineCashReturn;
    
    const baselineMonthlyReturn = baselineWeightedReturn / 12;
    let baselineValue = 0;

    // Calculate scenario projections
    const scenarioProjections: Record<string, number[]> = {};
    
    selectedMarketScenarios.forEach(scenarioId => {
      const scenario = marketScenarios.find(s => s.id === scenarioId);
      if (!scenario) return;
      
      scenarioProjections[scenarioId] = [];
      let scenarioValue = 0;
      
      // Calculate returns for this scenario
      const scenarioEquityReturn = scenario.equityReturn;
      const scenarioBondReturn = scenario.bondReturn;
      const scenarioRealEstateReturn = scenario.realEstateReturn;
      const scenarioCashReturn = scenario.cashReturn;
      
      const scenarioWeightedReturn = 
        (allocations.equities / 100) * scenarioEquityReturn +
        (allocations.bonds / 100) * scenarioBondReturn +
        (allocations.realEstate / 100) * scenarioRealEstateReturn +
        (allocations.cash / 100) * scenarioCashReturn;
      
      const scenarioMonthlyReturn = scenarioWeightedReturn / 12;
      
      for (let i = 0; i <= years * 12; i += 12) {
        if (i === 0) {
          scenarioProjections[scenarioId].push(0);
        } else {
          // Calculate value for this year
          for (let m = 0; m < 12; m++) {
            scenarioValue = scenarioValue * (1 + scenarioMonthlyReturn) + monthlyContributionAmount;
          }
          scenarioProjections[scenarioId].push(scenarioValue);
        }
      }
    });

    // Generate data points
    for (let i = 0; i <= years * 12; i += 12) {
      const year = i / 12;
      const dataPoint: { year: number; baseline: number; [key: string]: number | string } = {
        year,
        baseline: baselineValue,
      };

      // Add scenario values
      selectedMarketScenarios.forEach(scenarioId => {
        const scenarioIndex = Math.floor(i / 12);
        if (scenarioProjections[scenarioId] && scenarioProjections[scenarioId][scenarioIndex] !== undefined) {
          dataPoint[scenarioId] = scenarioProjections[scenarioId][scenarioIndex];
        }
      });

      data.push(dataPoint);

      // Calculate baseline value for next year
      if (i < years * 12) {
        for (let m = 0; m < 12; m++) {
          baselineValue = baselineValue * (1 + baselineMonthlyReturn) + monthlyContributionAmount;
        }
      }
    }

    return data;
  }, [allocations, monthlyContribution, investmentHorizon, selectedMarketScenarios, marketScenarios]);

  // Handle slider change
  const handleAllocationChange = useCallback((assetClass: keyof AssetAllocations, value: number[]) => {
    setAllocations(prev => {
      const newValue = value[0];
      const oldValue = prev[assetClass];
      const difference = newValue - oldValue;
      
      // Calculate total of other allocations
      const otherTotal = Object.entries(prev)
        .filter(([key]) => key !== assetClass)
        .reduce((sum, [, val]) => sum + val, 0);
      
      // If other allocations are 0, we can't adjust them
      if (otherTotal === 0) {
        return { ...prev, [assetClass]: Math.min(newValue, 100) };
      }
      
      // Adjust other allocations proportionally to maintain 100% total
      const newAllocations = { ...prev, [assetClass]: newValue };
      const newOtherTotal = 100 - newValue;
      
      if (newOtherTotal < 0) {
        // If new value exceeds 100%, cap it at 100% and set others to 0
        return {
          equities: assetClass === 'equities' ? 100 : 0,
          bonds: assetClass === 'bonds' ? 100 : 0,
          realEstate: assetClass === 'realEstate' ? 100 : 0,
          cash: assetClass === 'cash' ? 100 : 0,
        };
      }
      
      // Adjust proportionally
      Object.keys(newAllocations).forEach(key => {
        if (key !== assetClass) {
          const oldOtherValue = prev[key as keyof AssetAllocations];
          newAllocations[key as keyof AssetAllocations] = 
            Math.round((oldOtherValue / otherTotal) * newOtherTotal);
        }
      });
      
      // Ensure total is exactly 100% (handle rounding errors)
      const finalTotal = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
      if (finalTotal !== 100) {
        const adjustment = 100 - finalTotal;
        // Find the largest non-adjusted allocation and add/subtract the difference
        const largestKey = Object.entries(newAllocations)
          .filter(([key]) => key !== assetClass)
          .sort(([, a], [, b]) => b - a)[0]?.[0] as keyof AssetAllocations;
        if (largestKey) {
          newAllocations[largestKey] = Math.max(0, newAllocations[largestKey] + adjustment);
        }
      }
      
      return newAllocations;
    });
  }, []);

  // Reset to recommended
  const handleReset = useCallback(() => {
    if (recommendedAllocations) {
      setAllocations(recommendedAllocations);
    }
  }, [recommendedAllocations]);

  // Open save dialog
  const handleOpenSaveDialog = useCallback(() => {
    setEditingScenario(null);
    setScenarioName(`Scenario ${savedScenarios.length + 1}`);
    setShowSaveDialog(true);
  }, [savedScenarios.length]);

  // Save scenario
  const handleSaveScenario = useCallback(() => {
    if (!scenarioName.trim()) return;
    
    const scenario: Scenario = {
      id: editingScenario?.id || Date.now().toString(),
      name: scenarioName.trim(),
      allocations: { ...allocations },
      projectedReturn: projectedMetrics.projectedReturn,
      projectedRisk: projectedMetrics.projectedRisk,
      timeToGoal: projectedMetrics.timeToGoal,
    };
    
    if (editingScenario) {
      setSavedScenarios(prev => prev.map(s => s.id === editingScenario.id ? scenario : s));
    } else {
      setSavedScenarios(prev => [...prev, scenario]);
    }
    
    setShowSaveDialog(false);
    setScenarioName('');
    setEditingScenario(null);
  }, [scenarioName, allocations, projectedMetrics, editingScenario]);

  // Delete scenario
  const handleDeleteScenario = useCallback((id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  // Edit scenario
  const handleEditScenario = useCallback((scenario: Scenario) => {
    setEditingScenario(scenario);
    setScenarioName(scenario.name);
    setShowSaveDialog(true);
  }, []);

  // Load scenario
  const handleLoadScenario = useCallback((scenario: Scenario) => {
    setAllocations(scenario.allocations);
  }, []);

  // Get risk level label
  const getRiskLevel = (risk: number) => {
    if (risk >= 15) return { label: 'High Risk', color: 'text-red-600' };
    if (risk >= 10) return { label: 'Moderate Risk', color: 'text-yellow-600' };
    return { label: 'Low Risk', color: 'text-green-600' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={4} />
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(projectedMetrics.projectedRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Portfolio Simulator
              </CardTitle>
              <CardDescription className="mt-2">
                Experiment with different asset allocations and see how they affect your portfolio's risk and return
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!recommendedAllocations}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenSaveDialog}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Allocation Sliders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adjust Asset Allocation</CardTitle>
          <CardDescription>
            Drag the sliders to adjust your portfolio allocation. Total must equal 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Equities */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Equities</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stocks and equity investments. Higher allocation = higher potential returns and risk.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={allocations.equities}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      handleAllocationChange('equities', [value]);
                    }}
                    className="w-20 h-9 text-center text-lg font-bold"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {recommendedAllocations && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    Recommended: {recommendedAllocations.equities}%
                  </Badge>
                )}
              </div>
            </div>
            <Slider
              value={[allocations.equities]}
              onValueChange={(value) => handleAllocationChange('equities', value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            {recommendedAllocations && (
              <div className="sm:hidden">
                <Badge variant="outline" className="text-xs">
                  Recommended: {recommendedAllocations.equities}%
                </Badge>
              </div>
            )}
          </div>

          {/* Bonds */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Bonds</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fixed-income investments. Lower risk, stable returns.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={allocations.bonds}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      handleAllocationChange('bonds', [value]);
                    }}
                    className="w-20 h-9 text-center text-lg font-bold"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {recommendedAllocations && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    Recommended: {recommendedAllocations.bonds}%
                  </Badge>
                )}
              </div>
            </div>
            <Slider
              value={[allocations.bonds]}
              onValueChange={(value) => handleAllocationChange('bonds', value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            {recommendedAllocations && (
              <div className="sm:hidden">
                <Badge variant="outline" className="text-xs">
                  Recommended: {recommendedAllocations.bonds}%
                </Badge>
              </div>
            )}
          </div>

          {/* Real Estate */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Real Estate</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Real estate investments. Moderate risk, inflation hedge.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={allocations.realEstate}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      handleAllocationChange('realEstate', [value]);
                    }}
                    className="w-20 h-9 text-center text-lg font-bold"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {recommendedAllocations && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    Recommended: {recommendedAllocations.realEstate}%
                  </Badge>
                )}
              </div>
            </div>
            <Slider
              value={[allocations.realEstate]}
              onValueChange={(value) => handleAllocationChange('realEstate', value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            {recommendedAllocations && (
              <div className="sm:hidden">
                <Badge variant="outline" className="text-xs">
                  Recommended: {recommendedAllocations.realEstate}%
                </Badge>
              </div>
            )}
          </div>

          {/* Cash */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Cash</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cash and cash equivalents. Lowest risk, lowest return.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={allocations.cash}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      handleAllocationChange('cash', [value]);
                    }}
                    className="w-20 h-9 text-center text-lg font-bold"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {recommendedAllocations && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    Recommended: {recommendedAllocations.cash}%
                  </Badge>
                )}
              </div>
            </div>
            <Slider
              value={[allocations.cash]}
              onValueChange={(value) => handleAllocationChange('cash', value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            {recommendedAllocations && (
              <div className="sm:hidden">
                <Badge variant="outline" className="text-xs">
                  Recommended: {recommendedAllocations.cash}%
                </Badge>
              </div>
            )}
          </div>

          {/* Total Allocation Warning */}
          {totalAllocation !== 100 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Total allocation is {totalAllocation}%. Please adjust to equal 100%.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projected Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projected Return */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Projected Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {formatPercentage(projectedMetrics.projectedReturn / 100)}
              </div>
              <p className="text-sm text-muted-foreground">Annual expected return</p>
            </div>
          </CardContent>
        </Card>

        {/* Projected Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Projected Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${riskLevel.color}`}>
                {formatPercentage(projectedMetrics.projectedRisk / 100)}
              </div>
              <p className="text-sm text-muted-foreground">{riskLevel.label}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Scenario Selector */}
      {targetAmount && monthlyContribution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              What-If Scenarios
            </CardTitle>
            <CardDescription>
              Select market scenarios to see how different conditions would affect your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {marketScenarios.filter(s => s.id !== 'baseline').map((scenario) => {
                const Icon = scenario.icon;
                const isSelected = selectedMarketScenarios.includes(scenario.id);
                return (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMarketScenarios(prev => prev.filter(id => id !== scenario.id));
                      } else {
                        setSelectedMarketScenarios(prev => [...prev, scenario.id]);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-md"
                        style={{ backgroundColor: `${scenario.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: scenario.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{scenario.name}</h4>
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {scenario.description}
                        </p>
                        {scenario.probability && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {scenario.probability} Probability
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedMarketScenarios.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedMarketScenarios.length} scenario{selectedMarketScenarios.length > 1 ? 's' : ''} selected
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScenarioComparison(!showScenarioComparison)}
                >
                  {showScenarioComparison ? 'Hide' : 'Show'} Comparison Table
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Projection Chart */}
      {targetAmount && monthlyContribution ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Projected Growth
                </CardTitle>
                <CardDescription>
                  Projected portfolio value over time based on your allocation
                  {selectedMarketScenarios.length > 0 && ` (with ${selectedMarketScenarios.length} scenario${selectedMarketScenarios.length > 1 ? 's' : ''})`}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChartExpanded(!isChartExpanded)}
                className="h-8 w-8 p-0"
                aria-label={isChartExpanded ? "Minimize chart" : "Expand chart"}
              >
                {isChartExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              style={{ height: `${chartConfig.height}px` }}
              className="w-full transition-all duration-300"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={projectionData}
                  margin={chartConfig.margin}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="year" 
                    label={{ 
                      value: 'Years', 
                      position: 'bottom', 
                      offset: chartConfig.isMobile ? 5 : 10,
                      style: { fontSize: chartConfig.fontSize }
                    }}
                    tick={{ fontSize: chartConfig.fontSize }}
                    tickCount={chartConfig.tickCount}
                    interval={chartConfig.isMobile ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Value ($)', 
                      angle: -90, 
                      position: 'left', 
                      style: { 
                        textAnchor: 'middle',
                        fontSize: chartConfig.fontSize
                      } 
                    }}
                    tickFormatter={(value) => formatCurrency(value, { compact: true })}
                    width={chartConfig.yAxisWidth}
                    tick={{ fontSize: chartConfig.fontSize }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: chartConfig.fontSize,
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ 
                      paddingTop: chartConfig.isMobile ? '5px' : '0px',
                      fontSize: chartConfig.fontSize,
                    }}
                    iconSize={chartConfig.isMobile ? 10 : 12}
                  />
                  {/* Baseline line */}
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={chartConfig.isMobile ? 1.5 : 2}
                    name="Baseline (Normal Market)"
                    dot={!chartConfig.isMobile}
                    dotRadius={chartConfig.isMobile ? 2 : 3}
                  />
                  {/* Scenario lines */}
                  {selectedMarketScenarios.map((scenarioId) => {
                    const scenario = marketScenarios.find(s => s.id === scenarioId);
                    if (!scenario) return null;
                    return (
                      <Line
                        key={scenarioId}
                        type="monotone"
                        dataKey={scenarioId}
                        stroke={scenario.color}
                        strokeWidth={chartConfig.isMobile ? 1.5 : 2}
                        strokeDasharray={scenarioId === 'baseline' ? undefined : '5 5'}
                        name={scenario.name}
                        dot={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            {projectedMetrics.timeToGoal && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Time to Goal</span>
                  <span className="text-lg font-bold">
                    {Math.round(projectedMetrics.timeToGoal / 12)} years
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on monthly contribution of {formatCurrency(monthlyContribution)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Projected Growth
            </CardTitle>
            <CardDescription>
              Projected portfolio value over time based on your allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-muted/50 rounded-full">
                  <Target className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Goal Information Needed</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Complete your assessment with target amount and monthly contribution to see projected growth over time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenario Comparison Table */}
      {showScenarioComparison && selectedMarketScenarios.length > 0 && targetAmount && monthlyContribution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scenario Comparison</CardTitle>
            <CardDescription>
              Compare how different market conditions would affect your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-right">10-Year Value</TableHead>
                    <TableHead className="text-right">20-Year Value</TableHead>
                    <TableHead className="text-right">Time to Goal</TableHead>
                    <TableHead className="text-right">Final Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Baseline row */}
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="font-medium">Baseline (Normal Market)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(projectionData[10]?.baseline || 0, { compact: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(projectionData[20]?.baseline || 0, { compact: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      {projectedMetrics.timeToGoal 
                        ? `${Math.round(projectedMetrics.timeToGoal / 12)} years`
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(projectionData[projectionData.length - 1]?.baseline || 0, { compact: true })}
                    </TableCell>
                  </TableRow>
                  {/* Scenario rows */}
                  {selectedMarketScenarios.map((scenarioId) => {
                    const scenario = marketScenarios.find(s => s.id === scenarioId);
                    if (!scenario) return null;
                    
                    const scenarioData = projectionData.map(d => d[scenarioId] as number || 0);
                    const tenYearValue = scenarioData[10] || 0;
                    const twentyYearValue = scenarioData[20] || 0;
                    const finalValue = scenarioData[scenarioData.length - 1] || 0;
                    
                    // Calculate time to goal for scenario
                    const scenarioEquityReturn = scenario.equityReturn;
                    const scenarioBondReturn = scenario.bondReturn;
                    const scenarioRealEstateReturn = scenario.realEstateReturn;
                    const scenarioCashReturn = scenario.cashReturn;
                    
                    const scenarioWeightedReturn = 
                      (allocations.equities / 100) * scenarioEquityReturn +
                      (allocations.bonds / 100) * scenarioBondReturn +
                      (allocations.realEstate / 100) * scenarioRealEstateReturn +
                      (allocations.cash / 100) * scenarioCashReturn;
                    
                    const scenarioMonthlyReturn = scenarioWeightedReturn / 12;
                    let scenarioTimeToGoal: number | undefined;
                    if (targetAmount && monthlyContribution) {
                      let months = 0;
                      let value = 0;
                      while (value < targetAmount && months < 600) {
                        value = value * (1 + scenarioMonthlyReturn) + monthlyContribution;
                        months++;
                      }
                      scenarioTimeToGoal = months;
                    }
                    
                    const baselineFinal = projectionData[projectionData.length - 1]?.baseline || 0;
                    const difference = finalValue - baselineFinal;
                    const differencePercent = baselineFinal > 0 ? (difference / baselineFinal) * 100 : 0;
                    
                    return (
                      <TableRow key={scenarioId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: scenario.color }}
                            />
                            <span className="font-medium">{scenario.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(tenYearValue, { compact: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(twentyYearValue, { compact: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          {scenarioTimeToGoal 
                            ? `${Math.round(scenarioTimeToGoal / 12)} years`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-semibold">
                              {formatCurrency(finalValue, { compact: true })}
                            </span>
                            {difference !== 0 && (
                              <span 
                                className={`text-xs ${
                                  difference > 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {difference > 0 ? '+' : ''}
                                {formatCurrency(difference, { compact: true })} (
                                {differencePercent > 0 ? '+' : ''}
                                {differencePercent.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocation Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allocation Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioAllocation 
            allocations={allocations}
            loading={false}
          />
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      {savedScenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saved Scenarios</CardTitle>
            <CardDescription>Manage and compare your saved allocation scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{scenario.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {formatPercentage(scenario.projectedReturn / 100)} return
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatPercentage(scenario.projectedRisk / 100)} risk
                        </Badge>
                        {scenario.timeToGoal && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(scenario.timeToGoal / 12)} years to goal
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>Equities: <span className="font-semibold text-foreground">{scenario.allocations.equities}%</span></div>
                        <div>Bonds: <span className="font-semibold text-foreground">{scenario.allocations.bonds}%</span></div>
                        <div>Real Estate: <span className="font-semibold text-foreground">{scenario.allocations.realEstate}%</span></div>
                        <div>Cash: <span className="font-semibold text-foreground">{scenario.allocations.cash}%</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadScenario(scenario)}
                        className="text-xs"
                      >
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditScenario(scenario)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteScenario(scenario.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Scenario Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingScenario ? 'Edit Scenario' : 'Save Scenario'}</DialogTitle>
            <DialogDescription>
              {editingScenario 
                ? 'Update the name for this scenario' 
                : 'Give your scenario a name to save it for later comparison'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., Conservative Portfolio"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && scenarioName.trim()) {
                    handleSaveScenario();
                  }
                }}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
              <div className="font-medium">Current Allocation:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Equities: {allocations.equities}%</div>
                <div>Bonds: {allocations.bonds}%</div>
                <div>Real Estate: {allocations.realEstate}%</div>
                <div>Cash: {allocations.cash}%</div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span>Projected Return:</span>
                  <span className="font-semibold">{formatPercentage(projectedMetrics.projectedReturn / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Risk:</span>
                  <span className="font-semibold">{formatPercentage(projectedMetrics.projectedRisk / 100)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowSaveDialog(false);
              setScenarioName('');
              setEditingScenario(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveScenario}
              disabled={!scenarioName.trim()}
            >
              {editingScenario ? 'Update' : 'Save'} Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

