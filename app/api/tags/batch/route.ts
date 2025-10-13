import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "@/lib/constants";

const MAX_BATCH_SIZE = 50;

interface BatchTagInput {
  name: string;
  color: string;
  description?: string;
}

interface BatchCreateResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    name: string;
    error: string;
  }>;
  message?: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
    description: string | null;
  }>;
}

// POST /api/tags/batch - Batch create tags
export async function POST(
  request: NextRequest
): Promise<NextResponse<BatchCreateResult>> {
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
    const { tags } = body as { tags: BatchTagInput[] };

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: "Invalid request: tags array required",
        },
        { status: 400 }
      );
    }

    // Validate batch size
    if (tags.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          success: false,
          totalProcessed: 0,
          successCount: 0,
          errorCount: 0,
          errors: [],
          message: `Batch size exceeds limit. Maximum ${MAX_BATCH_SIZE} tags per batch.`,
        },
        { status: 400 }
      );
    }

    // Get existing tags for the user to avoid duplicates
    const existingTags = await prisma.tag.findMany({
      where: { userId: session.user.id },
      select: { name: true },
    });

    const existingTagNames = new Set(
      existingTags.map((tag) => tag.name.toLowerCase().trim())
    );

    const errors: BatchCreateResult["errors"] = [];
    const createdTags: BatchCreateResult["tags"] = [];
    let successCount = 0;

    // Process each tag
    for (const tag of tags) {
      try {
        // Validate required fields
        if (!tag.name || !tag.color) {
          errors.push({
            name: tag.name || "Unknown",
            error: "Missing required fields (name or color)",
          });
          continue;
        }

        // Check for duplicates
        const tagNameLower = tag.name.toLowerCase().trim();
        if (existingTagNames.has(tagNameLower)) {
          errors.push({
            name: tag.name,
            error: "Tag with this name already exists",
          });
          continue;
        }

        // Validate color - default to green if not in allowed list
        const validColor = (TAG_COLORS as readonly string[]).includes(tag.color)
          ? tag.color
          : DEFAULT_TAG_COLOR;

        // Create tag
        const createdTag = await prisma.tag.create({
          data: {
            name: tag.name.trim(),
            color: validColor,
            description: tag.description?.trim() || null,
            userId: session.user.id,
          },
        });

        createdTags.push({
          id: createdTag.id,
          name: createdTag.name,
          color: createdTag.color,
          description: createdTag.description,
        });

        // Add to existing set to prevent duplicates in same batch
        existingTagNames.add(tagNameLower);
        successCount++;
      } catch (error) {
        console.error(`Error creating tag ${tag.name}:`, error);
        errors.push({
          name: tag.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        totalProcessed: tags.length,
        successCount,
        errorCount: errors.length,
        errors,
        tags: createdTags,
        message: `Successfully created ${successCount} tag(s). ${errors.length} error(s).`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in batch tag creation:", error);
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
