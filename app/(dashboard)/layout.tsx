"use server"

import React from "react";
import { reactChildrenForProps } from "@/commonTypes";
import Navbar from "@/components/myComps/Navbar";
import Sidebar from "@/components/myComps/Sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: reactChildrenForProps) => {

  const apiLimitCount = await getApiLimitCount()
  const isPro = await checkSubscription()
  return (
    <div className="h-full relative">
      <div className="hidden h-full lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-gray-800 ">
        {/* {children} */}
        {/* <UserInfo /> */}
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <main className="">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;