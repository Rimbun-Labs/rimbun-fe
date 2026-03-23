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
import { useInsuranceProducts } from '@/hooks/useInsuranceProducts';
import {
  useAddInsuranceProduct,
  useUpdateInsuranceProduct,
} from '@/hooks/useInsuranceProfile';
import type { ExistingInsuranceProductDto } from '@/lib/api/types/insuranceProfile';

interface AddPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPolicy?: ExistingInsuranceProductDto | null;
}

export function AddPolicyDialog({
  open,
  onOpenChange,
  editPolicy,
}: AddPolicyDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [premiumMonthly, setPremiumMonthly] = useState('');
  const [cashValue, setCashValue] = useState('');
  const [startDate, setStartDate] = useState('');

  const { data: catalogData } = useInsuranceProducts({
    search: searchQuery || undefined,
    limit: 50,
  });
  const addMutation = useAddInsuranceProduct();
  const updateMutation = useUpdateInsuranceProduct(editPolicy?.productId ?? '');

  const products = catalogData?.products ?? [];

  useEffect(() => {
    if (editPolicy) {
      setSelectedProductId(editPolicy.productId);
      setSumAssured(editPolicy.sumAssured?.toString() ?? '');
      setPremiumMonthly(editPolicy.premiumMonthly?.toString() ?? '');
      setCashValue(editPolicy.cashValue?.toString() ?? '');
      setStartDate(editPolicy.startDate?.slice(0, 10) ?? '');
    } else if (!open) {
      setSearchQuery('');
      setSelectedProductId('');
      setSumAssured('');
      setPremiumMonthly('');
      setCashValue('');
      setStartDate('');
    }
  }, [editPolicy, open]);

  const handleSubmit = () => {
    if (editPolicy) {
      updateMutation.mutate(
        {
          ...(sumAssured !== '' && { sumAssured: parseFloat(sumAssured) }),
          ...(premiumMonthly !== '' && { premiumMonthly: parseFloat(premiumMonthly) }),
          ...(cashValue !== '' && { cashValue: parseFloat(cashValue) }),
          ...(startDate !== '' && { startDate }),
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      if (!selectedProductId) return;
      addMutation.mutate(
        {
          productId: selectedProductId,
          ...(sumAssured !== '' && { sumAssured: parseFloat(sumAssured) }),
          ...(premiumMonthly !== '' && { premiumMonthly: parseFloat(premiumMonthly) }),
          ...(cashValue !== '' && { cashValue: parseFloat(cashValue) }),
          ...(startDate !== '' && { startDate }),
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    }
  };

  const handleClose = (next: boolean) => {
    if (!next) {
      setSearchQuery('');
      setSelectedProductId('');
      setSumAssured('');
      setPremiumMonthly('');
      setCashValue('');
      setStartDate('');
    }
    onOpenChange(next);
  };

  const canSubmit = editPolicy ? true : !!selectedProductId;
  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPolicy ? 'Edit policy' : 'Add policy'}</DialogTitle>
          <DialogDescription>
            {editPolicy
              ? 'Update your policy details'
              : 'Search for an insurance product and add it to your profile'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!editPolicy && (
            <>
              <div className="space-y-2">
                <Label>Search products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search insurance products..."
                    className="pl-10"
                  />
                </div>
              </div>
              {products.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <Label>Select product</Label>
                  <div className="space-y-2">
                    {products.map((p) => (
                      <button
                        key={p.productId}
                        type="button"
                        onClick={() => setSelectedProductId(p.productId)}
                        className={`w-full text-left p-3 rounded-md border transition-colors ${
                          selectedProductId === p.productId
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium">{p.productName}</div>
                        <div className="text-sm text-muted-foreground">{p.insurerName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {(selectedProductId || editPolicy) && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sumAssured">Sum assured (optional)</Label>
                  <Input
                    id="sumAssured"
                    type="number"
                    min="0"
                    step="1"
                    value={sumAssured}
                    onChange={(e) => setSumAssured(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premiumMonthly">Monthly premium (optional)</Label>
                  <Input
                    id="premiumMonthly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={premiumMonthly}
                    onChange={(e) => setPremiumMonthly(e.target.value)}
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashValue">Cash value (optional)</Label>
                <Input
                  id="cashValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashValue}
                  onChange={(e) => setCashValue(e.target.value)}
                  placeholder="e.g. 10000"
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
              {editPolicy ? 'Update' : 'Add'} policy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
