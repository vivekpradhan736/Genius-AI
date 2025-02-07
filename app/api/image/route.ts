import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

fal.config({
  credentials: process.env.FAL_KEY,
});

// Update FalResult to match the actual structure returned by fal.subscribe
interface FalResult {
  images?: string[]; // Adjust based on the actual response from fal.subscribe
  logs?: { message: string }[];
  status?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, num_images = 1, image_size = "512x512" } = body;

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    // Cast the result to FalResult if you are confident in the structure
    const result: FalResult = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size,
        num_inference_steps: 4,
        num_images,
        enable_safety_checker: true,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    }) as FalResult; // Using type assertion here

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ (route.ts) [API_IMAGE_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
