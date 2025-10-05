import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET /api/tags/[id] - Get a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            questionTags: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ tag });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id] - Update a specific tag
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
    const { name, color, description } = body;

    // Check if tag exists and belongs to user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: Prisma.TagUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description;

    // If no fields provided, return a 400 so the client knows nothing will change
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Enforce ownership at update time to avoid race conditions where someone could
    // attempt to update by id directly. updateMany returns a count of affected rows.
    const result = await prisma.tag.updateMany({
      where: { id: params.id, userId: session.user.id },
      data: updateData,
    });

    if (result.count === 0) {
      // Either tag not found or doesn't belong to this user
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    // Fetch the updated tag with the _count include and return it
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            questionTags: true,
          },
        },
      },
    });

    return NextResponse.json({ tag });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete a specific tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if tag exists and belongs to user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            questionTags: true,
          },
        },
      },
    });

    if (!existingTag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    // Check if tag is being used by any questions
    if (existingTag._count.questionTags > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete tag. It is being used by questions. Remove the tag from questions first.",
        },
        { status: 400 }
      );
    }

    // Delete the tag enforcing ownership
    const deleted = await prisma.tag.deleteMany({
      where: { id: params.id, userId: session.user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
