import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const MAX_BATCH_SIZE = 150; // Increased from 100 for faster imports
const MAX_QUESTIONS_PER_USER = 500;

interface BatchQuestionInput {
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  starred?: boolean;
  tags?: string[]; // Tag names
  rowNumber: number; // For error reporting
}

interface BatchUploadResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    rowNumber: number;
    name: string;
    error: string;
  }>;
  message?: string;
}

// POST /api/questions/batch - Batch upload questions
export async function POST(
  request: NextRequest
): Promise<NextResponse<BatchUploadResult>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questions } = body as { questions: BatchQuestionInput[] };

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: "Invalid request: questions array required",
        },
        { status: 400 }
      );
    }

    // Validate batch size
    if (questions.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: `Batch size exceeds limit. Maximum ${MAX_BATCH_SIZE} questions per batch.`,
        },
        { status: 400 }
      );
    }

    // Check current question count for user
    const currentQuestionCount = await prisma.question.count({
      where: { userId: session.user.id },
    });

    if (currentQuestionCount >= MAX_QUESTIONS_PER_USER) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: `Question limit reached. Maximum ${MAX_QUESTIONS_PER_USER} questions allowed per user.`,
        },
        { status: 400 }
      );
    }

    const remainingSlots = MAX_QUESTIONS_PER_USER - currentQuestionCount;
    if (questions.length > remainingSlots) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: `Cannot upload ${questions.length} questions. Only ${remainingSlots} slots remaining (limit: ${MAX_QUESTIONS_PER_USER}).`,
        },
        { status: 400 }
      );
    }

    // Get all user's tags for lookup
    const userTags = await prisma.tag.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    });

    // Create case-insensitive tag name to ID map
    const tagMap = new Map(
      userTags.map((tag) => [tag.name.toLowerCase().trim(), tag.id])
    );

    const errors: BatchUploadResult["errors"] = [];
    let successCount = 0;

    // Process each question
    for (const question of questions) {
      try {
        // Validate required fields
        if (!question.name || !question.url || !question.difficulty) {
          errors.push({
            rowNumber: question.rowNumber,
            name: question.name || "Unknown",
            error: "Missing required fields (name, url, or difficulty)",
          });
          continue;
        }

        // Validate difficulty
        if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) {
          errors.push({
            rowNumber: question.rowNumber,
            name: question.name,
            error: `Invalid difficulty: ${question.difficulty}`,
          });
          continue;
        }

        // Process tags
        const tagIds: string[] = [];
        if (question.tags && question.tags.length > 0) {
          const invalidTags: string[] = [];

          for (const tagName of question.tags) {
            const trimmedTag = tagName.trim();
            const tagId = tagMap.get(trimmedTag.toLowerCase());

            if (tagId) {
              tagIds.push(tagId);
            } else {
              invalidTags.push(tagName);
            }
          }

          if (invalidTags.length > 0) {
            errors.push({
              rowNumber: question.rowNumber,
              name: question.name,
              error: `Tag(s) not found: ${invalidTags.join(", ")}`,
            });
            continue;
          }
        }

        // Create question
        await prisma.question.create({
          data: {
            name: question.name,
            url: question.url,
            difficulty: question.difficulty,
            completed: question.completed ?? false,
            starred: question.starred ?? false,
            userId: session.user.id,
            questionTags:
              tagIds.length > 0
                ? {
                    create: tagIds.map((tagId) => ({
                      tagId,
                    })),
                  }
                : undefined,
          },
        });

        successCount++;
      } catch (error) {
        console.error(
          `Error creating question at row ${question.rowNumber}:`,
          error
        );
        errors.push({
          rowNumber: question.rowNumber,
          name: question.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        totalProcessed: questions.length,
        successCount,
        errorCount: errors.length,
        errors,
        message: `Successfully uploaded ${successCount} question(s). ${errors.length} error(s).`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in batch upload:", error);
    return NextResponse.json(
      {
        success: false,
        totalProcessed: 0,
        successCount: 0,
        errorCount: 0,
        errors: [],
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
