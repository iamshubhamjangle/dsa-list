import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StudyOptions } from "@/lib/types";

interface StudyOptionsStore extends StudyOptions {
  toggleShowDifficulty: () => void;
  toggleRandomize: () => void;
  toggleCategoryWise: () => void;
  toggleAllFolded: () => void;
  toggleStarred: () => void;
  reset: () => void;
}

const initialState: StudyOptions = {
  showDifficulty: true,
  randomize: false,
  categoryWise: false,
  allFolded: false,
  starred: false,
};

export const useStudyOptionsStore = create<StudyOptionsStore>()(
  persist(
    (set) => ({
      ...initialState,
      toggleShowDifficulty: () =>
        set((state) => ({ showDifficulty: !state.showDifficulty })),
      toggleRandomize: () => set((state) => ({ randomize: !state.randomize })),
      toggleCategoryWise: () =>
        set((state) => ({ categoryWise: !state.categoryWise })),
      toggleAllFolded: () => set((state) => ({ allFolded: !state.allFolded })),
      toggleStarred: () => set((state) => ({ starred: !state.starred })),
      reset: () => set(initialState),
    }),
    {
      name: "study-options-storage", // localStorage key
    }
  )
);
