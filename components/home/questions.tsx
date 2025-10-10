"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsApi } from "@/lib/api";
import RenderQuestionsList from "@/components/home/questionsList";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useMemo } from "react";

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
  const { randomize, starred } = useStudyOptionsStore();

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestionsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  // Filter and sort questions based on study options
  const processedQuestions = useMemo(() => {
    if (!questions) return [];

    let filtered = [...questions];

    // Filter by starred if enabled
    if (starred) {
      filtered = filtered.filter((q) => q.starred);
    }

    // Randomize if enabled
    if (randomize) {
      // Fisher-Yates shuffle algorithm
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }

    return filtered;
  }, [questions, starred, randomize]);

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
      {processedQuestions && processedQuestions.length > 0 ? (
        <RenderQuestionsList questions={processedQuestions} />
      ) : (
        <div className="text-sm text-muted-foreground">No questions found.</div>
      )}
    </div>
  );
};

export default Questions;
