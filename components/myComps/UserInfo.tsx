import React from "react";
import { UserButton } from "@clerk/nextjs";

const UserInfo = () => {
  return (
    <div className="flex justify-between p-6 gap-6 rounded-b-lg">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default UserInfo;