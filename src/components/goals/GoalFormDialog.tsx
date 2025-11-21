import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateGoalRequest, GoalWithInsightsDto, GoalFamilyId, GoalType, GoalFamilySlug, GoalFamilySummaryDto } from '@/lib/api/types/goals';
import { getGoalFamilyConfigBySlug } from '@/lib/constants/goalFamilies';
import { useGoalFamilyMapping } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';

type GoalFormValues = {
  goalName: string;
  goalType: CreateGoalRequest['goalType'];
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  investmentHorizon?: number | null;
  targetYear?: number | null;
  priority?: number;
  initialInvestment?: number;
  notes?: string;
};

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialGoal?: GoalWithInsightsDto | null;
  onSubmit: (payload: CreateGoalRequest) => Promise<void> | void;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  preSelectedFamilyId?: GoalFamilyId | string; // UUID or slug - Pre-select family when creating from family page
  familySummaries?: GoalFamilySummaryDto[]; // Optional: to look up family slug from UUID
}

const goalTypeOptions: Array<{ value: GoalFormValues['goalType']; label: string }> = [
  { value: 'retirement', label: 'Retirement' },
  { value: 'house', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'other', label: 'Other' },
];

// Extract year from targetDate if it exists
const getTargetYear = (targetDate?: string | null): number | undefined => {
  if (!targetDate) return undefined;
  try {
    const date = new Date(targetDate);
    return date.getFullYear();
  } catch {
    return undefined;
  }
};

// Helper to get default goal type from family slug using API mapping
const useDefaultGoalTypeForFamily = (familySlug?: GoalFamilySlug | string | null, mapping?: { familyToGoalTypes: Record<string, string[]> }): GoalType => {
  if (!familySlug || !mapping) return 'other';
  
  const slug = typeof familySlug === 'string' ? familySlug : familySlug;
  const goalTypes = mapping.familyToGoalTypes[slug];
  
  // Return first suggested goal type, or 'other' as fallback
  if (goalTypes && goalTypes.length > 0) {
    // Map API goal types to our GoalType enum
    const apiToGoalType: Record<string, GoalType> = {
      'retirement': 'retirement',
      'house': 'house',
      'education': 'education',
      'emergency_fund': 'emergency_fund',
      'wealth_building': 'retirement', // Map to retirement
      'debt_payoff': 'other',
      'insurance': 'other',
      'charitable_giving': 'other',
      'other': 'other',
    };
    return apiToGoalType[goalTypes[0]] || 'other';
  }
  
  return 'other';
};

