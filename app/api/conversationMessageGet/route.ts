import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const conversationID = url.searchParams.get("conversationID");
  const userId = url.searchParams.get("userId");

  if (!conversationID || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 401 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationID as string
      },
      orderBy: {
        timestamp: "asc", // to sort messages by the time they were created
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return NextResponse.json(
      { message: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}