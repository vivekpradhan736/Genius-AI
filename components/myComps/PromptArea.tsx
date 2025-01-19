"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponseArea from "./ResponseArea";
import {
  amountOptions,
  resolutionOptions,
} from "../../app/(dashboard)/(routes)/image/formSchema";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import SelectTopic from "./SelectTopic";
import SelectStyle from "./SelectStyle";
import SelectDuration from "./SelectDuration";
import CustomLoading from "./CustomLoading";
import { v4 as uuidv4 } from 'uuid';
// import { VideoDataContext } from '@/app/__context/VideoDataContext';

interface SimpleMessage {
  role: string;
  content: string;
}

interface PromptAreaProps {
  placeholder: string;
  type: string;
  handleSubmit: any;
  isLoading: boolean;
  form: any;
  AIresponses: SimpleMessage[] | string[] | string;
  transcriptResponce?: any;
}

// interface VideoDataType {
//   videoScript: Array<{
//     content_text: string;
//     imagePrompt: string;
//   }>;
//   audioFileUrl: string;
//   captions: string;
//   imageList: string[];
// };

// interface UserDetailType {
//   credits: number;
//   email: string;
//   userId: string;
// };

interface FormData {
  topic?: string;
  imageStyle?: string;
  duration?: string;
}

// type apiEndpointsType = {
//   [key: string]: string;
// };

// const apiEndpoints: apiEndpointsType = {
//   conversation: "/api/conversation",
//   image: "/api/image",
//   video: "/api/video",
//   Videos_summarizer: "/api/Videos_summarizer",
//   code: "/api/code",
// };

const PromptArea = ({
  placeholder,
  type,
  handleSubmit: onSubmit,
  isLoading,
  form,
  AIresponses,
  transcriptResponce,
}: PromptAreaProps) => {

  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [videoScript, setVideoScript] = useState<any>();
  // const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>();
  // const [captions, setCaptions] = useState<any>();
  // const [imageList, setImageList] = useState<string[]>([]);
  // const [playVideo, setPlayVideo] = useState<boolean>(true);
  // const [videoId, setVideoId] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  // const { videoData, setVideoData } = useContext(VideoDataContext);
  // const { userDetail, setUserDetail } = useContext(VideoDataContext);
  // const { user } = useUser();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // const largeDeviceClassPicker = () => {
  //   if (type === "image") return "lg:col-span-6";
  // };

  const onHandleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    // if (userDetail?.credits <= 0) {
    //   toast("You don't have enough Credits");
    //   return;
    // }
    GetVideoScript();
  };

  // Get Video script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      'Write a script to generate ' +
      formData.duration +
      ' video on topic: ' +
      formData.topic +
      ' along with AI image prompt in ' +
      formData.imageStyle +
      ' format for each scene and give me result in JSON format with image prompt and content Text as field, No Plain text';

    const resp = await axios.post('http://localhost:3000/api/get-video-script', { prompt });
    if (resp.data.result) {
      // setVideoData((prev: VideoDataType) => ({
      //   ...prev,
      //   videoScript: resp.data.result,
      // }));
      setVideoScript(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
    setLoading(false);
  };

  // Generate audio file and save to Firebase storage
  const GenerateAudioFile = async (videoScriptData: any) => {
    setLoading(true);
    const id = uuidv4();
    const script = videoScriptData
      .map((item: { content_text: string }) => item.content_text)
      .join(' ');

    const resp = await axios.post('http://localhost:3000/api/generate-audio', {
      text: script,
      id: id,
    });
    // setAudioFileUrl(resp.data.result);
    // setVideoData((prev: VideoDataType) => ({
    //   ...prev,
    //   audioFileUrl: resp.data.result,
    // }));
    if (resp.data.result) await GenerateAudioCaption(resp.data.result);
    setLoading(false);
  };

  // Generate captions from audio file
  const GenerateAudioCaption = async (fileUrl: string) => {
    setLoading(true);
    const resp = await axios.post('http://localhost:3000/api/generate-caption', {
      audioFileUrl: fileUrl,
    });
    // setCaptions(resp.data.result);
    // setVideoData((prev: VideoDataType) => ({
    //   ...prev,
    //   captions: resp.data.result,
    // }));
    if (resp.data.result) GenerateImage(videoScript);
    setLoading(false);
  };

  // Generate AI Images
  const GenerateImage = async (videoScriptData: any) => {
    setLoading(true);
    const images: string[] = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post('http://localhost:3000/api/generate-image', {
          prompt: element.imagePrompt,
        });
        images.push(resp.data.result);
      } catch (e) {
        console.error('Error', e);
      }
    }

    // setImageList(images);
    // setVideoData((prev: VideoDataType) => ({
    //   ...prev,
    //   imageList: images,
    // }));
    setLoading(false);
  };

  return (
    <>
      <ResponseArea
        promptResponceArr={AIresponses}
        type={type}
        isLoading={isLoading}
        videoUrl={videoUrl}
        transcriptData={transcriptResponce}
      />
      <section className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border border-gray-300 w-full p-2 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "col-span-11 ",
                    type === "image" ? "lg:col-span-11" : "lg:col-span-11"
                  )}
                >
                  <FormControl className="m-0 p-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1 pl-1">
                        <Label htmlFor="message">Prompt<span className="text-red-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="rounded-full p-[1px] w-[17px] h-[18px] border-[1px] border-gray-300 text-[10px]">i</button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto  py-[1px] px-[5px] rounded-md text-[14px] z-50 bg-[#000000] text-white">
                            The prompt to generate the {type} from.
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Textarea
                        className=" text-black border-[1px] border-[#68686861] p-2 resize-none whitespace-pre-wrap break-words w-full"
                        disabled={isLoading}
                        placeholder={placeholder}
                        {...field}
                        ref={textareaRef}
                        onChange={(e) => {
                          field.onChange(e);
                          if (type === "Videos_summarizer") {
                            setVideoUrl(e.target.value)
                          }
                          if (textareaRef.current) {
                            if (field.value.length > 75) {
                              textareaRef.current.style.height = "150px";
                            } else {
                              textareaRef.current.style.height = "75px";
                            }
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {type === "image" && (
              <>
                <FormField
                  name="num_images"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2 self-center text-black">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="image_size"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2 self-center text-black">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}


            {type === "video" && (
              <div className='md:px-20 col-span-12'>
              <h2 className='font-bold text-4xl text-primary text-center'>
                  Create New
              </h2>
    
              <div className='mt-10 shadow-md p-10'>
                  {/* Select Topic */}
                  <SelectTopic onUserSelect={onHandleInputChange} />
                  {/* select style */}
                   <SelectStyle onUserSelect={onHandleInputChange}/>
                  {/* Duration */}
                   <SelectDuration onUserSelect={onHandleInputChange}/>
                  {/* Create Button */}
                  <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
              </div>
              <CustomLoading loading={loading} />
              {/* <PlayerDialog playVideo={playVideo} videoId={videoId}/> */}
        </div>
            )}
            <div className="py-8 col-span-1 sm:col-span-1 flex justify-center sm:justify-end">
              <Button
                className="send-btn grow max-w-[100vw] min-w-[50px]"
                disabled={isLoading}
              >
                <Send className="send-animation" />
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
};

export default PromptArea;