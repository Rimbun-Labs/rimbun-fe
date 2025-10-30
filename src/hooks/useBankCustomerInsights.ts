import { useState, useEffect } from 'react';
import { getCustomerInsights } from '@/lib/api/bankInsightsApi';
import { useAuth } from '@/contexts/AuthContext';
import type { BankCustomerInsights } from '@/lib/api/types/bankInsights';

/**
 * Hook to fetch bank customer insights data
 */
export const useBankCustomerInsights = () => {
  const { user, userRegistrationComplete } = useAuth();
  const [data, setData] = useState<BankCustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = async () => {
    // Don't fetch if user is not authenticated
    if (!user || !userRegistrationComplete) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const insights = await getCustomerInsights();
      setData(insights);
    } catch (err: any) {
      const error = err instanceof Error 
        ? err 
        : new Error(err?.response?.data?.error?.details || 'Failed to fetch customer insights');
      
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user, userRegistrationComplete]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchInsights 
  };
};

