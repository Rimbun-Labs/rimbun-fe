import React from 'react';
import { useUserAssessmentPersistence } from '@/hooks/useUserAssessmentPersistence';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface AssessmentPersistenceProviderProps {
  children: React.ReactNode;
}

export const AssessmentPersistenceProvider: React.FC<AssessmentPersistenceProviderProps> = ({ children }) => {
  const { user, userRegistrationComplete } = useAuth();
  const { 
    hasCheckedPersistence, 
    isLoading, 
    error 
  } = useUserAssessmentPersistence();

  // Show loading while checking persistence
  if (user && userRegistrationComplete && !hasCheckedPersistence && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState 
          variant="expanded"
          showTitle
          showSubtitle
          lines={3}
        />
      </div>
    );
  }

  // Show error if persistence check failed
  if (error) {
    console.error('Assessment persistence check failed:', error);
    // Continue with app - don't block user experience
  }

  return <>{children}</>;
};