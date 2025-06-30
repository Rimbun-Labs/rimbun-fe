import React from 'react';
import { Button } from "@/components/ui/button";
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import RecommendationCard from './RecommendationCard';

interface RecommendationsSectionProps {
  recommendations: any[];
  loading: boolean;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations, loading }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-[160px]">
              <LoadingState variant="expanded" lines={2} />
            </div>
          ))
        ) : recommendations.map((rec) => (
          <RecommendationCard 
            key={rec.id} 
            title={rec.title}
            description={rec.description}
            priority={rec.priority as "High" | "Medium" | "Low"}
            category={rec.category}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;
