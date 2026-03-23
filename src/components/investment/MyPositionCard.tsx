import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, TrendingUp } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import type { ExistingPositionDto } from '@/lib/api/types/investmentProfile';

interface MyPositionCardProps {
  position: ExistingPositionDto;
  onEdit: (position: ExistingPositionDto) => void;
  onDelete: (shareClassId: string) => void;
}

export function MyPositionCard({ position, onEdit, onDelete }: MyPositionCardProps) {
  const { formatCurrency } = useFormatters();
  const p = position.product;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
              {p?.fundName ?? 'Fund'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {p?.className ?? '—'} · {p?.fundHouse ?? '—'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {position.currentValue != null && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Current value</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(position.currentValue)}</p>
          </div>
        )}
        {position.units != null && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Units</p>
            <p className="text-sm font-semibold text-foreground">{position.units}</p>
          </div>
        )}
        {position.monthlyContribution != null && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Monthly contribution</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(position.monthlyContribution)}/mo
            </p>
          </div>
        )}
        {position.startDate && (
          <div className="text-xs text-muted-foreground">
            Start: {new Date(position.startDate).toLocaleDateString()}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(position)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(position.shareClassId)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
