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
  const { session, hasCompletedAssessment } = useSession();
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

    // Check if user has a complete assessment (not just existing)
    const checkCompleteAssessment = async () => {
      try {
        const status = await hasCompletedAssessment();
        // Only redirect if user has complete assessment AND is on the dashboard or root page
        if (status.hasAssessment && status.sessionId && !status.isIncomplete && (location.pathname === '/dashboard' || location.pathname === '/')) {
          console.log('✅ User has complete assessment and is on dashboard/root, redirecting to dashboard');
          navigate(`/dashboard/${status.sessionId}`);
        }
        // If incomplete assessment, let them stay on current page
        else if (status.isIncomplete) {
          console.log('⚠️ User has incomplete assessment, allowing them to complete it');
          // Don't redirect - let them stay on current page
        }
        // If no existing assessment, let them stay on current page
        else if (!status.hasAssessment) {
          console.log('ℹ️ No existing assessment found, user can take assessment');
          // Don't redirect - let them stay on current page
        }
      } catch (error) {
        console.error('Failed to check assessment completion status:', error);
      }
    };

    checkCompleteAssessment();
  }, [navigate, userRegistrationComplete]);

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