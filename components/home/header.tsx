"use client";

import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Shuffle,
  GalleryVertical,
  FoldVertical,
  UnfoldVertical,
  RotateCcw,
  Star,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStudyOptionsStore } from "@/store/studyOptions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetProgressApi } from "@/lib/api";

export function Header() {
  const queryClient = useQueryClient();
  const {
    showDifficulty,
    randomize,
    categoryWise,
    allFolded,
    starred,
    toggleShowDifficulty,
    toggleRandomize,
    toggleCategoryWise,
    toggleAllFolded,
    toggleStarred,
  } = useStudyOptionsStore();

  const handleResetProgress = async () => {
    try {
      await resetProgressApi();
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Progress reset successfully!");
    } catch (error) {
      toast.error("Failed to reset progress");
      console.error("Reset progress error:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleShowDifficulty}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        {showDifficulty ? <Eye size={16} /> : <EyeOff size={16} />}
        <span>{showDifficulty ? "Hide" : "Show"} Difficulty</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleRandomize}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <Shuffle size={16} />
        <span>{randomize ? "Sequential" : "Random"} Order</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleCategoryWise}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <GalleryVertical size={16} />
        <span>{categoryWise ? "List" : "Category"} View</span>
      </Button>

      {categoryWise && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllFolded}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          {allFolded ? (
            <UnfoldVertical size={16} />
          ) : (
            <FoldVertical size={16} />
          )}
          <span>{allFolded ? "Expand All" : "Collapse All"}</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={toggleStarred}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <Star size={16} className={starred ? "fill-current" : ""} />
        <span>{starred ? "All Questions" : "Starred Only"}</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <RotateCcw size={16} />
            <span>Reset Progress</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all completion status and stars for all questions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetProgress}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
