import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import type { ExistingInsuranceProductDto } from '@/lib/api/types/insuranceProfile';

interface MyPolicyCardProps {
  policy: ExistingInsuranceProductDto;
  onEdit: (policy: ExistingInsuranceProductDto) => void;
  onDelete: (productId: string) => void;
}

export function MyPolicyCard({ policy, onEdit, onDelete }: MyPolicyCardProps) {
  const { formatCurrency } = useFormatters();
  const p = policy.product;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
              {p?.productName ?? 'Insurance'}
            </h3>
            <p className="text-sm text-muted-foreground">{p?.insurerName ?? '—'}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {policy.sumAssured != null && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Sum assured</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(policy.sumAssured)}</p>
          </div>
        )}
        {policy.premiumMonthly != null && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Monthly premium</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(policy.premiumMonthly)}/mo
            </p>
          </div>
        )}
        {policy.cashValue != null && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Cash value</p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(policy.cashValue)}</p>
          </div>
        )}
        {policy.startDate && (
          <div className="text-xs text-muted-foreground">
            Start: {new Date(policy.startDate).toLocaleDateString()}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(policy)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(policy.productId)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
