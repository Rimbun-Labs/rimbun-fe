export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  BUSINESS = 'business'
}

export interface SubscriptionLimits {
  aiRequestsPer15min: number;
  aiRequestsPerDay: number;
  standardRequestsPer15min: number;
  publicRequestsPer15min: number;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  isActive: boolean;
  features: string[];
  limits: SubscriptionLimits;
  expiresAt?: Date;
}

