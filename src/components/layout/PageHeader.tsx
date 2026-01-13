import React from 'react';
import { LucideIcon } from 'lucide-react';
import { PAGE_HEADER } from '@/lib/constants/spacing';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Standardized page header component
 * 
 * Usage:
 * <PageHeader
 *   icon={Building2}
 *   title="Banking Products"
 *   description="Discover personalized banking products"
 *   action={<Button>Action</Button>}
 * />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn(PAGE_HEADER.container, className)}>
      <div className={cn(
        PAGE_HEADER.content,
        action && 'justify-between'
      )}>
        <div className={PAGE_HEADER.content}>
          <div className={PAGE_HEADER.icon.container}>
            <Icon className={cn(PAGE_HEADER.icon.size, 'text-primary')} />
          </div>
          <div>
            <h1 className={PAGE_HEADER.title}>{title}</h1>
            <p className={PAGE_HEADER.description}>{description}</p>
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

