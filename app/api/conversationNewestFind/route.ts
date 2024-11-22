import { NextResponse } from "next/server"; // Importing NextResponse
import prisma from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = getAuth(req);
  
  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { message: "User ID is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    const newestConversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!newestConversation) {
      return NextResponse.json(
        { message: "No conversation found for this user" },
        { status: 200 }
      );
    }

    return NextResponse.json({ conversation: newestConversation }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
