# Goal Families Implementation Plan

## Overview
This document outlines the detailed implementation plan for adding goal families (Debt & Obligations, Lifestyle & Wellbeing, Risk & Protection, Values-Based Goals, Liquidity & Resilience) to the goals system, with integration to the learning library.

---

## Phase 1: Data Model & Schema Changes

### Backend Database Schema Changes

**File: Backend database migration (new file)**
- Add `goal_family` column to `goals` table (ENUM or VARCHAR)
  - Values: `invest_grow`, `debt_obligations`, `lifestyle_wellbeing`, `risk_protection`, `values_based`, `liquidity_resilience`
- Add `goal_tags` JSONB column to `goals` table (array of strings)
  - Example: `["liquidity", "emergency_fund"]`
- Add `template_id` VARCHAR column to `goals` table (nullable)
  - References predefined templates
- Add `family_specific_metrics` JSONB column to `goals` table
  - Stores family-specific calculations (debt payoff %, coverage gaps, buffer days, etc.)
- Add `related_learning_modules` JSONB column to `goals` table (array of module IDs)
  - Links to learning library content

**New Table: `goal_templates`**
```sql
CREATE TABLE goal_templates (
  id VARCHAR PRIMARY KEY,
  family VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  default_target_amount DECIMAL,
  default_monthly_contribution DECIMAL,
  default_metadata JSONB,
  checklist_items JSONB, -- Array of checklist items for obligations
  related_learning_modules JSONB, -- Array of learning module IDs
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**New Table: `goal_family_learning_mappings`**
```sql
CREATE TABLE goal_family_learning_mappings (
  id VARCHAR PRIMARY KEY,
  goal_family VARCHAR NOT NULL,
  learning_folder_id VARCHAR NOT NULL, -- e.g., 'financial-planning'
  learning_module_id VARCHAR, -- Optional specific module
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP
);
```

---

## Phase 2: Backend API Changes

### Type Definitions

**File: `src/lib/api/types/goals.ts`** (MODIFY)

Add new types:
```typescript
export type GoalFamily = 
  | 'invest_grow'
  | 'debt_obligations'
  | 'lifestyle_wellbeing'
  | 'risk_protection'
  | 'values_based'
  | 'liquidity_resilience';

export type GoalTag = 
  | 'liquidity'
  | 'emergency_fund'
  | 'debt_payoff'
  | 'insurance'
  | 'estate_planning'
  | 'charitable_giving'
  | 'education_fund'
  | 'health_savings'
  | 'tax_planning'
  | 'retirement'
  | 'home_purchase'
  | 'other';

export interface GoalTemplate {
  id: string;
  family: GoalFamily;
  name: string;
  description: string;
  defaultTargetAmount?: number;
  defaultMonthlyContribution?: number;
  defaultMetadata?: GoalMetadata;
  checklistItems?: Array<{ id: string; label: string; completed: boolean }>;
  relatedLearningModules?: string[];
}

export interface FamilySpecificMetrics {
  // Debt & Obligations
  debtPayoffPercentage?: number;
  interestSaved?: number;
  monthsRemaining?: number;
  
  // Risk & Protection
  coverageGaps?: Array<{ type: string; description: string }>;
  coverageCompleteness?: number; // 0-100
  
  // Liquidity & Resilience
  bufferDays?: number; // Days of expenses covered
  emergencyFundAdequacy?: number; // 0-100
  
  // Values-Based
  givingTargetPercentage?: number;
  givingProgress?: number;
}

// Extend GoalMetadata
export interface GoalMetadata {
  initialInvestment?: number;
  assetAllocation?: Record<string, number>;
  notes?: string;
  templateId?: string; // NEW
  checklistItems?: Array<{ id: string; label: string; completed: boolean }>; // NEW
}

// Extend GoalDto
export interface GoalDto {
  // ... existing fields
  goalFamily?: GoalFamily; // NEW
  goalTags?: GoalTag[]; // NEW
  familySpecificMetrics?: FamilySpecificMetrics; // NEW
  relatedLearningModules?: string[]; // NEW
}

