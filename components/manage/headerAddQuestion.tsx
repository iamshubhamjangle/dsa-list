"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

const initialNewQuestion = {
  name: "",
  url: "",
  difficulty: "Medium" as "Easy" | "Medium" | "Hard",
  tags: [] as string[],
};

const HeaderAddQuestion = () => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState(initialNewQuestion);
  const handleAddQuestion = () => {};

  const tags = [
    "arrays",
    "heap",
    "two pointers",
    "sliding window",
    "stack",
    "binary search",
    "linked list",
    "trees",
    "backtracking",
    "tries",
    "graphs",
    "advanced graphs",
    "dp 1d",
    "dp 2d",
    "dp 3d",
    "dp 4d",
    "dp 5d",
    "dp 6d",
    "dp 7d",
    "dp 8d",
    "dp 9d",
    "dp 10d",
  ];

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
            <Select
              value={newQuestion.difficulty}
              onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                setNewQuestion({ ...newQuestion, difficulty: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={newQuestion.tags.includes(index.toString())}
                      onCheckedChange={(checked) => {
                        const newTags = checked
                          ? [...newQuestion.tags, index.toString()]
                          : newQuestion.tags.filter(
                              (t) => t !== index.toString()
                            );
                        setNewQuestion({ ...newQuestion, tags: newTags });
                      }}
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleAddQuestion} className="flex-1">
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddQuestion(false)}
                className="flex-1"
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
