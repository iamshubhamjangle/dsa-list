import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET /api/questions/[id] - Get a specific question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const question = await prisma.question.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        questionTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Transform the data to include tags array
    const questionWithTags = {
      ...question,
      tags: question.questionTags.map((qt) => qt.tag),
    };

    return NextResponse.json({ question: questionWithTags });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/questions/[id] - Update a specific question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      url,
      difficulty,
      completed,
      starred,
      notes,
      timeSpent,
      tagIds,
    } = body;

    // Check if question exists and belongs to user
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Prisma.QuestionUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (difficulty !== undefined) {
      if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        return NextResponse.json(
          { message: "Invalid difficulty level" },
          { status: 400 }
        );
      }
      updateData.difficulty = difficulty;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed && !existingQuestion.completed) {
        updateData.solvedAt = new Date();
      } else if (!completed && existingQuestion.completed) {
        updateData.solvedAt = null;
      }
    }
    if (starred !== undefined) updateData.starred = starred;
    if (notes !== undefined) updateData.notes = notes;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;

    // Update question and handle tags
    const question = await prisma.$transaction(async (tx) => {
      // Update the question
      await tx.question.update({
        where: { id: params.id },
        data: updateData,
      });

      // Handle tag updates if tagIds provided
      if (tagIds !== undefined) {
        // Remove existing question-tag relationships
        await tx.questionTag.deleteMany({
          where: { questionId: params.id },
        });

        // Create new question-tag relationships
        if (tagIds.length > 0) {
          await tx.questionTag.createMany({
            data: tagIds.map((tagId: string) => ({
              questionId: params.id,
              tagId,
            })),
          });
        }
      }

      // Return the updated question with tags
      return await tx.question.findUnique({
        where: { id: params.id },
        include: {
          questionTags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });

    // Transform the data to include tags array
    const questionWithTags = {
      ...question,
      tags: question?.questionTags.map((qt) => qt.tag),
    };

    return NextResponse.json({ question: questionWithTags });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - Delete a specific question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if question exists and belongs to user
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Delete the question (cascade will handle questionTags)
    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
