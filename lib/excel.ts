import { Question, UploadedData } from "./types";

export const processExcelData = (data: UploadedData[]): Question[] => {
  return [];
  /*
  return data.map((row, index) => {
    // Use the title from CSV instead of generating from URL
    const questionName = row.title.trim();

    // Parse tags - handle both comma-separated and single tag formats
    const tags = row.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    // Validate difficulty
    const difficulty = ["Easy", "Medium", "Hard"].includes(row.difficulty)
      ? (row.difficulty as "Easy" | "Medium" | "Hard")
      : "Medium";

    return {
      id: `question-${Date.now()}-${index}`,
      name: questionName,
      url: row.url,
      difficulty,
      tags,
      completed: false,
      starred: false,
    };
  });*/
};

export const parseCSV = (csvText: string): UploadedData[] => {
  return [];
  /*
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const data: UploadedData[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header.toLowerCase()] = values[index] || "";
    });

    // Check for required fields: title, url, difficulty, tags
    if (row.title && row.url && row.difficulty && row.tags) {
      data.push({
        title: row.title,
        url: row.url,
        difficulty: row.difficulty,
        tags: row.tags,
      });
    }
  }

  return data;
  */
};
