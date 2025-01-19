"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ImageIcon } from "lucide-react";
import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import { formSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";

const ImagePage = () => {
  const [images, setImages] = useState([] as string[]);
  const router = useRouter();
  const proModal = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      num_images: "1",
      image_size: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);

      const response = await axios.post("http://localhost:3000/api/image", values);

      const urls = response.data.data.images.map((image: { url: string }) => image.url);

      setImages(urls);

      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          proModal.onOpen();
        }
        console.error("⛔ [API_IMAGE_ERROR]: ", error.response?.data || error.message);
        toast.error("Something went wrong");
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
        title="Image Generation"
        describtion="OpenAI's most powerful image generation model. DALL-E 2"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-[#bd185d19]"
      />
      <PromptArea
        type="image"
        placeholder="Example: A futuristic gaming console floating in space with neon lights"
        handleSubmit={onSubmit}
        isLoading={isLoading}
        form={form}
        AIresponses={images}
      />
    </main>
  );
};

export default ImagePage;