/**
 * Custom hook for fetching transactions using TanStack Query
 * Handles background polling without page refreshes
 */
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/chat';

export function useTransactions(refetchInterval: number = 30000, archived?: boolean) {
    return useQuery({
        queryKey: ['transactions', archived],
        queryFn: async () => {
            const response = await getTransactions(archived);
            if (response.error) throw new Error(response.error);
            return response.data?.transactions || [];
        },
        refetchInterval, // Poll every 30 seconds by default
        staleTime: 10000, // Consider data stale after 10 seconds
        retry: 3,
    });
}
