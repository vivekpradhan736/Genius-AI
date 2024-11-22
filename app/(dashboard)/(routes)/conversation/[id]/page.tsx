"use client";

import ChatSidebar from '@/components/myComps/ChatSidebar'
import Heading from '@/components/myComps/Heading'
import PromptArea from '@/components/myComps/PromptArea'
import axios from 'axios'
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ChatCompletionRequestMessage from "openai";
import { MessageSquare } from 'lucide-react'
import { useAuth  } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react';
import { useProModal } from '@/hooks/use-pro-modal';
import { formSchema } from '../formSchema';
import toast from 'react-hot-toast';

interface SimpleMessage {
  role: string;
  content: string;
}

const ConversationSinglePage = ({params}: any) => {
    console.log("params",params.id)
    const { userId } = useAuth()
    const conversationID = params.id;
    const [messages, setMessages] = useState<SimpleMessage[]>([]);
    const [allConversationLoading, setAllConversationLoading] = useState(false);
    const [allConversation, setAllConversation] = useState("");
    const [currentConversation, setCurrentConversation] = useState<{
      id?: string;
      conversationName?: string;
      messages?: ChatCompletionRequestMessage[];
    } | null>(null);
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
          conversationId: params?.id,
          sender: "user",
          content: values.prompt
        });
  
        const responce = await axios.post("http://localhost:3000/api/conversation", {
          messages: values.prompt,
        });
        const aiMessage: any = {
          role: "ai",
          content: responce.data,
        };
        setMessages((current) => [...current, aiMessage]);
        const res_saveAiChat = await axios.post("http://localhost:3000/api/conversationMessageCreate", {
          conversationId: params?.id,
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
            console.log("Fetched conversation:", response.data);
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

      const fetchAllConversationMessage = async () => {
        try {
          const response = await axios.get("/api/conversationMessageGet", {
            params: { conversationID, userId },
          });
          console.log("vivek",response)
          if (response.status === 200 && response.data) {
            // const formattedMessages: SimpleMessage[] = [];
            response.data.forEach((msg: any) => {
              const newMessage = {
                  role: msg.sender,
                  content: msg.content,
              };
      
              // Add each message to the state individually
              setMessages((current) => [...current, newMessage]);
              console.log("newMessage",newMessage)
          });
          } else {
            console.error("No message");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Error fetching message:", error.response?.data.message || error.message);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      };

      const generateConversationName = async () => {
        try {
          const lastChat = messages[messages.length - 1]?.content;
          console.log("lastChat",lastChat)
          const prompt = 'Given the provided question ( ' + lastChat + ' ), please suggest a single 4-5 word title that best captures the essence of the question.';

          const response = await axios.post("/api/conversationNameCreate", {
            prompt,
            conversationID
          });
          if (response.status === 200 && response.data) {
          } else {
            console.error("No message");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Error fetching message:", error.response?.data.message || error.message);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      };
    
      useEffect(() => {
        fetchAllConversation();
        if (conversationID && !hasFetchedMessages.current) {
          fetchAllConversationMessage();
          hasFetchedMessages.current = true;
        }
        
      }, [])
      if(messages.length > 0){
        generateConversationName();
      }
      
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
      <ChatSidebar allConversation={allConversation} allConversationLoading={allConversationLoading} createConversation={createConversation} chatId={params.id} />
    </main>
  )
}

export default ConversationSinglePage
