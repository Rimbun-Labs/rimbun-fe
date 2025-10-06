# 🧩 Component Library

> **Comprehensive guide to all components in InvestLearn Compass**

This document provides detailed information about each component, including props, usage examples, and best practices.

## 📋 Table of Contents

- [Assessment Components](#assessment-components)
- [Dashboard Components](#dashboard-components)
- [Learning Components](#learning-components)
- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Form Components](#form-components)

---

## 🎯 Assessment Components

### AssessmentContainer

Main wrapper for the assessment flow. Manages question progression, progress tracking, and navigation.

**Location:** `src/components/assessment/AssessmentContainer.tsx`

**Props:**
```typescript
interface AssessmentContainerProps {
  questions: Question[];
  currentQuestionIndex: number;
  progress: AssessmentProgressState['progress'];
  answers: Record<string, any>;
  error: string | null;
  isSubmitting: boolean;
  onAnswer: (answer: UserAnswer) => Promise<any>;
  onNext: () => void;
  onPrevious: () => void;
}
```

**Usage:**
```tsx
<AssessmentContainer
  questions={assessmentQuestions}
  currentQuestionIndex={currentIndex}
  progress={progressState}
  answers={userAnswers}
  error={validationError}
  isSubmitting={isSubmitting}
  onAnswer={handleAnswer}
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
```

**Features:**
- Progress bar with category information
- Error display and validation feedback
- Navigation between questions
- Category headers and question counting

---

### QuestionCard

Displays individual assessment questions with appropriate input components and validation.

**Location:** `src/components/assessment/QuestionCard.tsx`

**Props:**
```typescript
interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: UserAnswer) => Promise<any>;
  onNext: () => void;
  currentAnswer?: string | number;
  isLastQuestion: boolean;
  error?: string;
}
```

**Usage:**
```tsx
<QuestionCard
  question={currentQuestion}
  onAnswer={handleAnswer}
  onNext={handleNext}
  currentAnswer={answers[question.id]}
  isLastQuestion={isLastQuestion}
  error={validationError}
/>
```

**Features:**
- Dynamic input rendering based on question type
- Real-time validation
- Error display and handling
- Answer persistence

---

### AnswerInputs

Dynamic input component that renders different input types based on question configuration.

**Location:** `src/components/assessment/question/AnswerInputs.tsx`

**Supported Input Types:**
- `boolean` - Yes/No questions
- `number` - Numeric inputs with validation
- `multiple_choice` - Radio button selection
- `select` - Dropdown selection
- `single_text` - Text input
- `slider` - Range slider input

**Usage:**
```tsx
<AnswerInputs
  question={question}
  onAnswer={handleAnswer}
  currentAnswer={currentAnswer}
  error={error}
/>
```

---

### ProgressBar

Visual progress indicator showing assessment completion and current category.

**Location:** `src/components/assessment/ProgressBar.tsx`

**Props:**
```typescript
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  category: string;
}
```

**Features:**
- Step-by-step progress visualization
- Category name display
- Responsive design
- Smooth animations

---

## 📊 Dashboard Components

### PortfolioAllocation

Interactive portfolio visualization with pie charts and metric breakdowns.

**Location:** `src/components/dashboard/PortfolioAllocation.tsx`

**Props:**
```typescript
interface PortfolioAllocationProps {
  allocations: AssetAllocations;
  recommendedMetrics?: RecommendedMetricsWithWeights;
  loading?: boolean;
}
```

**Features:**
- Pie chart visualization using Recharts
- Toggle between allocation and metrics views
- Responsive design with dark/light theme support
- Loading states and error handling

**Usage:**
```tsx
<PortfolioAllocation
  allocations={{
    equities: 60,
    bonds: 25,
    realEstate: 10,
    cash: 5
  }}
  recommendedMetrics={userMetrics}
  loading={isLoading}
/>
```

---

### RiskProfileChart

Displays user's risk profile with visual indicators and explanations.

**Location:** `src/components/dashboard/RiskProfileChart.tsx`

**Features:**
- Radar chart visualization
- Risk dimension breakdown
- Confidence scoring
- Interactive tooltips

---

### LearningProgress

Tracks user's learning journey and achievements.

**Location:** `src/components/dashboard/LearningProgress.tsx`

**Features:**
- Progress bars for different learning areas
- Achievement badges and milestones
- Learning path recommendations
- Time-based progress tracking

---

### RecommendationsSection

Provides personalized investment recommendations based on assessment results.

**Location:** `src/components/dashboard/RecommendationsSection.tsx`

**Features:**
- Asset allocation suggestions
- Risk-adjusted recommendations
- Educational content links
- Action item tracking

---

## 📚 Learning Components

### LearningFolderView

Organizes educational content into logical folders and modules.

**Location:** `src/components/learning/LearningFolderView.tsx`

**Features:**
- Folder-based content organization
- Search and filtering capabilities
- Progress tracking per module
- Difficulty level indicators

**Usage:**
```tsx
<LearningFolderView folderId="asset-classes" />
```

---

### ModuleCard

Displays individual learning modules with progress and metadata.

**Location:** `src/components/learning/ModuleCard.tsx`

**Props:**
```typescript
interface ModuleCardProps {
  module: LearningModule;
  onSelect: (moduleId: string) => void;
}
```

**Features:**
- Progress visualization
- Difficulty indicators
- Estimated duration
- Completion status

---

### MetricLibraryDetail

Detailed explanations of investment metrics and concepts.

**Location:** `src/components/learning/library/MetricLibraryDetail.tsx`

**Features:**
- Comprehensive metric explanations
- Real-world examples
- Interactive calculators
- Related learning resources

---

### QuizSection

Interactive knowledge testing with immediate feedback.

**Location:** `src/components/learning/quiz/QuizSection.tsx`

**Features:**
- Multiple question types
- Instant feedback
- Progress tracking
- Score calculation

---

## 🏗️ Layout Components

### AppLayout

Main application layout with sidebar navigation and content area.

**Location:** `src/components/layout/AppLayout.tsx`

**Features:**
- Responsive sidebar navigation
- Mobile menu support
- Breadcrumb navigation
- User profile integration

---

### AppHeader

Top navigation bar with user actions and branding.

**Location:** `src/components/layout/AppHeader.tsx`

**Features:**
- User authentication status
- Quick action buttons
- Search functionality
- Notification center

---

### AppSidebar

Left navigation sidebar with main app sections.

**Location:** `src/components/layout/AppSidebar.tsx`

**Features:**
- Collapsible navigation
- Icon-based menu items
- Active state indicators
- Nested menu support

---

### MobileMenu

Responsive mobile navigation menu.

**Location:** `src/components/layout/MobileMenu.tsx`

**Features:**
- Hamburger menu toggle
- Full-screen overlay
- Touch-friendly navigation
- Smooth animations

---

## 🎨 UI Components

### Button

Versatile button component with multiple variants and sizes.

**Location:** `src/components/ui/button.tsx`

**Variants:**
- `default` - Primary action button
- `destructive` - Dangerous actions
- `outline` - Secondary actions
- `secondary` - Alternative styling
- `ghost` - Subtle interactions
- `link` - Text-based buttons

**Sizes:**
- `sm` - Small buttons
- `default` - Standard size
- `lg` - Large buttons
- `icon` - Icon-only buttons

**Usage:**
```tsx
<Button variant="default" size="lg" onClick={handleClick}>
  Get Started
</Button>
```

---

### Card

Container component for content organization.

**Location:** `src/components/ui/card.tsx`

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Portfolio Overview</CardTitle>
    <CardDescription>Your current investment allocation</CardDescription>
  </CardHeader>
  <CardContent>
    <PortfolioChart data={portfolioData} />
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

---

### LoadingState

Skeleton loading component for content placeholders.

**Location:** `src/components/dashboard/ui/LoadingState.tsx`

**Variants:**
- `default` - Standard loading state
- `compact` - Minimal loading display
- `expanded` - Full-page loading

**Props:**
```typescript
interface LoadingStateProps {
  variant?: 'default' | 'compact' | 'expanded';
  lines?: number;
  showTitle?: boolean;
  showSubtitle?: boolean;
}
```

**Usage:**
```tsx
<LoadingState
  variant="expanded"
  lines={3}
  showTitle
  showSubtitle
/>
```

---

## 📝 Form Components

### Form

Form wrapper with validation and submission handling.

**Location:** `src/components/ui/form.tsx`

**Features:**
- React Hook Form integration
- Zod schema validation
- Error handling
- Field state management

---

### Input

Text input component with various types and states.

**Location:** `src/components/ui/input.tsx`

**Types:**
- `text` - Standard text input
- `email` - Email validation
- `password` - Secure input
- `number` - Numeric input
- `search` - Search functionality

**Usage:**
```tsx
<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Select

Dropdown selection component.

**Location:** `src/components/ui/select.tsx`

**Features:**
- Searchable options
- Multi-select support
- Custom option rendering
- Keyboard navigation

---

### Checkbox

Checkbox input component.

**Location:** `src/components/ui/checkbox.tsx`

**Features:**
- Controlled state
- Custom styling
- Accessibility support
- Form integration

---

## 🔧 Best Practices

### Component Design

1. **Single Responsibility** - Each component should have one clear purpose
2. **Props Interface** - Always define TypeScript interfaces for props
3. **Default Props** - Provide sensible defaults where appropriate
4. **Error Boundaries** - Wrap critical components with error boundaries

### Performance

1. **Memoization** - Use `React.memo` for expensive components
2. **Callback Optimization** - Optimize event handlers with `useCallback`
3. **Lazy Loading** - Implement code splitting for large components
4. **Bundle Analysis** - Monitor bundle size impact

### Accessibility

1. **ARIA Labels** - Provide descriptive labels for screen readers
2. **Keyboard Navigation** - Ensure all interactive elements are keyboard accessible
3. **Color Contrast** - Maintain sufficient contrast ratios
4. **Focus Management** - Proper focus handling in modals and forms

### Testing

1. **Component Testing** - Test component rendering and behavior
2. **Integration Testing** - Test component interactions
3. **Accessibility Testing** - Verify ARIA compliance
4. **Visual Regression** - Test component appearance consistency

---

## 📚 Additional Resources

- [Loading States Guide](./LOADING_STATES.md) - Detailed loading component documentation
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Base component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Documentation](https://react.dev/) - Official React guides

---

*Last updated: [Current Date]*
*Maintained by: InvestLearn Compass Development Team* 