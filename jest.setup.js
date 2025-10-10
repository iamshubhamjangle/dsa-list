// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock next-auth providers
jest.mock("next-auth/providers/google", () => ({
  default: jest.fn(() => ({
    id: "google",
    name: "Google",
  })),
}));

// Mock Prisma adapter
jest.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: jest.fn(),
}));

// Mock Prisma client
jest.mock("./lib/db", () => ({
  prisma: {
    question: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    questionTag: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Set up test environment variables
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
