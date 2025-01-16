import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

fal.config({
  credentials: process.env.FAL_KEY,
});

// Define the expected structure of the result
interface FalVideoResult {
  status: string;
  logs?: { message: string }[];
  video_url?: string; // Replace or add properties based on the actual API response
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const result: FalVideoResult = await fal.subscribe("fal-ai/cogvideox-5b", {
      input: {
        prompt,
        video_size: "portrait_16_9",
        negative_prompt:
          "Distorted, discontinuous, Ugly, blurry, low resolution, motionless, static, disfigured, disconnected limbs, Ugly faces, incomplete arms",
        num_inference_steps: 50,
        guidance_scale: 7,
        use_rife: true,
        export_fps: 16,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("result", result);

    await increaseApiLimit();

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ (route.ts) [API_VIDEO_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
