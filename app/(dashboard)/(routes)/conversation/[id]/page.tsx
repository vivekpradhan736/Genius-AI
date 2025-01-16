"use client";

import ChatSidebar from "@/components/myComps/ChatSidebar";
import Heading from "@/components/myComps/Heading";
import PromptArea from "@/components/myComps/PromptArea";
import axios from "axios";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useProModal } from "@/hooks/use-pro-modal";
import { formSchema } from "../formSchema";
import toast from "react-hot-toast";

interface SimpleMessage {
  role: string;
  content: string;
}

interface ConversationMessage {
  sender: string;
  content: string;
}

interface Conversation {
  id: string;
  conversationName: string;
  messages: SimpleMessage[];
  createdAt: string;
}

const ConversationSinglePage = ({ params }: { params: { id: string } }) => {
  const { userId } = useAuth();
  const conversationID = params.id;
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [allConversationLoading, setAllConversationLoading] = useState(false);
  const [allConversation, setAllConversation] = useState<Conversation[]>([]);
  const router = useRouter();
  const proModal = useProModal();
  const hasFetchedMessages = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const fetchAllConversation = useCallback(async () => {
    try {
      setAllConversationLoading(true);
      const response = await axios.get("/api/conversationAllFind");
      if (response.status === 200 && response.data.conversations.length > 0) {
        setAllConversation(response.data.conversations);
      } else {
        console.error("No conversations found");
      }
      setAllConversationLoading(false);
    } catch (error) {
      setAllConversationLoading(false);
      if (axios.isAxiosError(error)) {
        console.error("Error fetching conversations:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, []);

  const fetchAllConversationMessage = useCallback(async () => {
    try {
      const response = await axios.get("/api/conversationMessageGet", {
        params: { conversationID, userId },
      });
      if (response.status === 200 && response.data) {
        const newMessages: SimpleMessage[] = response.data.map((msg: ConversationMessage) => ({
          role: msg.sender,
          content: msg.content,
        }));
        setMessages(newMessages);
      } else {
        console.error("No messages found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching messages:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [conversationID, userId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: SimpleMessage = {
        role: "user",
        content: values.prompt,
      };
      setMessages((current) => [...current, userMessage]);

      await axios.post("/api/conversationMessageCreate", {
        conversationId: conversationID,
        sender: "user",
        content: values.prompt,
      });

      const response = await axios.post("/api/conversation", {
        messages: values.prompt,
      });

      const aiMessage: SimpleMessage = {
        role: "ai",
        content: response.data,
      };
      setMessages((current) => [...current, aiMessage]);

      await axios.post("/api/conversationMessageCreate", {
        conversationId: conversationID,
        sender: "ai",
        content: response.data,
      });

      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        proModal.onOpen();
      }
      console.error("API conversation error:", error);
      toast.error("Something went wrong");
    } finally {
      router.refresh();
    }
  };

  const generateConversationName = useCallback(async () => {
    try {
      const lastChat = messages[messages.length - 1]?.content;
      if (!lastChat) return;

      const prompt = `Given the provided question ("${lastChat}"), please suggest a single 4-5 word title that best captures the essence of the question.`;

      await axios.post("/api/conversationNameCreate", {
        prompt,
        conversationID,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error generating conversation name:", error.response?.data.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [conversationID, messages]);

  useEffect(() => {
    fetchAllConversation();
    if (conversationID && !hasFetchedMessages.current) {
      fetchAllConversationMessage();
      hasFetchedMessages.current = true;
    }
  }, [conversationID, fetchAllConversation, fetchAllConversationMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      generateConversationName();
    }
  }, [messages, generateConversationName]);

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
        <PromptArea
          type="conversation"
          placeholder="Message Genius"
          handleSubmit={onSubmit}
          isLoading={isLoading}
          form={form}
          AIresponses={messages}
        />
      </div>
      <ChatSidebar
        allConversation={allConversation}
        allConversationLoading={allConversationLoading}
        createConversation={() => {}}
        chatId={conversationID}
      />
    </main>
  );
};

export default ConversationSinglePage;