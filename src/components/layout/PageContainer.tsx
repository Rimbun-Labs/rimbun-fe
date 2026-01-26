import React from 'react';
import { SPACING } from '@/lib/constants/spacing';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'default' | 'tight' | 'loose';
}

/**
 * Standardized page container component
 * 
 * Provides consistent padding and spacing across all pages
 * 
 * Usage:
 * <PageContainer>
 *   <PageHeader ... />
 *   <Content />
 * </PageContainer>
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  spacing = 'default',
}) => {
  const spacingClass = spacing === 'tight' 
    ? SPACING.page.tight 
    : spacing === 'loose'
    ? SPACING.page.section
    : SPACING.page.section;

  return (
    <div className={cn(SPACING.page.container, className)}>
      <div className={cn('w-full', spacingClass, className)}>
        {children}
      </div>
    </div>
  );
};

