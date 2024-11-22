"use server"

import { checkSubscription } from "@/lib/subscription";
import MobileSidebar from "./Mobile-sidebar";
import UserInfo from "./UserInfo";
import { getApiLimitCount } from "@/lib/api-limit";

const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount()
  const isPro = await checkSubscription()
  return (
    <div className="flex items-center p-4">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      <div className="lg:hidden absolute inset-y-0 right-0 shrink">
        <UserInfo />
      </div>
    </div>
  );
};

export default Navbar;