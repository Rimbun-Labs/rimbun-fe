import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface ProtectedFeatureProps {
  feature: string;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
  promptTitle?: string;
  promptDescription?: string;
}

export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  feature,
  children,
  showUpgradePrompt = true,
  promptTitle = 'Feature Locked',
  promptDescription = 'Upgrade to access this feature',
}) => {
  const { canAccessFeature, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const handleUpgrade = () => {
    // Subscription tab disabled for testbed launch - navigate to profile instead
    navigate('/profile');
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">{promptTitle}</h3>
        <p className="text-sm text-muted-foreground mb-6">{promptDescription}</p>
        <Button onClick={handleUpgrade} variant="default">
          Upgrade to Unlock
        </Button>
      </CardContent>
    </Card>
  );
};

