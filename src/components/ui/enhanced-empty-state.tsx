import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className={cn('text-center py-6', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-muted/50 rounded-full">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
          </div>
          {onAction && actionText && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onAction}
              className="mt-2"
            >
              {actionText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted/50 rounded-full">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          {onAction && actionText && (
            <Button 
              onClick={onAction}
              className="mt-2"
            >
              {actionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

