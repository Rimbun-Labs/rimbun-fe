import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart as PieChartIcon, Plus, Edit, Trash2, List, BarChart3 } from "lucide-react";
import { SpendingCategoryDto } from '@/lib/api/spendingApi';
import { useAddSpendingCategory, useUpdateSpendingCategory, useDeleteSpendingCategory } from '@/hooks/useSpendingData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';
import { useTheme } from '@/hooks/useTheme';

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
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const { formatCurrency, formatPercentage } = useFormatters();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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

  // Color palette for categories (consistent colors)
  const categoryColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
    '#6366F1', // indigo
  ];

  // Transform categories data for pie chart
  const chartData = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    const total = categories.reduce((sum, cat) => sum + cat.monthlyAmount, 0);
    
    return categories.map((category, index) => ({
      name: category.categoryName,
      value: category.monthlyAmount,
      percentage: total > 0 ? (category.monthlyAmount / total) * 100 : 0,
      color: categoryColors[index % categoryColors.length],
      isCustom: category.isCustom,
    }));
  }, [categories]);

  // Calculate total spending
  const totalSpending = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.monthlyAmount, 0);
  }, [categories]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Spending Categories
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* View Toggle Buttons */}
            {categories.length > 0 && (
              <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg mr-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="h-8 px-3"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Chart
                </Button>
              </div>
            )}
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
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-2">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No categories added yet</p>
              <p className="text-sm text-muted-foreground">
                Add spending categories to get detailed insights
              </p>
            </div>
          ) : viewMode === 'chart' ? (
            <div className="space-y-4">
              {/* Total Spending Summary */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Monthly Spending</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpending)}</p>
              </div>

              {/* Pie Chart */}
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percentage }) => 
                        percentage > 5 ? `${name}: ${percentage.toFixed(0)}%` : ''
                      }
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                              <p className="font-medium text-popover-foreground">
                                {data.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.value)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatPercentage(data.percentage)}
                              </p>
                              {data.isCustom && (
                                <p className="text-xs text-blue-600 mt-1">Custom Category</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      formatter={(value, entry: any) => (
                        <span style={{ color: isDarkMode ? '#e2e8f0' : '#64748b' }}>
                          {value} ({formatPercentage(entry.payload.percentage)})
                        </span>
                      )}
                      payload={chartData.map((item) => ({
                        value: item.name,
                        type: 'circle',
                        color: item.color,
                        payload: item,
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Summary List */}
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Category Breakdown</h4>
                {chartData
                  .sort((a, b) => b.value - a.value)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.isCustom && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatCurrency(item.value)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage(item.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => {
                const percentage = totalSpending > 0 ? (category.monthlyAmount / totalSpending) * 100 : 0;
                return (
                  <div key={category.id || index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                      ></div>
                      <span className="font-medium">{category.categoryName}</span>
                      {category.isCustom && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(category.monthlyAmount)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage(percentage)}
                        </div>
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingCategories;
