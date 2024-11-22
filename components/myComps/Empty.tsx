import Image from "next/image";
import React from "react";

interface EmptyProps {
  label: string;
  isSettings: boolean;
}

const Empty = ({ label, isSettings = false }: EmptyProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      {isSettings && (
        <>
          <div className="max-sm:hidden relative h-[200] w-full">
            <Image
              alt="thanks-img"
              style={{ position: "absolute", left: "400px" }}
              width={200}
              height={200}
              src="/thank_you.png"
            />
          </div>
          <div className="max-sm:hidden flex justify-end w-full rotate-180 scale-y-[-1]">
            <Image
              alt="robot-hand"
              width={500}
              height={500}
              src="/robot-hand-hover-hold.png"
            />
          </div>
        </>
      )}
      <div className="relative h-40 w-40 mt-6 sm:h-52 sm:w-52 sm:mt-14">
        <Image alt="Empty" fill src="/empty.png" />
      </div>
      <p className="mt-4 text-black text-sm text-center">{label}</p>
    </div>
  );
};

export default Empty;