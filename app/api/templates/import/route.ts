import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";

const MAX_QUESTIONS_PER_USER = 500;

interface TemplateQuestion {
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  starred?: boolean;
  tag: string; // Single tag string
}

interface ImportResult {
  success: boolean;
  message: string;
  questionsImported?: number;
  tagsCreated?: number;
}

// POST /api/templates/import - Import a template
export async function POST(
  request: NextRequest
): Promise<NextResponse<ImportResult>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { templateId } = body as { templateId: string };

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Template ID is required",
        },
        { status: 400 }
      );
    }

    // Map template IDs to file names
    const templateFiles: Record<string, string> = {
      "google-266": "GOOGLE-266.json",
    };

    const fileName = templateFiles[templateId];
    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found",
        },
        { status: 404 }
      );
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found in database",
        },
        { status: 404 }
      );
    }

    // Read template file from public directory
    const filePath = join(process.cwd(), "public", fileName);
    const fileContent = await readFile(filePath, "utf-8");
    const templateQuestions: TemplateQuestion[] = JSON.parse(fileContent);

    // Check if user already has questions
    const currentQuestionCount = await prisma.question.count({
      where: { userId: user.id },
    });

    if (currentQuestionCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have questions. Please delete existing questions before importing a template.",
        },
        { status: 400 }
      );
    }

    // Check total limit
    if (templateQuestions.length > MAX_QUESTIONS_PER_USER) {
      return NextResponse.json(
        {
          success: false,
          message: `Template has too many questions. Maximum ${MAX_QUESTIONS_PER_USER} allowed.`,
        },
        { status: 400 }
      );
    }

    // Get all user's tags
    const userTags = await prisma.tag.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    // Create a map of tag names to IDs (case-insensitive)
    const tagMap = new Map(
      userTags.map((tag) => [tag.name.toLowerCase().trim(), tag.id])
    );

    // Collect unique tags from template
    const uniqueTagNames = new Set<string>();
    templateQuestions.forEach((q) => {
      if (q.tag) {
        uniqueTagNames.add(q.tag.trim());
      }
    });

    // Check which tags need to be created
    const tagsToCreate: string[] = [];
    uniqueTagNames.forEach((tagName) => {
      if (!tagMap.has(tagName.toLowerCase())) {
        tagsToCreate.push(tagName);
      }
    });

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      let tagsCreatedCount = 0;

      // Create missing tags first
      if (tagsToCreate.length > 0) {
        // Get default color for tags (we'll use green as default)
        const defaultColor = "#10B981";

        // Create tags one by one to handle duplicates gracefully
        for (const tagName of tagsToCreate) {
          try {
            const createdTag = await tx.tag.create({
              data: {
                name: tagName,
                color: defaultColor,
                description: null,
                userId: user.id,
              },
            });

            // Add newly created tag to the map
            tagMap.set(createdTag.name.toLowerCase().trim(), createdTag.id);
            tagsCreatedCount++;
          } catch (error) {
            // Tag might already exist (race condition), try to find it
            console.log(`Tag "${tagName}" might already exist, fetching...`);
            const existingTag = await tx.tag.findFirst({
              where: {
                name: tagName,
                userId: user.id,
              },
            });

            if (existingTag) {
              tagMap.set(existingTag.name.toLowerCase().trim(), existingTag.id);
            } else {
              // Re-throw if it's not a duplicate error
              throw error;
            }
          }
        }
      }

      // Prepare questions with their tag relationships
      const questionsToCreate = templateQuestions
        .map((q) => {
          const tagId = q.tag ? tagMap.get(q.tag.toLowerCase().trim()) : null;

          return {
            name: q.name,
            url: q.url,
            difficulty: q.difficulty,
            completed: q.completed ?? false,
            starred: q.starred ?? false,
            userId: user.id,
            tagId: tagId || null, // Will use this to create QuestionTag entries
          };
        })
        .filter((q) => q.name && q.url); // Filter out any invalid entries

      // Create all questions
      const createdQuestions = await tx.question.createManyAndReturn({
        data: questionsToCreate.map((q) => ({
          name: q.name,
          url: q.url,
          difficulty: q.difficulty,
          completed: q.completed,
          starred: q.starred,
          userId: q.userId,
        })),
      });

      // Create QuestionTag relationships
      const questionTagsToCreate = createdQuestions
        .map((question, index) => {
          const originalQuestion = questionsToCreate[index];
          if (originalQuestion.tagId) {
            return {
              questionId: question.id,
              tagId: originalQuestion.tagId,
            };
          }
          return null;
        })
        .filter(
          (qt): qt is { questionId: string; tagId: string } => qt !== null
        );

      if (questionTagsToCreate.length > 0) {
        await tx.questionTag.createMany({
          data: questionTagsToCreate,
        });
      }

      return {
        questionsImported: createdQuestions.length,
        tagsCreated: tagsCreatedCount,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported ${result.questionsImported} questions${
          result.tagsCreated > 0
            ? ` and created ${result.tagsCreated} tags`
            : ""
        }`,
        questionsImported: result.questionsImported,
        tagsCreated: result.tagsCreated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing template:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
