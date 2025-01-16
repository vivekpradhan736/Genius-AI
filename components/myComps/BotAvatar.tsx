import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const BotAvatar = () => {
  return (
    <Avatar className="h-10 w-10 rounded-md p-1 bg-[#f0e7d3]">
      <AvatarImage className="" src="/icon.png" />
    </Avatar>
  );
};

export default BotAvatar;