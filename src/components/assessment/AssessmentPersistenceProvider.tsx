import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAssessmentPersistence } from '@/hooks/useUserAssessmentPersistence';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface AssessmentPersistenceProviderProps {
  children: React.ReactNode;
}

export const AssessmentPersistenceProvider: React.FC<AssessmentPersistenceProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRegistrationComplete } = useAuth();
  const { session } = useSession();
  const { 
    hasCheckedPersistence, 
    hasExistingAssessment, 
    isLoading, 
    error 
  } = useUserAssessmentPersistence();

  // Effect to handle navigation based on assessment persistence
  useEffect(() => {
    // Only proceed if user is authenticated and registration is complete
    if (!user || !userRegistrationComplete) {
      return;
    }

    // Wait for persistence check to complete
    if (!hasCheckedPersistence || isLoading) {
      return;
    }

    // Only redirect if user has existing assessment AND is on the home page
    if (hasExistingAssessment && session?.id && location.pathname === '/home') {
      console.log('✅ User has existing assessment and is on home page, redirecting to dashboard');
      navigate(`/dashboard/${session.id}`);
    }
    // If no existing assessment, let them stay on current page
    else if (!hasExistingAssessment) {
      console.log('ℹ️ No existing assessment found, user can take assessment');
      // Don't redirect - let them stay on current page
    }
  }, [user, userRegistrationComplete, hasCheckedPersistence, hasExistingAssessment, session, navigate, isLoading, location.pathname]);

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