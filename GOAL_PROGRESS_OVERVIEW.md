# Goal Progress Overview & Wireframes

## 📊 Application Overview

**InvestLearn Compass** is a comprehensive financial planning and investment education platform that helps users:
- Complete personalized financial assessments
- Track investment goals with progress visualization
- Analyze spending patterns over time
- Get personalized investment recommendations
- Learn through structured learning paths

---

## 🎯 Goal Progress Showcase

Goal progress is displayed across multiple sections of the application, providing users with comprehensive insights into their financial journey.

---

## 📐 Wireframes & Components

### 1. **Dashboard - Goal Gap Analysis Section**

**Location:** Main Dashboard → Insights Section (Expandable)

**Component:** `DirectInputs.tsx`

```
┌─────────────────────────────────────────────────────────────┐
│  💡 Insights & Goal Analysis                    [Show Less] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Your Investment Profile                               │ │
│  │ Your assessment inputs and goal analysis              │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 🎯 Your Goal Summary                          │   │ │
│  │  │                                               │   │ │
│  │  │ You're investing for retirement, targeting    │   │ │
│  │  │ $1,200,000 in 20 years. With your current    │   │ │
│  │  │ monthly income of $8,000, you're investing   │   │ │
│  │  │ $2,000 monthly.                               │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │ │
│  │  │ Age      │ │ Financial │ │ Monthly  │          │ │
│  │  │ 35       │ │ Goal      │ │ Income   │          │ │
│  │  │          │ │ Retirement│ │ $8,000   │          │ │
│  │  └──────────┘ └──────────┘ └──────────┘          │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ Goal Gap Analysis                             │   │ │
│  │  ├─────────────────────────────────────────────┤   │ │
│  │  │                                              │   │ │
│  │  │ Current Gap: $850,000                        │   │ │
│  │  │                                              │   │ │
│  │  │ Goal Achievability Score                      │   │ │
│  │  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │ │
│  │  │ 65/100                                       │   │ │
│  │  │                                              │   │ │
│  │  │ ┌─────────────────────────────────────────┐ │   │ │
│  │  │ │ → Timeline Analysis                     │ │   │ │
│  │  │ │   Time to Goal: 28.5 years              │ │   │ │
│  │  │ │   Investment Horizon: 20 years          │ │   │ │
│  │  │ │   ⚠️ Exceeds by 8.5 years               │ │   │ │
│  │  │ └─────────────────────────────────────────┘ │   │ │
│  │  │                                              │   │ │
│  │  │ ┌─────────────────────────────────────────┐ │   │ │
│  │  │ │ 💰 Investment Analysis                  │ │   │ │
│  │  │ │   Current Monthly: $2,000               │ │   │ │
│  │  │ │   Required Monthly: $3,500              │ │   │ │
│  │  │ │   You're investing 57% of what's needed │ │   │ │
│  │  │ └─────────────────────────────────────────┘ │   │ │
│  │  │                                              │   │ │
│  │  │ ┌─────────────────────────────────────────┐ │   │ │
│  │  │ │ 📈 Primary Recommendation                │ │   │ │
│  │  │ │   Increase your monthly savings to       │ │   │ │
│  │  │ │   $3,500 to reach your goal on time      │ │   │ │
│  │  │ └─────────────────────────────────────────┘ │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Goal summary with user inputs
- Current gap calculation
- Goal achievability score (0-100) with progress bar
- Timeline analysis comparing actual vs. target time
- Investment analysis showing current vs. required savings
- Primary recommendation with actionable steps

---

### 2. **Dashboard - Investment Scenarios**

**Location:** Main Dashboard → Insights Section (Expanded) → Below Goal Gap Analysis

**Component:** `InvestmentScenarios.tsx`

```
┌─────────────────────────────────────────────────────────────┐
│  Investment Scenarios                                       │
│  Compare different approaches to reach your goal            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 💰 Conservative Plan                    [Achievable]  │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                       │ │
│  │  Initial Investment: $50,000                         │ │
│  │  Monthly Investment: $2,000                          │ │
│  │                                                       │ │
│  │  ⏰ Time to Goal                                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │  28.5 years                                           │ │
│  │                                                       │ │
│  │  🎯 Projected Amount                                  │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │  $1,200,000                                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📈 Aggressive Plan                    [Achievable]   │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                       │ │
│  │  Total Savings: $100,000                              │ │
│  │  Monthly Investment: $2,000                          │ │
│  │                                                       │ │
│  │  ⏰ Time to Goal                                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │  22.3 years                                           │ │
│  │                                                       │ │
│  │  🎯 Projected Amount                                  │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │  $1,200,000                                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Key Differences                                       │ │
│  │ • Conservative Plan uses initial investment          │ │
│  │ • Aggressive Plan includes all savings               │ │
│  │ • Time difference: 6.2 years                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Side-by-side comparison of Conservative vs. Aggressive plans
- Progress bars for time to goal (relative to investment horizon)
- Progress bars for projected amount (relative to target)
- Visual indicators for achievability
- Key differences summary

