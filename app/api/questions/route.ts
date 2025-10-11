import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { QuestionDTO } from "@/lib/types";

// GET /api/questions - Get all questions for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

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

    // Transform to QuestionDTO
    const questionsDTO = questions.map(
      (question): QuestionDTO => ({
        id: question.id,
        name: question.name,
        url: question.url,
        difficulty: question.difficulty as "Easy" | "Medium" | "Hard",
        completed: question.completed,
        starred: question.starred,
        notes: question.notes ?? undefined,
        timeSpent: question.timeSpent ?? undefined,
        solvedAt: question.solvedAt ? question.solvedAt.toISOString() : null,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString(),
        tags: question.questionTags.map((qt) => ({
          id: qt.tag.id,
          name: qt.tag.name,
          color: qt.tag.color,
          description: qt.tag.description ?? undefined,
        })),
      })
    );

    return NextResponse.json({ questions: questionsDTO });
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
