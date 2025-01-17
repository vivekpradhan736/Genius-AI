import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { message: "User ID is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    // Fetch all conversations for the given user, ordered by the latest createdAt
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: true, // Optionally include messages if you need them
      },
    });

    if (conversations.length === 0) {
      return NextResponse.json(
        { message: "No conversations found for this user" },
        { status: 200 }
      );
    }

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
