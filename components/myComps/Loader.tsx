import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="Loader" fill src="/loader.png" />
      </div>
      <p className="text-sm text-black">AI Model is Computing...</p>
    </div>
  );
};

export default Loader;