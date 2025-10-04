import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { GET, POST } from "../../app/api/questions/route";
import {
  GET as GET_BY_ID,
  PUT,
  DELETE,
} from "../../app/api/questions/[id]/route";
import { prisma } from "../../lib/db";
import { Question } from "@prisma/client";

// Mock the dependencies
jest.mock("next-auth");
jest.mock("../../lib/db");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("/api/questions", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: mockUser,
      expires: new Date().toISOString(),
    });
  });

  describe("GET /api/questions", () => {
    it("should return questions for authenticated user", async () => {
      const mockQuestions = [
        {
          id: "q1",
          name: "Two Sum",
          url: "https://leetcode.com/problems/two-sum/",
          difficulty: "Easy",
          completed: false,
          starred: false,
          notes: null,
          timeSpent: null,
          solvedAt: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          questionTags: [
            {
              tag: {
                id: "t1",
                name: "Array",
                color: "#3B82F6",
                description: "Array problems",
              },
            },
          ],
        },
      ];

      (mockPrisma.question.findMany as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      const request = new NextRequest("http://localhost:3000/api/questions");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.questions).toHaveLength(1);
      expect(data.questions[0].name).toBe("Two Sum");
      expect(data.questions[0].tags).toHaveLength(1);
      expect(data.questions[0].tags[0].name).toBe("Array");
    });

    it("should return 401 for unauthenticated user", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/questions");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Unauthorized");
    });

    it("should filter questions by difficulty", async () => {
      const mockQuestions = [] as Question[];
      (mockPrisma.question.findMany as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      const request = new NextRequest(
        "http://localhost:3000/api/questions?difficulty=Easy"
      );
      await GET(request);

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          difficulty: "Easy",
        },
        include: {
          questionTags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  describe("POST /api/questions", () => {
    it("should create a new question", async () => {
      const mockQuestion = {
        id: "q2",
        name: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
        completed: false,
        starred: false,
        notes: null,
        timeSpent: null,
        solvedAt: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        questionTags: [
          {
            tag: {
              id: "t2",
              name: "Linked List",
              color: "#10B981",
              description: "Linked list problems",
            },
          },
        ],
      };

      (mockPrisma.question.create as jest.Mock).mockResolvedValue(mockQuestion);

      const requestBody = {
        name: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
        tagIds: ["t2"],
      };

      const request = new NextRequest("http://localhost:3000/api/questions", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.question.name).toBe("Add Two Numbers");
      expect(data.question.difficulty).toBe("Medium");
    });

    it("should return 400 for missing required fields", async () => {
      const requestBody = {
        name: "Test Question",
        // Missing url and difficulty
      };

      const request = new NextRequest("http://localhost:3000/api/questions", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe(
        "Missing required fields: name, url, difficulty"
      );
    });

    it("should return 400 for invalid difficulty", async () => {
      const requestBody = {
        name: "Test Question",
        url: "https://example.com",
        difficulty: "Invalid",
      };

      const request = new NextRequest("http://localhost:3000/api/questions", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid difficulty level");
    });
  });
});

describe("/api/questions/[id]", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: mockUser,
      expires: new Date().toISOString(),
    });
  });

  describe("GET /api/questions/[id]", () => {
    it("should return a specific question", async () => {
      const mockQuestion = {
        id: "q1",
        name: "Two Sum",
        url: "https://leetcode.com/problems/two-sum/",
        difficulty: "Easy",
        completed: false,
        starred: false,
        notes: null,
        timeSpent: null,
        solvedAt: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        questionTags: [
          {
            tag: {
              id: "t1",
              name: "Array",
              color: "#3B82F6",
            },
          },
        ],
      };

      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(
        mockQuestion
      );

      const params = { id: "q1" };
      const request = new NextRequest("http://localhost:3000/api/questions/q1");
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.question.name).toBe("Two Sum");
    });

    it("should return 404 for non-existent question", async () => {
      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(null);

      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/questions/non-existent"
      );
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Question not found");
    });
  });

  describe("PUT /api/questions/[id]", () => {
    it("should update a question", async () => {
      const existingQuestion = {
        id: "q1",
        name: "Two Sum",
        completed: false,
        userId: "user-1",
      };

      const updatedQuestion = {
        ...existingQuestion,
        name: "Updated Two Sum",
        completed: true,
        solvedAt: new Date(),
        questionTags: [],
      };

      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(
        existingQuestion
      );
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrisma);
      });
      (mockPrisma.question.findUnique as jest.Mock).mockResolvedValue(
        updatedQuestion
      );

      const requestBody = {
        name: "Updated Two Sum",
        completed: true,
      };

      const params = { id: "q1" };
      const request = new NextRequest(
        "http://localhost:3000/api/questions/q1",
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.question.name).toBe("Updated Two Sum");
    });

    it("should return 404 for non-existent question", async () => {
      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(null);

      const requestBody = { name: "Updated Name" };
      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/questions/non-existent",
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Question not found");
    });
  });

  describe("DELETE /api/questions/[id]", () => {
    it("should delete a question", async () => {
      const existingQuestion = {
        id: "q1",
        name: "Two Sum",
        userId: "user-1",
      };

      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(
        existingQuestion
      );
      (mockPrisma.question.delete as jest.Mock).mockResolvedValue(
        existingQuestion
      );

      const params = { id: "q1" };
      const request = new NextRequest(
        "http://localhost:3000/api/questions/q1",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Question deleted successfully");
    });

    it("should return 404 for non-existent question", async () => {
      (mockPrisma.question.findFirst as jest.Mock).mockResolvedValue(null);

      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/questions/non-existent",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Question not found");
    });
  });
});
