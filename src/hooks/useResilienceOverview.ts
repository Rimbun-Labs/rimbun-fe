import { useQuery } from '@tanstack/react-query';
import { resilienceApi } from '@/lib/api/resilienceApi';
import type { ResilienceOverviewResponseDto, SafetyFloorResponseDto } from '@/lib/api/types/resilience';

export const resilienceOverviewQueryKey = ['resilience', 'overview'] as const;
export const safetyFloorQueryKey = ['resilience', 'safety-floor'] as const;

export function useResilienceOverview() {
  return useQuery<ResilienceOverviewResponseDto>({
    queryKey: resilienceOverviewQueryKey,
    queryFn: () => resilienceApi.getOverview(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSafetyFloor(limit?: number) {
  return useQuery<SafetyFloorResponseDto>({
    queryKey: [...safetyFloorQueryKey, limit],
    queryFn: () => resilienceApi.getSafetyFloor(limit),
    staleTime: 1000 * 60 * 5,
  });
}
