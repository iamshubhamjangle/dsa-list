"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsApi } from "@/lib/api";
import { Progress as ProgressUI } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function Progress() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestionsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  if (isLoading) {
    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 mb-4">
        <div className="text-sm text-destructive">
          Failed to load progress data
        </div>
      </div>
    );
  }

  const totalCount = questions?.length ?? 0;
  const completedCount = questions?.filter((q) => q.completed).length ?? 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span>
          Progress: {completedCount}/{totalCount} completed
        </span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <ProgressUI value={progressPercentage} className="h-2" />
    </div>
  );
}
