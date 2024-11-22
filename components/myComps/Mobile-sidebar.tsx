"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Sidebar from "@/components/myComps/Sidebar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import withClientSideRendering from "@/components/myComps/HOC/withClientSideRendering";

interface MobileSidebarProps{
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({
  apiLimitCount = 0,
  isPro = false
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if(!isMounted) {
    return null;
  }
  
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  );
};

// *NOTE: This "withClientSideRendering" is just a workaround for handling Hydration errors
// *NOTE: It should not be used often
export default withClientSideRendering(MobileSidebar);