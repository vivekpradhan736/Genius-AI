import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Define a type for the messages
// In JavaScript, you don't need to define the type explicitly

const genAI = new GoogleGenerativeAI("AIzaSyCSDGHe_Lcceu5j_Ukvcwg117rJSutotQY");

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(messages);

    const response = result?.response;
    const text = response?.text();

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(text); // Return the generated code
  } catch (error) {
    console.error("❌ (route.js) [API_CONVERSATION_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
