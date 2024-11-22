"use client";

import React, { useState } from "react";
import Heading from "@/components/myComps/Heading";
import { Code } from "lucide-react";
import PromptArea from "@/components/myComps/PromptArea";
import { ChatCompletionRequestMessage } from "openai";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { formSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";


const CodePage = () => {
  const [messages, setMessages] = useState(
    [] as ChatCompletionRequestMessage[]
  );
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
    console.log(
      "🧪 The form' values that are going to be submitted to Genius"
    );
    console.log(values);
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const responce = await axios.post("http://localhost:3000/api/code", {
        messages: values.prompt,
      });
      console.log("responce",responce)
      setMessages((current) => [...current, userMessage, responce.data]);

      form.reset();
    } catch (error: any) {
      if(error?.response?.status === 403){
        proModal.onOpen()
      }
      console.log("⛔ [API_CONVERSATION_ERROR]: ", error);
      toast.error("Something went wrong");

    } finally {
      router.refresh();
    }
  };

  return (
    <main className="not-mobile h-full">
      <Heading
        title="Code Generation"
        describtion="Generate code through text. Powered by Genius Turbo"
        icon={Code}
        iconColor="text-green-500"
        bgColor="bg-green-500/20"
      />
      <PromptArea
        type="code"
        placeholder="Example: Create a CSS animation that upon hover, it will scale the specified HTML element by a little."
        handleSubmit={onSubmit}
        isLoading={isLoading}
        form={form}
        AIresponses={messages}
      />
    </main>
  );
};

export default CodePage;