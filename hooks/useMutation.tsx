import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Generic mutation hook that tracks loading state by ID and invalidates queries
 * @param mutationFn - The mutation function to execute
 * @param invalidateQueryKeys - Query keys to invalidate on success
 * @returns [isMutating, mutate] - Function to check if item is mutating and mutate function
 */
function useItemMutation<TVariables extends { id: string }, TData = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateQueryKeys: string[] = []
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      invalidateQueryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  /**
   * Check if a specific item is currently being mutated `mutation.variables?.id === itemId;`
   */
  const isMutating = (itemId: string): boolean => {
    return mutation.isPending && mutation.variables?.id === itemId;
  };

  return [isMutating, mutation.mutate] as const;
}

export default useItemMutation;
