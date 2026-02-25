import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Building2 } from 'lucide-react';
import type { GoalWithInsightsDto } from '@/lib/api/types/goals';
import type { FundListItem } from '@/lib/api/types/funds';
import { useFundCatalog } from '@/hooks/useFunds';
import { useUpdateGoal } from '@/hooks/useGoals';

interface AssignFundsToGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: GoalWithInsightsDto | null;
}

export function AssignFundsToGoalDialog({
  open,
  onOpenChange,
  goal,
}: AssignFundsToGoalDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});

  const { data: catalogData, isLoading: fundsLoading } = useFundCatalog({
    limit: 100,
    offset: 0,
  });
  const funds: FundListItem[] = catalogData?.funds ?? [];
  const updateGoal = useUpdateGoal(goal?.id);

  // Sync from goal when dialog opens
  useEffect(() => {
    if (!open || !goal) return;
    const ids = goal.metadata?.selectedFundIds ?? [];
    setSelectedIds(ids);
    const w: Record<string, number> = {};
    const weightList = goal.metadata?.selectedFundWeights;
    if (weightList?.length === ids.length) {
      ids.forEach((id, i) => {
        w[id] = weightList[i];
      });
    }
    setWeights(w);
  }, [open, goal]);

  const toggleFund = (fundId: string) => {
    setSelectedIds((prev) =>
      prev.includes(fundId) ? prev.filter((id) => id !== fundId) : [...prev, fundId]
    );
  };

  const setWeight = (fundId: string, value: number) => {
    setWeights((prev) => ({ ...prev, [fundId]: value }));
  };

  const handleSave = async () => {
    if (!goal) return;
    const raw = selectedIds.map((id) => weights[id]);
    const allEntered = raw.every((v) => v != null && !Number.isNaN(v) && v > 0);
    const sum = raw.reduce((s, v) => s + (Number.isNaN(Number(v)) ? 0 : Number(v)), 0);
    const selectedFundWeights =
      selectedIds.length > 0 && allEntered && sum > 0
        ? selectedIds.map((id) => {
            const v = weights[id];
            return typeof v === 'number' && !Number.isNaN(v) ? v / 100 : 0;
          })
        : undefined;
    const metadata = {
      ...goal.metadata,
      selectedFundIds: selectedIds,
      ...(selectedFundWeights && { selectedFundWeights }),
    };
    await updateGoal.mutateAsync({ metadata });
    onOpenChange(false);
  };

  const selectedCount = selectedIds.length;
  const canSave = goal != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign funds to goal</DialogTitle>
          <DialogDescription>
            {goal
              ? `Choose funds for "${goal.goalName}". Simulation will use real fund performance when you run the strategy.`
              : 'Select a goal to assign funds.'}
          </DialogDescription>
        </DialogHeader>

        {!goal ? (
          <p className="text-sm text-muted-foreground py-4">No goal selected.</p>
        ) : fundsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 min-h-[200px] max-h-[50vh] rounded-md border p-3">
              <div className="space-y-2">
                {funds.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No funds in catalog.</p>
                ) : (
                  funds.map((fund) => (
                    <div
                      key={fund.fundId}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`fund-${fund.fundId}`}
                        checked={selectedIds.includes(fund.fundId)}
                        onCheckedChange={() => toggleFund(fund.fundId)}
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`fund-${fund.fundId}`}
                          className="text-sm font-medium cursor-pointer truncate block"
                        >
                          {fund.name}
                        </label>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span>{fund.fundHouse}</span>
                          <span>·</span>
                          <span>{fund.assetClass}</span>
                        </div>
                      </div>
                      {selectedIds.includes(fund.fundId) && (
                        <div className="flex items-center gap-1 w-20 shrink-0">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={5}
                            placeholder="%"
                            className="h-8 text-xs"
                            value={weights[fund.fundId] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value === '' ? NaN : Number(e.target.value);
                              setWeight(fund.fundId, v);
                            }}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              {selectedCount > 0
                ? `${selectedCount} fund(s) selected. Leave weights empty for equal allocation.`
                : 'Select at least one fund to use real fund performance in simulation.'}
            </p>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || updateGoal.isPending}>
            {updateGoal.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
