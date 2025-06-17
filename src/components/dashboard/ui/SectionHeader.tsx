import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isExpanded,
  onToggle,
  className
}) => {
  return (
    <CardHeader className={`flex flex-row items-center justify-between ${className}`}>
      <CardTitle className="text-xl">{title}</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        {isExpanded ? 'Show Less' : 'Learn More'}
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </CardHeader>
  );
}; 