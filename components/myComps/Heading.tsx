import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";

interface HeadingProps {
  title: string;
  describtion: string;
  icon: IconType | LucideIcon;  // Accept both `react-icons` and `lucide-react` icons
  iconColor?: string;
  bgColor?: string;
}

const Heading = ({
  title,
  describtion,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) => {
  return (
    <div className="p-4 lg:px-8 flex items-center gap-x-3">
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-black">{title}</h2>
        <p className="text-sm text-gray-400">{describtion}</p>
      </div>
    </div>
  );
};

export default Heading;
