import React, { useState } from "react";
import Empty from "./Empty";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar.tsx";
import BotAvatar from "./BotAvatar";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface ResponseAreaProps {
  promptResponceArr: any[] | string;
  isLoading: boolean;
  type: string;
  videoUrl: any[] | string;
  transcriptData: any;
}

type featureCategs = {
  [key: string]: string;
};

const features: featureCategs = {
  conversation: "conversation",
  image: "image",
  video: "video",
  Videos_summarizer: "Videos_summarizer",
  code: "code",
};

const ResponseArea = ({
  promptResponceArr, //messages in Video Tutorial
  isLoading,
  type,
  videoUrl,
  transcriptData,
}: ResponseAreaProps) => {
  console.log("type",type)
  console.log("promptResponceArr", promptResponceArr)
  console.log("videoUrl", videoUrl)
  console.log("transcriptData", transcriptData)

  // Reverse the array to display recent messages first
  const reversedMessages = Array.isArray(promptResponceArr) ? [...promptResponceArr].reverse() : [];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getYouTubeVideoId = (url: any) => {
    // Handle full YouTube URLs (with 'v=' parameter)
    if (url.includes("youtube.com/watch?v=")) {
      const urlParts = url.split("v=");
      return urlParts[1]?.split("&")[0];
    }
    
    // Handle short URLs (youtu.be)
    if (url.includes("youtu.be/")) {
      const urlParts = url.split("youtu.be/");
      return urlParts[1]?.split("?")[0];
    }
    
    // Handle embed URLs
    if (url.includes("youtube.com/embed/")) {
      const urlParts = url.split("embed/");
      return urlParts[1]?.split("?")[0];
    }
  
    // If no valid video ID is found
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  console.log("videoId",videoId)

  const handleDownload = async (url: any, filename: any) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the body
      document.body.removeChild(link);

      // Release the blob URL after download
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <div className="p-4 lg:mx-4 mt-4 space-y-4 text-white">
      {isLoading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-gray-200">
          <Loader text={"AI Model is Computing..."} />
        </div>
      )}
      {promptResponceArr.length === 0 && !isLoading && (
        <Empty label="No Available Responses" isSettings={false} />
      )}
      {/* CONVERSATION or CODE */}
      {(type === features.conversation || type === features.code) && (
      <div className="max-h-[400px] overflow-y-scroll p-4 space-y-4 rounded-lg">
        <div className=" gap-y-4 w-full grid grid-cols-6">
          {Array.isArray(promptResponceArr) &&
            promptResponceArr.map((singleResp: any) => (
              <div key={singleResp.id} className={cn(" ", singleResp.role === "user"
                    ? "w-[100%] col-start-3 col-end-7"
                    : "w-[100%] col-start-1 col-end-6")}>
              <div
                className={cn(
                  "overflow-auto p-4 flex flex-row gap-x-5 items-start gap-y-4 rounded-lg",
                  singleResp.role === "user"
                    ? "bg-white border border-gray-300 w-[100%]"
                    : "bg-gray-100 w-[100%]"
                )}
              >
                <div>
                  {singleResp.role === "user" ? <UserAvatar /> : <BotAvatar />}
                </div>
                <div className={`overflow-auto text-black ${singleResp.role != "user" ? "font-medium text-gray-600" : ""}`}>
                  {/* CONVERSATION */}
                  {type === features.conversation && singleResp.role === "user" && (
                    <ReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto w-full my-2 bg-[#e2e5e3b9] p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-black/10 rounded-lg p-1"
                            {...props}
                          />
                        ),
                      }}
                      className="overflow-auto text-base leading-7"
                    >
                      {typeof singleResp?.content === 'string' ? singleResp.content : JSON.stringify(singleResp.content)}
                    </ReactMarkdown>
                  )}
                  {/* {type === features.conversation && singleResp.role != "user" && singleResp} */}
                  {type === features.conversation && singleResp.role === "ai" && (
                    <ReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto w-full my-2 bg-[#e2e5e3b9] p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-black/10 rounded-lg p-1"
                            {...props}
                          />
                        ),
                      }}
                      className="overflow-auto text-sm leading-7"
                    >
                      {/* {singleResp} */}
                      {typeof singleResp?.content === 'string' ? singleResp.content : JSON.stringify(singleResp.content)}
                    </ReactMarkdown>
                  )}
                  {/* CODE GENERATION */}
                  {type === features.code && (
                    <ReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto w-full my-2 bg-[#e2e5e3b9] p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-black/10 rounded-lg p-1"
                            {...props}
                          />
                        ),
                      }}
                      className="overflow-auto text-sm leading-7"
                    >
                      {singleResp?.content || singleResp}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
              </div>
            ))}
        </div>
      </div>
      )}

      {/* IMAGE */}
      {type === "image" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {Array.isArray(promptResponceArr) &&
            promptResponceArr.map((src, index) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square cursor-pointer">
                  <Image alt="Image" fill src={src} onClick={() => window.open(src)} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    hover
                    onClick={() => handleDownload(src, `image${index + 1}.jpg`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}

      {/* Video Summarizer */}
      {type === "video_summarizer" &&
        promptResponceArr && (
          <div className="flex flex-col lg:flex-row mt-2 w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="video-container w-full lg:w-1/2 p-3 flex flex-col gap-3">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            // width="500" 
            // height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video Player"
            className="w-full h-72"
          ></iframe>
        </div>
        <div className="bg-white shadow-lg rounded-lg max-h-[400px] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-2">
            <div className="py-1 px-2 w-20 text-center rounded-md text-blue-500 bg-blue-100 text-sm">
              Transcript
            </div>
          </div>
          {transcriptData?.map((entry: any, index: any) => (
            <div key={index} className="mb-4 flex px-4">
              <div className="text-blue-500 w-12 flex-shrink-0 font-mono">
                {formatTime(entry.intervalStart)}
              </div>
              <div className="flex-grow">
                <p className="text-gray-800">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block border-l border-gray-200"></div>
      <div className="w-full lg:w-1/2 text-black p-3">
        <h3 className="text-lg font-medium mb-2">Summary:</h3>
        <ReactMarkdown
          components={{
            pre: ({ node, ...props }) => (
              <div className="overflow-auto w-full my-2 bg-gray-100 p-2 rounded-lg">
                <pre {...props} />
              </div>
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-200 rounded-lg p-1" {...props} />
            ),
          }}
          className="overflow-auto text-sm leading-7"
        >
          {Array.isArray(promptResponceArr) ? promptResponceArr.join(" ") : promptResponceArr}
        </ReactMarkdown>
      </div>
    </div>
        )}

      {/* VIDEO */}
      {type === "video" &&
        promptResponceArr &&
        typeof promptResponceArr === "string" && (
          <video
            controls
            className="w-full aspect-video mt-8 rounded-lg  border bg-white"
          >
            <source src={promptResponceArr} />
          </video>
        )}
    </div>
  );
};

export default ResponseArea;