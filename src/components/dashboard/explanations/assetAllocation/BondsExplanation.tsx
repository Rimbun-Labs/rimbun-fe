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

const getBondsExplanation = (
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

  if (allocation >= 50) {
    return {
      title: 'Your Bond Foundation',
      description: `Bonds form the bedrock of your ${riskContextLabel} portfolio, providing steady income and stability for ${goalText}. It's like having a reliable income stream that helps protect your savings while matching your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Delivers regular interest payments for ${goalText}`,
        `Protects your savings from market swings`,
        `Provides stability when markets are volatile`,
        `Perfect for your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Creating a stable income foundation for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Medium',
      marketConditions: {
        good: 'Steady interest payments and stable values',
        bad: 'Lower returns possible in rising rate environments'
      },
      riskContext: `Bonds' low risk provides stability and income for ${goalText}, anchoring your ${horizonText}.`
    };
  } else if (allocation >= 20) {
    return {
      title: 'Your Bond Balance',
      description: `Bonds add stability to your ${riskContextLabel} portfolio, supporting ${goalText} with reliable income. It's like having a safety net that cushions market ups and downs while complementing your ${riskCapacityTone} strategy.`,
      keyPoints: [
        `Earns interest to support ${goalText}`,
        `Helps smooth out market volatility`,
        `Adds stability to your overall plan`,
        `Aligns with your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding stability and income for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Medium',
      marketConditions: {
        good: 'Consistent interest income with stability',
        bad: 'Modest impact from interest rate changes'
      },
      riskContext: `A moderate bond allocation provides stability for ${goalText}, complementing your ${horizonText}.`
    };
  } else {
    return {
      title: 'A Touch of Stability',
      description: `Your ${riskContextLabel} portfolio focuses on growth, but a small bond allocation adds stability for ${goalText}. It's like having a small anchor that helps steady your plan while maintaining your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Small interest payments boost ${goalText}`,
        `Adds a touch of stability to your plan`,
        `Helps manage overall portfolio risk`,
        `Supports your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding a touch of stability for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Short',
      marketConditions: {
        good: 'Small but steady interest income',
        bad: 'Minimal impact from market changes'
      },
      riskContext: `A small bond allocation adds stability to your plan for ${goalText}, keeping your ${horizonText} on track.`
    };
  }
};

export const BondsExplanation = ({
  allocation,
  riskProfile,
  goal,
  investmentHorizon,
  riskCapacity,
  className,
}: ExtendedAssetAllocationProps) => {
  const explanation = getBondsExplanation(
    allocation,
    riskProfile,
    goal,
    investmentHorizon,
    riskCapacity
  );
  return <BaseExplanation explanation={explanation} className={className} score={allocation} />;
}; 