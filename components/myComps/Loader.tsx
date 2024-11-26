import Image from "next/image";
import React from "react";

const Loader = ({ text }: { text: string }) => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="Loader" fill src="/loader.png" />
      </div>
      <p className="text-sm text-black">{text}</p>
    </div>
  );
};

export default Loader;