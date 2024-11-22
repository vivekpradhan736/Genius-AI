import Background_Remove_LandingPage from "@/components/myComps/Background_Remove_LandingPage";
import Heading from "@/components/myComps/Heading";
import { PiSelectionBackgroundBold } from "react-icons/pi";

export default function BackgroundRemove() {
  return (
        <main className="not-mobile h-full w-[95vw] lg:w-[70vw]">
      <Heading
        title="Background Remover"
        describtion="The ultimate online tool for unlimited and free image background remover"
        icon={PiSelectionBackgroundBold}
        iconColor="text-green-500"
        bgColor="bg-green-500/20"
      />
          <Background_Remove_LandingPage />
      </main>
  );
}