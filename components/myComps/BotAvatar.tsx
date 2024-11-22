import React from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BotAvatar = () => {
  const { user } = useUser();
  return (
    <Avatar className="h-10 w-10 rounded-md p-1 bg-[#f0e7d3]">
      <AvatarImage className="" src="/icon.png" />
    </Avatar>
  );
};

export default BotAvatar;