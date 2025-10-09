"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/lib/api";
import RenderQuestionsList from "@/components/home/questionsList";

const Questions = () => {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestions(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  if (isLoading) return <div>Loading questions...</div>;
  if (isError) return <div>Failed to load questions.</div>;

  return (
    <div>
      {questions && questions.length > 0 ? (
        <RenderQuestionsList questions={questions} />
      ) : (
        <div>No questions found.</div>
      )}
    </div>
  );
};

export default Questions;
