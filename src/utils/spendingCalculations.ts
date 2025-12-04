/**
 * Utility functions for spending scenario calculations
 */

export interface EmergencyFundTimeline {
  currentMonthsToTarget: number;
  scenarioMonthsToTarget: number;
  monthsDifference: number;
  currentCompletionDate: Date;
  scenarioCompletionDate: Date;
  isFaster: boolean;
}

export interface GoalImpact {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  currentMonthsToGoal: number;
  scenarioMonthsToGoal: number;
  monthsDifference: number;
  currentCompletionDate: Date;
  scenarioCompletionDate: Date;
  isFaster: boolean;
  currentMonthlyContribution: number;
  scenarioMonthlyContribution: number;
}

/**
 * Calculate months to reach emergency fund target
 */
export function calculateEmergencyFundTimeline(
  currentAmount: number,
  targetAmount: number,
  currentMonthlyContribution: number,
  scenarioMonthlyContribution: number
): EmergencyFundTimeline {
  const today = new Date();
  
  // Calculate current timeline
  let currentMonthsToTarget = 0;
  if (currentAmount >= targetAmount) {
    // Already reached target
    currentMonthsToTarget = 0;
  } else if (currentMonthlyContribution <= 0) {
    // No contribution, will never reach target
    currentMonthsToTarget = Infinity;
  } else {
    currentMonthsToTarget = Math.ceil((targetAmount - currentAmount) / currentMonthlyContribution);
  }

  // Calculate scenario timeline
  let scenarioMonthsToTarget = 0;
  if (currentAmount >= targetAmount) {
    // Already reached target
    scenarioMonthsToTarget = 0;
  } else if (scenarioMonthlyContribution <= 0) {
    // No contribution, will never reach target
    scenarioMonthsToTarget = Infinity;
  } else {
    scenarioMonthsToTarget = Math.ceil((targetAmount - currentAmount) / scenarioMonthlyContribution);
  }

  // Calculate dates
  const currentCompletionDate = new Date(today);
  currentCompletionDate.setMonth(currentCompletionDate.getMonth() + currentMonthsToTarget);

  const scenarioCompletionDate = new Date(today);
  scenarioCompletionDate.setMonth(scenarioCompletionDate.getMonth() + scenarioMonthsToTarget);

  // Calculate difference
  const monthsDifference = scenarioMonthsToTarget - currentMonthsToTarget;
  const isFaster = monthsDifference < 0;

  return {
    currentMonthsToTarget: currentMonthsToTarget === Infinity ? -1 : currentMonthsToTarget,
    scenarioMonthsToTarget: scenarioMonthsToTarget === Infinity ? -1 : scenarioMonthsToTarget,
    monthsDifference,
    currentCompletionDate,
    scenarioCompletionDate,
    isFaster,
  };
}

/**
 * Calculate months to reach a goal
 */
export function calculateMonthsToGoal(
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number
): number {
  if (currentAmount >= targetAmount) {
    return 0; // Already reached
  }
  
  if (monthlyContribution <= 0) {
    return -1; // Will never reach (invalid)
  }

  return Math.ceil((targetAmount - currentAmount) / monthlyContribution);
}

/**
 * Calculate goal impact based on scenario
 * 
 * @param goal - The goal to calculate impact for
 * @param currentInvestmentAllocation - Current monthly investment allocation
 * @param scenarioInvestmentAllocation - Scenario monthly investment allocation
 * @param allocationStrategy - How to distribute investment among goals ('proportional' | 'priority' | 'equal')
 */
export function calculateGoalImpact(
  goal: {
    id: string;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    priority?: number;
  },
  currentInvestmentAllocation: number,
  scenarioInvestmentAllocation: number,
  allocationStrategy: 'proportional' | 'priority' | 'equal' = 'proportional'
): GoalImpact {
  const today = new Date();

  // For now, we'll use a simplified approach:
  // Assume the goal's current monthly contribution is part of the investment allocation
  // The scenario investment allocation will proportionally increase/decrease the goal contribution
  
  // Calculate current state
  const currentMonthsToGoal = calculateMonthsToGoal(
    goal.targetAmount,
    goal.currentAmount,
    goal.monthlyContribution
  );

  // Calculate scenario contribution
  // If current investment is 0, we can't calculate proportion, so use equal distribution
  let scenarioMonthlyContribution = goal.monthlyContribution;
  
  if (currentInvestmentAllocation > 0 && scenarioInvestmentAllocation > 0) {
    // Proportional: maintain the same ratio
    const ratio = scenarioInvestmentAllocation / currentInvestmentAllocation;
    scenarioMonthlyContribution = goal.monthlyContribution * ratio;
  } else if (scenarioInvestmentAllocation > 0 && currentInvestmentAllocation === 0) {
    // If no current investment, distribute equally (simplified - in reality would use goal priority)
    // For now, just add a portion of the new investment
    scenarioMonthlyContribution = goal.monthlyContribution + (scenarioInvestmentAllocation * 0.1); // 10% of new investment
  }

  // Ensure non-negative
  scenarioMonthlyContribution = Math.max(0, scenarioMonthlyContribution);

  // Calculate scenario months to goal
  const scenarioMonthsToGoal = calculateMonthsToGoal(
    goal.targetAmount,
    goal.currentAmount,
    scenarioMonthlyContribution
  );

  // Calculate dates
  const currentCompletionDate = new Date(today);
  if (currentMonthsToGoal >= 0) {
    currentCompletionDate.setMonth(currentCompletionDate.getMonth() + currentMonthsToGoal);
  }

  const scenarioCompletionDate = new Date(today);
  if (scenarioMonthsToGoal >= 0) {
    scenarioCompletionDate.setMonth(scenarioCompletionDate.getMonth() + scenarioMonthsToGoal);
  }

  // Calculate difference
  const monthsDifference = scenarioMonthsToGoal - currentMonthsToGoal;
  const isFaster = monthsDifference < 0;

  return {
    goalId: goal.id,
    goalName: goal.goalName,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currentMonthsToGoal,
    scenarioMonthsToGoal,
    monthsDifference,
    currentCompletionDate,
    scenarioCompletionDate,
    isFaster,
    currentMonthlyContribution: goal.monthlyContribution,
    scenarioMonthlyContribution,
  };
}

/**
 * Generate data points for emergency fund timeline chart
 */
export function generateEmergencyFundTimelineData(
  currentAmount: number,
  targetAmount: number,
  currentMonthlyContribution: number,
  scenarioMonthlyContribution: number,
  maxMonths: number = 60
): Array<{
  month: number;
  current: number;
  scenario: number;
}> {
  const data: Array<{ month: number; current: number; scenario: number }> = [];
  
  for (let month = 0; month <= maxMonths; month++) {
    const current = Math.min(
      currentAmount + (currentMonthlyContribution * month),
      targetAmount
    );
    const scenario = Math.min(
      currentAmount + (scenarioMonthlyContribution * month),
      targetAmount
    );
    
    data.push({ month, current, scenario });
    
    // Stop if both reach target
    if (current >= targetAmount && scenario >= targetAmount) {
      break;
    }
  }
  
  return data;
}

