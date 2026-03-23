import { useState } from 'react';
import { MyPositionCard } from './MyPositionCard';
import { AddPositionDialog } from './AddPositionDialog';
import { Button } from '@/components/ui/button';
import { useInvestmentProfile, useDeletePosition } from '@/hooks/useInvestmentProfile';
import { Plus, Wallet } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import type { ExistingPositionDto } from '@/lib/api/types/investmentProfile';

export function MyPositionsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPosition, setEditPosition] = useState<ExistingPositionDto | null>(null);

  const { data: profile, isLoading, error } = useInvestmentProfile();
  const deleteMutation = useDeletePosition();

  const positions = profile?.existingPositions ?? [];

  const handleEdit = (position: ExistingPositionDto) => {
    setEditPosition(position);
    setDialogOpen(true);
  };

  const handleDelete = (shareClassId: string) => {
    if (confirm('Remove this position from your profile?')) {
      deleteMutation.mutate(shareClassId);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditPosition(null);
  };

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn&apos;t load your positions. Check your connection and try again.
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
            <h2 className="text-lg font-semibold text-foreground">My positions</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your fund positions
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add position
        </Button>
      </div>

      {positions.length === 0 ? (
        <EnhancedEmptyState
          icon={Wallet}
          title="No positions yet"
          description="Add your existing fund positions to keep track of them."
          actionText="Add your first position"
          onAction={() => setDialogOpen(true)}
          variant="default"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
          {positions.map((position) => (
            <MyPositionCard
              key={position.shareClassId}
              position={position}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddPositionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editPosition={editPosition}
      />
    </div>
  );
}