---

### 3. **Cash Flow Projections - Goal Progress Card**

**Location:** Cash Flow Projections Page → Right Sidebar

**Component:** `CashFlowProjections.tsx` (Goal Progress Summary Card)

```
┌─────────────────────────────────────────┐
│  🎯 Goal Progress                      │
├─────────────────────────────────────────┤
│                                         │
│           ┌─────────────┐              │
│           │    42.3%    │              │
│           │             │              │
│           └─────────────┘              │
│      Goal Achievement                   │
│                                         │
│  ───────────────────────────────────── │
│                                         │
│  Current Value                          │
│  $507,600                               │
│                                         │
│  Target Amount                          │
│  $1,200,000                             │
│                                         │
│  Time to Goal                           │
│  156 months                             │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features:**
- Large percentage display of goal achievement
- Current value vs. target amount comparison
- Time remaining to reach goal
- Clean, focused card design

---

### 4. **Dashboard Preview - Quick Goal Progress**

**Location:** Landing/Welcome Page (Preview)

**Component:** `DashboardPreview.tsx`

```
┌─────────────────────────────────────────┐
│  Goal Progress                          │
│                                         │
│  42%                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  $150K of $1.2M target                 │
└─────────────────────────────────────────┘
```

**Key Features:**
- Compact progress display
- Percentage with progress bar
- Current vs. target amount

---

## 🎨 Design Patterns

### Progress Visualization

1. **Progress Bars**
   - Used for: Goal achievability score, time to goal, projected amount
   - Styling: Primary color, height varies (h-2 to h-2.5)
   - Shows percentage completion

2. **Percentage Displays**
   - Large text (text-2xl to text-3xl) for emphasis
   - Color-coded based on status (green = on track, yellow = needs attention, red = challenging)

3. **Comparison Cards**
   - Side-by-side scenarios (Conservative vs. Aggressive)
   - Badge indicators for achievability status
   - Grid layout for metrics

4. **Timeline Indicators**
   - Clock icons for time-based metrics
   - Warning indicators when timeline exceeds horizon
   - Color-coded (green/yellow/red) based on feasibility

---

## 📊 Data Flow

```
Assessment Inputs
    ↓
Backend Calculation
    ↓
Goal Gap Insights API
    ↓
Frontend Components
    ├── DirectInputs (Goal Gap Analysis)
    ├── InvestmentScenarios (Scenario Comparison)
    └── CashFlowProjections (Progress Summary)
