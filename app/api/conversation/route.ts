import { getAuth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const firstMessage = {
  role: "user",
  content: "Please provide all your responses in markdown format.",
};

const genAI = new GoogleGenerativeAI("AIzaSyB0OTIRRkEN6Uy2vtSzGHplx9WrOAnMqOk");

export async function POST(req: Request) {
  try {
    // const { userId } = getAuth(req);
    const body = await req.json();
    console.log("🧪 2. The body: ", body);

    const { messages }: { messages: Array<any> } = body;
    // messages = [firstMessage, ...messages];
    console.log("🧪 3. The Messages: ", messages);

    if (!messages) {
      return new NextResponse("Messages are required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired.", { status: 403})
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent( messages );
      const response = result?.response;
      const text = response?.text();

      if(!isPro) {
        await increaseApiLimit();
      }
      
      return NextResponse.json( text );
  } catch (error) {
    console.error("❌ (route.ts) [API_CONVERSATION_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}