export const GoalFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialGoal,
  onSubmit,
  isSubmitting,
  title,
  description,
  preSelectedFamilyId,
  familySummaries,
}: GoalFormDialogProps) => {
  // Fetch mapping from API
  const { data: mapping } = useGoalFamilyMapping();

  // Get family slug from preSelectedFamilyId
  // If it's a UUID, look it up from familySummaries
  // If it's already a slug, use it directly
  const familySlug = useMemo(() => {
    if (!preSelectedFamilyId) return undefined;
    
    // Check if it's a UUID (contains hyphens and is long)
    const isLikelyUUID = preSelectedFamilyId.includes('-') && preSelectedFamilyId.length > 20;
    
    if (isLikelyUUID && familySummaries) {
      // Look up family by UUID to get slug
      const family = familySummaries.find(f => f.id === preSelectedFamilyId);
      if (family?.slug) {
        return family.slug as GoalFamilySlug;
      }
    }
    
    // Assume it's a slug (or try to use it as-is)
    // Check if it matches a valid slug format
    const slugPattern = /^[a-z-]+$/;
    if (typeof preSelectedFamilyId === 'string' && slugPattern.test(preSelectedFamilyId)) {
      return preSelectedFamilyId as GoalFamilySlug;
    }
    
    return undefined;
  }, [preSelectedFamilyId, familySummaries]);

  // Determine default goal type: use family mapping if pre-selected, otherwise use initial goal or default
  const defaultGoalType = familySlug && mapping
    ? useDefaultGoalTypeForFamily(familySlug, mapping)
    : (initialGoal?.goalType ?? 'retirement');

  const form = useForm<GoalFormValues>({
    defaultValues: {
      goalName: initialGoal?.goalName ?? '',
      goalType: defaultGoalType,
      targetAmount: initialGoal?.targetAmount ?? 0,
      currentAmount: initialGoal?.currentAmount ?? 0,
      monthlyContribution: initialGoal?.monthlyContribution ?? 0,
      investmentHorizon: initialGoal?.investmentHorizon ?? undefined,
      targetYear: getTargetYear(initialGoal?.targetDate) ?? undefined,
      priority: initialGoal?.priority ?? 3,
      initialInvestment: initialGoal?.metadata?.initialInvestment ?? undefined,
      notes: initialGoal?.metadata?.notes ?? '',
    },
  });

  useEffect(() => {
    const goalType = familySlug && mapping
      ? useDefaultGoalTypeForFamily(familySlug, mapping)
      : (initialGoal?.goalType ?? 'retirement');
    
    form.reset({
      goalName: initialGoal?.goalName ?? '',
      goalType: goalType,
      targetAmount: initialGoal?.targetAmount ?? 0,
      currentAmount: initialGoal?.currentAmount ?? 0,
      monthlyContribution: initialGoal?.monthlyContribution ?? 0,
      investmentHorizon: initialGoal?.investmentHorizon ?? undefined,
      targetYear: getTargetYear(initialGoal?.targetDate) ?? undefined,
      priority: initialGoal?.priority ?? 3,
      initialInvestment: initialGoal?.metadata?.initialInvestment ?? undefined,
      notes: initialGoal?.metadata?.notes ?? '',
    });
  }, [initialGoal, form, familySlug, mapping]);

  const handleSubmit = async (values: GoalFormValues) => {
    // Convert targetYear to targetDate string (format: YYYY-01-01)
    const targetDate = values.targetYear 
      ? `${values.targetYear}-01-01` 
      : undefined;

    const payload: CreateGoalRequest = {
      goalName: values.goalName,
      goalType: values.goalType,
      targetAmount: Number(values.targetAmount),
      currentAmount: Number(values.currentAmount ?? 0),
      monthlyContribution: Number(values.monthlyContribution),
      investmentHorizon: values.investmentHorizon ? Number(values.investmentHorizon) : undefined,
      targetDate: targetDate,
      priority: values.priority ? Number(values.priority) : undefined,
      metadata: {
        initialInvestment: values.initialInvestment ? Number(values.initialInvestment) : undefined,
        notes: values.notes?.trim() || undefined,
      },
      // Include pre-selected family ID if provided (for create mode) or use existing goal's family
      primaryFamilyId: (preSelectedFamilyId as GoalFamilyId) || initialGoal?.primaryFamilyId,
    };

    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title ?? (mode === 'create' ? 'Add Goal' : 'Edit Goal')}</DialogTitle>
          <DialogDescription>
            {description ?? 'Capture the target amount, contribution, and timeline for this goal.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="goalName"
                rules={{ required: 'Goal name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Retirement" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalType"
                render={({ field }) => {
                  const familyConfig = familySlug 
                    ? getGoalFamilyConfigBySlug(familySlug)
                    : null;
                  
                  // Show read-only if we have a pre-selected family (even if config lookup failed)
                  const shouldShowReadOnly = Boolean(preSelectedFamilyId);
                  
                  return (
                    <FormItem>
                      <FormLabel>Goal type</FormLabel>
                      {shouldShowReadOnly ? (
                        <div className="space-y-1">
                          <FormControl>
                            <Input 
                              value={goalTypeOptions.find(opt => opt.value === field.value)?.label || field.value}
                              disabled
                              className="bg-muted"
                            />
                          </FormControl>
                          {familyConfig ? (
                            <p className="text-xs text-muted-foreground">
                              Auto-selected for {familyConfig.label} family
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Auto-selected based on family
                            </p>
                          )}
                        </div>
                      ) : (
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a goal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {goalTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="targetAmount"
                rules={{ required: 'Target amount is required', min: { value: 1, message: 'Target must be greater than 0' } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target amount (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="100" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current amount</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="100" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyContribution"
                rules={{ required: 'Monthly contribution is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly contribution</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="50" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="investmentHorizon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment horizon (years)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step="1" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={new Date().getFullYear()} 
                        max={2100}
                        step="1"
                        placeholder="e.g., 2035"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority (1 = highest)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={5} step="1" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial investment</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="100" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Add context, assumptions, or advisor recommendations"
                        {...field}
                        disabled={isSubmitting}
                        className={cn('resize-none')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create goal' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalFormDialog;


