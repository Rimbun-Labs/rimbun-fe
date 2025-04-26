
import React from 'react';
import { cn } from "@/lib/utils";

interface CategoryHeaderProps {
  category: {
    name: string;
    description: string;
  };
  questionCount: number;
  currentQuestion: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  questionCount,
  currentQuestion
}) => {
  const progress = (currentQuestion / questionCount) * 100;
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <div>
          <h2 className="text-xl font-bold text-primary">{category.name}</h2>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
        <div className="text-sm font-medium">
          Question {currentQuestion} of {questionCount} in this category
        </div>
      </div>
      
      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default CategoryHeader;
