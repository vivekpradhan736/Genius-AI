import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const newConversation = await prisma.conversation.create({
      data: {
        userId,
        conversationName: "New Chat",
      },
    });

    return NextResponse.json({ conversation: newConversation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json(
      { message: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
