import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    console.log("content",body)
  const { conversationId, sender, content } = body;

  if (!conversationId || !sender || !content) {
    return NextResponse.json(
        { message: "Missing required fields" },
        { status: 401 }
      );
  }

  try {
      await prisma.message.create({
        data: {
          conversationId: conversationId,
          sender,
          content,
        },
      });

    return NextResponse.json(
        { message: "Message added to conversation" },
        { status: 200 }
      );
  } catch (error) {
    console.error("Failed to store message:", error);
    return NextResponse.json(
        { message: "Failed to store message" },
        { status: 500 }
      );
  }
}