// Extend CreateGoalRequest
export interface CreateGoalRequest {
  // ... existing fields
  goalFamily?: GoalFamily; // NEW
  goalTags?: GoalTag[]; // NEW
  templateId?: string; // NEW
}

// New response type
export interface GoalFamilySummary {
  family: GoalFamily;
  totalGoals: number;
  activeGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  progressPercentage: number;
  nextAction?: string;
  attentionRequired: boolean;
}

export interface UserGoalsResponse {
  goals: GoalWithInsightsDto[];
  summary: GoalsSummaryDto;
  budgetValidation?: BudgetValidationResult | null;
  familySummaries?: GoalFamilySummary[]; // NEW
}
```

**File: `src/lib/api/types/learningPaths.ts`** (MODIFY)

Add goal family mapping:
```typescript
export interface GoalFamilyLearningMapping {
  goalFamily: string;
  learningFolderId: string;
  learningModuleIds?: string[];
  priority: number;
}

// Add to existing types if needed
export const GOAL_FAMILY_LEARNING_MAP: Record<string, string[]> = {
  debt_obligations: ['financial-planning', 'risk-management'],
  risk_protection: ['risk-management', 'financial-planning'],
  liquidity_resilience: ['financial-planning'],
  values_based: ['esg-investing', 'islamic-finance'],
  lifestyle_wellbeing: ['retirement-planning', 'financial-planning'],
  invest_grow: ['asset-classes', 'portfolio-optimization'],
};
```

### API Client Changes

**File: `src/lib/api/goalsApi.ts`** (MODIFY)

Add new endpoints:
```typescript
export const goalsApi = {
  // ... existing methods

  getGoalTemplates: async (family?: GoalFamily): Promise<GoalTemplate[]> => {
    const params = new URLSearchParams();
    if (family) params.append('family', family);
    const response = await apiClient.get<ApiResponse<GoalTemplate[]>>(
      `/goals/templates?${params.toString()}`
    );
    return response.data.data;
  },

  getGoalFamilySummaries: async (userId: string): Promise<GoalFamilySummary[]> => {
    const params = buildUserParams(userId);
    const response = await apiClient.get<ApiResponse<GoalFamilySummary[]>>(
      `/goals/families/summary?${params.toString()}`
    );
    return response.data.data;
  },

  getFamilyLearningModules: async (family: GoalFamily): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `/goals/families/${family}/learning-modules`
    );
    return response.data.data;
  },
};
```

---

## Phase 3: Frontend Constants & Utilities

**File: `src/lib/constants/goalFamilies.ts`** (NEW)

```typescript
import { GoalFamily, GoalTag } from '@/lib/api/types/goals';
import { 
  TrendingUp, 
  CreditCard, 
  Heart, 
  Shield, 
  Star, 
  Droplet 
} from 'lucide-react';

export interface GoalFamilyConfig {
  id: GoalFamily;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  defaultTags: GoalTag[];
  learningFolderIds: string[];
}

export const GOAL_FAMILIES: Record<GoalFamily, GoalFamilyConfig> = {
  invest_grow: {
    id: 'invest_grow',
    label: 'Invest & Grow',
    description: 'Build wealth through investments and savings',
    icon: TrendingUp,
    color: 'text-green-600',
    defaultTags: ['retirement'],
    learningFolderIds: ['asset-classes', 'portfolio-optimization'],
  },
  debt_obligations: {
    id: 'debt_obligations',
    label: 'Debt & Obligations',
    description: 'Manage and pay off debts systematically',
    icon: CreditCard,
    color: 'text-red-600',
    defaultTags: ['debt_payoff'],
    learningFolderIds: ['financial-planning'],
  },
  lifestyle_wellbeing: {
    id: 'lifestyle_wellbeing',
    label: 'Lifestyle & Wellbeing',
    description: 'Major purchases, health, and life milestones',
    icon: Heart,
    color: 'text-pink-600',
    defaultTags: [],
    learningFolderIds: ['retirement-planning', 'financial-planning'],
  },
  risk_protection: {
    id: 'risk_protection',
    label: 'Risk & Protection',
    description: 'Insurance, estate planning, and risk management',
    icon: Shield,
    color: 'text-blue-600',
    defaultTags: ['insurance', 'estate_planning'],
    learningFolderIds: ['risk-management', 'financial-planning'],
  },
  values_based: {
    id: 'values_based',
    label: 'Values-Based Goals',
    description: 'Charitable giving, education funds, ethical investing',
    icon: Star,
    color: 'text-purple-600',
    defaultTags: ['charitable_giving', 'education_fund'],
    learningFolderIds: ['esg-investing', 'islamic-finance'],
  },
  liquidity_resilience: {
    id: 'liquidity_resilience',
    label: 'Liquidity & Resilience',
    description: 'Emergency funds, cash buffers, financial security',
    icon: Droplet,
    color: 'text-cyan-600',
    defaultTags: ['liquidity', 'emergency_fund'],
    learningFolderIds: ['financial-planning'],
  },
};

