"use client";

import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  VideoIcon,
} from "lucide-react";
import { LuFileVideo2 } from "react-icons/lu";
import { useUser } from '@clerk/nextjs'
import { useEffect } from "react";
import { VscFiles } from "react-icons/vsc";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BiMoviePlay } from "react-icons/bi";
import { FaImages } from "react-icons/fa";
import { PiSelectionBackgroundBold } from "react-icons/pi";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-500/10",
    href: "/code",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Summarizer",
    icon: LuFileVideo2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/Videos_summarizer",
  },
  // {
  //   label: "Video Generation",
  //   icon: VideoIcon,
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-700/10",
  //   href: "/video",
  // },
  // {
  //   label: "File Converter",
  //   icon: VscFiles,
  //   href: "/file_con",
  //   color: "text-yellow-400",
  //   bgColor: "bg-yellow-400/20",
  // },
  {
    label: "Background Remover",
    icon: PiSelectionBackgroundBold,
    href: "/background_remove",
    color: "text-blue-700",
    bgColor: "bg-blue-500/20",
  },
  {
    label: "Image Converter",
    icon: FaImages,
    href: "/Image_Converter",
    color: "text-red-500",
    bgColor: "bg-red-500/20",
  },
  {
    label: "Music Converter",
    icon: BsFiletypeMp3,
    href: "/Music_Converter",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
  {
    label: "Video Converter",
    icon: BiMoviePlay,
    href: "/Video_Converter",
    color: "text-sky-500",
    bgColor: "bg-sky-500/20",
  },
];
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser()
  console.log("user", user)

  useEffect(() => {
    if(user){
      isNewUser();
    }
  }, [user])
  

  const isNewUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/createNewUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          name: user?.fullName,
          email: user?.emailAddresses[0]?.emailAddress,
          imageUrl: user?.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };
  return (
    <div>
      <div className="not-mobile mt-8 mb-8 space-y-4">
        <h2 className="text-purple-700 text-2xl md:text-3xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="font-normal text-gray-600 text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the Power of AI
        </p>
      </div>
      <div className="not-mobile flex flex-col items-center px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            onClick={() => router.push(tool.href)}
            className="p-4 lg:max-w-[750px] w-full border-black/5 flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}