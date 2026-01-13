import { useState } from 'react';
import { MyProductCard } from './MyProductCard';
import { AddProductDialog } from './AddProductDialog';
import { Button } from '@/components/ui/button';
import { useBankingProfile, useDeleteProduct } from '@/hooks/useBankingProducts';
import { Plus, Wallet } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import type { UserProduct } from '@/lib/api/types/banking';

interface MyProductsTabProps {
  firebaseId?: string;
}

export const MyProductsTab = ({ firebaseId }: MyProductsTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<UserProduct | null>(null);
  
  const { data: products, isLoading, error } = useBankingProfile();
  const deleteProductMutation = useDeleteProduct();

  const handleEdit = (product: UserProduct) => {
    setEditProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditProduct(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We couldn't load your banking products. Check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Wallet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">My Products</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your existing banking products
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <EnhancedEmptyState
          icon={Wallet}
          title="No Products Yet"
          description="Add your existing banking products to keep track of them."
          actionText="Add Your First Product"
          onAction={() => setDialogOpen(true)}
          variant="default"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <MyProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddProductDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editProduct={editProduct}
      />
    </div>
  );
};

