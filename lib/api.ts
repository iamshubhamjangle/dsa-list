import { QuestionDTO, TagDTO } from "./types";

// Questions API
export async function fetchQuestionsApi(params?: {
  difficulty?: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  starred?: boolean;
  tagId?: string;
}): Promise<QuestionDTO[]> {
  const url = new URL("/api/questions", window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }
  const data = await res.json();
  return data.questions;
}

export async function toggleQuestionCompleteApi(
  id: string,
  completed: boolean
): Promise<QuestionDTO> {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) {
    throw new Error("Failed to update question");
  }

  const data = await res.json();
  return data.question;
}

export async function toggleQuestionStarredApi(
  id: string,
  starred: boolean
): Promise<QuestionDTO> {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ starred }),
  });

  if (!res.ok) {
    throw new Error("Failed to update question");
  }

  const data = await res.json();
  return data.question;
}

export async function resetProgressApi(): Promise<void> {
  const res = await fetch("/api/questions/progress", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to reset progress");
  }

  return;
}

export async function updateQuestionApi(
  id: string,
  data: {
    name?: string;
    url?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    tagIds?: string[];
    notes?: string;
  }
): Promise<QuestionDTO> {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update question");
  }

  const response = await res.json();
  return response.question;
}

export async function deleteQuestionApi(id: string): Promise<void> {
  const res = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete question");
  }
}

// Tags API
export async function createTagApi(data: {
  name: string;
  color: string;
  description?: string;
}): Promise<TagDTO> {
  const res = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create tag");
  }

  const response = await res.json();
  return response.tag;
}

export async function fetchTagsApi(): Promise<TagDTO[]> {
  const res = await fetch("/api/tags", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.tags;
}

export async function updateTagApi(
  id: string,
  data: {
    name?: string;
    color?: string;
    description?: string;
  }
): Promise<TagDTO> {
  const res = await fetch(`/api/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update tag");
  }

  const response = await res.json();
  return response.tag;
}

export async function deleteTagApi(id: string): Promise<void> {
  const res = await fetch(`/api/tags/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete tag");
  }
}

export async function createQuestionApi(data: {
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tagIds?: string[];
  notes?: string;
}): Promise<QuestionDTO> {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create question");
  }

  const response = await res.json();
  return response.question;
}

// Batch Upload Types
export interface BatchQuestionInput {
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  starred?: boolean;
  tags?: string[]; // Tag names
  rowNumber: number;
}

export interface BatchUploadResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    rowNumber: number;
    name: string;
    error: string;
  }>;
  message?: string;
}

export async function batchUploadQuestionsApi(
  questions: BatchQuestionInput[]
): Promise<BatchUploadResult> {
  const res = await fetch("/api/questions/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ questions }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to batch upload questions");
  }

  return data;
}
