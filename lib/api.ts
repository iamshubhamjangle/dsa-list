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
