/**
 * Standardized spacing constants for consistent design across the application
 * 
 * Usage:
 * import { SPACING } from '@/lib/constants/spacing';
 * 
 * <div className={SPACING.page.container}>
 *   <div className={SPACING.page.section}>
 *     Content
 *   </div>
 * </div>
 */

export const SPACING = {
  // Page-level spacing
  page: {
    // Standard page container (used on all pages)
    container: 'w-full px-4 sm:px-6 lg:px-8 py-8',
    // Main content wrapper spacing
    section: 'space-y-8', // Standard section spacing (32px)
    // Subsection spacing (for nested sections)
    subsection: 'space-y-6', // 24px
    // Tight spacing for related items
    tight: 'space-y-4', // 16px
  },
  
  // Card spacing
  card: {
    // Standard card padding
    padding: 'p-6', // 24px
    // Card content spacing
    content: 'space-y-4', // 16px
    // Card header spacing
    header: 'space-y-2', // 8px
    // Card gap between elements
    gap: 'gap-6', // 24px
  },
  
  // Form spacing
  form: {
    // Individual field spacing (label + input)
    field: 'space-y-2', // 8px
    // Form group spacing (multiple fields)
    group: 'space-y-4', // 16px
    // Form section spacing
    section: 'space-y-6', // 24px
  },
  
  // Grid spacing
  grid: {
    // Tight grid (for compact layouts)
    tight: 'gap-4', // 16px
    // Normal grid (default)
    normal: 'gap-6', // 24px
    // Loose grid (for spacious layouts)
    loose: 'gap-8', // 32px
  },
  
  // Component spacing
  component: {
    // Button groups
    buttonGroup: 'gap-2', // 8px
    // Icon + text spacing
    iconText: 'gap-2', // 8px
    // Icon + text (larger)
    iconTextLarge: 'gap-3', // 12px
  },
} as const;

/**
 * Standard page header configuration
 */
export const PAGE_HEADER = {
  // Icon container
  icon: {
    container: 'p-2 bg-primary/10 rounded-lg',
    size: 'h-6 w-6',
  },
  // Title styles
  title: 'text-3xl font-bold text-foreground',
  // Description styles
  description: 'text-muted-foreground text-lg',
  // Header container
  container: 'space-y-2',
  // Header content wrapper
  content: 'flex items-center gap-3',
} as const;

/**
 * Standard card configurations
 */
export const CARD = {
  // Standard card spacing
  spacing: 'space-y-6',
  // Card header spacing
  headerSpacing: 'space-y-2',
  // Card content spacing
  contentSpacing: 'space-y-4',
} as const;

