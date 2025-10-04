import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET /api/questions - Get all questions for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const completed = searchParams.get("completed");
    const starred = searchParams.get("starred");
    const tagId = searchParams.get("tagId");

    const where: Prisma.QuestionWhereInput = {
      userId: session.user.id,
    };

    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
      where.difficulty = difficulty as "Easy" | "Medium" | "Hard";
    }

    if (completed !== null) {
      where.completed = completed === "true";
    }

    if (starred !== null) {
      where.starred = starred === "true";
    }

    if (tagId) {
      where.questionTags = {
        some: {
          tagId: tagId,
        },
      };
    }

    const questions = await prisma.question.findMany({
      where,
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

    // Transform the data to include tags array
    const questionsWithTags = questions.map((question) => ({
      ...question,
      tags: question.questionTags.map((qt) => qt.tag),
    }));

    return NextResponse.json({ questions: questionsWithTags });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, difficulty, tagIds, notes } = body;

    if (!name || !url || !difficulty) {
      return NextResponse.json(
        { message: "Missing required fields: name, url, difficulty" },
        { status: 400 }
      );
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return NextResponse.json(
        { message: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    // Create the question with tags
    const question = await prisma.question.create({
      data: {
        name,
        url,
        difficulty,
        notes,
        userId: session.user.id,
        questionTags: tagIds
          ? {
              create: tagIds.map((tagId: string) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        questionTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Transform the data to include tags array
    const questionWithTags = {
      ...question,
      tags: question.questionTags.map((qt) => qt.tag),
    };

    return NextResponse.json({ question: questionWithTags }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
