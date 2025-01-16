'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowRight, Upload } from "lucide-react"
import { useRouter } from "next/navigation";
import Image from 'next/image'

const MotionButton = motion(Button)

export default function Component() {
    const router = useRouter();
  const [activeTab, setActiveTab] = useState('people')
  // const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<number>(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  };

  const image_upload_href = "/image_upload"

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    // setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // setIsDragging(false)
    // Handle file drop logic here
  }

  const categories = [
    {
        id: 1,
        name: "People",
        image: "/people.jpg?height=400&width=600",
        processImage: "/people_bg.png?height=400&width=600"
    },
    {
        id: 2,
        name: "Products",
        image: "/product.jpg?height=400&width=600",
        processImage: "/product_bg.png?height=400&width=600"
    },
    {
        id: 3,
        name: "Animals",
        image: "/animal.jpg?height=400&width=600",
        processImage: "/animal_bg.png?height=400&width=600"
    },
    {
        id: 4,
        name: "Cars",
        image: "/car.jpg?height=400&width=600",
        processImage: "/car_bg.png?height=400&width=600"
    },
    {
        id: 5,
        name: "Graphics",
        image: "/graphics.jpg?height=400&width=600",
        processImage: "/graphics_bg.png?height=400&width=600"
    },
    ];

  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  }, [controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const addImage = () => {
    localStorage.setItem('openFileField', 'true');
    router.push(image_upload_href)
  }

  return (
    <div className="flex flex-col min-h-screen ">
        {/* Upload Section */}
      <section className="">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Video Player Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <video
              className="w-full aspect-video"
              src="/background_remove_video.mp4"
              poster="/placeholder.svg?height=400&width=600"
              autoPlay
              muted
            />
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-6xl font-bold mb-4 text-gray-700">Remove Image Background</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-600">100% Automatically and</span>
              <motion.span
                className="bg-yellow-400 px-3 py-1 rounded-full text-gray-900 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Free
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8 md:py-28"
        >
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={` h-80 rounded-[2.4rem] shadow-2xl } transition-colors`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CardContent className="py-28 gap-8 text-center flex flex-col justify-center items-center">
                  <MotionButton
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addImage}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </MotionButton>
                  <p className="text-gray-600">
                    or drop a file,
                    <br />
                    paste image or <span className="text-gray-900">URL</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 flex justify-center items-center w-full gap-5"
          >
            <div className="flex flex-col  justify-center text-gray-600 w-[28%]">
              <span className='text-[1rem] font-semibold'>No image?</span>
              <span className='text-[1rem] font-semibold'>Try one of these:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 w-[72%]">
              {[
                { src: "/2_thumbnail.jpg?height=80&width=80", alt: "Person example" },
                { src: "/3_thumbnail.jpg?height=80&width=80", alt: "Animal example" },
                { src: "/4_thumbnail.jpg?height=80&width=80", alt: "Car example" },
                { src: "/5_thumbnail.jpg?height=80&width=80", alt: "Controller example" },
              ].map((image, index) => (
                <motion.button
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                <Image
                width={800} height={600}
                src={image.src}
                alt={image.alt}
                  className="w-full h-full object-cover"
                />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 md:py-2 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500"
          >
            Stunning Quality
          </motion.h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 mb-8 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.name.toLowerCase()}
                  className="w-full py-2 md:py-3 px-2 md:px-4 rounded-full text-xs md:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-teal-400 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <AnimatePresence mode="wait">
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.name.toLowerCase()}>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mt-6 rounded-2xl border-0 shadow-xl overflow-hidden">
                      <CardContent className="p-0">
                      <div className="relative aspect-video">
  <div className="relative object-cover aspect-video overflow-hidden rounded-lg">
  <div className="absolute inset-0">
      <Image
        width={800} height={600}
        src="/background.jpg"
        alt="Processed"
        className="w-full h-full object-cover blur-sm"
      />
    </div>
    {/* Original Image */}
    <div
      className="absolute inset-0"
      style={{
        clipPath: `inset(0 ${100 - position}% 0 0)`, // Clip the image based on slider position
      }}
    >
      <Image
        width={800} height={600}
        src={category.image}
        alt="Original"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Processed Image */}
    <div className="absolute inset-0">
      <Image
        width={800} height={600}
        src={category.processImage}
        alt="Processed"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Invisible Range Input for Slider */}
    <input
                              type="range"
                              min="0"
                              max="100"
                              value={position}
                              onChange={handleSliderChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              aria-label="Percentage of before photo shown"
                            />

                            {/* Vertical Divider Line */}
                            <div
                              className="absolute top-0 bottom-0 w-[2px] bg-white left-[var(--position)] transform -translate-x-1/2 pointer-events-none"
                              aria-hidden="true"
                            ></div>

                            {/* Slider Button */}
                            <div
      className="absolute top-1/2 pointer-events-none"
      style={{
        left: `${position}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
        <div
          className="absolute top-1/2 left-[var(--position)] transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <line
              x1="128"
              y1="40"
              x2="128"
              y2="216"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></line>
            <line
              x1="96"
              y1="128"
              x2="16"
              y2="128"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></line>
            <polyline
              points="48 160 16 128 48 96"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></polyline>
            <line
              x1="160"
              y1="128"
              x2="240"
              y2="128"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></line>
            <polyline
              points="208 96 240 128 208 160"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></polyline>
          </svg>
        </div>
                            </div>
  </div>
</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative px-4 py-10 md:pt-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        />
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={controls}
          className="container mx-auto max-w-6xl relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500"
              >
                Remove backgrounds in seconds
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 mb-8"
              >
                Unleash your creativity with our AI-powered background removal tool.
              </motion.p>
              <motion.div variants={itemVariants}>
                <MotionButton
                  size="lg"
                  className=""
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {router.push(image_upload_href)}}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </MotionButton>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl"
              />
              <motion.img
                src="/fiveMinute.png"
                alt="AI Background Removal"
                className="relative z-10 mx-auto rounded-2xl"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      <section className="py-14 md:py-28 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500"
          >
            Just Picture It!
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[{
        id: 1,
        name: "Original",
        image: "/people-1.jpg?height=400&width=600"
    },
    {
        id: 2,
        name: "Transparent background",
        image: "/people-1-transparent2.jpg?height=400&width=600"
    },
    {
        id: 3,
        name: "New Background",
        image: "/people-skater-floor-fix.png?height=400&width=600"
    },
    {
        id: 4,
        name: "Endless possibilities",
        image: "/people-endless-possibilities.jpg?height=400&width=600"
    },].map((title) => (
              <motion.div
                key={title.id}
                variants={itemVariants}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4 lg:h-96">
                      <motion.img
                        src={title.image}
                        alt={title.name}
                        className="rounded-lg w-full lg:h-80 aspect-square object-cover mb-4"
                        whileHover={{
                          scale: 1.05,
                          rotate: Math.random() * 6 - 3,
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      />
                    <motion.p
                      className="text-center font-medium text-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {title.name}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}