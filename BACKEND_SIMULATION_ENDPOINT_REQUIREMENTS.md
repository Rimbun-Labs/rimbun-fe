# Backend Requirements: Goal Allocation Strategy Simulation Endpoint

## Overview
We need a new endpoint that allows users to simulate different allocation strategies with custom budget amounts. This will enable real-time "what-if" analysis in the frontend without requiring users to save changes.

## Endpoint Specification

### `POST /api/v1/goals/simulate-strategy`

**Purpose**: Calculate goal allocations for a given strategy and budget amount, returning projected completion dates.

**Authentication**: Required (user must be authenticated)

---

## Request Body

```typescript
{
  userId: string;                    // User ID (can be extracted from auth token)
  strategy: 'priority' | 'timeline' | 'proportional' | 'required_savings';
  monthlyBudget: number;             // Total monthly budget to allocate (in dollars)
  goalIds?: string[];                // Optional: specific goal IDs to include (if omitted, use all active goals)
  includeInactive?: boolean;         // Optional: include inactive goals (default: false)
}
```

**Example Request**:
```json
{
  "strategy": "priority",
  "monthlyBudget": 5000,
  "goalIds": ["goal-123", "goal-456"]
}
```

---

## Response Body

```typescript
{
  strategy: 'priority' | 'timeline' | 'proportional' | 'required_savings';
  monthlyBudget: number;             // The budget that was allocated
  totalAllocated: number;            // Sum of all allocated contributions
  remainingBudget: number;            // Budget left unallocated (should be 0 if fully allocated)
  allocations: Array<{
    goalId: string;
    goalName: string;
    currentContribution: number;      // User's current monthly contribution
    suggestedContribution: number;    // New suggested monthly contribution
    reason: string;                   // Explanation for this allocation
    projectedCompletionYear?: number; // Year goal will be completed with this contribution
    projectedCompletionMonth?: number; // Month goal will be completed (1-12)
    monthsToComplete?: number;       // Total months from now until completion
    timeDifference?: number;         // Months faster/slower than current trajectory (positive = faster)
  }>;
  warnings?: string[];                // Optional warnings (e.g., "Some goals may not be achievable")
  reasoning: string;                  // Overall explanation of the strategy
}
```

**Example Response**:
```json
{
  "strategy": "priority",
  "monthlyBudget": 5000,
  "totalAllocated": 5000,
  "remainingBudget": 0,
  "allocations": [
    {
      "goalId": "goal-123",
      "goalName": "Retirement Fund",
      "currentContribution": 2000,
      "suggestedContribution": 3000,
      "reason": "Highest priority goal (priority: 1)",
      "projectedCompletionYear": 2035,
      "projectedCompletionMonth": 6,
      "monthsToComplete": 120,
      "timeDifference": -12
    },
    {
      "goalId": "goal-456",
      "goalName": "Emergency Fund",
      "currentContribution": 500,
      "suggestedContribution": 2000,
      "reason": "Second highest priority (priority: 2)",
      "projectedCompletionYear": 2027,
      "projectedCompletionMonth": 3,
      "monthsToComplete": 24,
      "timeDifference": -6
    }
  ],
  "reasoning": "Priority-based allocation funds highest priority goals first until budget is exhausted."
}
```

---

## Business Logic Requirements

### Strategy Implementation

#### 1. Priority-Based (`priority`)
- Sort goals by `priority` field (lower number = higher priority)
- Allocate budget starting with highest priority goals
- For each goal, allocate up to:
  - `requiredMonthlySavings` (if available from goal insights)
  - Or a proportional amount based on remaining budget
- Continue until budget is exhausted
- If budget remains, distribute proportionally to all goals

#### 2. Timeline-Based (`timeline`)
- Sort goals by `targetYear` or `investmentHorizon` (earliest first)
- Allocate budget to goals with nearest deadlines first
- Prioritize goals that are "at risk" (behind schedule)
- Allocate up to `requiredMonthlySavings` for each goal
- Continue until budget is exhausted

#### 3. Proportional (`proportional`)
- Calculate each goal's share based on `targetAmount` ratio
- Allocate budget proportionally: `(goal.targetAmount / totalTargetAmount) * monthlyBudget`
- Ensure no goal gets more than its `requiredMonthlySavings` (if available)
- Redistribute excess proportionally

