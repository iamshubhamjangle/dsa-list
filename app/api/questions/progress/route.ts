import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/questions/progress - Reset all progress (completed and starred)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset all questions for the user
    await prisma.question.updateMany({
      where: {
        userId: session.user.id,
      },
      data: {
        completed: false,
        starred: false,
        solvedAt: null,
      },
    });

    return NextResponse.json({ message: "Progress reset successfully" });
  } catch (error) {
    console.error("Failed to reset progress:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}
