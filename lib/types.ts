// DTOs for API responses (safe for client/server, no Prisma types)
export interface TagDTO {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface QuestionDTO {
  id: string;
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  starred: boolean;
  notes?: string;
  timeSpent?: number;
  solvedAt?: string | null; // ISO string for date
  createdAt: string; // ISO string for date
  updatedAt: string; // ISO string for date
  tags: TagDTO[];
}
export interface Question {
  id: string;
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  starred: boolean;
  notes?: string;
  timeSpent?: number;
  solvedAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
  questionTags?: QuestionTag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionTag {
  id: string;
  questionId: string;
  tagId: string;
  question?: Question;
  tag?: Tag;
}

export interface UploadedData {
  title: string;
  url: string;
  difficulty: string;
  tags: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
