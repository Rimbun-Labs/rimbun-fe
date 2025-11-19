import { useEffect } from 'react';
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
import { CreateGoalRequest, GoalWithInsightsDto } from '@/lib/api/types/goals';
import { cn } from '@/lib/utils';

type GoalFormValues = {
  goalName: string;
  goalType: CreateGoalRequest['goalType'];
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  investmentHorizon?: number | null;
  targetDate?: string;
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
}

const goalTypeOptions: Array<{ value: GoalFormValues['goalType']; label: string }> = [
  { value: 'retirement', label: 'Retirement' },
  { value: 'house', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'other', label: 'Other' },
];

export const GoalFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialGoal,
  onSubmit,
  isSubmitting,
  title,
  description,
}: GoalFormDialogProps) => {
  const form = useForm<GoalFormValues>({
    defaultValues: {
      goalName: initialGoal?.goalName ?? '',
      goalType: initialGoal?.goalType ?? 'retirement',
      targetAmount: initialGoal?.targetAmount ?? 0,
      currentAmount: initialGoal?.currentAmount ?? 0,
      monthlyContribution: initialGoal?.monthlyContribution ?? 0,
      investmentHorizon: initialGoal?.investmentHorizon ?? undefined,
      targetDate: initialGoal?.targetDate ? initialGoal.targetDate.slice(0, 10) : undefined,
      priority: initialGoal?.priority ?? 3,
      initialInvestment: initialGoal?.metadata?.initialInvestment ?? undefined,
      notes: initialGoal?.metadata?.notes ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      goalName: initialGoal?.goalName ?? '',
      goalType: initialGoal?.goalType ?? 'retirement',
      targetAmount: initialGoal?.targetAmount ?? 0,
      currentAmount: initialGoal?.currentAmount ?? 0,
      monthlyContribution: initialGoal?.monthlyContribution ?? 0,
      investmentHorizon: initialGoal?.investmentHorizon ?? undefined,
      targetDate: initialGoal?.targetDate ? initialGoal.targetDate.slice(0, 10) : undefined,
      priority: initialGoal?.priority ?? 3,
      initialInvestment: initialGoal?.metadata?.initialInvestment ?? undefined,
      notes: initialGoal?.metadata?.notes ?? '',
    });
  }, [initialGoal, form]);

  const handleSubmit = async (values: GoalFormValues) => {
    const payload: CreateGoalRequest = {
      goalName: values.goalName,
      goalType: values.goalType,
      targetAmount: Number(values.targetAmount),
      currentAmount: Number(values.currentAmount ?? 0),
      monthlyContribution: Number(values.monthlyContribution),
      investmentHorizon: values.investmentHorizon ? Number(values.investmentHorizon) : undefined,
      targetDate: values.targetDate ? new Date(values.targetDate).toISOString() : undefined,
      priority: values.priority ? Number(values.priority) : undefined,
      metadata: {
        initialInvestment: values.initialInvestment ? Number(values.initialInvestment) : undefined,
        notes: values.notes?.trim() || undefined,
      },
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal type</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
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
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
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