export const GOAL_TAG_LABELS: Record<GoalTag, string> = {
  liquidity: 'Liquidity',
  emergency_fund: 'Emergency Fund',
  debt_payoff: 'Debt Payoff',
  insurance: 'Insurance',
  estate_planning: 'Estate Planning',
  charitable_giving: 'Charitable Giving',
  education_fund: 'Education Fund',
  health_savings: 'Health Savings',
  tax_planning: 'Tax Planning',
  retirement: 'Retirement',
  home_purchase: 'Home Purchase',
  other: 'Other',
};
```

**File: `src/lib/utils/goalFamilyUtils.ts`** (NEW)

```typescript
import { GoalFamily, GoalWithInsightsDto, FamilySpecificMetrics } from '@/lib/api/types/goals';
import { GOAL_FAMILIES } from '@/lib/constants/goalFamilies';

export const getFamilyConfig = (family: GoalFamily) => {
  return GOAL_FAMILIES[family];
};

export const calculateFamilyMetrics = (
  goal: GoalWithInsightsDto
): FamilySpecificMetrics => {
  const metrics: FamilySpecificMetrics = {};
  
  if (goal.goalFamily === 'debt_obligations') {
    const totalDebt = goal.targetAmount;
    const paidOff = goal.currentAmount;
    metrics.debtPayoffPercentage = totalDebt > 0 
      ? (paidOff / totalDebt) * 100 
      : 0;
    // Calculate interest saved (simplified)
    metrics.interestSaved = paidOff * 0.15; // Example: 15% interest rate
  }
  
  if (goal.goalFamily === 'liquidity_resilience') {
    // Calculate buffer days (simplified - would need monthly expenses)
    const monthlyExpenses = 5000; // This should come from user data
    metrics.bufferDays = goal.currentAmount / (monthlyExpenses / 30);
    metrics.emergencyFundAdequacy = Math.min(
      (goal.currentAmount / goal.targetAmount) * 100,
      100
    );
  }
  
  return metrics;
};

