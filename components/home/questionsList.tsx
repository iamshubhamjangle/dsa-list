import { CheckCircle, Circle, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { QuestionDTO } from "@/lib/types";
import { toggleQuestionCompleteApi, toggleQuestionStarredApi } from "@/lib/api";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RenderQuestionsListProps {
  questions: QuestionDTO[];
}

function RenderQuestionsList({ questions }: RenderQuestionsListProps) {
  const { showDifficulty, categoryWise } = useStudyOptionsStore();
  const queryClient = useQueryClient();

  const completedMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleQuestionCompleteApi(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update question status");
    },
  });

  const starredMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      toggleQuestionStarredApi(id, starred),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update starred status");
    },
  });

  // Helper functions to check if a specific item is being mutated
  const isCompletedMutating = (itemId: string): boolean => {
    return (
      completedMutation.isPending && completedMutation.variables?.id === itemId
    );
  };

  const isStarredMutating = (itemId: string): boolean => {
    return (
      starredMutation.isPending && starredMutation.variables?.id === itemId
    );
  };

  // Group questions by tags for category view
  const groupedQuestions = useMemo(() => {
    const groups: Record<string, QuestionDTO[]> = {};

    questions.forEach((question) => {
      if (question.tags && question.tags.length > 0) {
        question.tags.forEach((tag) => {
          if (!groups[tag.name]) {
            groups[tag.name] = [];
          }
          groups[tag.name].push(question);
        });
      } else {
        if (!groups["Uncategorized"]) {
          groups["Uncategorized"] = [];
        }
        groups["Uncategorized"].push(question);
      }
    });

    return groups;
  }, [questions]);

  const categories = useMemo(
    () => Object.keys(groupedQuestions),
    [groupedQuestions]
  );

  const handleToggleCompleted = (questionId: string, currentValue: boolean) => {
    if (!questionId) return;
    completedMutation.mutate({ id: questionId, completed: !currentValue });
  };

  const handleToggleStarred = (questionId: string, currentValue: boolean) => {
    if (!questionId) return;
    starredMutation.mutate({ id: questionId, starred: !currentValue });
  };

  const renderQuestion = (question: QuestionDTO) => (
    <div key={question.id} className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            onClick={() =>
              handleToggleCompleted(question.id, question.completed)
            }
            variant="ghost"
            size="sm"
            disabled={isCompletedMutating(question.id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600"
          >
            {isCompletedMutating(question.id) ? (
              <Spinner className="h-5 w-5" />
            ) : question.completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>

          <Button
            onClick={() => handleToggleStarred(question.id, question.starred)}
            variant="ghost"
            size="sm"
            disabled={isStarredMutating(question.id)}
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              question.starred
                ? "text-yellow-500"
                : "text-muted-foreground hover:text-yellow-500"
            )}
          >
            {isStarredMutating(question.id) ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Star
                className={cn("h-4 w-4", question.starred && "fill-current")}
              />
            )}
          </Button>

          <div className="flex-1">
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                question.completed && "line-through text-muted-foreground"
              )}
            >
              {question.name}
            </a>
          </div>
        </div>

        {showDifficulty && (
          <Badge
            variant="outline"
            className={cn({
              "border-green-500 text-green-500": question.difficulty === "Easy",
              "border-yellow-500 text-yellow-500":
                question.difficulty === "Medium",
              "border-red-500 text-red-500": question.difficulty === "Hard",
            })}
          >
            {question.difficulty}
          </Badge>
        )}
      </div>
    </div>
  );

  // Render category-wise view with cards for each category
  if (categoryWise) {
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category} className="gap-0">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold">
                {category}{" "}
                <span className="text-muted-foreground font-normal">
                  ({groupedQuestions[category].length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {groupedQuestions[category].map((question) =>
                  renderQuestion(question)
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render list view in a single card
  return (
    <Card>
      <CardContent>
        <div className="divide-y">
          {questions.map((question) => renderQuestion(question))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RenderQuestionsList;
