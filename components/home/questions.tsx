"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsApi } from "@/lib/api";
import RenderQuestionsList from "@/components/home/questionsList";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionSkeleton = () => (
  <div className="py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        {/* Circle icon skeleton */}
        <Skeleton className="h-8 w-8 rounded-md" />
        {/* Star icon skeleton */}
        <Skeleton className="h-8 w-8 rounded-md" />
        {/* Question name skeleton */}
        <Skeleton className="h-5 flex-1 max-w-md" />
      </div>
      {/* Badge skeleton */}
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  </div>
);

const Questions = () => {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestionsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <QuestionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to load questions.</div>
    );
  }

  return (
    <div>
      {questions && questions.length > 0 ? (
        <RenderQuestionsList questions={questions} />
      ) : (
        <div className="text-sm text-muted-foreground">No questions found.</div>
      )}
    </div>
  );
};

export default Questions;
