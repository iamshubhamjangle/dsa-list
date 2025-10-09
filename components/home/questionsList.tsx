import { QuestionDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleQuestionComplete, toggleQuestionStarred } from "@/lib/api";

interface RenderQuestionsListProps {
  questions: QuestionDTO[];
}

function RenderQuestionsList({ questions }: RenderQuestionsListProps) {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleQuestionComplete(id, completed),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const starredMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      toggleQuestionStarred(id, starred),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  function isCompletedMutating(questionId: string): boolean {
    return (
      completeMutation.isPending &&
      completeMutation.variables?.id === questionId
    );
  }

  function isStarredMutating(questionId: string): boolean {
    return (
      starredMutation.isPending && starredMutation.variables?.id === questionId
    );
  }

  function onToggleQuestionCompletedBtnClick(
    questionId: string,
    prevValue: boolean
  ) {
    if (!questionId) return;
    completeMutation.mutate({
      id: questionId,
      completed: !prevValue,
    });
  }

  function onToggleQuestionStarredBtnClick(
    questionId: string,
    prevValue: boolean
  ) {
    if (!questionId) return;
    starredMutation.mutate({
      id: questionId,
      starred: !prevValue,
    });
  }

  return questions.map((question) => (
    <div key={question.id} className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            onClick={() =>
              onToggleQuestionCompletedBtnClick(question.id, question.completed)
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
            onClick={() =>
              onToggleQuestionStarredBtnClick(question.id, question.starred)
            }
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
      </div>
    </div>
  ));
}

export default RenderQuestionsList;
