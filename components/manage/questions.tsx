"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchQuestionsApi,
  fetchTagsApi,
  updateQuestionApi,
  deleteQuestionApi,
} from "@/lib/api";
import { QuestionDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Questions = () => {
  const [editingQuestion, setEditingQuestion] = useState<QuestionDTO | null>(
    null
  );
  const [deletingQuestion, setDeletingQuestion] = useState<QuestionDTO | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    tagIds: [] as string[],
  });

  const queryClient = useQueryClient();

  // Fetch questions
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestionsApi(),
  });

  // Fetch tags
  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsApi,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        url?: string;
        difficulty?: "Easy" | "Medium" | "Hard";
        tagIds?: string[];
      };
    }) => updateQuestionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question updated successfully!");
      setEditingQuestion(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update question");
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question deleted successfully!");
      setDeletingQuestion(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete question");
    },
  });

  const handleEditClick = (question: QuestionDTO) => {
    setEditingQuestion(question);
    setEditForm({
      name: question.name,
      url: question.url,
      difficulty: question.difficulty,
      tagIds: question.tags.map((t) => t.id),
    });
  };

  const handleEditSubmit = () => {
    if (!editingQuestion) return;

    if (!editForm.name.trim() || !editForm.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }

    updateQuestionMutation.mutate({
      id: editingQuestion.id,
      data: {
        name: editForm.name,
        url: editForm.url,
        difficulty: editForm.difficulty,
        tagIds: editForm.tagIds,
      } as {
        name: string;
        url: string;
        difficulty: "Easy" | "Medium" | "Hard";
        tagIds: string[];
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingQuestion) return;
    deleteQuestionMutation.mutate(deletingQuestion.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "border-green-500 text-green-500";
      case "Medium":
        return "border-yellow-500 text-yellow-500";
      case "Hard":
        return "border-red-500 text-red-500";
      default:
        return "";
    }
  };

  if (questionsError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading questions:{" "}
            {questionsError instanceof Error
              ? questionsError.message
              : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Questions {questions && `(${questions.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isQuestionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={question.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline flex items-center gap-1"
                      >
                        {question.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={cn(getDifficultyColor(question.difficulty))}
                      >
                        {question.difficulty}
                      </Badge>
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          style={{ backgroundColor: tag.color }}
                          className="text-white"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingQuestion(question)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No questions found. Add one using the &quot;Add Question&quot;
              button above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Question Dialog */}
      <Dialog
        open={!!editingQuestion}
        onOpenChange={() => setEditingQuestion(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update the question details and tags
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Question Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Question name"
              />
            </div>
            <div>
              <Label htmlFor="edit-url">Question URL *</Label>
              <Input
                id="edit-url"
                type="url"
                value={editForm.url}
                onChange={(e) =>
                  setEditForm({ ...editForm, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="block mb-2">Difficulty</Label>
              <RadioGroup
                value={editForm.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setEditForm({ ...editForm, difficulty: value })
                }
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Easy" id="edit-easy" />
                  <Label htmlFor="edit-easy" className="cursor-pointer">
                    Easy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="edit-medium" />
                  <Label htmlFor="edit-medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hard" id="edit-hard" />
                  <Label htmlFor="edit-hard" className="cursor-pointer">
                    Hard
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="block mb-2">Tags</Label>
              {isTagsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={editForm.tagIds.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          const newTagIds = checked
                            ? [...editForm.tagIds, tag.id]
                            : editForm.tagIds.filter((t) => t !== tag.id);
                          setEditForm({ ...editForm, tagIds: newTagIds });
                        }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No tags available. Create tags first.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingQuestion(null)}
              disabled={updateQuestionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={updateQuestionMutation.isPending}
            >
              {updateQuestionMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingQuestion}
        onOpenChange={() => setDeletingQuestion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              <span className="font-semibold">{deletingQuestion?.name}</span>
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteQuestionMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteQuestionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteQuestionMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Questions;
