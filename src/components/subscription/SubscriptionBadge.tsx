import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionTier } from '@/lib/api/types/subscription';
import { Crown, Zap } from 'lucide-react';

export const SubscriptionBadge: React.FC = () => {
  const { subscription, isLoading } = useSubscription();

  if (isLoading || !subscription) {
    return null;
  }

  const getBadgeProps = () => {
    switch (subscription.tier) {
      case SubscriptionTier.BUSINESS:
        return {
          className: 'bg-purple-500 text-white',
          text: 'Business',
          icon: <Crown className="h-3 w-3" />,
        };
      case SubscriptionTier.PREMIUM:
        return {
          className: 'bg-yellow-500 text-white',
          text: 'Premium',
          icon: <Zap className="h-3 w-3" />,
        };
      default:
        return {
          className: 'bg-gray-500 text-white',
          text: 'Free',
        };
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <Badge className={`flex items-center gap-1 ${badgeProps.className}`}>
      {badgeProps.icon}
      <span className="text-xs font-medium">{badgeProps.text}</span>
    </Badge>
  );
};

