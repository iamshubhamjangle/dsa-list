// Question templates for quick import

export interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

// Available templates
export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: "google-266",
    name: "Google-266",
    description: "266 curated DSA questions for Google interviews",
    questionCount: 266,
  },
  // Add more templates here in the future
];
