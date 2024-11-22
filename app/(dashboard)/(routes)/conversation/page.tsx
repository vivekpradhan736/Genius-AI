"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { ChatCompletionRequestMessage } from "openai";
import ChatCompletionRequestMessage from "openai";

import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import { MessageSquare } from "lucide-react";
import { formSchema } from "./formSchema.ts";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";
import ChatSidebar from "@/components/myComps/ChatSidebar";
import { Button } from "@/components/ui/button";
import { useAuth  } from '@clerk/nextjs'

const ConversationPage = () => {
  const { userId } = useAuth()
  const [messages, setMessages] = useState(
    [] as ChatCompletionRequestMessage[]
  );
  const [allConversationLoading, setAllConversationLoading] = useState(false);
  const [allConversation, setAllConversation] = useState("");
  const [currentConversation, setCurrentConversation] = useState<{
    id?: string;
    conversationName?: string;
    messages?: ChatCompletionRequestMessage[];
  } | null>(null);
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
      const userMessage: any = {
        role: "user",
        content: values.prompt,
      };
      setMessages((current) => [...current, userMessage])
      const res_saveUserChat = await axios.post("/api/conversationMessageCreate", {
        conversationId: currentConversation?.id,
        sender: "user",
        content: values.prompt
      });

      const responce = await axios.post("http://localhost:3000/api/conversation", {
        messages: values.prompt,
      });
      setMessages((current) => [...current, responce.data]);
      const res_saveAiChat = await axios.post("http://localhost:3000/api/conversationMessageCreate", {
        conversationId: currentConversation?.id,
        sender: "ai",
        content: responce.data
      });
      console.log("Messages",messages)

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

  const fetchConversation = async () => {
    try {
      const response = await axios.get("/api/conversationNewestFind");
      if (response.status === 200 && response.data.conversation) {
        setCurrentConversation(response.data.conversation)
        router.push(`/conversation/${response.data.conversation.id}`)
      } else {
        console.error("No conversation found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching conversation:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const createConversation = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/conversationCreate", {
        userId,
      });
      if (response.status === 201 && response.data.conversation) {
        fetchAllConversation();
        setCurrentConversation(response.data.conversation)
        router.push(`/conversation/${response.data.conversation.id}`)
      } else {
        console.error("Failed to create conversation");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating conversation:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  const fetchAllConversation = async () => {
    try {
      setAllConversationLoading(true)
      const response = await axios.get("/api/conversationAllFind");
      console.log("response",response)
      if (response.status === 200 && response.data.conversations.length > 0) {
        setAllConversation(response.data.conversations)
      } else {
        console.error("No conversation");
      }
      setAllConversationLoading(false)
    } catch (error) {
      setAllConversationLoading(false)
      if (axios.isAxiosError(error)) {
        console.error("Error fetching conversation:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchConversation();
    fetchAllConversation();
  }, [])
  console.log("currentConversation", currentConversation?.id)
  

  return (
    <main className="lg:ml-[350px] flex h-full w-[75%]">
      <div className="w-[90%]">
      <Heading
        title="Conversation"
        describtion="OpenAI's most powerful AI conversation model. Genius Turbo"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/20"
        />
        {!currentConversation ? (
          <div className="flex justify-center items-center h-[70vh]">
          <div className="flex flex-col w-52 justify-center items-center">
            <p className="text-lg text-gray-500">No conversation found</p>
            <Button className="" onClick={createConversation} variant="premium">
              Create new chat
            </Button>
          </div>
          </div>
        ) : (
      <PromptArea
        type="conversation"
        placeholder="Message Genius"
        handleSubmit={onSubmit}
        isLoading={isLoading}
        form={form}
        AIresponses={messages}
        />
      )}
      </div>
      <ChatSidebar allConversation={allConversation} allConversationLoading={allConversationLoading} createConversation={createConversation} />
    </main>
  );
};

export default ConversationPage;