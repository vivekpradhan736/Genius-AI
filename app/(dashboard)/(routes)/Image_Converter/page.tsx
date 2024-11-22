import Dropzone from "@/components/myComps/Dropzone";
import Heading from "@/components/myComps/Heading";
import { FaImages } from "react-icons/fa";

export default function ImageConverter() {
  return (
        <main className="not-mobile h-full w-[95vw] lg:w-[70vw]">
      <Heading
        title="Image File Converter"
        describtion="The ultimate online tool for unlimited and free image file conversion"
        icon={FaImages}
        iconColor="text-red-500"
        bgColor="bg-red-500/20"
      />
          <Dropzone />
      </main>
  );
}