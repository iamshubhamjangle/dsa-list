import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { GET, POST } from "../../app/api/tags/route";
import { GET as GET_BY_ID, PUT, DELETE } from "../../app/api/tags/[id]/route";
import { prisma } from "../../lib/db";

// Mock the dependencies
jest.mock("next-auth");
jest.mock("../../lib/db");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("/api/tags", () => {
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

  describe("GET /api/tags", () => {
    it("should return tags for authenticated user", async () => {
      const mockTags = [
        {
          id: "t1",
          name: "Array",
          color: "#3B82F6",
          description: "Array problems",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            questionTags: 5,
          },
        },
        {
          id: "t2",
          name: "Linked List",
          color: "#10B981",
          description: "Linked list problems",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            questionTags: 3,
          },
        },
      ];

      (mockPrisma.tag.findMany as jest.Mock).mockResolvedValue(mockTags);

      const request = new NextRequest("http://localhost:3000/api/tags");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tags).toHaveLength(2);
      expect(data.tags[0].name).toBe("Array");
      expect(data.tags[1].name).toBe("Linked List");
      expect(data.tags[0]._count.questionTags).toBe(5);
    });

    it("should return 401 for unauthenticated user", async () => {
      (mockGetServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/tags");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Unauthorized");
    });
  });

  describe("POST /api/tags", () => {
    it("should create a new tag", async () => {
      const mockTag = {
        id: "t3",
        name: "Dynamic Programming",
        color: "#F59E0B",
        description: "DP problems",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(null); // No existing tag
      (mockPrisma.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const requestBody = {
        name: "Dynamic Programming",
        color: "#F59E0B",
        description: "DP problems",
      };

      const request = new NextRequest("http://localhost:3000/api/tags", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.tag.name).toBe("Dynamic Programming");
      expect(data.tag.color).toBe("#F59E0B");
    });

    it("should return 400 for missing required fields", async () => {
      const requestBody = {
        name: "Test Tag",
        // Missing color
      };

      const request = new NextRequest("http://localhost:3000/api/tags", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Missing required fields: name, color");
    });

    it("should return 400 for duplicate tag name", async () => {
      const existingTag = {
        id: "t1",
        name: "Array",
        color: "#3B82F6",
        userId: "user-1",
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(existingTag);

      const requestBody = {
        name: "Array",
        color: "#3B82F6",
      };

      const request = new NextRequest("http://localhost:3000/api/tags", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Tag with this name already exists");
    });
  });
});

describe("/api/tags/[id]", () => {
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

  describe("GET /api/tags/[id]", () => {
    it("should return a specific tag", async () => {
      const mockTag = {
        id: "t1",
        name: "Array",
        color: "#3B82F6",
        description: "Array problems",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          questionTags: 5,
        },
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(mockTag);

      const params = { id: "t1" };
      const request = new NextRequest("http://localhost:3000/api/tags/t1");
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tag.name).toBe("Array");
      expect(data.tag._count.questionTags).toBe(5);
    });

    it("should return 404 for non-existent tag", async () => {
      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(null);

      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/tags/non-existent"
      );
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Tag not found");
    });
  });

  describe("PUT /api/tags/[id]", () => {
    it("should update a tag", async () => {
      const existingTag = {
        id: "t1",
        name: "Array",
        color: "#3B82F6",
        userId: "user-1",
      };

      const updatedTag = {
        ...existingTag,
        name: "Updated Array",
        color: "#EF4444",
        _count: {
          questionTags: 5,
        },
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(existingTag);
      (mockPrisma.tag.update as jest.Mock).mockResolvedValue(updatedTag);

      const requestBody = {
        name: "Updated Array",
        color: "#EF4444",
      };

      const params = { id: "t1" };
      const request = new NextRequest("http://localhost:3000/api/tags/t1", {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tag.name).toBe("Updated Array");
      expect(data.tag.color).toBe("#EF4444");
    });

    it("should return 404 for non-existent tag", async () => {
      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(null);

      const requestBody = { name: "Updated Name" };
      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/tags/non-existent",
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
      expect(data.message).toBe("Tag not found");
    });

    it("should return 400 for duplicate tag name", async () => {
      const existingTag = {
        id: "t1",
        name: "Array",
        color: "#3B82F6",
        userId: "user-1",
      };

      const duplicateTag = {
        id: "t2",
        name: "Updated Array",
        color: "#EF4444",
        userId: "user-1",
      };

      (mockPrisma.tag.findFirst as jest.Mock)
        .mockResolvedValueOnce(existingTag) // First call for existing tag check
        .mockResolvedValueOnce(duplicateTag); // Second call for duplicate check

      const requestBody = {
        name: "Updated Array", // This name already exists
      };

      const params = { id: "t1" };
      const request = new NextRequest("http://localhost:3000/api/tags/t1", {
        method: "PUT",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Tag with this name already exists");
    });
  });

  describe("DELETE /api/tags/[id]", () => {
    it("should delete a tag", async () => {
      const existingTag = {
        id: "t1",
        name: "Array",
        userId: "user-1",
        _count: {
          questionTags: 0,
        },
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(existingTag);
      (mockPrisma.tag.delete as jest.Mock).mockResolvedValue(existingTag);

      const params = { id: "t1" };
      const request = new NextRequest("http://localhost:3000/api/tags/t1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Tag deleted successfully");
    });

    it("should return 404 for non-existent tag", async () => {
      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(null);

      const params = { id: "non-existent" };
      const request = new NextRequest(
        "http://localhost:3000/api/tags/non-existent",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("Tag not found");
    });

    it("should return 400 when tag is in use", async () => {
      const existingTag = {
        id: "t1",
        name: "Array",
        userId: "user-1",
        _count: {
          questionTags: 5, // Tag is being used by 5 questions
        },
      };

      (mockPrisma.tag.findFirst as jest.Mock).mockResolvedValue(existingTag);

      const params = { id: "t1" };
      const request = new NextRequest("http://localhost:3000/api/tags/t1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe(
        "Cannot delete tag. It is being used by questions. Remove the tag from questions first."
      );
    });
  });
});
