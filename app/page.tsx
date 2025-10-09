"use client";

import { useState, useEffect } from "react";
import { Question, Tag, StudyOptions } from "@/lib/types";
import {
  getQuestions,
  getTags,
  getProgress,
  saveProgress,
  getStudyOptions,
  saveStudyOptions,
} from "@/lib/storage";
import { Header } from "@/components/home/header";
import { Progress } from "@/components/home/progress";
import { Questions } from "@/components/home/questions";

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [progress, setProgress] = useState<
    Record<string, { completed: boolean; starred: boolean }>
  >({});
  const [studyOptions, setStudyOptions] = useState<StudyOptions>({
    showDifficulty: true,
    randomize: false,
    categoryWise: true,
    allFolded: false,
    starred: false,
  });
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  // Store random order for session
  const [randomOrder, setRandomOrder] = useState<string[] | null>(null);

  useEffect(() => {
    const storedQuestions = getQuestions();
    const storedTags = getTags();
    const storedProgress = getProgress();
    const storedOptions = getStudyOptions();

    setQuestions(storedQuestions);
    setTags(storedTags);
    setProgress(storedProgress);
    setStudyOptions(storedOptions);

    // Initialize expanded tags
    if (storedOptions.allFolded) {
      setExpandedTags(new Set());
    } else {
      setExpandedTags(new Set(storedTags.map((tag) => tag.id)));
    }
  }, []);

  // Reset random order if questions change or randomize is turned off
  useEffect(() => {
    if (!studyOptions.randomize) {
      setRandomOrder(null);
    } else if (studyOptions.randomize && questions.length > 0 && !randomOrder) {
      setRandomOrder(
        [...questions.map((q) => q.id)].sort(() => Math.random() - 0.5)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, studyOptions.randomize]);

  const toggleTagExpansion = (tagId: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedTags(newExpanded);
  };

  const toggleAllFolded = () => {
    // Only allow folding/unfolding in categoryWise mode
    if (!studyOptions.categoryWise) return;
    const newAllFolded = !studyOptions.allFolded;
    const newOptions = { ...studyOptions, allFolded: newAllFolded };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);

    if (newAllFolded) {
      setExpandedTags(new Set());
    } else {
      setExpandedTags(new Set(tags.map((tag) => tag.id)));
    }
  };

  const toggleDifficulty = () => {
    const newOptions = {
      ...studyOptions,
      showDifficulty: !studyOptions.showDifficulty,
    };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
  };

  const toggleRandomize = () => {
    const newRandomize = !studyOptions.randomize;
    const newOptions = { ...studyOptions, randomize: newRandomize };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
    if (newRandomize) {
      setRandomOrder(
        [...questions.map((q) => q.id)].sort(() => Math.random() - 0.5)
      );
    } else {
      setRandomOrder(null);
    }
  };

  const toggleCategoryWise = () => {
    const newCategoryWise = !studyOptions.categoryWise;
    const newOptions = {
      ...studyOptions,
      categoryWise: newCategoryWise,
    };
    // If switching to non-categoryWise, force allFolded to false
    if (!newCategoryWise) {
      newOptions.allFolded = false;
    }
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
    // If switching to non-categoryWise, set expandedTags to only show 'all'
    if (!newCategoryWise) {
      setExpandedTags(new Set(["all"]));
    } else {
      setExpandedTags(new Set(tags.map((tag) => tag.id)));
    }
  };

  const resetProgress = () => {
    if (
      confirm(
        "Are you sure you want to reset all progress? This will uncheck all completed questions."
      )
    ) {
      setProgress({});
      saveProgress({});
    }
  };

  const toggleStarred = () => {
    const newOptions = { ...studyOptions, starred: !studyOptions.starred };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
  };

  const toggleQuestionCompleted = (questionId: string) => {
    const currentProgress = progress[questionId] || {
      completed: false,
      starred: false,
    };
    const newProgress = {
      ...currentProgress,
      completed: !currentProgress.completed,
    };

    const updatedProgress = { ...progress, [questionId]: newProgress };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const toggleQuestionStarred = (questionId: string) => {
    const currentProgress = progress[questionId] || {
      completed: false,
      starred: false,
    };
    const newProgress = {
      ...currentProgress,
      starred: !currentProgress.starred,
    };

    const updatedProgress = { ...progress, [questionId]: newProgress };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const getQuestionsForTag = (tagId: string) => {
    // Ensure tagId and q.tags are both strings and compared as such
    let tagQuestions = questions.filter((q) =>
      q.tags?.some((tag) => tag.id === tagId)
    );

    // Filter by starred if needed
    if (studyOptions.starred) {
      tagQuestions = tagQuestions.filter((q) => progress[q.id]?.starred);
    }

    if (studyOptions.randomize && randomOrder) {
      tagQuestions = randomOrder
        .map((id) => tagQuestions.find((q) => q.id === id))
        .filter((q): q is Question => !!q);
    }
    return tagQuestions;
  };

  const getFilteredQuestions = () => {
    if (studyOptions.categoryWise) {
      return tags
        .map((tagDetails) => ({
          tag: tagDetails,
          questions: getQuestionsForTag(tagDetails.id),
        }))
        .filter((group) => group.questions.length > 0);
    } else {
      let allQuestions = [...questions];
      // Filter by starred if needed
      if (studyOptions.starred) {
        allQuestions = allQuestions.filter((q) => progress[q.id]?.starred);
      }
      if (studyOptions.randomize && randomOrder) {
        allQuestions = randomOrder
          .map((id) => allQuestions.find((q) => q.id === id))
          .filter((q): q is Question => !!q);
      }
      return [
        {
          tag: { id: "all", name: "All Questions", color: "bg-gray-500" },
          questions: allQuestions,
        },
      ];
    }
  };

  const getQuestionProgress = (questionId: string) => {
    return progress[questionId] || { completed: false, starred: false };
  };

  const getCompletedCount = () => {
    return Object.values(progress).filter((p) => p.completed).length;
  };

  const getTotalCount = () => questions.length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Header
        studyOptions={studyOptions}
        toggleDifficulty={toggleDifficulty}
        toggleRandomize={toggleRandomize}
        toggleCategoryWise={toggleCategoryWise}
        toggleAllFolded={toggleAllFolded}
        toggleStarred={toggleStarred}
        resetProgress={resetProgress}
      />

      <Progress
        questions={
          studyOptions.starred
            ? questions.filter((q) => progress[q.id]?.starred)
            : questions
        }
        progress={progress}
      />

      <Questions
        questions={questions}
        tags={tags}
        progress={progress}
        studyOptions={studyOptions}
        expandedTags={expandedTags}
        toggleTagExpansion={toggleTagExpansion}
        toggleQuestionCompleted={toggleQuestionCompleted}
        toggleQuestionStarred={toggleQuestionStarred}
        randomOrder={randomOrder}
      />
    </div>
  );
}