#### 4. Required Savings (`required_savings`)
- For each goal, allocate exactly `requiredMonthlySavings` (from goal insights)
- If budget is insufficient, prioritize by:
  1. Goals that are "needs attention" or "off track"
  2. Goals with nearest deadlines
  3. Goals with highest priority
- If budget exceeds total required, distribute excess proportionally

### Projection Calculation

For each goal, calculate projected completion:

1. **Current State**:
   - `currentAmount`: Current saved amount
   - `targetAmount`: Target amount
   - `monthlyContribution`: New suggested contribution
   - `targetYear`: Target year for completion (if available)
   - `investmentHorizon`: Investment horizon in years (if available)

2. **Projection**:
   - `remainingAmount = targetAmount - currentAmount`
   - `monthsToComplete = Math.ceil(remainingAmount / monthlyContribution)`
   - `completionDate = now + monthsToComplete`
   - `projectedCompletionYear = completionDate.getFullYear()`
   - `projectedCompletionMonth = completionDate.getMonth() + 1`

3. **Time Difference**:
   - Calculate current trajectory: `monthsToCompleteCurrent = Math.ceil(remainingAmount / currentContribution)`
   - `timeDifference = monthsToCompleteCurrent - monthsToComplete`
   - Positive = faster, Negative = slower
   - Compare to `targetYear` if available: `timeDifferenceFromTarget = (targetYear - currentYear) * 12 - monthsToComplete`

### Edge Cases

1. **Insufficient Budget**:
   - If `monthlyBudget < sum(requiredMonthlySavings)`, allocate to highest priority/earliest deadline goals first
   - Include warning: "Budget insufficient to meet all required savings"

2. **Excess Budget**:
   - If `monthlyBudget > sum(requiredMonthlySavings)`, distribute excess proportionally
   - Or allow user to exceed required savings (optional parameter)

3. **Goals Without Required Savings**:
   - If `requiredMonthlySavings` is not available, calculate it as: `(targetAmount - currentAmount) / monthsUntilTarget`
   - Where `monthsUntilTarget` = `(targetYear - currentYear) * 12` if `targetYear` exists
   - Or `investmentHorizon * 12` if available
   - Otherwise use a default (e.g., 20 years = 240 months)

4. **Goals Already Completed**:
   - Skip completed goals or allocate $0 with reason "Goal already completed"

5. **Goals Without Target Year**:
   - For timeline-based strategy, use `investmentHorizon` or sort to end of list
   - For projection, use `investmentHorizon` if available, otherwise estimate based on current progress rate

---

## Validation

1. **Input Validation**:
   - `monthlyBudget` must be > 0
   - `strategy` must be one of the valid values
   - `goalIds` (if provided) must exist and belong to the user

2. **Business Validation**:
   - User must have at least one active goal
   - If `goalIds` provided, at least one must be active

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "monthlyBudget must be greater than 0"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "No active goals found for user"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to calculate strategy allocation"
}
```

---

## Performance Considerations

- Response time should be < 500ms for typical use cases (10-20 goals)
- Consider caching strategy calculations if budget hasn't changed
- Database queries should be optimized (e.g., fetch all goals in one query)

---

## Integration Notes

- This endpoint should reuse existing allocation logic from `/api/v1/goals/budget-validation`
- The projection calculation should match the logic used in goal insights
- Consider adding a `dryRun` parameter if we want to allow testing without affecting current allocations

---

## Future Enhancements (Phase 2+)

- Support for comparing multiple strategies in one request
- Historical simulation (show how strategy would have performed in the past)
- Custom allocation rules (user-defined priorities/weights)
- Investment return projections (account for growth, not just contributions)

---

## Questions for Backend Team

1. Do we already have `requiredMonthlySavings` calculated in goal insights? If not, how should we calculate it?
2. Should we support partial allocations (e.g., goal needs $1000/month but only gets $500)?
3. How should we handle goals with investment returns? Should projections account for growth?
4. Should this endpoint be rate-limited? (Users might adjust slider frequently)
5. Do we want to persist simulation results, or is this purely ephemeral?

