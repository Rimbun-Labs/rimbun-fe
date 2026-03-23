import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useFundCatalog, useFundDetail } from '@/hooks/useFunds';
import {
  useAddPosition,
  useUpdatePosition,
} from '@/hooks/useInvestmentProfile';
import type { ExistingPositionDto } from '@/lib/api/types/investmentProfile';
import type { ShareClassListItem } from '@/lib/api/types/funds';

interface AddPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPosition?: ExistingPositionDto | null;
}

export function AddPositionDialog({
  open,
  onOpenChange,
  editPosition,
}: AddPositionDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [selectedShareClassId, setSelectedShareClassId] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [units, setUnits] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [startDate, setStartDate] = useState('');

  const { data: fundsData } = useFundCatalog(
    open && !editPosition ? { search: searchQuery || undefined, limit: 30 } : undefined
  );
  const { data: fundDetail } = useFundDetail(
    open && !editPosition && selectedFundId ? selectedFundId : null
  );

  const addMutation = useAddPosition();
  const updateMutation = useUpdatePosition(editPosition?.shareClassId ?? '');

  const funds = fundsData?.funds ?? [];
  const shareClasses: ShareClassListItem[] = fundDetail?.shareClasses ?? [];

  useEffect(() => {
    if (editPosition) {
      setCurrentValue(editPosition.currentValue?.toString() ?? '');
      setUnits(editPosition.units?.toString() ?? '');
      setMonthlyContribution(editPosition.monthlyContribution?.toString() ?? '');
      setStartDate(editPosition.startDate?.slice(0, 10) ?? '');
    } else if (!open) {
      setSearchQuery('');
      setSelectedFundId(null);
      setSelectedShareClassId('');
      setCurrentValue('');
      setUnits('');
      setMonthlyContribution('');
      setStartDate('');
    }
  }, [editPosition, open]);

  const handleSubmit = () => {
    if (editPosition) {
      updateMutation.mutate(
        {
          ...(currentValue !== '' && { currentValue: parseFloat(currentValue) }),
          ...(units !== '' && { units: parseFloat(units) }),
          ...(monthlyContribution !== '' && { monthlyContribution: parseFloat(monthlyContribution) }),
          ...(startDate !== '' && { startDate }),
        },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      if (!selectedShareClassId) return;
      addMutation.mutate(
        {
          shareClassId: selectedShareClassId,
          ...(currentValue !== '' && { currentValue: parseFloat(currentValue) }),
          ...(units !== '' && { units: parseFloat(units) }),
          ...(monthlyContribution !== '' && { monthlyContribution: parseFloat(monthlyContribution) }),
          ...(startDate !== '' && { startDate }),
        },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const handleClose = (next: boolean) => {
    if (!next) {
      setSearchQuery('');
      setSelectedFundId(null);
      setSelectedShareClassId('');
      setCurrentValue('');
      setUnits('');
      setMonthlyContribution('');
      setStartDate('');
    }
    onOpenChange(next);
  };

  const canSubmit = editPosition ? true : !!selectedShareClassId;
  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPosition ? 'Edit position' : 'Add position'}</DialogTitle>
          <DialogDescription>
            {editPosition
              ? 'Update your position details'
              : 'Select a fund and share class, then add it to your profile'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!editPosition && (
            <>
              <div className="space-y-2">
                <Label>Search funds</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search funds..."
                    className="pl-10"
                  />
                </div>
              </div>
              {funds.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <Label>Select fund</Label>
                  <div className="space-y-2">
                    {funds.map((f) => (
                      <button
                        key={f.fundId}
                        type="button"
                        onClick={() => {
                          setSelectedFundId(f.fundId);
                          setSelectedShareClassId('');
                        }}
                        className={`w-full text-left p-3 rounded-md border transition-colors ${
                          selectedFundId === f.fundId
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium">{f.name}</div>
                        <div className="text-sm text-muted-foreground">{f.fundHouse} · {f.assetClass}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedFundId && shareClasses.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <Label>Select share class</Label>
                  <div className="space-y-2">
                    {shareClasses.map((sc) => (
                      <button
                        key={sc.shareClassId}
                        type="button"
                        onClick={() => setSelectedShareClassId(sc.shareClassId)}
                        className={`w-full text-left p-3 rounded-md border transition-colors ${
                          selectedShareClassId === sc.shareClassId
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium">{sc.className}</div>
                        <div className="text-sm text-muted-foreground">{sc.currency} · {sc.isActive ? 'Active' : 'Inactive'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {(selectedShareClassId || editPosition) && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current value (optional)</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units (optional)</Label>
                  <Input
                    id="units"
                    type="number"
                    min="0"
                    step="any"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly contribution (optional)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g. 200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date (optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
              {editPosition ? 'Update' : 'Add'} position
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
