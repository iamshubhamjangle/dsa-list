import { QuestionDTO } from "./types";

export async function fetchQuestions(params?: {
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

// Future: Add mutation functions (createQuestion, updateQuestion, etc.) and cache helpers here for scalability.
