import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// Export a named function for the POST method
export async function POST(req: NextRequest) {
  try {
    const { id, name, email, imageUrl } = await req.json();

    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      await prisma.users.create({
        data: {
          id,
          userId: id,
          name,
          email,
          imageUrl,
        },
      });
    }

    return NextResponse.json({ message: "User added successfully" });
  } catch (error) {
    console.error("Failed to add user:", error);
    return NextResponse.json(
      { message: "Failed to add user" },
      { status: 500 }
    );
  }
}
