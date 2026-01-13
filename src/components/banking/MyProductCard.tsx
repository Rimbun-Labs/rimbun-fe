import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CreditCard, Landmark, PiggyBank, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import type { UserProduct } from '@/lib/api/types/banking';

interface MyProductCardProps {
  product: UserProduct;
  onEdit: (product: UserProduct) => void;
  onDelete: (productId: string) => void;
}

const typeIcons: Record<UserProduct['productType'], React.ElementType> = {
  savings: PiggyBank,
  credit_card: CreditCard,
  checking: Wallet,
  cd: Landmark,
  money_market: TrendingUp,
  loan: DollarSign,
  debit_card: CreditCard,
  virtual_prepaid_card: CreditCard,
};

const typeLabels: Record<UserProduct['productType'], string> = {
  savings: 'Savings',
  credit_card: 'Credit Card',
  checking: 'Checking',
  cd: 'Fixed Deposit',
  money_market: 'Money Market',
  loan: 'Loan',
  debit_card: 'Debit Card',
  virtual_prepaid_card: 'Virtual Prepaid Card',
};

export const MyProductCard: React.FC<MyProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { formatCurrency } = useFormatters();
  const Icon = typeIcons[product.productType] || PiggyBank;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {typeLabels[product.productType]}
              </Badge>
            </div>
            <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
              {product.productName}
            </h3>
            <p className="text-sm text-muted-foreground">{product.bankName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Display fields based on product type */}
        {(product.productType === 'savings' || product.productType === 'cd') && product.currentBalance !== undefined && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">
              {product.productType === 'cd' ? 'Principal Amount' : 'Current Balance'}
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(product.currentBalance)}
            </p>
          </div>
        )}

        {product.productType === 'credit_card' && (
          <>
            {product.outstandingBalance !== undefined && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Outstanding Balance</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(product.outstandingBalance)}
                </p>
              </div>
            )}
            {product.creditLimit !== undefined && (
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Credit Limit</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(product.creditLimit)}
                </p>
              </div>
            )}
          </>
        )}

        {product.productType === 'loan' && (
          <>
            {product.loanAmount !== undefined && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(product.loanAmount)}
                </p>
              </div>
            )}
            {product.outstandingBalance !== undefined && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Outstanding Balance</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(product.outstandingBalance)}
                </p>
              </div>
            )}
            {product.monthlyPayment !== undefined && (
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(product.monthlyPayment)}
                </p>
              </div>
            )}
          </>
        )}

        {/* Debit Card - No balance fields, but show opened date if available */}
        {(product.productType === 'debit_card' || product.productType === 'virtual_prepaid_card') && product.openedDate && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Opened Date</p>
            <p className="text-sm font-semibold text-foreground">
              {new Date(product.openedDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Show opened date for other product types if available */}
        {product.productType !== 'debit_card' && product.productType !== 'virtual_prepaid_card' && product.openedDate && (
          <div className="text-xs text-muted-foreground">
            Opened: {new Date(product.openedDate).toLocaleDateString()}
          </div>
        )}
        
        {product.notes && (
          <div className="text-xs text-muted-foreground line-clamp-2">
            {product.notes}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

