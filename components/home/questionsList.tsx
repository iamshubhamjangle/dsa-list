import { CheckCircle, Circle, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { QuestionDTO } from "@/lib/types";
import useMutationWrapper from "@/hooks/useMutation";
import { toggleQuestionCompleteApi, toggleQuestionStarredApi } from "@/lib/api";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useMemo, useEffect, useState } from "react";

interface RenderQuestionsListProps {
  questions: QuestionDTO[];
}

function RenderQuestionsList({ questions }: RenderQuestionsListProps) {
  const { showDifficulty, categoryWise, allFolded } = useStudyOptionsStore();
  const [isCompletedMutating, mutateCompleted] = useMutationWrapper<
    { id: string; completed: boolean },
    QuestionDTO
  >(
    ({ id, completed }) => toggleQuestionCompleteApi(id, completed),
    ["questions"]
  );

  const [isStarredMutating, mutateStarred] = useMutationWrapper<
    { id: string; starred: boolean },
    QuestionDTO
  >(({ id, starred }) => toggleQuestionStarredApi(id, starred), ["questions"]);

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
  const categoriesKey = categories.join(",");
  const [openCategories, setOpenCategories] = useState<string[]>(categories);

  // Update open categories when allFolded changes
  useEffect(() => {
    setOpenCategories(allFolded ? [] : categories);
  }, [allFolded, categories, categoriesKey]);

  const handleToggleCompleted = (questionId: string, currentValue: boolean) => {
    if (!questionId) return;
    mutateCompleted({ id: questionId, completed: !currentValue });
  };

  const handleToggleStarred = (questionId: string, currentValue: boolean) => {
    if (!questionId) return;
    mutateStarred({ id: questionId, starred: !currentValue });
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

  // Render category-wise view using accordion
  if (categoryWise) {
    return (
      <Accordion
        type="multiple"
        value={openCategories}
        onValueChange={setOpenCategories}
        className="w-full"
      >
        {categories.map((category) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm font-semibold">
              {category}{" "}
              <span className="text-xs text-muted-foreground ml-2">
                ({groupedQuestions[category].length})
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {groupedQuestions[category].map((question) =>
                  renderQuestion(question)
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  // Render list view
  return <>{questions.map((question) => renderQuestion(question))}</>;
}

export default RenderQuestionsList;
