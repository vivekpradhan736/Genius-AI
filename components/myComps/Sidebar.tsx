"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
  VideoIcon,
} from "lucide-react";
import { LuFileVideo2 } from "react-icons/lu";
import FreeCounter from "./FreeCounter";
import { UserButton } from "@clerk/nextjs";
import { VscFiles } from "react-icons/vsc";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BiMoviePlay } from "react-icons/bi";
import { FaImages } from "react-icons/fa";
import { PiSelectionBackgroundBold } from "react-icons/pi";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-green-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-red-700",
  },
  {
    label: "Video Summarizer",
    icon: LuFileVideo2,
    href: "/Videos_summarizer",
    color: "text-emerald-500",
  },
  {
    label: "Background Remover",
    icon: PiSelectionBackgroundBold,
    href: "/background_remove",
    color: "text-blue-700",
  },
  // {
  //   label: "Video Generation",
  //   icon: VideoIcon,
  //   href: "/video",
  //   color: "text-orange-700",
  // },
  // {
  //   label: "File Converter",
  //   icon: VscFiles,
  //   href: "/file_con",
  //   color: "text-yellow-400",
  // },
  {
    label: "Image Converter",
    icon: FaImages,
    href: "/Image_Converter",
    color: "text-red-600",
  },
  {
    label: "Music Converter",
    icon: BsFiletypeMp3,
    href: "/Music_Converter",
    color: "text-purple-500",
  },
  {
    label: "Video Converter",
    icon: BiMoviePlay,
    href: "/Video_Converter",
    color: "text-sky-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    // color: "text-orange-700",
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: SidebarProps) => {
  const pathname = usePathname();
  console.log("pathname",pathname)

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#310778] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-5">
          <div className="relative w-10 h-10 mr-4">
            <Image fill alt="Logo" src="/icon.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Genius
          </h1>
          <div className="pl-7">
            <UserButton  afterSignOutUrl="/" />
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route, index) => (
            <Link
              key={route.label + "-" + index}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname.startsWith(route.href)
                  ? "text-white bg-white/10 "
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3 text-white", route.color)} />

                {/* Page Indicator "👉" */}
                {pathname.startsWith(route.href) && (
                  <span className="-translate-y-0.5">{"👉"}</span>
                )}

                <span className={cn("text-white", pathname.startsWith(route.href) ? "pl-2" : "")}>
                  {route.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount}/>
    </div>
  );
};

export default Sidebar;