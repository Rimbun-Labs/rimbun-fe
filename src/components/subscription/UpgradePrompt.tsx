import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Check } from 'lucide-react';

interface UpgradePromptProps {
  showForFreeUsers?: boolean;
  showForPremiumUsers?: boolean;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  showForFreeUsers = true,
  showForPremiumUsers = false 
}) => {
  const { subscription, isLoading, isPremium } = useSubscription();
  const navigate = useNavigate();

  if (isLoading || !subscription) return null;

  // Don't show if user already has highest tier
  if (subscription.tier === 'business') return null;

  // Show for free users
  if (!isPremium && !showForFreeUsers) return null;
  
  // Show for premium users (to upgrade to business)
  if (isPremium && !showForPremiumUsers) return null;

  const handleUpgrade = () => {
    // Subscription tab disabled for testbed launch - navigate to profile instead
    navigate('/profile');
  };

  const getUpgradeContent = () => {
    if (isPremium) {
      // Show business tier upgrade
      return {
        title: 'Upgrade to Business',
        description: 'Get unlimited access and priority support',
        benefits: [
          'Unlimited AI requests',
          'Advanced analytics',
          'Priority support',
          'Dedicated account manager',
        ],
      };
    } else {
      // Show premium tier upgrade
      return {
        title: 'Upgrade to Premium',
        description: 'Unlock powerful features for smarter investing',
        benefits: [
          'Enhanced AI recommendations',
          'Advanced analytics',
          'Priority support',
          'Remove ads',
        ],
      };
    }
  };

  const content = getUpgradeContent();

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isPremium ? (
                <Crown className="h-5 w-5 text-purple-500" />
              ) : (
                <Zap className="h-5 w-5 text-yellow-500" />
              )}
              <h3 className="font-semibold">{content.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
            <ul className="space-y-2 mb-4">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button onClick={handleUpgrade} className="w-full sm:w-auto">
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

