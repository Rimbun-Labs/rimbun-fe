import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="p-4 bg-muted/50 rounded-full mx-auto w-fit">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            
            {onAction && (
              <Button 
                onClick={onAction}
                variant="outline"
                className="mt-4"
              >
                {actionText}
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};
