import { Question, Tag, QuestionProgress, StudyOptions } from "./types";

const STORAGE_KEYS = {
  QUESTIONS: "problem-list-questions",
  TAGS: "problem-list-tags",
  PROGRESS: "problem-list-progress",
  STUDY_OPTIONS: "problem-list-study-options",
} as const;

// Default tags
const currentDate = new Date();

export const DEFAULT_TAGS: Tag[] = [
  {
    id: "tag-1755331013001",
    name: "Arrays",
    color: "bg-green-200",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331013002",
    name: "Heap",
    color: "bg-green-200",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331013586",
    name: "Two Pointers",
    color: "bg-green-200",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331023426",
    name: "Sliding Window",
    color: "bg-green-200",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331030842",
    name: "Stack",
    color: "bg-green-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331042314",
    name: "Binary Search",
    color: "bg-green-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331197882",
    name: "Linked List",
    color: "bg-green-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331207258",
    name: "Trees",
    color: "bg-green-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331227874",
    name: "Backtracking",
    color: "bg-red-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331234297",
    name: "Tries",
    color: "bg-red-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331241474",
    name: "Graphs",
    color: "bg-red-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331246026",
    name: "Advanced Graphs",
    color: "bg-red-300",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331250530",
    name: "DP 1D",
    color: "bg-red-400",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331254538",
    name: "DP 2D",
    color: "bg-red-400",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331260530",
    name: "Greedy",
    color: "bg-red-400",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331264842",
    name: "Intervals",
    color: "bg-red-400",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331275315",
    name: "Segment Tree",
    color: "bg-red-500",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331271499",
    name: "Math",
    color: "bg-red-500",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    id: "tag-1755331275314",
    name: "Bit Manipulation",
    color: "bg-red-500",
    createdAt: currentDate,
    updatedAt: currentDate,
  },
];

// Questions storage
export const getQuestions = (): Question[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestions = (questions: Question[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const addQuestion = (question: Question): void => {
  const questions = getQuestions();
  questions.push(question);
  saveQuestions(questions);
};

export const updateQuestion = (
  id: string,
  updates: Partial<Question>
): void => {
  const questions = getQuestions();
  const index = questions.findIndex((q) => q.id === id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...updates };
    saveQuestions(questions);
  }
};

export const deleteQuestion = (id: string): void => {
  const questions = getQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  saveQuestions(filtered);
};

// Tags storage
export const getTags = (): Tag[] => {
  if (typeof window === "undefined") return DEFAULT_TAGS;
  const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
  return stored ? JSON.parse(stored) : DEFAULT_TAGS;
};

export const saveTags = (tags: Tag[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export const addTag = (tag: Tag): void => {
  const tags = getTags();
  tags.push(tag);
  saveTags(tags);
};

export const updateTag = (id: string, updates: Partial<Tag>): void => {
  const tags = getTags();
  const index = tags.findIndex((t) => t.id === id);
  if (index !== -1) {
    tags[index] = { ...tags[index], ...updates };
    saveTags(tags);
  }
};

export const deleteTag = (id: string): void => {
  const tags = getTags();
  const filtered = tags.filter((t) => t.id !== id);
  saveTags(filtered);
};

// Progress storage
export const getProgress = (): QuestionProgress => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : {};
};

export const saveProgress = (progress: QuestionProgress): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const updateQuestionProgress = (
  questionId: string,
  updates: Partial<QuestionProgress[string]>
): void => {
  const progress = getProgress();
  progress[questionId] = { ...progress[questionId], ...updates };
  saveProgress(progress);
};

export const resetProgress = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

// Study options storage
export const getStudyOptions = () => {
  if (typeof window === "undefined")
    return {
      showDifficulty: true,
      randomize: false,
      categoryWise: true,
      allFolded: false,
    };
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_OPTIONS);
  return stored
    ? JSON.parse(stored)
    : {
        showDifficulty: true,
        randomize: false,
        categoryWise: true,
        allFolded: false,
      };
};

export const saveStudyOptions = (options: StudyOptions): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.STUDY_OPTIONS, JSON.stringify(options));
};
