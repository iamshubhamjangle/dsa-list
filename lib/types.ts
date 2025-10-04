export interface Question {
  id: string;
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  completed: boolean;
  starred: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface UploadedData {
  title: string;
  url: string;
  difficulty: string;
  tags: string;
}

export interface StudyOptions {
  showDifficulty: boolean;
  randomize: boolean;
  categoryWise: boolean;
  allFolded: boolean;
  starred: boolean;
}

export interface QuestionProgress {
  [questionId: string]: {
    completed: boolean;
    starred: boolean;
  };
}

// NextAuth type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
