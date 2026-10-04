import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// Deletes one analysis, but only if it belongs to the signed-in user
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing analysis id." },
        { status: 400 }
      );
    }

    // deleteMany with both id AND userId = deletes only the user's own record
    const result = await prisma.analysis.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: "Analysis not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /api/history/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete analysis." },
      { status: 500 }
    );
  }
}