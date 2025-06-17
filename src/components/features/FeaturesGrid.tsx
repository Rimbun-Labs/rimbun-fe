import React from 'react';
import { FeatureCard } from './FeatureCard';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  previewContent: React.ReactNode;
  path: string;
  assessmentRequired?: boolean;
}

const features: Feature[] = [
  {
    id: 'learning-paths',
    title: 'Learning Paths',
    description: 'Personalized learning journeys tailored to your investment goals and experience level.',
    previewContent: (
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-2/3" />
      </div>
    ),
    path: '/learning-path',
    assessmentRequired: true,
  },
  {
    id: 'market-insights',
    title: 'Market Insights',
    description: 'Real-time market analysis and insights to help you make informed investment decisions.',
    previewContent: (
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-2/3" />
        <div className="h-2 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-3/4" />
      </div>
    ),
    path: '/learning',
    assessmentRequired: true,
  },
  {
    id: 'portfolio-tracker',
    title: 'Portfolio Tracker',
    description: 'Track and analyze your investment portfolio performance with detailed metrics and insights.',
    previewContent: (
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-2/3" />
      </div>
    ),
    path: '/dashboard',
    assessmentRequired: true,
  },
  {
    id: 'community',
    title: 'Investment Community',
    description: 'Connect with other investors, share insights, and learn from experienced traders.',
    previewContent: (
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-2/3" />
        <div className="h-2 bg-muted rounded w-1/2" />
      </div>
    ),
    path: '/profile',
    assessmentRequired: false,
  },
];

export const FeaturesGrid: React.FC = () => {
  const { user } = useAuth();
  const { session } = useSession();
  
  // Check if user has completed assessment by looking at the session's isCompleted flag
  const hasCompletedAssessment = Boolean(session?.isCompleted);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          title={feature.title}
          description={feature.description}
          isLocked={feature.assessmentRequired && !hasCompletedAssessment}
          previewContent={feature.previewContent}
          assessmentRequired={feature.assessmentRequired}
          featurePath={hasCompletedAssessment && session?.id ? `${feature.path}/${session.id}` : feature.path}
        />
      ))}
    </div>
  );
}; 