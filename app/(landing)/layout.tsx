import { reactChildrenForProps } from "@/commonTypes";

const LandingLayout = ({ children }: reactChildrenForProps) => {
  return (
    <main className="h-full bg-[#ffffff] overflow-auto">
      <div className="p-2 mx-auto max-w-screen-xl h-full w-full">
        {children}
      </div>
    </main>
  );
};

export default LandingLayout;