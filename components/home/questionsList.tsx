import { QuestionDTO } from "@/lib/types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RenderQuestionsListProps {
  questions: QuestionDTO[];
}

function RenderQuestionsList({ questions }: RenderQuestionsListProps) {
  function toggleQuestionCompleted(questionId: string) {
    // Implement the logic to toggle the completed status of the question
    console.log("Toggling completed for question ID:", questionId);
  }

  function toggleQuestionStarred(questionId: string) {
    // Implement the logic to toggle the starred status of the question
    console.log("Toggling starred for question ID:", questionId);
  }

  return questions.map((question) => (
    <div key={question.id} className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            onClick={() => toggleQuestionCompleted(question.id)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600"
          >
            {question.completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>

          <Button
            onClick={() => toggleQuestionStarred(question.id)}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              question.starred
                ? "text-yellow-500"
                : "text-muted-foreground hover:text-yellow-500"
            )}
          >
            <Star
              className={cn("h-4 w-4", question.starred && "fill-current")}
            />
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
