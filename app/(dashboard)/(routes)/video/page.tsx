"use client";

import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import { VideoIcon } from "lucide-react";
import { formSchema } from "./formSchema";
import { useProModal } from "@/hooks/use-pro-modal";

const VideoPage = () => {
  const [video, setVideo] = useState<string | undefined>("");
  const router = useRouter();
  const proModal = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      video_size: "512x512",
      num_inference_steps: 30,
      guidance_scale: 7,
      export_fps: 16,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      console.log("values",values)

      const responce = await axios.post("http://localhost:3000/api/video", values);
      console.log("responce",responce)

      setVideo(responce.data.data.video.url);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          proModal.onOpen();
        }
        console.error("⛔ [API_VIDEO_ERROR]: ", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <main className="not-mobile h-full">
      <Heading
        title="Video Generation"
        describtion="Create Videos with the power of AI."
        icon={VideoIcon}
        iconColor="text-orange-400"
        bgColor="bg-[#d07a342a]"
      />
      <PromptArea
        type="video"
        placeholder="Example: Astronaut drinking beer on the moon."
        handleSubmit={onSubmit}
        isLoading={isLoading}
        form={form}
        AIresponses={video === undefined ? "" : video}
      />
    </main>
  );
};

export default VideoPage;