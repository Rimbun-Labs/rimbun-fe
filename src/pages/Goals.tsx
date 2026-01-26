import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCreateGoal,
  useDeleteGoal,
  useGoalFamilySummaries,
  useGoalsOverview,
  useUpdateGoal,
} from '@/hooks/useGoals';
import GoalSummaryCards from '@/components/goals/GoalSummaryCards';
import GoalCard from '@/components/goals/GoalCard';
import GoalFormDialog from '@/components/goals/GoalFormDialog';
import BudgetOptimizationCard from '@/components/goals/BudgetOptimizationCard';
import GoalFamiliesOverview from '@/components/goals/families/GoalFamiliesOverview';
import GoalProgressTimeline from '@/components/goals/GoalProgressTimeline';
import { AllocationStrategySimulator } from '@/components/goals/AllocationStrategySimulator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, PlusCircle, RefreshCw, Target } from 'lucide-react';
import { PageHeader, PageContainer } from '@/components/layout';
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

  const { data, isLoading, isError, refetch } = useGoalsOverview(includeInactive);
  const {
    data: familySummaries,
    isLoading: isFamilySummaryLoading,
  } = useGoalFamilySummaries();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal(editingGoal?.id);
  const deleteGoal = useDeleteGoal();

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
    <PageContainer>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <PageHeader
          icon={Target}
          title="Goals"
          description="Track every financial objective, monitor progress, and adjust plans."
        />
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

      {/* Main Content */}
      <div className="space-y-6 mt-6">
        <GoalSummaryCards summary={data?.summary} isLoading={isLoading} />

        {/* Budget Optimization Warning */}
        {!isLoading && data?.budgetValidation && data.budgetValidation.isOverBudget && (
          <BudgetOptimizationCard budgetValidation={data.budgetValidation} />
        )}

        {/* Goal Progress Timeline Chart */}
        <GoalProgressTimeline
          goals={data?.goals}
          isLoading={isLoading}
          familySummaries={familySummaries?.families}
        />

        {/* Allocation Strategy Simulator */}
        <AllocationStrategySimulator
          goals={data?.goals ?? []}
          budgetValidation={data?.budgetValidation}
          familySummaries={familySummaries?.families}
          isLoading={isLoading}
        />

        <GoalFamiliesOverview
          summaries={familySummaries}
          isLoading={isFamilySummaryLoading}
          onSelectFamily={(family) => navigate(`/goals/family/${family.slug}`)}
        />

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load goals</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
          </Alert>
        )}
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
    </PageContainer>
  );
};

export default GoalsPage;

