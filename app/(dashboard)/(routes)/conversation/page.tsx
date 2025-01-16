"use client";

import React, { useEffect, useState, useCallback } from "react";
import * as z from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import { MessageSquare } from "lucide-react";
import { formSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/use-pro-modal";
import ChatSidebar from "@/components/myComps/ChatSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image.js";
import Loader from "@/components/myComps/Loader";

// Define the ChatCompletionRequestMessage type locally
type ChatCompletionRequestMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const ConversationPage = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [allConversationLoading, setAllConversationLoading] = useState(false);
  const [allConversation, setAllConversation] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<{
    id?: string;
    conversationName?: string;
    messages?: ChatCompletionRequestMessage[];
  } | null>(null);
  const [fetchConversationLoading, setFetchConversationLoading] = useState(false);
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
    console.log("🧪 The form values that are going to be submitted to Genius");
    console.log(values);

    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      setMessages((current) => [...current, userMessage]);

      const response = await axios.post("http://localhost:3000/api/conversation", {
        messages: values.prompt,
      });
      setMessages((current) => [...current, response.data]);

      console.log("Messages", messages);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          proModal.onOpen();
        }
        console.error("⛔ [API_CONVERSATION_ERROR]: ", error.response?.data || error.message);
        toast.error("Something went wrong");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      router.refresh();
    }
  };

  const fetchConversation = useCallback(async () => {
    try {
      setFetchConversationLoading(true);
      const response = await axios.get("/api/conversationNewestFind");
      if (response.status === 200 && response.data.conversation) {
        setCurrentConversation(response.data.conversation);
        setFetchConversationLoading(false);
        router.push(`/conversation/${response.data.conversation.id}`);
      } else {
        setFetchConversationLoading(false);
        console.error("No conversation found");
      }
    } catch (error) {
      setFetchConversationLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching conversation:",
          error.response?.data.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [router]);

  const createConversation = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/conversationCreate", {
        userId,
      });
      if (response.status === 201 && response.data.conversation) {
        fetchAllConversation();
        setCurrentConversation(response.data.conversation);
        router.push(`/conversation/${response.data.conversation.id}`);
      } else {
        console.error("Failed to create conversation");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating conversation:",
          error.response?.data.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const fetchAllConversation = useCallback(async () => {
    try {
      setAllConversationLoading(true);
      const response = await axios.get("/api/conversationAllFind");
      if (response.status === 200 && response.data.conversations.length > 0) {
        setAllConversation(response.data.conversations); // Set the correct array of conversations
      } else {
        console.error("No conversations found");
      }
      setAllConversationLoading(false);
    } catch (error) {
      setAllConversationLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching conversations:",
          error.response?.data.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchConversation();
    fetchAllConversation();
  }, [fetchConversation, fetchAllConversation]);

  console.log("currentConversation", currentConversation?.id);

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
          fetchConversationLoading ? (
            <div className="flex justify-center items-center h-screen">
              <Loader text="Loading..." />
            </div>
          ) : (
            <div className="flex justify-center items-center h-[70vh]">
              <div className="flex flex-col w-52 justify-center items-center">
                <div className="relative h-40 w-40 sm:h-52 sm:w-52 sm:mt-1">
                  <Image alt="Empty" fill src="/empty.png" />
                </div>
                <p className="text-lg text-gray-500">No conversation found</p>
                <Button onClick={createConversation} variant="premium">
                  Create new chat
                </Button>
              </div>
            </div>
          )
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
      <ChatSidebar
        allConversation={allConversation}
        allConversationLoading={allConversationLoading}
        createConversation={createConversation}
      />
    </main>
  );
};

export default ConversationPage;
