import React from 'react';
import { BaseExplanation } from './BaseExplanation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define investment goal type
type InvestmentGoal = 'retirement' | 'house' | 'wealth' | 'education' | 'other';

interface CorrelationExplanationProps {
  correlationMatrix: Record<string, Record<string, number>>;
  goal?: InvestmentGoal;
  allocations: {
    equities: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
  riskProfile: number;
  investmentHorizon: number;
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

// Generate enhanced educational correlation explanations
const generateCorrelationLabel = (
  value: number,
  asset1: string,
  asset2: string,
  goal: InvestmentGoal,
  allocations: CorrelationExplanationProps['allocations'],
  riskProfile: number,
  investmentHorizon: number,
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced'
): string => {
  const asset1Name = asset1.charAt(0).toUpperCase() + asset1.slice(1);
  const asset2Name = asset2.charAt(0).toUpperCase() + asset2.slice(1);

  // Personalize goal text
  const goalText = goal === 'retirement' ? 'building a secure retirement' :
                   goal === 'house' ? 'saving for your house' :
                   goal === 'wealth' ? 'growing your wealth' :
                   goal === 'education' ? 'funding your education' :
                   'reaching your goal';

  // Personalize risk profile
  const riskText = riskProfile < 30 ? 'cautious approach' :
                   riskProfile <= 70 ? 'balanced style' :
                   'growth-focused strategy';

  // Personalize horizon
  const horizonText = investmentHorizon < 3 ? 'short-term' :
                      investmentHorizon <= 7 ? 'medium-term' :
                      'long-term';

  // Identify dominant assets (allocations >= 20%)
  const dominantAssets = Object.entries(allocations)
    .filter(([_, alloc]) => alloc >= 0.2)
    .map(([asset]) => asset.toLowerCase());

  const isDominantPair = dominantAssets.includes(asset1.toLowerCase()) && 
                         dominantAssets.includes(asset2.toLowerCase());

  // Adjust explanation depth based on knowledge level
  const addTechnical = knowledgeLevel === 'intermediate' || knowledgeLevel === 'advanced';
  const technicalDetail = addTechnical && value !== -1 && value !== 0 && value !== 1
    ? ` (Correlation of ${value.toFixed(2)} means ~${Math.round(value * value * 100)}% of price movements are shared.)`
    : '';

  // Helper to get allocation suggestion
  const suggestAllocation = (asset: string, current: number, target: number): string => {
    const assetName = asset.charAt(0).toUpperCase() + asset.slice(1);
    return `With your ${Math.round(allocations[asset] * 100)}% in ${assetName}, consider adjusting to ~${target}% to optimize your ${riskText} for ${goalText}.`;
  };

  // Conditional rendering based on correlation ranges
  if (value >= 0.7) {
    // Strong Positive
    if (asset1 === asset2) {
      return `${asset1Name} naturally sync with themselves, like a steady drumbeat for your ${horizonText} ${goalText}. Stay aligned with your ${riskText}.`;
    }
    if (asset1 === 'equities' && asset2 === 'realEstate') {
      return isDominantPair
        ? `Your hefty Equities and RealEstate surge together when economies boom—like tech stocks and city properties riding a wave. Economic growth and low interest rates drive this, while RealEstate also depends on housing demand and rental yields. In the 2010s recovery, both soared, but crashed in 2008's high-inflation bust. Bear markets tighten their link, amplifying risk. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 30)} to cushion your ${horizonText} ${goalText}.${technicalDetail}`
        : `Equities and RealEstate often rise together, fueled by growth, though RealEstate leans on property markets. They thrived in the 2010s but tanked in 2008. High inflation strengthens this link. For ${goalText}, add 15% Cash to stabilize your ${horizonText} plan.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'bonds') {
      return `Rarely, Equities and Bonds align strongly, like in 2022's rate-hike storm when both faced pressure. Rising rates and inflation drive this, unlike their usual divergence. This was brief but tough in 2022. In high-inflation regimes, they stick together. For your ${riskText}, shift 20% to Cash to hedge your ${horizonText} ${goalText}.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'cash') {
      return `Unusual for Equities and Cash to sync, but in hyper-liquidity events like 2020's stimulus, both can hold firm. Central bank policies drive this, rare outside crises. For your ${riskText}, keep 10% Cash for ${horizonText} safety in ${goalText}. Inflation may align them briefly.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'realEstate') {
      return isDominantPair
        ? `Your Bonds and RealEstate strongly align in stable, low-rate markets—like government bonds and rental properties in calm times. Steady yields and low borrowing costs drive this, but rising rates hurt both, as in 2022. In inflationary regimes, their link grows tighter. For your ${riskText}, raise Equities to 20% for ${horizonText} ${goalText} balance.${technicalDetail}`
        : `Bonds and RealEstate sync in calm markets but stumble in high-rate periods, like 2022. For ${goalText}, add 15% Equities for ${horizonText} diversification.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'cash') {
      return `Bonds and Cash align in ultra-safe conditions, like 2008's flight to safety. Low yields and risk aversion drive this, stable in deflationary markets. For your ${riskText}, maintain 15% Cash for ${horizonText} ${goalText} protection. In deflation, they stay close.${technicalDetail}`;
    }
    if (asset1 === 'realEstate' && asset2 === 'cash') {
      return `RealEstate and Cash rarely sync, but in stable, low-yield markets like 2015, both can hold steady. RealEstate follows property cycles; Cash is fixed. For your ${riskText}, keep 10% Cash for ${horizonText} ${goalText} safety. Stable regimes align them slightly.${technicalDetail}`;
    }
    return isDominantPair
      ? `Your ${asset1Name} and ${asset2Name} move in lockstep, like teammates in a bull market, driven by economic upswings. They crashed together in 2008's high-inflation environment. In bear markets, this link tightens. For your ${riskText}, add 20% Bonds to diversify your ${horizonText} ${goalText}.${technicalDetail}`
      : `${asset1Name} and ${asset2Name} strongly align in growth phases but fell in 2008. High inflation amplifies this. For ${horizonText} ${goalText}, increase Cash to 15% to manage risk.${technicalDetail}`;
  } else if (value >= 0.3) {
    // Moderate Positive
    if (asset1 === 'equities' && asset2 === 'realEstate') {
      return isDominantPair
        ? `Your strong Equities and RealEstate often climb together, like stocks and properties in a thriving economy. Economic expansion and low rates fuel this, but RealEstate also tracks housing demand. In the 2010s, both grew, but slowed in 2022's rate hikes. Low-inflation markets align them; high inflation loosens ties. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 25)} for ${horizonText} ${goalText} stability.${technicalDetail}`
        : `Equities and RealEstate rise in growth periods, like the 2010s, but RealEstate depends on property trends. High inflation may weaken this. For ${goalText}, set Cash at 10% for ${horizonText} balance.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'bonds') {
      return `Equities and Bonds sometimes align, like in 2019's stable growth, driven by moderate rates and calm markets. High-inflation periods, like 2022, split them. For your ${riskText}, keep 20% Bonds for ${horizonText} ${goalText} balance. Inflation may push them together.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'cash') {
      return `Equities and Cash rarely move together, but in calm markets like 2015, Cash holds steady as Equities inch up. Market stability drives this, rare in volatile regimes. For your ${riskText}, maintain 10% Cash for ${horizonText} ${goalText} safety.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'realEstate') {
      return isDominantPair
        ? `Your Bonds and RealEstate often sync in steady markets, like the 1990s growth phase. Stable rates and rental yields drive this, but rate hikes, like 2022, weaken the link. For your ${riskText}, aim for 20% Equities for ${horizonText} ${goalText}.${technicalDetail}`
        : `Bonds and RealEstate align in calm times but diverge in rate hikes, like 2022. For ${goalText}, add 15% Equities for ${horizonText} growth.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'cash') {
      return `Bonds and Cash sometimes align in low-rate environments, like the 2010s quantitative easing. Stability drives this, but inflation pulls them apart. For your ${riskText}, keep 15% Cash for ${horizonText} ${goalText} protection.${technicalDetail}`;
    }
    if (asset1 === 'realEstate' && asset2 === 'cash') {
      return `RealEstate and Cash occasionally align in stable markets, like 2015, where Cash is steady and RealEstate inches up. Property cycles vs. fixed value drive this. For your ${riskText}, hold 10% Cash for ${horizonText} ${goalText} safety.${technicalDetail}`;
    }
    return isDominantPair
      ? `Your ${asset1Name} and ${asset2Name} often rise together in growth markets, like the 2010s, driven by economic momentum. High inflation may loosen this. For your ${riskText}, set Bonds at 20% for ${horizonText} ${goalText} stability.${technicalDetail}`
      : `${asset1Name} and ${asset2Name} climb in strong markets, like the 2010s. High inflation weakens this. For ${goalText}, add 10% Cash for ${horizonText} balance.${technicalDetail}`;
  } else if (value >= -0.29) {
    // Weak/Neutral
    if (asset1 === 'cash' || asset2 === 'cash') {
      return isDominantPair
        ? `Your trusty ${asset1Name} stands firm—like a lighthouse in 2020's market storm—while ${asset2Name} swings. Cash's fixed value shines in crises, stable across regimes. For your ${riskText}, ${suggestAllocation('cash', allocations.cash, 15)} for ${horizonText} ${goalText} safety, but add Equities for growth.${technicalDetail}`
        : `${asset1Name} stays steady, like a savings account in 2020, ignoring ${asset2Name}'s moves. For ${goalText}, hold 10% Cash for ${horizonText} protection.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'bonds') {
      return isDominantPair
        ? `Your Equities and Bonds dance independently—like runners on separate tracks. In 2020, Bonds held firm as stocks fell, driven by risk-on vs. safe-haven flows. High inflation, like 2022, can align them. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 30)} for ${horizonText} ${goalText}.${technicalDetail}`
        : `Equities and Bonds don't sync, like in 2020's split. Inflation can align them. For ${goalText}, set Bonds at 20% for ${horizonText} stability.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'realEstate') {
      return isDominantPair
        ? `Your Equities and RealEstate sometimes go their own way, like in 2015's mixed markets. Equities chase corporate profits; RealEstate follows property demand. Inflation may tighten their link. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 25)} for ${horizonText} ${goalText}.${technicalDetail}`
        : `Equities and RealEstate act independently in mixed markets, like 2015. Inflation can sync them. For ${goalText}, add 15% Bonds for ${horizonText} balance.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'realEstate') {
      return `Bonds and RealEstate act independently, like in 2010s stable markets. Bonds follow interest rates; RealEstate tracks housing trends. Inflation can align them. For your ${riskText}, aim for 15% Cash for ${horizonText} ${goalText} balance.${technicalDetail}`;
    }
    return isDominantPair
      ? `Your ${asset1Name} and ${asset2Name} move independently—like ships on different courses in 2020. Market splits drive this, but inflation may align them. For your ${riskText}, add 20% Bonds for ${horizonText} ${goalText} balance.${technicalDetail}`
      : `${asset1Name} and ${asset2Name} act solo, like in 2020. For ${goalText}, set 15% Cash for ${horizonText} stability.${technicalDetail}`;
  } else if (value >= -0.69) {
    // Moderate Negative
    if (asset1 === 'equities' && asset2 === 'bonds') {
      return isDominantPair
        ? `Your Equities and Bonds balance like a seesaw—when stocks drop, bonds often rise, as in 2008's crisis. Safe-haven demand lifts bonds in downturns, unlike growth-driven stocks. In high-inflation regimes, like 2022, this weakens. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 35)} for ${horizonText} ${goalText}.${technicalDetail}`
        : `Equities and Bonds offset each other, like in 2008. Inflation can disrupt this. For ${goalText}, set Bonds at 25% for ${horizonText} calm.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'realEstate') {
      return `Rarely, Equities and RealEstate counter each other, like in 2011's uneven recovery. Global stocks vs. local property slumps drive this. Inflation aligns them. For your ${riskText}, add 20% Bonds for ${horizonText} ${goalText}.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'realEstate') {
      return `Bonds and RealEstate sometimes balance, like in 2009's recovery. Bonds gain from safety; RealEstate from housing rebounds. Rate hikes align them. For your ${riskText}, set 15% Cash for ${horizonText} ${goalText} stability.${technicalDetail}`;
    }
    if (asset1 === 'realEstate' && asset2 === 'cash') {
      return `RealEstate and Cash occasionally offset each other, like in 2008 when Cash held firm as properties fell. Risk aversion vs. property cycles drive this. For your ${riskText}, keep 15% Cash for ${horizonText} ${goalText} protection.${technicalDetail}`;
    }
    return isDominantPair
      ? `Your ${asset1Name} and ${asset2Name} counterbalance—like scales in 2008. Risk-off flows drive this, weakened by inflation. For your ${riskText}, add 20% Bonds for ${horizonText} ${goalText}.${technicalDetail}`
      : `${asset1Name} and ${asset2Name} balance each other, like in 2008. For ${goalText}, set 15% Bonds for ${horizonText} calm.${technicalDetail}`;
  } else {
    // Strong Negative
    if (asset1 === 'equities' && asset2 === 'bonds') {
      return isDominantPair
        ? `Your Equities and Bonds are a dynamic duo—when stocks crash, bonds soar, like 2008's panic. Safe-haven flows vs. risk-off selling drive this, but high inflation, like 2022, can align them. For your ${riskText}, ${suggestAllocation('bonds', allocations.bonds, 40)} for ${horizonText} ${goalText} stability.${technicalDetail}`
        : `Equities and Bonds strongly counter, like in 2008. Inflation may disrupt this. For ${goalText}, set Bonds at 30% for ${horizonText} calm.${technicalDetail}`;
    }
    if (asset1 === 'equities' && asset2 === 'realEstate') {
      return `Very rarely, Equities and RealEstate strongly oppose, like in niche 2010 recovery markets. Divergent economic signals drive this, reversed by inflation. For your ${riskText}, add 25% Bonds for ${horizonText} ${goalText} balance.${technicalDetail}`;
    }
    if (asset1 === 'bonds' && asset2 === 'realEstate') {
      return `Bonds and RealEstate rarely counter strongly, like in 2009's split recovery. Safe-haven bonds vs. recovering properties drive this, weakened by rate hikes. For your ${riskText}, set 20% Cash for ${horizonText} ${goalText} stability.${technicalDetail}`;
    }
    return isDominantPair
      ? `Your ${asset1Name} and ${asset2Name} are opposites—like day and night in 2008. Risk aversion drives this, but inflation aligns them. For your ${riskText}, add 25% Bonds for ${horizonText} ${goalText} stability.${technicalDetail}`
      : `${asset1Name} strongly balance ${asset2Name}, like in 2008. For ${goalText}, set 20% Bonds for ${horizonText} calm.${technicalDetail}`;
  }
};

