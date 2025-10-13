"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsApi } from "@/lib/api";
import RenderQuestionsList from "@/components/home/questionsList";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useMemo } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import TemplateImport from "@/components/home/templateImport";

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

  // Seeded random number generator for deterministic shuffling
  const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
      // Linear Congruential Generator (LCG)
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  };

  // Filter and sort questions based on study options
  const processedQuestions = useMemo(() => {
    if (!questions) return [];

    let filtered = [...questions];

    // Filter by starred if enabled
    if (starred) {
      filtered = filtered.filter((q) => q.starred);
    }

    // Sort alphabetically by name for consistent ordering
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Randomize if enabled (deterministic shuffle)
    if (randomize) {
      // Create a seed from the question IDs for deterministic randomization
      const seed = filtered.reduce((acc, q) => {
        return acc + q.id.charCodeAt(0);
      }, 12345);

      const random = seededRandom(seed);

      // Fisher-Yates shuffle with seeded random
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
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

  // Check if user has no questions at all (not just filtered)
  const hasNoQuestions = !questions || questions.length === 0;
  // const hasNoFilteredQuestions =
  //   processedQuestions && processedQuestions.length === 0;

  return (
    <div>
      {processedQuestions && processedQuestions.length > 0 ? (
        <RenderQuestionsList questions={processedQuestions} />
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            {/* <EmptyMedia variant="icon">
              <LayoutTemplate />
            </EmptyMedia> */}
            <EmptyTitle>
              {hasNoQuestions
                ? "Get Started with Curated Templates"
                : "No Questions Found"}
            </EmptyTitle>
            <EmptyDescription>
              {hasNoQuestions
                ? "Select a template and import!"
                : starred
                ? "No starred questions available. Star some questions to see them here."
                : "No questions match your current filters."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {hasNoQuestions ? (
              <TemplateImport />
            ) : starred ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  useStudyOptionsStore.setState({ starred: false })
                }
              >
                Clear Filter
              </Button>
            ) : null}
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};

export default Questions;
