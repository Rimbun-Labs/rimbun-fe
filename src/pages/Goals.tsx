import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCreateGoal,
  useDeleteGoal,
  useGoalsOverview,
  useUpdateGoal,
} from '@/hooks/useGoals';
import GoalSummaryCards from '@/components/goals/GoalSummaryCards';
import GoalCard from '@/components/goals/GoalCard';
import GoalFormDialog from '@/components/goals/GoalFormDialog';
import BudgetOptimizationCard from '@/components/goals/BudgetOptimizationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, PlusCircle, RefreshCw } from 'lucide-react';
import { GoalType, GoalWithInsightsDto } from '@/lib/api/types/goals';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const goalTypeFilters: Array<{ value: GoalType | 'all'; label: string }> = [
  { value: 'all', label: 'All goal types' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'house', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'other', label: 'Other' },
];

const GoalsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.uid ?? '';

  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<GoalType | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingGoal, setEditingGoal] = useState<GoalWithInsightsDto | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<GoalWithInsightsDto | null>(null);

  const { data, isLoading, isError, refetch } = useGoalsOverview(userId, includeInactive);
  const createGoal = useCreateGoal(userId);
  const updateGoal = useUpdateGoal(userId, editingGoal?.id);
  const deleteGoal = useDeleteGoal(userId);

  const handleCreateClick = () => {
    setFormMode('create');
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: GoalWithInsightsDto) => {
    setFormMode('edit');
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleSubmitGoal = async (payload: Parameters<typeof createGoal.mutateAsync>[0]) => {
    if (formMode === 'create') {
      await createGoal.mutateAsync(payload);
    } else if (editingGoal?.id) {
      await updateGoal.mutateAsync(payload);
    }
  };

  const filteredGoals = useMemo(() => {
    if (!data?.goals) return [];
    return data.goals.filter((goal) => {
      const matchesSearch = goal.goalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' ? true : goal.goalType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [data?.goals, searchTerm, typeFilter]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Track every financial objective, monitor progress, and adjust plans.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add goal
          </Button>
        </div>
      </div>

      <GoalSummaryCards summary={data?.summary} isLoading={isLoading} />

      {/* Budget Optimization Warning */}
      {!isLoading && data?.budgetValidation && data.budgetValidation.isOverBudget && (
        <BudgetOptimizationCard budgetValidation={data.budgetValidation} />
      )}

      <div className="rounded-xl border bg-card/60 p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-xs"
            />
            <Select value={typeFilter} onValueChange={(value: GoalType | 'all') => setTypeFilter(value)}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Goal type" />
              </SelectTrigger>
              <SelectContent>
                {goalTypeFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="include-inactive" className="text-sm text-muted-foreground">
              Include inactive
            </Label>
            <Switch
              id="include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
          </div>
        </div>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load goals</AlertTitle>
          <AlertDescription>Check your connection and try again.</AlertDescription>
        </Alert>
      )}

      {!isLoading && filteredGoals.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
          <p className="text-lg font-medium">No goals yet</p>
          <p className="mt-2 text-muted-foreground">
            Create a goal to see personalized insights, gaps, and timelines.
          </p>
          <Button className="mt-4" onClick={handleCreateClick}>
            Start a goal
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onView={(selected) => navigate(`/goals/${selected.id}`)}
            onEdit={handleEditGoal}
            onDelete={(selected) => setGoalToDelete(selected)}
            disableDelete={goal.isFromAssessment}
          />
        ))}
      </div>

      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        initialGoal={editingGoal}
        onSubmit={handleSubmitGoal}
        isSubmitting={formMode === 'create' ? createGoal.isPending : updateGoal.isPending}
        description="Provide the target, contribution, and notes for this goal."
      />

      <AlertDialog
        open={Boolean(goalToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteGoal.isPending) {
            setGoalToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete goal</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {goalToDelete?.goalName}. Progress history may be lost. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGoalToDelete(null)} disabled={deleteGoal.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (goalToDelete) {
                  await deleteGoal.mutateAsync(goalToDelete.id);
                  setGoalToDelete(null);
                }
              }}
              disabled={deleteGoal.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalsPage;

