import { useState } from 'react';
import { MyPolicyCard } from './MyPolicyCard';
import { AddPolicyDialog } from './AddPolicyDialog';
import { Button } from '@/components/ui/button';
import { useInsuranceProfile, useDeleteInsuranceProduct } from '@/hooks/useInsuranceProfile';
import { Plus, Wallet } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import type { ExistingInsuranceProductDto } from '@/lib/api/types/insuranceProfile';

export function MyPoliciesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState<ExistingInsuranceProductDto | null>(null);

  const { data: profile, isLoading, error } = useInsuranceProfile();
  const deleteMutation = useDeleteInsuranceProduct();

  const policies = profile?.existingProducts ?? [];

  const handleEdit = (policy: ExistingInsuranceProductDto) => {
    setEditPolicy(policy);
    setDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Remove this policy from your profile?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditPolicy(null);
  };

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn&apos;t load your policies. Check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Wallet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">My policies</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your existing insurance policies
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add policy
        </Button>
      </div>

      {policies.length === 0 ? (
        <EnhancedEmptyState
          icon={Wallet}
          title="No policies yet"
          description="Add your existing insurance policies to keep track of them."
          actionText="Add your first policy"
          onAction={() => setDialogOpen(true)}
          variant="default"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
          {policies.map((policy) => (
            <MyPolicyCard
              key={policy.productId}
              policy={policy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddPolicyDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editPolicy={editPolicy}
      />
    </div>
  );
}