// Get color based on correlation value
const getCorrelationColor = (value: number): string => {
  if (value >= 0.7) return "text-emerald-600"; // Strong positive - green (growth)
  if (value >= 0.3) return "text-emerald-400"; // Moderate positive - lighter green
  if (value >= -0.29) return "text-slate-500"; // Weak/neutral - slate gray
  if (value >= -0.69) return "text-amber-500"; // Moderate negative - amber (caution)
  return "text-rose-600"; // Strong negative - rose (warning)
};

// Add legend component
const CorrelationLegend = () => (
  <div className="flex items-center justify-center gap-4 text-xs">
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
      <span className="font-medium">Strong Positive (≥ 0.7)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span className="font-medium">Moderate Positive (≥ 0.3)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
      <span className="font-medium">Neutral (-0.29 to 0.29)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
      <span className="font-medium">Moderate Negative (≤ -0.3)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
      <span className="font-medium">Strong Negative (≤ -0.7)</span>
    </div>
  </div>
);

export const CorrelationExplanation: React.FC<CorrelationExplanationProps> = ({
  correlationMatrix,
  goal = 'other',
  allocations,
  riskProfile,
  investmentHorizon,
  knowledgeLevel = 'beginner',
  className
}) => {
  const assets = Object.keys(correlationMatrix);

  return (
    <div className={`${className} space-y-4`}>
      <div className="bg-slate-50 rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]"></TableHead>
              {assets.map(asset => (
                <TableHead key={asset} className="text-center font-semibold text-slate-700">
                  {asset.charAt(0).toUpperCase() + asset.slice(1)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map(asset1 => (
              <TableRow key={asset1} className="hover:bg-slate-100/50">
                <TableCell className="font-semibold text-slate-700">
                  {asset1.charAt(0).toUpperCase() + asset1.slice(1)}
                </TableCell>
                {assets.map(asset2 => {
                  const value = correlationMatrix[asset1][asset2];
                  const label = generateCorrelationLabel(
                    value,
                    asset1,
                    asset2,
                    goal,
                    allocations,
                    riskProfile,
                    investmentHorizon,
                    knowledgeLevel
                  );
                  return (
                    <TableCell key={`${asset1}-${asset2}`} className="text-center p-2">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="w-full px-3 py-1.5 rounded-md hover:bg-white transition-colors border border-transparent hover:border-slate-200">
                              <span className={`${getCorrelationColor(value)} font-semibold text-base`}>
                                {value.toFixed(2)}
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            align="center"
                            className="max-w-lg p-4 z-50 bg-white shadow-lg border border-slate-200"
                          >
                            <p className="text-sm leading-relaxed">{label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <CorrelationLegend />
      </div>
    </div>
  );
}; 