export const getFamilyLearningModules = (family: GoalFamily): string[] => {
  return GOAL_FAMILIES[family]?.learningFolderIds || [];
};
```

---

## Phase 4: Frontend Component Changes

### Goal Form Updates

**File: `src/components/goals/GoalFormDialog.tsx`** (MODIFY)

Add fields for:
- Goal Family selector (required)
- Goal Tags (multi-select, optional)
- Template selector (optional, shows templates for selected family)
- Checklist items (if template selected)

Key changes:
1. Add `goalFamily` field to form
2. Add `goalTags` multi-select
3. Add template selector that filters by family
4. Show checklist items when template selected
5. Pre-fill form when template selected

### Goal List/Overview Updates

**File: `src/pages/Goals.tsx`** (MODIFY)

Add:
- Family filter chips (in addition to type filter)
- Family summary cards row (showing progress per family)
- Family badges on goal cards

**File: `src/components/goals/GoalCard.tsx`** (MODIFY)

Add:
- Family badge/chip display
- Tag chips display
- Family-specific metric display (e.g., "65% paid off" for debt goals)

**File: `src/components/goals/GoalSummaryCards.tsx`** (MODIFY)

Add:
- Optional family summary cards component
- Dual dials for Aspirational vs Obligation goals

**File: `src/components/goals/GoalFamilySummaryCards.tsx`** (NEW)

Component to display family summaries:
- Progress per family
- Next action indicators
- Attention flags

### Goal Detail Updates

**File: `src/pages/GoalDetail.tsx`** (MODIFY)

Add:
- Family and tags display in header
- Family-specific metrics section
- Related learning modules section (links to learning library)
- Contextual guidance module (tips based on family)

**File: `src/components/goals/GoalFamilyMetrics.tsx`** (NEW)

Component to display family-specific metrics:
- Debt payoff percentage
- Coverage gaps
- Buffer days
- Giving progress

**File: `src/components/goals/GoalLearningModules.tsx`** (NEW)

Component to display related learning content:
- Links to learning folders/modules
- Progress tracking for learning
- "Start Learning" CTAs

**File: `src/components/goals/GoalContextualGuidance.tsx`** (NEW)

Component showing tips and guidance based on goal family:
- Why this goal matters
- Best practices
- Common mistakes to avoid

### Dashboard Updates

**File: `src/pages/Dashboard.tsx`** (MODIFY)

Add:
- Dual dials component (Aspirational vs Obligation)
- Family cards carousel
- Insights strip with obligation/resilience nudges

**File: `src/components/dashboard/GoalFamilyCarousel.tsx`** (NEW)

Carousel showing family cards with:
- Progress summary
- Next action
- Quick link to family goals

**File: `src/components/dashboard/DualGoalDials.tsx`** (NEW)

Component showing:
- Aspirational momentum dial
- Obligation steadiness dial
- Overall health score

**File: `src/components/dashboard/GoalInsightsStrip.tsx`** (NEW)

Horizontal strip showing:
- Emergency fund status
- Insurance review due dates
- Debt payment reminders
- Other time-based nudges

---

## Phase 5: Learning Library Integration

### Learning Page Updates

**File: `src/pages/Learning.tsx`** (MODIFY)

Add:
- "Recommended for Your Goals" section
- Filter by goal family
- Quick links from goal families to relevant learning content

**File: `src/components/learning/GoalFamilyLearningSection.tsx`** (NEW)

Component showing:
- Learning modules recommended based on user's active goals
- Progress tracking
- "Complete to unlock insights" messaging

### Learning Path Integration

**File: `src/pages/LearningPaths.tsx`** (MODIFY)

Add:
- Filter by goal family
- Show goals that relate to each learning path
- "Apply to Goal" CTA on learning path cards

**File: `src/components/learning/paths/LearningPathCard.tsx`** (MODIFY)

Add:
- Goal family badges
- "Related to your goals" indicator
- Link to create goal from learning path

### Learning Detail Integration

**File: `src/pages/LearningLibraryDetail.tsx`** (MODIFY)

Add:
- "Related Goals" section
- "Create Goal from This Content" CTA
- Goal family context

---

## Phase 6: Template System

**File: `src/lib/constants/goalTemplates.ts`** (NEW)

Define goal templates:
```typescript
export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'debt_credit_card',
    family: 'debt_obligations',
    name: 'Credit Card Payoff',
    description: 'Pay off credit card debt systematically',
    defaultMetadata: {
      checklistItems: [
        { id: '1', label: 'List all credit cards', completed: false },
        { id: '2', label: 'Calculate total debt', completed: false },
        { id: '3', label: 'Choose payoff strategy (snowball/avalanche)', completed: false },
        { id: '4', label: 'Set up automatic payments', completed: false },
      ],
    },
    relatedLearningModules: ['financial-planning'],
  },
  {
    id: 'debt_student_loan',
    family: 'debt_obligations',
    name: 'Student Loan Payoff',
    description: 'Eliminate student loan debt',
    // ... similar structure
  },
  {
    id: 'insurance_review',
    family: 'risk_protection',
    name: 'Insurance Coverage Review',
    description: 'Ensure adequate insurance coverage',
    defaultMetadata: {
      checklistItems: [
        { id: '1', label: 'Review life insurance coverage', completed: false },
        { id: '2', label: 'Review health insurance', completed: false },
        { id: '3', label: 'Review disability insurance', completed: false },
        { id: '4', label: 'Review property insurance', completed: false },
      ],
    },
    relatedLearningModules: ['risk-management'],
  },
  // ... more templates
];
```

**File: `src/components/goals/GoalTemplateSelector.tsx`** (NEW)

Component for selecting and applying templates:
- Template gallery
- Preview of pre-filled values
- Apply template action

---

## Phase 7: Guided Workflows

**File: `src/components/goals/GuidedGoalWorkflow.tsx`** (NEW)

Wizard-style component for obligations:
1. Snapshot (current state)
2. Priority recommendations
3. Goal template suggestions
4. Add to quarterly review checklist

**File: `src/components/goals/QuarterlyReviewChecklist.tsx`** (NEW)

Component for managing quarterly financial health checks:
- List of obligation goals
- Review status
- Reminder system

---

## Phase 8: Reminders & Notifications

**File: `src/hooks/useGoalReminders.ts`** (NEW)

Hook for managing goal-related reminders:
- Payment due dates (debt goals)
- Insurance renewal dates
- Quarterly review reminders
- Liquidity check reminders

**File: `src/components/goals/GoalReminderSettings.tsx`** (NEW)

Component for configuring reminders per goal:
- Reminder type selection
- Frequency settings
- Notification preferences

---

## Implementation Order

### Sprint 1: Foundation
1. ✅ Database schema changes (backend)
2. ✅ Type definitions (`goals.ts`)
3. ✅ Constants (`goalFamilies.ts`, `goalTemplates.ts`)
4. ✅ Utility functions (`goalFamilyUtils.ts`)

### Sprint 2: Core Goal Features
5. ✅ Update `GoalFormDialog` with family/tags
6. ✅ Update `GoalCard` to show family/tags
7. ✅ Update `GoalDetail` page with family metrics
8. ✅ Create `GoalFamilyMetrics` component

### Sprint 3: Dashboard & Overview
9. ✅ Update `Goals.tsx` with family filters
10. ✅ Create `GoalFamilySummaryCards`
11. ✅ Update Dashboard with dual dials
12. ✅ Create `GoalFamilyCarousel`

### Sprint 4: Learning Integration
13. ✅ Update Learning pages with goal context
14. ✅ Create `GoalFamilyLearningSection`
15. ✅ Add learning links to goal detail pages
16. ✅ Create `GoalLearningModules` component

### Sprint 5: Templates & Workflows
17. ✅ Create template system
18. ✅ Create `GoalTemplateSelector`
19. ✅ Create `GuidedGoalWorkflow`
20. ✅ Create `QuarterlyReviewChecklist`

### Sprint 6: Polish & Reminders
21. ✅ Create reminder system
22. ✅ Add contextual guidance
23. ✅ Add insights strip
24. ✅ Testing & refinement

---

## Testing Checklist

- [ ] Goal creation with family/tags
- [ ] Template application
- [ ] Family filtering
- [ ] Family-specific metrics calculation
- [ ] Learning module linking
- [ ] Dashboard family summaries
- [ ] Guided workflows
- [ ] Reminder system
- [ ] Mobile responsiveness
- [ ] Backward compatibility (existing goals)

---

## Migration Strategy

1. **Backward Compatibility**: Existing goals without `goalFamily` default to `invest_grow`
2. **Data Migration**: Script to suggest families for existing goals based on `goalType`
3. **Gradual Rollout**: Feature flag for new goal families UI
4. **User Education**: In-app tooltips and onboarding for new features

---

## Notes

- All goal families are optional - users don't need to use all of them
- Templates are optional - users can still create custom goals
- Learning integration is contextual - shows relevant content but doesn't force it
- Family-specific metrics are calculated client-side initially, can move to backend later
- Reminders can integrate with existing notification system