```

---

## 🔑 Key Metrics Displayed

1. **Goal Achievability Score** (0-100)
   - Based on investment progress, timeline, market conditions
   - Visual progress bar

2. **Current Gap**
   - Difference between current investments and target
   - Currency formatted

3. **Time Analysis**
   - Actual time to goal vs. investment horizon
   - Warning if exceeds horizon

4. **Investment Analysis**
   - Current monthly investment vs. required
   - Percentage of required amount being invested

5. **Scenario Projections**
   - Conservative: Uses initial investment only
   - Aggressive: Includes all savings
   - Time and amount comparisons

---

## 🎯 User Experience Flow

1. **User completes assessment** → Inputs goal, timeline, savings
2. **System calculates** → Goal gap insights generated
3. **Dashboard displays** → Goal summary, achievability score, scenarios
4. **User expands insights** → Detailed analysis, recommendations
5. **User views projections** → Cash flow page shows progress card
6. **User takes action** → Adjusts savings, timeline, or target based on recommendations

---

## 📱 Responsive Design

- **Desktop:** Full-width cards with side-by-side comparisons
- **Tablet:** Stacked layout, maintain card structure
- **Mobile:** Single column, simplified metrics, collapsible sections

---

## 🚀 Future Enhancements (Potential)

1. **Interactive Goal Adjuster**
   - Sliders to adjust target amount, timeline, monthly savings
   - Real-time recalculation

2. **Goal Milestones**
   - Break down large goals into smaller milestones
   - Progress tracking for each milestone

3. **Historical Progress Chart**
   - Show goal progress over time
   - Compare actual vs. projected progress

4. **Goal Comparison**
   - Multiple goals side-by-side
   - Priority ranking

5. **Achievement Badges**
   - Celebrate milestones reached
   - Visual rewards for progress

---

## 📝 Summary

The goal progress system provides users with:
- ✅ Clear visualization of their financial goals
- ✅ Actionable insights and recommendations
- ✅ Multiple scenario comparisons
- ✅ Real-time progress tracking
- ✅ Comprehensive gap analysis

All components use consistent design patterns, responsive layouts, and clear visual hierarchy to guide users toward their financial objectives.

---

## 🗂️ Dedicated Goals Hub (Main Navigation)

### Information Architecture
- **Route structure**
  - `/goals` → Overview (summary + list)
  - `/goals/:goalId` → Detail workspace (insights, progress, actions)
  - `/goals/:goalId/progress` → Deep-linkable chart tab (optional nested route)
  - `/goals/new` & `/goals/:goalId/edit` → Form surface (full-page or modal overlay)
- **Navigation**
  - Main nav item “Goals” with icon + badge when attention required.
  - Dashboard goal widget “View all goals” CTA links to `/goals`.
  - Contextual chips (e.g., in Cash Flow or Learning) link to specific goal detail routes.

### Overview Screen Wireframe ( `/goals` )
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Goals Hub                                                     [+ Add Goal] │
├─────────────────────────────────────────────────────────────────────────────┤
│  Summary Row: [Total Goals] [Overall Progress] [Total Target] [Monthly Gap] │
├─────────────────────────────────────────────────────────────────────────────┤
│  Filters: [Status All/Active/Paused] [Goal Type dropdown] [Sort] [Search 🔍] │
├─────────────────────────────────────────────────────────────────────────────┤
│  Goal Cards Grid/List                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Retirement  | On Track badge | Assessment Goal                        │ │
│  │  Target $1.2M • Current $420K • Progress 35%                           │ │
│  │  Required Monthly $3.5K | Investing $2K (57%)                          │ │
│  │  Footer: View Details | Quick Actions (Edit/Delete)                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  ...                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key modules**
- Summary cards reuse `UserGoalsResponse.summary`.
- Filters/sorting persist to query params to keep state shareable.
- Goal cards show `goalGapInsights`, `timeline`, `isFromAssessment` badge, priority, and CTA.
- Empty state highlights benefits + “Add your first goal” action.

### Goal Detail Workspace ( `/goals/:goalId` )
```
┌─────────────────────────────┬──────────────────────────────────────────────┐
│  Left Column (2/3 width)    │ Right Column (1/3 width)                    │
├─────────────────────────────┼──────────────────────────────────────────────┤
│  Header: Goal name, type,   │ Action Panel:                                │
│  status badge, priority     │  - Edit Goal                                 │
│  tabs: Overview | Progress  │  - Delete Goal (disabled if assessment)      │
│  | Insights                 │  - Link back to Assessment (if applicable)   │
│                             │                                              │
│  Section 1: Goal Snapshot   │  Side widgets:                               │
│  - Target vs Current card   │  - Notes / metadata                          │
│  - Timeline chip            │  - Recommended allocation                    │
│                             │  - Related learning tiles                     │
│  Section 2: Gap & Savings   │                                              │
│  - Current gap, required vs │                                              │
│    actual monthly, progress │                                              │
│  Section 3: Timeline chart  │                                              │
│  - Pulls `/progress` API    │                                              │
└─────────────────────────────┴──────────────────────────────────────────────┘
```

**Progress tab**
- Uses line chart (current amount vs. target trajectory) + bar chart for contributions.
- Filter panel for timeframe (1Y, 3Y, custom start/end using API query params).
- Trend stats from `GoalProgressHistoryDto.trends`.

### Create/Edit Goal Flow
- Shared full-screen form with sections:
  1. Basics (name, type, priority, metadata notes)
  2. Financials (target, current, monthly contribution, horizon/date)
  3. Investment details (initial investment, asset allocation if provided)
- Inline validation mirrors backend DTO requirements; currency inputs use existing formatters.
- Submit triggers React Query mutation with optimistic toast + redirect back to detail/overview.

### Attention & Gamification
- Badge/indicator on nav + goal cards when progress slip > configurable threshold.
- Milestone chips (25%, 50%, 75%) and celebratory confetti modal on completion (future enhancement-ready).
- Integrate micro-learning tiles matched to goal type (e.g., “Saving for College? Watch 3-min guide”).

### Responsive Behavior
- Desktop: two-column layout with persistent filters sidebar (optional).
- Tablet: stacked summary, single-column cards; detail page converts right column into collapsible drawer.
- Mobile: condensed hero metrics, horizontal scroll cards, FAB for “Add Goal”.

### Technical Notes
- React Query cache keys: `['goals','list',includeInactive]`, `['goals','detail',goalId]`, `['goals','progress',goalId,params]`.
- Use dynamic route segments to integrate with existing `AppRouter`; lazy-load goal hub bundle to keep initial dashboard payload light.
- Authorization guard: ensure `/goals` routes require authenticated session just like dashboard.

This Goals Hub plan elevates goal management to a dedicated workspace while keeping the dashboard snapshot intact, providing room for future enhancements like milestones, comparisons, and educational nudges.

