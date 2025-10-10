"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagApi } from "@/lib/api";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "@/lib/constants";
import { toast } from "sonner";

const initialNewTag = {
  name: "",
  color: DEFAULT_TAG_COLOR,
};

const HeaderAddTag = () => {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState(initialNewTag);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully!");
      setNewTag(initialNewTag);
      setShowAddTag(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create tag");
    },
  });

  const handleAddTag = () => {
    if (!newTag.name.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    mutation.mutate({
      name: newTag.name.trim(),
      color: newTag.color,
    });
  };

  return (
    <>
      <Dialog open={showAddTag} onOpenChange={setShowAddTag}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Tag</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tag name"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                }
              }}
              disabled={mutation.isPending}
            />
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewTag({ ...newTag, color })}
                    disabled={mutation.isPending}
                    className={cn(
                      "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                      newTag.color === color
                        ? "border-foreground ring-2 ring-offset-2 ring-foreground"
                        : "border-transparent hover:border-muted",
                      mutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleAddTag}
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding..." : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddTag(false)}
                className="flex-1"
                disabled={mutation.isPending}
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

export default HeaderAddTag;
