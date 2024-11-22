import Dropzone from "@/components/myComps/Dropzone";
import Heading from "@/components/myComps/Heading";
import { BiMoviePlay } from "react-icons/bi";

export default function ImageConverter() {
  return (
        <main className="not-mobile h-full w-[95vw] lg:w-[70vw]">
      <Heading
        title="Video File Converter"
        describtion="The ultimate online tool for unlimited and free video file conversion"
        icon={BiMoviePlay}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/20"
      />
          <Dropzone />
      </main>
  );
}