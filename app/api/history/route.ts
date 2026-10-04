import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Returns the analysis history of the signed-in user only
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to see your history." },
        { status: 401 }
      );
    }

    const history = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("API /api/history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load history." },
      { status: 500 }
    );
  }
}