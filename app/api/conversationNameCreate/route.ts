import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from "@/lib/prismadb";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const genAI = new GoogleGenerativeAI("AIzaSyCSDGHe_Lcceu5j_Ukvcwg117rJSutotQY");

export async function POST(req: Request) {
  try {
    // const { userId } = getAuth(req);
    const body = await req.json();
    console.log("🧪 2. The body: ", body);

    const { prompt, conversationID } = body;
    // messages = [firstMessage, ...messages];
    console.log("🧪 3. The Messages: ", prompt);

    if (!prompt) {
      return new NextResponse("Messages are required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired.", { status: 403})
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent( prompt );
      console.log("resultVivek",result.response?.text())
      const response = result?.response;
      const text = response?.text();

      if(!isPro) {
        await increaseApiLimit();
      }

      if (!conversationID || !text) {
        return NextResponse.json(
          { message: "Conversation ID and new name are required" },
          { status: 400 }
        );
      }

      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationID },
        data: { conversationName: text },
      });
      
      return NextResponse.json({ conversation: updatedConversation }, { status: 200 });
  } catch (error) {
    console.error("❌ (route.ts) [API_CONVERSATION_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}