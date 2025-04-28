
import React from 'react';
import ScoreCard from './ScoreCard';

interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
  confidence: number;
  description?: string;
}

interface CategoryScoresProps {
  categoryScores: Record<string, CategoryScore>;
}

const CategoryScores: React.FC<CategoryScoresProps> = ({ categoryScores }) => {
  const categories = Object.entries(categoryScores);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Category Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([category, scoreData]) => (
          <ScoreCard
            key={category}
            title={category}
            score={scoreData.score}
            maxScore={scoreData.maxScore}
            confidence={scoreData.confidence}
            description={scoreData.description || `Score assessment for ${category} category.`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryScores;
