import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { fal } from "@fal-ai/client";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

fal.config({
    credentials: process.env.FAL_KEY,
  });

export async function POST(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const { prompt, 
            num_images = 1, 
            image_size = "512x512" } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // if (!process.env.OPENAI_API_KEY) {
    //   return new NextResponse("OpenAI API Key not configured", { status: 500 });
    // }

    // if (!prompt) {
    //   return new NextResponse("Prompt are required!", { status: 400 });
    // }

    // if (!amount) {
    //   return new NextResponse("Amount are required!", { status: 400 });
    // }

    // if (!resolution) {
    //   return new NextResponse("Resolution are required!", { status: 400 });
    // }

    // const response = await openai.images.generate({
    //   model: "dall-e-2",
    //   prompt,
    //   n: parseInt(amount, 10),
    //   size: resolution,
    // });

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired.", { status: 403})
    }

    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt,
          image_size,
          num_inference_steps: 4,
          num_images,
          enable_safety_checker: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
      const res = result;

      if(!isPro){
        await increaseApiLimit();
      }

    return NextResponse.json(res);
  } catch (error) {
    console.error("❌ (route.ts) [API_IMAGE_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}