import { QuestionDTO } from "./types";

export async function fetchQuestionsApi(params?: {
  difficulty?: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  starred?: boolean;
  tagId?: string;
}) {
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
  return data.questions as QuestionDTO[];
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
