import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getSubscription } from '@/lib/api/subscriptionApi';
import { SubscriptionData, SubscriptionTier } from '@/lib/api/types/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  
  // Convenience helpers
  isPremium: boolean;
  isBusiness: boolean;
  canAccessFeature: (feature: string) => boolean;
  hasReachedLimit: (limitType: 'ai' | 'standard' | 'public', timeframe: '15min' | 'day') => boolean;
  isExpired: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRegistrationComplete } = useAuth();

  const fetchSubscription = async () => {
    if (!user || !userRegistrationComplete) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getSubscription();
      
      // Parse expiresAt if it's a string
      if (data.expiresAt && typeof data.expiresAt === 'string') {
        data.expiresAt = new Date(data.expiresAt);
      }
      
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      // Set default free tier on error
      setSubscription({
        tier: SubscriptionTier.FREE,
        isActive: false,
        features: [],
        limits: {
          aiRequestsPer15min: 2,
          aiRequestsPerDay: 10,
          standardRequestsPer15min: 10,
          publicRequestsPer15min: 20,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    
    // Poll every 5 minutes to refresh subscription status
    const interval = setInterval(fetchSubscription, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, userRegistrationComplete]);

  const isPremium = subscription?.tier === SubscriptionTier.PREMIUM || subscription?.tier === SubscriptionTier.BUSINESS;
  const isBusiness = subscription?.tier === SubscriptionTier.BUSINESS;

  const canAccessFeature = (feature: string): boolean => {
    if (!subscription) return false;
    return subscription.features.includes(feature);
  };

  const hasReachedLimit = (
    limitType: 'ai' | 'standard' | 'public',
    timeframe: '15min' | 'day'
  ): boolean => {
    // This would check against actual usage - placeholder for now
    // TODO: Track actual usage in context state
    return false;
  };

  const isExpired = subscription?.expiresAt 
    ? new Date(subscription.expiresAt) < new Date()
    : false;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch: fetchSubscription,
        isPremium,
        isBusiness,
        canAccessFeature,
        hasReachedLimit,
        isExpired,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

