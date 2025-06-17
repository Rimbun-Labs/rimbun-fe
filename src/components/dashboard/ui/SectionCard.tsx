import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className
}) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      {children}
    </Card>
  );
}; 