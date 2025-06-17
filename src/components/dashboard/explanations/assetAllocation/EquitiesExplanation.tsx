import { AssetAllocationProps, AssetAllocationData } from '../types';
import { BaseExplanation } from '../BaseExplanation';

// Define investment goal type based on assessment options
type InvestmentGoal = 'retirement' | 'house' | 'wealth' | 'education' | string;

// Extend props to include assessment data
interface ExtendedAssetAllocationProps extends Omit<AssetAllocationProps, 'riskProfile'> {
  goal?: InvestmentGoal;  // From AssessmentResult.scoreData.directInputs.financialGoal
  investmentHorizon?: number;  // From AssessmentResult.scoreData.investmentHorizon
  riskProfile: number;  // Required from AssetAllocationProps
  riskCapacity?: number;  // From AssessmentResult.scoreData.riskCapacity
}

const getEquitiesExplanation = (
  allocation: number,
  riskProfile: number,
  goal: InvestmentGoal = 'your goals',
  investmentHorizon: number = 50,
  riskCapacity: number = 50,
): AssetAllocationData => {
  // Personalize goal context
  const goalText = goal.toLowerCase() === 'retirement' ? 'building a secure retirement' :
                   goal.toLowerCase() === 'house' ? 'saving for a house' :
                   goal.toLowerCase() === 'wealth' ? 'growing your wealth' :
                   goal.toLowerCase() === 'education' ? 'funding your education' :
                   'reaching your goals';

  // Personalize horizon context (adjusted to 0-100 scale)
  const horizonText = investmentHorizon < 30 ? 'short-term plans' :
                      investmentHorizon <= 70 ? 'medium-term goals' :
                      'long-term dreams';

  // Define risk context based on riskProfile
  const riskContextLabel = riskProfile < 30 ? 'conservative' :
                           riskProfile <= 70 ? 'balanced' :
                           'growth-focused';

  // Define risk capacity tone
  const riskCapacityTone = riskCapacity < 30 ? 'cautious' :
                           riskCapacity <= 70 ? 'balanced' :
                           'bold';

  if (allocation >= 60) {
    return {
      title: 'Your Growth Engine',
      description: `Equities power your ${riskContextLabel} portfolio, driving growth and returns for ${goalText}. It's like owning pieces of successful companies that can grow your wealth over time, perfectly suited for your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Drives long-term growth for ${goalText}`,
        `Offers potential for higher returns`,
        `Provides ownership in growing companies`,
        `Ideal for your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Generating strong growth for ${goalText}`,
      riskLevel: 'High',
      timeHorizon: 'Long',
      marketConditions: {
        good: 'Strong potential for capital appreciation',
        bad: 'May experience significant market volatility'
      },
      riskContext: `Equities' growth potential aligns with your ${horizonText} for ${goalText}, matching your ${riskCapacityTone} style.`
    };
  } else if (allocation >= 30) {
    return {
      title: 'Your Growth Balance',
      description: `Equities add growth potential to your ${riskContextLabel} portfolio, supporting ${goalText} with market returns. It's like having a balanced mix of company ownership that can grow your wealth while matching your ${riskCapacityTone} strategy.`,
      keyPoints: [
        `Contributes to growth for ${goalText}`,
        `Offers potential for solid returns`,
        `Provides diversification benefits`,
        `Aligns with your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding growth potential for ${goalText}`,
      riskLevel: 'Medium',
      timeHorizon: 'Medium',
      marketConditions: {
        good: 'Potential for steady growth and returns',
        bad: 'May experience moderate market swings'
      },
      riskContext: `A balanced equity allocation supports growth for ${goalText}, complementing your ${horizonText}.`
    };
  } else {
    return {
      title: 'A Touch of Growth',
      description: `Your ${riskContextLabel} portfolio focuses on stability, but a small equity allocation adds growth potential for ${goalText}. It's like having a small stake in companies that can boost your returns while maintaining your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Adds growth potential for ${goalText}`,
        `Provides exposure to market returns`,
        `Helps combat inflation over time`,
        `Supports your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding modest growth potential for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Medium',
      marketConditions: {
        good: 'Potential for modest growth',
        bad: 'Limited impact from market volatility'
      },
      riskContext: `A small equity allocation adds growth potential for ${goalText}, keeping your ${horizonText} on track.`
    };
  }
};

export const EquitiesExplanation = ({
  allocation,
  riskProfile,
  goal,
  investmentHorizon,
  riskCapacity,
  className,
}: ExtendedAssetAllocationProps) => {
  const explanation = getEquitiesExplanation(
    allocation,
    riskProfile,
    goal,
    investmentHorizon,
    riskCapacity
  );
  return <BaseExplanation explanation={explanation} className={className} score={allocation} />;
}; 