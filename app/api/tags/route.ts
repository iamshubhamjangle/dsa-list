import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "@/lib/constants";

// GET /api/tags - Get all tags for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            questionTags: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, color, description } = body;

    if (!name || !color) {
      return NextResponse.json(
        { message: "Missing required fields: name, color" },
        { status: 400 }
      );
    }

    // Check if tag with same name already exists for this user
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: name,
        userId: session.user.id,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "Tag with this name already exists" },
        { status: 400 }
      );
    }

    // Validate color - default to green if not in allowed list
    const validColor = (TAG_COLORS as readonly string[]).includes(color)
      ? color
      : DEFAULT_TAG_COLOR;

    const tag = await prisma.tag.create({
      data: {
        name,
        color: validColor,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
