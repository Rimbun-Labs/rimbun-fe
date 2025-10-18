import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Save, AlertCircle } from "lucide-react";
import { SpendingAnalysisDto, SpendingOverviewDto } from '@/lib/api/spendingApi';
import { useSaveSpendingOverview } from '@/hooks/useSpendingData';
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
  userId: string;
  currentData?: SpendingAnalysisDto;
  onSuccess?: () => void;
}

const SpendingInput: React.FC<SpendingInputProps> = ({ 
  userId, 
  currentData, 
  onSuccess 
}) => {
  const { formatCurrency } = useFormatters();
  const saveSpendingMutation = useSaveSpendingOverview(userId);

  // Initialize form with current data or defaults
  const form = useForm<SpendingFormData>({
    resolver: zodResolver(spendingFormSchema),
    defaultValues: {
      monthlySpending: currentData?.monthlySpending || 0,
      emergencyFundCurrent: currentData?.emergencyFundCurrent || 0,
      emergencyFundTarget: currentData?.recommendedEmergencyFund || undefined
    }
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;

  // Watch form values for real-time calculations
  const watchedValues = watch();
  const monthlyIncome = currentData?.monthlyIncome || 0;
  const monthlySpending = watchedValues.monthlySpending || 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;

  const onSubmit = async (data: SpendingFormData) => {
    try {
      const spendingData: SpendingOverviewDto = {
        monthlySpending: data.monthlySpending,
        emergencyFundCurrent: data.emergencyFundCurrent,
        emergencyFundTarget: data.emergencyFundTarget
      };

      await saveSpendingMutation.mutateAsync(spendingData);
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
              disabled={saveSpendingMutation.isPending}
            >
              {saveSpendingMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Spending Data
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
