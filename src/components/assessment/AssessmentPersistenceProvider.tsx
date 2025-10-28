import React, { ReactNode } from 'react';
import { useUserAssessmentPersistence } from '@/hooks/useUserAssessmentPersistence';

interface AssessmentPersistenceProviderProps {
  children: ReactNode;
}

export const AssessmentPersistenceProvider: React.FC<AssessmentPersistenceProviderProps> = ({ children }) => {
  // This hook handles checking for existing assessment results and restoring session state
  // It now waits for authentication to complete before checking persistence
  useUserAssessmentPersistence();

  return <>{children}</>;
};
