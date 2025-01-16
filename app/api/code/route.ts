import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// const firstMessage = {
//   role: "user",
//   content: "Please provide a code snippet in JavaScript that fetches data from an API and logs it to the console.",
// };

// Define a type for the messages
interface Message {
  role: string;
  content: string;
}

const genAI = new GoogleGenerativeAI("AIzaSyB0OTIRRkEN6Uy2vtSzGHplx9WrOAnMqOk");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages }: { messages: Message[] } = body;

    if (!messages) {
      return new NextResponse("Messages are required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired.", { status: 403})
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(messages);

    const response = result?.response;
    const text = response?.text();

    if(!isPro){
      await increaseApiLimit();
    }

    return NextResponse.json( text ); // Return the generated code
  } catch (error) {
    console.error("❌ (route.ts) [API_CONVERSATION_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
