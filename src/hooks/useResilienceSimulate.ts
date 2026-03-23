import { useMutation } from '@tanstack/react-query';
import { resilienceApi } from '@/lib/api/resilienceApi';
import type { ResilienceSimulateRequest, ResilienceSimulateResponse } from '@/lib/api/types/resilience';

export function useResilienceSimulate() {
  return useMutation<ResilienceSimulateResponse, Error, ResilienceSimulateRequest>({
    mutationFn: (body) => resilienceApi.simulate(body),
  });
}
