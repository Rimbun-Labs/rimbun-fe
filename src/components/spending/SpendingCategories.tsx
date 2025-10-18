import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Plus, Edit, Trash2 } from "lucide-react";
import { SpendingCategoryDto } from '@/lib/api/spendingApi';
import { useAddSpendingCategory, useUpdateSpendingCategory, useDeleteSpendingCategory } from '@/hooks/useSpendingData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const categoryFormSchema = z.object({
  categoryName: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  monthlyAmount: z.number().min(0, 'Amount must be positive').max(1000000, 'Amount seems too high')
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface SpendingCategoriesProps {
  userId: string;
  categories: SpendingCategoryDto[];
  loading: boolean;
}

const SpendingCategories: React.FC<SpendingCategoriesProps> = ({ 
  userId, 
  categories, 
  loading 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SpendingCategoryDto | null>(null);

  const addCategoryMutation = useAddSpendingCategory(userId);
  const updateCategoryMutation = useUpdateSpendingCategory(userId);
  const deleteCategoryMutation = useDeleteSpendingCategory(userId);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
      monthlyAmount: 0
    }
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = form;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id!,
          userId,
          category: {
            categoryName: data.categoryName,
            monthlyAmount: data.monthlyAmount,
            isCustom: true
          }
        });
        setEditingCategory(null);
      } else {
        // Add new category
        await addCategoryMutation.mutateAsync({
          categoryName: data.categoryName,
          monthlyAmount: data.monthlyAmount,
          isCustom: true
        });
      }
      reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: SpendingCategoryDto) => {
    setEditingCategory(category);
    setValue('categoryName', category.categoryName);
    setValue('monthlyAmount', category.monthlyAmount);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryMutation.mutateAsync({ id: categoryId, userId });
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Spending Categories
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? 'Update the spending category details below.'
                    : 'Add a new spending category to track your expenses.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Groceries, Entertainment"
                    {...register('categoryName')}
                    className={errors.categoryName ? 'border-red-500' : ''}
                  />
                  {errors.categoryName && (
                    <p className="text-sm text-red-500">{errors.categoryName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">Monthly Amount ($)</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('monthlyAmount', { valueAsNumber: true })}
                    className={errors.monthlyAmount ? 'border-red-500' : ''}
                  />
                  {errors.monthlyAmount && (
                    <p className="text-sm text-red-500">{errors.monthlyAmount.message}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addCategoryMutation.isPending || updateCategoryMutation.isPending}
                  >
                    {addCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      editingCategory ? 'Update Category' : 'Add Category'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-2">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No categories added yet</p>
              <p className="text-sm text-muted-foreground">
                Add spending categories to get detailed insights
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={category.id || index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span className="font-medium">{category.categoryName}</span>
                    {category.isCustom && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold">${category.monthlyAmount.toLocaleString()}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id!)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingCategories;
