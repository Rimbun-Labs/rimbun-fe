import { useState, useEffect } from 'react';
import { checkBankPermission } from '@/lib/api/bankInsightsApi';
import { useAuth } from '@/contexts/AuthContext';
import type { BankPermissionResponse } from '@/lib/api/types/bankInsights';

interface UseBankPermissionResult extends BankPermissionResponse {
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to check if user has permission to access bank analytics
 * Uses the lightweight /bank/permissions/check endpoint
 */
export const useBankPermission = (): UseBankPermissionResult => {
  const { user, userRegistrationComplete } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermission = async () => {
    // Don't check if user is not authenticated or registration not complete
    if (!user || !userRegistrationComplete) {
      setHasPermission(false);
      setRole('');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await checkBankPermission();
      
      // Validate result before using it
      if (result && typeof result.hasPermission === 'boolean') {
        console.log('🔍 useBankPermission hook result:', { hasPermission: result.hasPermission, role: result.role });
        setHasPermission(result.hasPermission);
        setRole(result.role || '');
      } else {
        console.error('❌ Invalid permission result:', result);
        setHasPermission(false);
        setRole('');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check bank permissions');
      console.error('❌ useBankPermission error:', error);
      setError(error);
      setHasPermission(false);
      setRole('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission();
  }, [user, userRegistrationComplete]);

  return {
    hasPermission,
    role,
    isLoading,
    error,
    refetch: fetchPermission,
  };
};

