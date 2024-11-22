import Dropzone from "@/components/myComps/Dropzone";
import Heading from "@/components/myComps/Heading";
import { BsFiletypeMp3 } from "react-icons/bs";

export default function ImageConverter() {
  return (
        <main className="not-mobile h-full w-[95vw] lg:w-[70vw]">
      <Heading
        title="Music File Converter"
        describtion="The ultimate online tool for unlimited and free music file conversion"
        icon={BsFiletypeMp3}
        iconColor="text-purple-500"
        bgColor="bg-purple-500/20"
      />
          <Dropzone />
      </main>
  );
}