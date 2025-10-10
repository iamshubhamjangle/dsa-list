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
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagApi } from "@/lib/api";
import toast from "react-hot-toast";

const initialNewTag = {
  name: "",
  color: "bg-blue-500",
};

const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-gray-500",
];

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
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex justify-between gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTag({ ...newTag, color: color })}
                    disabled={mutation.isPending}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-opacity",
                      color,
                      newTag.color === color
                        ? "border-foreground"
                        : "border-border",
                      mutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
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
