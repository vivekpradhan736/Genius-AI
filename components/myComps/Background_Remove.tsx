"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the interval
  const [position, setPosition] = useState<number>(0);

  // const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPosition(Number(e.target.value));
  // };

  // Function to increment the counter
  const incrementCount = () => {
    setPosition((prevPosition) => {
      if (prevPosition >= 100) {
        return 100;
      }
      return prevPosition + 4;
    });
  };

  const decrementCount = () => {
    setPosition((prevPosition) => {
      if (prevPosition <= 0) {
        return 0;
      }
      return prevPosition - 4;
    });
  };

  // Function to start the interval when holding down the button
  const startHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start an interval to increment every 10ms
    intervalRef.current = setInterval(incrementCount, 0);
  };

  // Function to start decrementing when button is released
  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start an interval to decrement every 10ms
    intervalRef.current = setInterval(decrementCount, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the uploaded file here
      console.log("File dropped:", e.dataTransfer.files[0])
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Remove background using API
  const removeBackground = useCallback(async () => {
    if (!image) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image_file_b64", image.split(",")[1]); // Remove the base64 prefix
      formData.append("size", "auto");

      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY as string,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "arraybuffer",
        }
      );

      const base64Image = Buffer.from(response.data, "binary").toString("base64");
      setResultImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setLoading(false);
      intervalRef.current = setInterval(decrementCount, 50);
    }
  }, [image]);

  const handleChange = () => {
    const openFileField = localStorage.getItem('openFileField');
    if (openFileField === 'true') {
        document.getElementById('fileInput')?.click();
        localStorage.setItem('openFileField', 'false');
    }
  };

  // Function to download the result image
  const downloadImage = () => {
    if (!resultImage) return;

    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "background-removed.png";
    link.click();
  };

  useEffect(() => {
    handleChange()
    if (image) {
        removeBackground();
      }
  }, [image, removeBackground]);

  return (
    <div>
        {image === null ? (<div className="mx-auto max-w-md px-4 py-8">
      <div className="flex justify-end mb-4">
        <Plus className="w-6 h-6 text-yellow-400" />
      </div>
      
      <h1 className="text-[2.1rem] font-bold text-center mb-7 text-[#454545]">
        Upload an image to
        <br />
        remove the background
      </h1>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex items-center justify-center ${dragActive ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <Button 
          className="w-52 bg-[#2e80e5] hover:bg-[#127DFF] text-white rounded-full py-6 text-2xl font-semibold"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          Upload Image
        </Button>
        <input id="fileInput" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
      </div>

      <p className="text-center mt-4 text-gray-600">
        or drop a file,
      </p>
      
      <p className="text-center mt-2 text-gray-600">
        paste image or <Link href="#" className="underline">URL</Link>
      </p>

      <div className="mt-12">
        <h2 className="text-center text-gray-600 mb-4 text-md font-semibold">No image? Try one of these:</h2>
        <div className="grid grid-cols-5 gap-2">
              {[
                { src: "/1_thumbnail.jpg?height=80&width=80", alt: "Product example" },
                { src: "/2_thumbnail.jpg?height=80&width=80", alt: "Person example" },
                { src: "/3_thumbnail.jpg?height=80&width=80", alt: "Animal example" },
                { src: "/4_thumbnail.jpg?height=80&width=80", alt: "Car example" },
                { src: "/5_thumbnail.jpg?height=80&width=80", alt: "Controller example" },
              ].map((image, index) => (
                <button
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <Image
                  src={image.src}
                  alt={image.alt}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                </button>
              ))}
            </div>
      </div>

      <p className="text-center text-[0.65rem] text-gray-500 mt-8">
        By uploading an image or URL you agree to our{' '}
        <Link href="#" className="text-gray-600 underline">
          Terms of Service
        </Link>
        . To learn more about how remove.bg handles your personal data, check our{' '}
        <Link href="#" className="text-gray-600 underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>) : (
        <>
        <Button 
          className="w-12 bg-[#bfd6f283] hover:bg-[#bfd6f2a8] text-blue-500 rounded-md py-6 ml-10 text-2xl font-semibold"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          +
        </Button>
        <span className='pl-2'>Upload Image</span>
      <input id="fileInput" type="file" accept="image/*" ref={fileInputRef} className='hidden' onChange={handleImageUpload} />
      <main className="container mx-auto px-10 pt-8 pb-3">
        <div className="grid md:gap-8 md:grid-cols-2">
        {image && (
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
            {resultImage && loading == false ? (
                <>
                <div
        className=" aspect-square overflow-hidden rounded-lg"
        style={{ '--position': `${position}%` } as React.CSSProperties}
      >
        {/* Original Image (Grayscale) */}
        <div className="absolute inset-0 w-[var(--position)] overflow-hidden">
          <Image
          width={800} height={600}
            src={image}
            alt="Original"
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Processed Image */}
        <div className="absolute inset-0">
          <Image
                  src={resultImage}
                  alt="Processed"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover object-left"
                />
        </div>

        {/* Invisible Range Input for Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
        //   onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Percentage of before photo shown"
        />

      </div>
                </>
            ) : (
                <>
                <Image
                width={800} height={600}
                  src={image}
                  alt="Original image"
                  className="object-cover blur-[2px] grayscale"
                />
                <div className="absolute inset-0 flex flex-col gap-6">
                    <div className='flex gap-24'>
                    <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-14 h-14'/>
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-28 h-24' />
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-20 h-20' />
                    </div>
                    <div className='flex gap-24'>
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-28 h-24' />
                    <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-12 h-12' />
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-28 h-24' />
                    </div>
                    <div className='flex gap-24'>
                    <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-10 h-10' />
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-28 h-24' />
                <Image width={300} height={300} src="/star_loader.gif" alt="Loading animation" className='w-16 h-16' />
                    </div>
            </div>
            </>
            ) }
            </div>
          </div>
        )}
        {resultImage ? (
          <div>
            <div className="relative aspect-[4/2] md:aspect-[4/3] overflow-hidden flex flex-col justify-center items-center md:items-start">
            <Button onClick={downloadImage}
          className="w-80 bg-[#2e80e5] hover:bg-[#127DFF] text-white rounded-full py-5 text-lg font-semibold"
        >
          Download
        </Button>
            <h1 className="w-80  text-center text-[#979aa0] py-1 text-balance font-medium">634 x 394 px</h1>
            <Button onClick={downloadImage}
          className="w-80 bg-[#e6ecf4] hover:bg-[#DEE1E3] text-gray-700 rounded-full py-5 text-lg font-semibold"
        >
          Download HD
        </Button>
        <h1 className="w-80  text-center text-[#979aa0] py-1 text-balance font-medium">1539 x 957 px </h1>
            </div>
          </div>
        ) : (
            <div>
            <div className="relative aspect-[4/2] md:aspect-[4/3] overflow-hidden flex flex-col justify-center items-center md:items-start gap-5">
        <Skeleton className="h-10 w-80 rounded-full py-5 bg-[#f4f4f4]" />
        <div className='flex'>
        <Skeleton className="h-3 w-28 rounded-full py-3 bg-[#f4f4f4]" />
        <h1 className='text-gray-400'>x</h1>
        <Skeleton className="h-3 w-28 rounded-full py-3 bg-[#f4f4f4]" />
        </div>
        <Skeleton className="h-10 w-80 rounded-full py-5 bg-[#f4f4f4]" />
        <div className='flex'>
        <Skeleton className="h-3 w-28 rounded-full py-3 bg-[#f4f4f4]" />
        <h1 className='text-gray-400'>x</h1>
        <Skeleton className="h-3 w-28 rounded-full py-3 bg-[#f4f4f4]" />
        </div>
            </div>
          </div>
        )}
        </div>
      </main>
      <button
      onMouseDown={startHold} // Start incrementing on mouse down
      onMouseUp={stopHold} // Stop incrementing on mouse up
      onMouseLeave={stopHold}
       className='hold-button w-[50%] flex justify-center'>
    <Image 
      width={25} height={25}
      src="/toggle.png"
      alt="Original image"
      className="hover:bg-[#e2e2e2] m-1 rounded-md"/>
      </button>
      </>)}
    </div>
  );
}
