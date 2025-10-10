"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTagsApi, updateTagApi, deleteTagApi } from "@/lib/api";
import { TagDTO } from "@/lib/types";
import { TAG_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Tags = () => {
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  const [deletingTag, setDeletingTag] = useState<TagDTO | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    color: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch tags
  const {
    data: tags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsApi,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TagDTO> }) =>
      updateTagApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Tag updated successfully!");
      setEditingTag(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tag");
    },
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: deleteTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Tag deleted successfully!");
      setDeletingTag(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete tag");
    },
  });

  const handleEditClick = (tag: TagDTO) => {
    setEditingTag(tag);
    setEditForm({
      name: tag.name,
      color: tag.color,
      description: tag.description || "",
    });
  };

  const handleEditSubmit = () => {
    if (!editingTag) return;

    if (!editForm.name.trim() || !editForm.color.trim()) {
      toast.error("Name and color are required");
      return;
    }

    updateTagMutation.mutate({
      id: editingTag.id,
      data: {
        name: editForm.name,
        color: editForm.color,
        description: editForm.description || undefined,
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingTag) return;
    deleteTagMutation.mutate(deletingTag.id);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading tags:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  style={{ backgroundColor: tag.color }}
                  className="px-3 py-1.5 text-white flex items-center gap-2"
                >
                  <span>{tag.name}</span>
                  <div className="flex items-center gap-1 ml-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-white/20"
                      onClick={() => handleEditClick(tag)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-white/20"
                      onClick={() => setDeletingTag(tag)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No tags found. Create one using the &quot;Add Tag&quot; button
              above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag name, color, and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Tag name"
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Color *</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, color })}
                    className={cn(
                      "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                      editForm.color === color
                        ? "border-foreground ring-2 ring-offset-2 ring-foreground"
                        : "border-transparent hover:border-muted"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Tag description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTag(null)}
              disabled={updateTagMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={updateTagMutation.isPending}
            >
              {updateTagMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingTag}
        onOpenChange={() => setDeletingTag(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag &quot;
              <span className="font-semibold">{deletingTag?.name}</span>&quot;?
              This action cannot be undone. The tag must not be in use by any
              questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTagMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTagMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTagMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Tags;
