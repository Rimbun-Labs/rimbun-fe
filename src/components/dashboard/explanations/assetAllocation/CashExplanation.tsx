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

const getCashExplanation = (
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

  if (allocation >= 30) {
    return {
      title: 'Your Cash Cushion',
      description: `Cash forms a significant part of your ${riskContextLabel} portfolio, providing immediate access and security for ${goalText}. It's like having a financial safety net that's ready when you need it, perfectly aligned with your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Keeps money readily available for ${goalText}`,
        `Protects against unexpected expenses`,
        `Provides stability during market uncertainty`,
        `Supports your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Maintaining financial flexibility for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Short',
      marketConditions: {
        good: 'Stable value with easy access',
        bad: 'May lose purchasing power to inflation'
      },
      riskContext: `Cash provides immediate access and security for ${goalText}, supporting your ${horizonText}.`
    };
  } else if (allocation >= 10) {
    return {
      title: 'Your Cash Reserve',
      description: `Cash adds flexibility to your ${riskContextLabel} portfolio, supporting ${goalText} with ready access to funds. It's like having a financial buffer that helps you seize opportunities while maintaining your ${riskCapacityTone} strategy.`,
      keyPoints: [
        `Maintains liquidity for ${goalText}`,
        `Helps manage unexpected expenses`,
        `Provides stability when needed`,
        `Aligns with your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding financial flexibility for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Short',
      marketConditions: {
        good: 'Ready access to funds when needed',
        bad: 'Limited growth potential in low-rate environments'
      },
      riskContext: `A moderate cash reserve provides flexibility for ${goalText}, complementing your ${horizonText}.`
    };
  } else {
    return {
      title: 'A Touch of Liquidity',
      description: `Your ${riskContextLabel} portfolio focuses on growth, but a small cash allocation adds flexibility for ${goalText}. It's like having a small financial cushion that helps you stay nimble while pursuing your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Keeps some money easily accessible for ${goalText}`,
        `Helps handle unexpected needs`,
        `Adds flexibility to your plan`,
        `Supports your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Maintaining minimal liquidity for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Short',
      marketConditions: {
        good: 'Quick access to funds when needed',
        bad: 'Minimal impact from market changes'
      },
      riskContext: `A small cash allocation provides flexibility for ${goalText}, keeping your ${horizonText} adaptable.`
    };
  }
};

export const CashExplanation = ({
  allocation,
  riskProfile,
  goal,
  investmentHorizon,
  riskCapacity,
  className,
}: ExtendedAssetAllocationProps) => {
  const explanation = getCashExplanation(
    allocation,
    riskProfile,
    goal,
    investmentHorizon,
    riskCapacity
  );
  return <BaseExplanation explanation={explanation} className={className} score={allocation} />;
}; 