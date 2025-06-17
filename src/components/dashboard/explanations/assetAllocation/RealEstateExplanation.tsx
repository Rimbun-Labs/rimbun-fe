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

const getRealEstateExplanation = (
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

  if (allocation >= 20) {
    return {
      title: 'Your Property Power',
      description: `Real estate is a key part of your ${riskContextLabel} portfolio, fueling ${goalText} with reliable income and growth. It's like owning properties that pay you rent and increase in value, perfectly suited for your ${riskCapacityTone} style.`,
      keyPoints: [
        `Pays steady cash like rent to support ${goalText}`,
        `Grows your money as property values climb`,
        `Spreads risk by moving differently from stocks`,
        `Ideal for your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Generating income and growth for ${goalText}`,
      riskLevel: 'Medium',
      timeHorizon: 'Long',
      marketConditions: {
        good: 'Strong rental income and rising property values',
        bad: 'Slower growth possible if interest rates rise'
      },
      riskContext: `Real Estate's medium risk brings steady income and growth for ${goalText}, fitting your ${horizonText} perfectly.`
    };
  } else if (allocation >= 10) {
    return {
      title: 'Your Property Balance',
      description: `Real estate adds a balanced touch to your ${riskContextLabel} portfolio, supporting ${goalText} with income and growth. It's like a small property stake that steadies your plan while matching your ${riskCapacityTone} approach.`,
      keyPoints: [
        `Earn cash like rent to boost ${goalText}`,
        `Grow your savings with property value increases`,
        `Balances your portfolio with unique stability`,
        `Fits your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding income and stability for ${goalText}`,
      riskLevel: 'Medium',
      timeHorizon: 'Long',
      marketConditions: {
        good: 'Reliable income with moderate growth',
        bad: 'Small dips possible in high-rate markets'
      },
      riskContext: `With medium risk, Real Estate balances income and growth for ${goalText}, ideal for your ${horizonText}.`
    };
  } else {
    return {
      title: 'A Hint of Property',
      description: `Your ${riskContextLabel} portfolio leans elsewhere, but a small slice of real estate boosts ${goalText} with a touch of income and growth. It's like a mini property investment that adds versatility to your ${riskCapacityTone} plan.`,
      keyPoints: [
        `A bit of cash from property payouts for ${goalText}`,
        `Small growth as property values rise`,
        `Adds a unique twist to your portfolio`,
        `Supports your ${horizonText}`
      ],
      allocation,
      riskProfile,
      typicalUse: `Adding a touch of income and growth for ${goalText}`,
      riskLevel: 'Low',
      timeHorizon: 'Medium',
      marketConditions: {
        good: 'Modest income and growth from properties',
        bad: 'Stays mostly steady in tough markets'
      },
      riskContext: `A low-risk touch of Real Estate adds growth to your plan for ${goalText}, keeping things flexible.`
    };
  }
};

export const RealEstateExplanation = ({
  allocation,
  riskProfile,
  goal,
  investmentHorizon,
  riskCapacity,
  className,
}: ExtendedAssetAllocationProps) => {
  const explanation = getRealEstateExplanation(
    allocation,
    riskProfile,
    goal,
    investmentHorizon,
    riskCapacity
  );
  return <BaseExplanation explanation={explanation} className={className} score={allocation} />;
}; 