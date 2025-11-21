import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { goalsApi } from '@/lib/api/goalsApi';
import { goalFamiliesApi } from '@/lib/api/goalFamiliesApi';
import {
  CreateGoalRequest,
  GoalProgressHistoryDto,
  GoalWithInsightsDto,
  GoalFamilySummariesResponse,
  GoalFamilyBoardDto,
  UpdateGoalRequest,
  UserGoalsResponse,
  SimulateStrategyRequest,
  SimulateStrategyResponse,
  GoalFamilyMappingResponse,
} from '@/lib/api/types/goals';

export const useGoalsOverview = (userId: string, includeInactive = false) => {
  const queryClient = useQueryClient();
  const hasUpdatedRef = useRef<Set<string>>(new Set());

  const query = useQuery<UserGoalsResponse>({
    queryKey: ['goals', 'overview', userId, includeInactive],
    queryFn: () => goalsApi.listGoals(userId, includeInactive),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Automatically set assessment goals to Priority 1
  useEffect(() => {
    if (!query.data?.goals || !userId) return;

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
          goalsApi.updateGoal(userId, goal.id, { priority: 1 })
        )
      )
        .then(() => {
          // Invalidate queries to refresh the data
          queryClient.invalidateQueries({ queryKey: ['goals', 'overview', userId] });
        })
        .catch((error) => {
          console.error('Failed to update assessment goal priorities:', error);
          // Remove from set on error so we can retry
          assessmentGoalsNeedingUpdate.forEach((goal) => {
            hasUpdatedRef.current.delete(goal.id);
          });
        });
    }
  }, [query.data?.goals, userId, queryClient]);

  return query;
};

export const useGoal = (userId: string, goalId?: string) => {
  return useQuery<GoalWithInsightsDto>({
    queryKey: ['goals', 'detail', userId, goalId],
    queryFn: () => goalsApi.getGoal(userId, goalId!),
    enabled: Boolean(userId && goalId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGoalProgressHistory = (
  userId: string,
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
    queryKey: ['goals', 'progress', userId, goalId, options],
    queryFn: () => goalsApi.getGoalProgressHistory(userId, goalId!, options),
    enabled: Boolean(userId && goalId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateGoal = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGoalRequest) => goalsApi.createGoal(userId, payload),
    onSuccess: (goal) => {
      toast.success('Goal created successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview', userId] });
      queryClient.setQueryData<GoalWithInsightsDto>(
        ['goals', 'detail', userId, goal.id],
        goal
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create goal');
    },
  });
};

export const useUpdateGoal = (userId: string, goalId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGoalRequest) => goalsApi.updateGoal(userId, goalId!, payload),
    onSuccess: (goal) => {
      toast.success('Goal updated successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'progress', userId, goalId] });
      queryClient.setQueryData<GoalWithInsightsDto>(
        ['goals', 'detail', userId, goal.id],
        goal
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update goal');
    },
  });
};

export const useDeleteGoal = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalsApi.deleteGoal(userId, goalId),
    onSuccess: (_, goalId) => {
      toast.success('Goal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['goals', 'overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'progress', userId, goalId] });
      queryClient.removeQueries({ queryKey: ['goals', 'detail', userId, goalId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete goal');
    },
  });
};

export const useGoalFamilySummaries = (userId: string) => {
  return useQuery<GoalFamilySummariesResponse>({
    queryKey: ['goal-families', 'summaries', userId],
    queryFn: () => goalFamiliesApi.listSummaries(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGoalFamilyBoard = (userId: string, familyId?: string) => {
  return useQuery<GoalFamilyBoardDto>({
    queryKey: ['goal-families', 'board', userId, familyId],
    queryFn: () => goalFamiliesApi.getBoard(userId, familyId!),
    enabled: Boolean(userId && familyId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useSimulateStrategy = (userId: string) => {
  return useMutation<SimulateStrategyResponse, Error, SimulateStrategyRequest>({
    mutationFn: (request) => goalsApi.simulateStrategy(userId, request),
  });
};

export const useGoalFamilyMapping = () => {
  return useQuery<GoalFamilyMappingResponse>({
    queryKey: ['goal-family-mapping'],
    queryFn: () => goalFamiliesApi.getMapping(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

