import { CheckCircle, Circle, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { QuestionDTO } from "@/lib/types";
import { toggleQuestionCompleteApi, toggleQuestionStarredApi } from "@/lib/api";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RenderQuestionsListProps {
  questions: QuestionDTO[];
}

function RenderQuestionsList({ questions }: RenderQuestionsListProps) {
  const { showDifficulty, categoryWise, allFolded } = useStudyOptionsStore();
  const queryClient = useQueryClient();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

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

  // Group questions by tags for category view with completed count
  const groupedQuestions = useMemo(() => {
    const groups: Record<
      string,
      { questions: QuestionDTO[]; completed: number; total: number }
    > = {};

    questions.forEach((question) => {
      if (question.tags && question.tags.length > 0) {
        question.tags.forEach((tag) => {
          if (!groups[tag.name]) {
            groups[tag.name] = { questions: [], completed: 0, total: 0 };
          }
          groups[tag.name].questions.push(question);
          groups[tag.name].total += 1;
          if (question.completed) {
            groups[tag.name].completed += 1;
          }
        });
      } else {
        if (!groups["Uncategorized"]) {
          groups["Uncategorized"] = { questions: [], completed: 0, total: 0 };
        }
        groups["Uncategorized"].questions.push(question);
        groups["Uncategorized"].total += 1;
        if (question.completed) {
          groups["Uncategorized"].completed += 1;
        }
      }
    });

    return groups;
  }, [questions]);

  const categories = useMemo(
    () => Object.keys(groupedQuestions),
    [groupedQuestions]
  );

  // Helps to close all accordions when allFolded is true
  useEffect(() => {
    if (allFolded) {
      setOpenAccordions([]);
    } else {
      setOpenAccordions(categories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFolded]);

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

  // Render category-wise view with accordion for each category
  if (categoryWise) {
    return (
      <Accordion
        type="multiple"
        className="space-y-4"
        value={openAccordions}
        onValueChange={setOpenAccordions}
      >
        {categories.map((category) => (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg"
          >
            <Card className="border-0 py-0 gap-0">
              <CardHeader className="py-0 gap-0">
                <AccordionTrigger className="hover:no-underline">
                  <CardTitle className="font-semibold text-left">
                    {category}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({groupedQuestions[category].completed}/
                      {groupedQuestions[category].total})
                    </span>
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="divide-y">
                    {groupedQuestions[category].questions.map((question) =>
                      renderQuestion(question)
                    )}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
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
