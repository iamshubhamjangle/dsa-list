"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchTagsApi, createQuestionApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const initialNewQuestion = {
  name: "",
  url: "",
  difficulty: "Medium" as "Easy" | "Medium" | "Hard",
  tags: [] as string[],
};

const HeaderAddQuestion = () => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState(initialNewQuestion);
  const queryClient = useQueryClient();

  const {
    data: tags,
    isLoading: isTagsLoading,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTagsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  const createQuestionMutation = useMutation({
    mutationFn: createQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question added successfully!");
      setNewQuestion(initialNewQuestion);
      setShowAddQuestion(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add question");
    },
  });

  const handleAddQuestion = () => {
    if (!newQuestion.name || !newQuestion.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    createQuestionMutation.mutate({
      name: newQuestion.name,
      url: newQuestion.url,
      difficulty: newQuestion.difficulty,
      tagIds: newQuestion.tags.length > 0 ? newQuestion.tags : undefined,
    });
  };

  return (
    <>
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Question name"
              value={newQuestion.name}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, name: e.target.value })
              }
            />
            <Input
              type="url"
              placeholder="Question URL"
              value={newQuestion.url}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, url: e.target.value })
              }
            />
            <div>
              <Label className="block mb-2">Difficulty</Label>
              <RadioGroup
                value={newQuestion.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setNewQuestion({ ...newQuestion, difficulty: value })
                }
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Easy" id="easy" />
                  <Label htmlFor="easy" className="cursor-pointer">
                    Easy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hard" id="hard" />
                  <Label htmlFor="hard" className="cursor-pointer">
                    Hard
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              {isTagsLoading && <Skeleton className="h-4 w-4" />}
              {tagsError && <div>Error loading tags</div>}
              {!isTagsLoading && !tagsError && (
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={newQuestion.tags.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          const newTags = checked
                            ? [...newQuestion.tags, tag.id]
                            : newQuestion.tags.filter((t) => t !== tag.id);
                          setNewQuestion({ ...newQuestion, tags: newTags });
                        }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleAddQuestion}
                className="flex-1"
                disabled={createQuestionMutation.isPending}
              >
                {createQuestionMutation.isPending ? "Adding..." : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddQuestion(false)}
                className="flex-1"
                disabled={createQuestionMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeaderAddQuestion;
