import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Save, AlertCircle, Calendar } from "lucide-react";
import { SpendingAnalysisDto, SpendingOverviewDto } from '@/lib/api/spendingApi';
import { useSaveSpendingOverview, useSaveSpendingPeriod, useSpendingHistory } from '@/hooks/useSpendingData';
import { useFormatters } from '@/hooks/useFormatters';

// Form validation schema
const spendingFormSchema = z.object({
  monthlySpending: z
    .number()
    .min(0, 'Spending must be positive')
    .max(1000000, 'Spending amount seems too high'),
  emergencyFundCurrent: z
    .number()
    .min(0, 'Emergency fund must be positive')
    .max(10000000, 'Emergency fund amount seems too high'),
  emergencyFundTarget: z
    .number()
    .min(0, 'Target must be positive')
    .max(10000000, 'Target amount seems too high')
    .optional()
});

type SpendingFormData = z.infer<typeof spendingFormSchema>;

interface SpendingInputProps {
  userId?: string; // Deprecated: No longer needed, kept for backward compatibility
  currentData?: SpendingAnalysisDto;
  onSuccess?: () => void;
}

const SpendingInput: React.FC<SpendingInputProps> = ({ 
  userId, 
  currentData, 
  onSuccess 
}) => {
  const { formatCurrency } = useFormatters();
  const saveSpendingMutation = useSaveSpendingOverview();
  const savePeriodMutation = useSaveSpendingPeriod();
  const { data: historyData } = useSpendingHistory({ limit: 12 });

  // Get current month/year
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // State for period selection
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const isCurrentPeriod = selectedYear === currentYear && selectedMonth === currentMonth;

  // Generate year options (current year and 2 years back)
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Check if selected period already has data
  const existingPeriod = historyData?.periods.find(
    p => p.periodYear === selectedYear && p.periodMonth === selectedMonth
  );

  // Initialize form with current data or existing period data
  const form = useForm<SpendingFormData>({
    resolver: zodResolver(spendingFormSchema),
    defaultValues: {
      monthlySpending: currentData?.monthlySpending || 0,
      emergencyFundCurrent: currentData?.emergencyFundStatus?.currentAmount ?? currentData?.emergencyFundCurrent ?? 0,
      emergencyFundTarget: currentData?.emergencyFundStatus?.recommendedEmergencyFund ?? currentData?.emergencyFundStatus?.recommendedTarget ?? undefined
    }
  });

  // Update form when period changes or existing data is found
  useEffect(() => {
    if (existingPeriod) {
      form.setValue('monthlySpending', existingPeriod.monthlySpending);
      form.setValue('emergencyFundCurrent', existingPeriod.emergencyFundCurrent);
      form.setValue('emergencyFundTarget', existingPeriod.emergencyFundTarget);
    } else if (isCurrentPeriod && currentData) {
      form.setValue('monthlySpending', currentData.monthlySpending || 0);
      form.setValue('emergencyFundCurrent', currentData.emergencyFundStatus?.currentAmount ?? currentData.emergencyFundCurrent ?? 0);
      form.setValue('emergencyFundTarget', currentData.emergencyFundStatus?.recommendedEmergencyFund ?? currentData.emergencyFundStatus?.recommendedTarget);
    } else {
      form.setValue('monthlySpending', 0);
      form.setValue('emergencyFundCurrent', 0);
      form.setValue('emergencyFundTarget', undefined);
    }
  }, [selectedYear, selectedMonth, existingPeriod, isCurrentPeriod, currentData, form]);

  const { register, handleSubmit, formState: { errors }, watch } = form;

  // Watch form values for real-time calculations
  const watchedValues = watch();
  const monthlyIncome = currentData?.monthlyIncome || 0;
  const monthlySpending = watchedValues.monthlySpending || 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;

  const onSubmit = async (data: SpendingFormData) => {
    try {
      if (isCurrentPeriod) {
        // Use existing endpoint for current month (backward compatible)
        const spendingData: SpendingOverviewDto = {
          monthlySpending: data.monthlySpending,
          emergencyFundCurrent: data.emergencyFundCurrent,
          emergencyFundTarget: data.emergencyFundTarget
        };
        await saveSpendingMutation.mutateAsync(spendingData);
      } else {
        // Use new period endpoint for past/future months
        await savePeriodMutation.mutateAsync({
          year: selectedYear,
          month: selectedMonth,
          monthlySpending: data.monthlySpending,
          emergencyFundCurrent: data.emergencyFundCurrent,
          emergencyFundTarget: data.emergencyFundTarget
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save spending data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Enter Your Spending Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Period Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Period
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {existingPeriod && (
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  This period already has data. Editing will update it.
                </p>
              )}
              {isCurrentPeriod && (
                <p className="text-xs text-muted-foreground">
                  Current month selected
                </p>
              )}
            </div>

            {/* Monthly Income Display (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                value={formatCurrency(monthlyIncome)}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                This value comes from your assessment
              </p>
            </div>

            {/* Monthly Spending Input */}
            <div className="space-y-2">
              <Label htmlFor="monthlySpending">Monthly Spending *</Label>
              <Input
                id="monthlySpending"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your total monthly expenses"
                {...register('monthlySpending', { valueAsNumber: true })}
                className={errors.monthlySpending ? 'border-red-500' : ''}
              />
              {errors.monthlySpending && (
                <p className="text-sm text-red-500">{errors.monthlySpending.message}</p>
              )}
            </div>

            {/* Emergency Fund Current */}
            <div className="space-y-2">
              <Label htmlFor="emergencyFundCurrent">Current Emergency Fund</Label>
              <Input
                id="emergencyFundCurrent"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your current emergency fund amount"
                {...register('emergencyFundCurrent', { valueAsNumber: true })}
                className={errors.emergencyFundCurrent ? 'border-red-500' : ''}
              />
              {errors.emergencyFundCurrent && (
                <p className="text-sm text-red-500">{errors.emergencyFundCurrent.message}</p>
              )}
            </div>

            {/* Emergency Fund Target */}
            <div className="space-y-2">
              <Label htmlFor="emergencyFundTarget">Emergency Fund Target (Optional)</Label>
              <Input
                id="emergencyFundTarget"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your target emergency fund amount"
                {...register('emergencyFundTarget', { valueAsNumber: true })}
                className={errors.emergencyFundTarget ? 'border-red-500' : ''}
              />
              {errors.emergencyFundTarget && (
                <p className="text-sm text-red-500">{errors.emergencyFundTarget.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended: 3-6 months of expenses ({formatCurrency(monthlySpending * 6)})
              </p>
            </div>

            {/* Real-time Preview */}
            {monthlySpending > 0 && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-medium">Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Savings Rate:</span>
                    <span className={`ml-2 font-medium ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className={`ml-2 font-medium ${(monthlyIncome - monthlySpending) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyIncome - monthlySpending)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={saveSpendingMutation.isPending || savePeriodMutation.isPending}
            >
              {(saveSpendingMutation.isPending || savePeriodMutation.isPending) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {existingPeriod ? 'Update' : 'Save'} Spending Data for {monthNames[selectedMonth - 1]} {selectedYear}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Tips for Accurate Spending Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">What to include in monthly spending:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Housing (rent/mortgage, utilities, insurance)</li>
              <li>Food and groceries</li>
              <li>Transportation (car payments, gas, public transit)</li>
              <li>Healthcare and insurance</li>
              <li>Entertainment and subscriptions</li>
              <li>Debt payments (credit cards, loans)</li>
              <li>Other regular expenses</li>
            </ul>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Don't include one-time expenses or investments. Focus on recurring monthly costs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingInput;
