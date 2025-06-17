import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MetricCategory } from '@/lib/api/types/metrics';
import { getCategoryDisplayName } from '@/lib/constants/displayNames';
import { getCategoryColor } from '@/utils/metrics';

interface MetricCategoryFilterProps {
  categories: MetricCategory[];
  selectedCategories: MetricCategory[];
  onCategorySelect: (category: MetricCategory) => void;
  className?: string;
}

const MetricCategoryFilter: React.FC<MetricCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategorySelect,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 p-1">
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer transition-colors",
              selectedCategories.length === 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-slate-100"
            )}
            onClick={() => onCategorySelect('all')}
          >
            All Categories
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={cn(
                "cursor-pointer transition-colors",
                getCategoryColor(category),
                selectedCategories.includes(category)
                  ? "bg-opacity-20"
                  : "hover:bg-slate-100"
              )}
              onClick={() => onCategorySelect(category)}
            >
              {getCategoryDisplayName(category)}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MetricCategoryFilter; 