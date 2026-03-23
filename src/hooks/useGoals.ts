import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { goalsApi } from '@/lib/api/goalsApi';
import { singleViewProfileQueryKey } from '@/hooks/useSingleViewProfile';
import { profileNeedsQueryKey } from '@/hooks/useProfileNeeds';
import { goalFamiliesApi } from '@/lib/api/goalFamiliesApi';
import {
  CreateGoalRequest,
  GoalProgressHistoryDto,
  GoalWithInsightsDto,
  GoalFamilySummariesResponse,
  GoalFamilyBoardDto,
  ResilienceResponseDto,
  UpdateGoalRequest,
  UserGoalsResponse,
  SimulateStrategyRequest,
  SimulateStrategyResponse,
  GoalFamilyMappingResponse,
} from '@/lib/api/types/goals';

export const useGoalsOverview = (includeInactive = false) => {
  const queryClient = useQueryClient();
  const hasUpdatedRef = useRef<Set<string>>(new Set());

  const query = useQuery<UserGoalsResponse>({
    queryKey: ['goals', 'overview', includeInactive],
    queryFn: () => goalsApi.listGoals(includeInactive),
    staleTime: 1000 * 60 * 5,
  });

  // Automatically set assessment goals to Priority 1
  useEffect(() => {
    if (!query.data?.goals) return;

    const assessmentGoalsNeedingUpdate = query.data.goals.filter(
      (goal) =>
        goal.isFromAssessment &&
        goal.priority !== undefined &&
        goal.priority !== 1 &&
        !hasUpdatedRef.current.has(goal.id)
    );

    if (assessmentGoalsNeedingUpdate.length > 0) {
      // Mark these goals as being updated to prevent duplicate updates
      assessmentGoalsNeedingUpdate.forEach((goal) => {
        hasUpdatedRef.current.add(goal.id);
      });

      // Update all assessment goals to Priority 1
      Promise.all(
        assessmentGoalsNeedingUpdate.map((goal) =>
          goalsApi.updateGoal(goal.id, { priority: 1 })
        )
      )
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['goals', 'overview'] });
          queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
          queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
        })
        .catch((error) => {
          console.error('Failed to update assessment goal priorities:', error);
          // Remove from set on error so we can retry
          assessmentGoalsNeedingUpdate.forEach((goal) => {
            hasUpdatedRef.current.delete(goal.id);
          });
        });
    }
  }, [query.data?.goals, queryClient]);

  return query;
};

export const useGoal = (goalId?: string) => {
  return useQuery<GoalWithInsightsDto>({
    queryKey: ['goals', 'detail', goalId],
    queryFn: () => goalsApi.getGoal(goalId!),
    enabled: Boolean(goalId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useResilience = (goalId?: string) => {
  return useQuery<ResilienceResponseDto | null>({
    queryKey: ['goals', 'resilience', goalId],
    queryFn: () => goalsApi.getResilience(goalId!),
    enabled: Boolean(goalId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGoalProgressHistory = (
  goalId?: string,
  options?: {
    startYear?: number;
    startMonth?: number;
    endYear?: number;
    endMonth?: number;
    limit?: number;
  }
) => {
  return useQuery<GoalProgressHistoryDto>({
    queryKey: ['goals', 'progress', goalId, options],
    queryFn: () => goalsApi.getGoalProgressHistory(goalId!, options),
    enabled: Boolean(goalId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGoalRequest) => goalsApi.createGoal(payload),
    onSuccess: (goal) => {
      toast.success('Goal created successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview'] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      queryClient.setQueryData<GoalWithInsightsDto>(
        ['goals', 'detail', goal.id],
        goal
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create goal');
    },
  });
};

export const useUpdateGoal = (goalId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGoalRequest) => goalsApi.updateGoal(goalId!, payload),
    onSuccess: (goal) => {
      toast.success('Goal updated successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'progress', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'resilience', goalId] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      queryClient.setQueryData<GoalWithInsightsDto>(
        ['goals', 'detail', goal.id],
        goal
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update goal');
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalsApi.deleteGoal(goalId),
    onSuccess: (_, goalId) => {
      toast.success('Goal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'progress', goalId] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      queryClient.removeQueries({ queryKey: ['goals', 'detail', goalId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete goal');
    },
  });
};

export const useGoalFamilySummaries = () => {
  return useQuery<GoalFamilySummariesResponse>({
    queryKey: ['goal-families', 'summaries'],
    queryFn: () => goalFamiliesApi.listSummaries(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGoalFamilyBoard = (familyId?: string) => {
  return useQuery<GoalFamilyBoardDto>({
    queryKey: ['goal-families', 'board', familyId],
    queryFn: () => goalFamiliesApi.getBoard(familyId!),
    enabled: Boolean(familyId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useSimulateStrategy = () => {
  return useMutation<SimulateStrategyResponse, Error, SimulateStrategyRequest>({
    mutationFn: (request) => goalsApi.simulateStrategy(request),
  });
};

export const useGoalFamilyMapping = () => {
  return useQuery<GoalFamilyMappingResponse>({
    queryKey: ['goal-family-mapping'],
    queryFn: () => goalFamiliesApi.getMapping(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

