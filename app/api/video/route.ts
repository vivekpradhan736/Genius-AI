// import { NextResponse } from "next/server";
// import { fal } from "@fal-ai/client";

// import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

// fal.config({
//   credentials: process.env.FAL_KEY,
// });

// // Adjust the interface to match the actual response structure
// interface FalVideoResult {
//   status?: string; // Make it optional if it's not always present
//   logs?: { message: string }[];
//   video_url?: string; // Add or modify properties based on actual API response
// }

export async function POST() {
  // try {
  //   const body = await req.json();
  //   const { prompt } = body;

  //   if (!prompt) {
  //     return new NextResponse("Prompt is required!", { status: 400 });
  //   }

  //   const freeTrial = await checkApiLimit();
  //   if (!freeTrial) {
  //     return new NextResponse("Free trial has expired.", { status: 403 });
  //   }

  //   // Use a broader type or adjust the structure before casting
  //   const result = await fal.subscribe("fal-ai/cogvideox-5b", {
  //     input: {
  //       prompt,
  //       video_size: "portrait_16_9",
  //       negative_prompt:
  //         "Distorted, discontinuous, Ugly, blurry, low resolution, motionless, static, disfigured, disconnected limbs, Ugly faces, incomplete arms",
  //       num_inference_steps: 50,
  //       guidance_scale: 7,
  //       use_rife: true,
  //       export_fps: 16,
  //     },
  //     logs: true,
  //     onQueueUpdate: (update) => {
  //       if (update.status === "IN_PROGRESS" && update.logs) {
  //         update.logs.map((log) => log.message).forEach(console.log);
  //       }
  //     },
  //   });

  //   // If necessary, transform the result to include a 'status' property
  //   const transformedResult: FalVideoResult = {
  //     status: result.status || "UNKNOWN", // Provide a default if 'status' is missing
  //     logs: result.logs,
  //     video_url: result.video_url,
  //   };

  //   console.log("result", transformedResult);

  //   await increaseApiLimit();

  //   return NextResponse.json(transformedResult);
  // } catch (error) {
  //   console.error("❌ (route.ts) [API_VIDEO_ERROR]: ", error);
  //   return new NextResponse("Internal Error", { status: 500 });
  // }
}
