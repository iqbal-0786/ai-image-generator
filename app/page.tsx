"use client"

import { useState, useEffect } from "react"
import { ImageGeneratorForm } from "@/components/image-generator-form"
import { ImageDisplay } from "@/components/image-display"
import { ImageHistory } from "@/components/image-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import type { GeneratedImage } from "@/types/image"
import { Sparkles, BrainCircuit } from "lucide-react"
import { motion } from "framer-motion"

// Define a type for a star
type Star = {
  id: number
  top: string
  left: string
  width: string
  height: string
  opacity: number
  animationDuration: string
  animationDelay: string
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([])
  const [stars, setStars] = useState<Star[]>([])
  const { toast } = useToast()

  // Generate stars on the client-side only
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.8,
      animationDuration: `${Math.random() * 5 + 3}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
    
    setStars(generatedStars);
  }, []);

  // Load image history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("imageHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setImageHistory(parsedHistory)
      } catch (error) {
        console.error("Failed to parse image history:", error)
      }
    }
  }, [])

  // Save image history to localStorage whenever it changes
  useEffect(() => {
    if (imageHistory.length > 0) {
      localStorage.setItem("imageHistory", JSON.stringify(imageHistory))
    }
  }, [imageHistory])

  const handleGenerateImage = async (prompt: string, style: string) => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, style }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate image")
      }

      const data = await response.json()

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt,
        style,
        createdAt: new Date().toISOString(),
      }

      setCurrentImage(newImage)

      // Add to history and keep only the last 50 images
      setImageHistory((prev) => {
        const updatedHistory = [newImage, ...prev].slice(0, 50)
        return updatedHistory
      })

      toast({
        title: "Image generated successfully!",
        description: "Your image has been created based on your prompt.",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Failed to generate image",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setCurrentImage(image)
  }

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] w-full h-[500px] left-[-20%] rounded-full bg-[#4B0082]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] w-full h-[500px] right-[-20%] rounded-full bg-[#8A2BE2]/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#9400D3]/5 blur-[80px] animate-slow-spin" />
      </div>

      {/* Stars background - client-side only */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
              animation: `twinkle ${star.animationDuration} infinite ${star.animationDelay}`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto py-12 px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <div className="relative bg-[#0F0F1A] rounded-full p-5 border border-[#ffffff20]">
                <BrainCircuit className="h-12 w-12 text-[#E9B8FF]" />
              </div>
            </div>
          </div>
          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF00FF] via-[#E9B8FF] to-[#00BFFF]">
              AI Image Generator
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#E9B8FF]/80 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Transform your imagination into stunning visuals with our state-of-the-art AI. Simply describe what you
            want, choose a style, and watch as artificial intelligence brings your vision to life.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Form Section */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#0F0F1A]/80 backdrop-blur-xl rounded-xl p-6 border border-[#ffffff20] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-[#FF00FF] to-[#00BFFF] rounded-full mr-3"></div>
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-[#E9B8FF]" />
                  Create Your Image
                </h2>
              </div>
              <ImageGeneratorForm onGenerate={handleGenerateImage} isGenerating={isGenerating} />
            </div>
          </div>

          {/* Display Section */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00BFFF] to-[#FF00FF] rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#0F0F1A]/80 backdrop-blur-xl rounded-xl p-6 border border-[#ffffff20] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#0F0F1A]/80 border border-[#ffffff10] rounded-full p-1">
                  <TabsTrigger
                    value="current"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF00FF] data-[state=active]:to-[#00BFFF] data-[state=active]:text-white transition-all duration-300"
                  >
                    Current Image
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BFFF] data-[state=active]:to-[#FF00FF] data-[state=active]:text-white transition-all duration-300"
                  >
                    Image History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                  <div className="bg-[#0F0F1A]/60 rounded-lg p-4 min-h-96 border border-[#ffffff10]">
                    <ImageDisplay image={currentImage} isLoading={isGenerating} />
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="bg-[#0F0F1A]/60 rounded-lg p-4 min-h-96 border border-[#ffffff10]">
                    <ImageHistory images={imageHistory} onSelect={handleSelectFromHistory} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-[#0F0F1A]/80 px-8 py-4 rounded-full backdrop-blur-xl border border-[#ffffff20]">
            <p className="text-[#E9B8FF]/60 text-sm">
              Create amazing AI-generated images in seconds • © {new Date().getFullYear()} AI Image Generator
            </p>
          </div>
        </motion.div>
      </div>

      <Toaster />
    </div>
  )
}