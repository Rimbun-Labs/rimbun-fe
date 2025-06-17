# Loading States Migration Guide

## Overview

We are transitioning to a new, more consistent loading state system. This guide will help you migrate from the old loading components to the new ones.

## New Loading Components

### 1. LoadingSpinner

For inline loading indicators and small loading states.

```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Basic usage
<LoadingSpinner />

// With options
<LoadingSpinner 
  size="md"           // 'sm' | 'md' | 'lg'
  variant="primary"   // 'default' | 'primary' | 'white'
  text="Loading..."   // Optional loading text
/>
```

### 2. LoadingState

For content loading with skeleton placeholders.

```tsx
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

// Basic usage
<LoadingState />

// With options
<LoadingState 
  variant="default"   // 'default' | 'compact' | 'expanded'
  lines={2}          // Number of skeleton lines
  showTitle          // Show title skeleton
  showSubtitle       // Show subtitle skeleton
/>
```

## Migration Examples

### 1. Full Page Loading

Old:
```tsx
import { AssessmentLoading } from '@/components/assessment/AssessmentLoading';

<AssessmentLoading />
```

New:
```tsx
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

<LoadingState 
  variant="expanded"
  showTitle
  showSubtitle
  lines={3}
/>
```

### 2. Content Loading

Old:
```tsx
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

<LoadingState lines={2} />
```

New:
```tsx
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

<LoadingState 
  variant="default"
  lines={2}
  showTitle={false}
/>
```

### 3. Inline Loading

Old:
```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="h-4 w-4 animate-spin" />
```

New:
```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

<LoadingSpinner 
  size="sm"
  variant="default"
/>
```

### 4. Button Loading States

Old:
```tsx
<Button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

New:
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </div>
  ) : (
    "Submit"
  )}
</Button>
```

## Migration Timeline

1. **Phase 1 (Current)**
   - New components available
   - Deprecation notices added
   - Migration guide published

2. **Phase 2 (Next)**
   - Start migrating components
   - Keep old components functional
   - Add new components alongside old ones

3. **Phase 3 (Future)**
   - Remove deprecated components
   - Update all imports
   - Clean up unused code

## Best Practices

1. **Consistent Sizing**
   - Use `sm` for inline loading
   - Use `md` for button loading
   - Use `lg` for full-page loading

2. **Appropriate Variants**
   - Use `default` for most cases
   - Use `primary` for CTAs and important actions
   - Use `white` for dark backgrounds

3. **Loading Text**
   - Always provide descriptive loading text
   - Keep text concise and clear
   - Use consistent wording across the app

4. **Performance**
   - Use skeleton loading for content-heavy pages
   - Use spinner loading for quick operations
   - Consider using suspense boundaries for code-split loading

## Support

If you need help with migration or have questions about the new loading system, please:
1. Check the component documentation
2. Review the migration examples
3. Contact the development team 