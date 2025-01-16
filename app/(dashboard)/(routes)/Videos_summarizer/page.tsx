"use client";

import React, { useState } from "react";
import * as z from "zod";
import axios, { AxiosResponse } from "axios";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import { LuFileVideo2 } from "react-icons/lu";
import { formSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";

type VideoSummaryResponse = {
  kwargs?: {
    content?: string;
  };
};

type TranscriptResponse = {
  transcript: string; // Define the shape of your transcript response if it's an object or string
};

const VideoSummarizerPage = () => {
  const [video_summarizer, setVideo_summarizer] = useState<string | undefined>("");
  const [video_transcript, setVideo_transcript] = useState<TranscriptResponse | undefined>(undefined); // Explicitly type as TranscriptResponse or undefined
  const router = useRouter();

  const proModal = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo_summarizer(undefined);

      // Post request for video summary
      const response: AxiosResponse<VideoSummaryResponse> = await axios.post(
        "http://localhost:3000/api/video_summarizer",
        values
      );

      // Post request for video transcript
      const transcriptResponse: AxiosResponse<TranscriptResponse> = await axios.post(
        "http://localhost:3000/api/video_transcript",
        values
      );
      console.log("transcriptResponse", transcriptResponse);

      setVideo_transcript(transcriptResponse.data); // Use the appropriate response type

      // Extract summary content from the response
      if (response.data) {
        const summaryContent =
          typeof response.data === "object"
            ? response.data.kwargs?.content || "No summary available"
            : "No summary available";

        setVideo_summarizer(summaryContent);
      } else {
        setVideo_summarizer("No summary available");
      }

      console.log("response", response);
      form.reset();
    } catch (error: unknown) {
      // Refine error typing
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        proModal.onOpen();
      } else {
        console.error("⛔ [API_VIDEO_SUMMARY_ERROR]: ", error);
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <main className="not-mobile h-full">
      <Heading
        title="Video Summarizer"
        describtion="Transform video URL to video summarizer with the power of AI."
        icon={LuFileVideo2}
        iconColor="text-emerald-400"
        bgColor="bg-emerald-500/20"
      />
      <PromptArea
        type="video_summarizer"
        placeholder="Enter Youtube Video URL : https://www.youtube.com/watch?v=VIDEO_ID&otherParams"
        handleSubmit={onSubmit}
        isLoading={isLoading}
        form={form}
        AIresponses={video_summarizer === undefined ? "" : video_summarizer}
        transcriptResponce={video_transcript}
      />
    </main>
  );
};

export default VideoSummarizerPage;
