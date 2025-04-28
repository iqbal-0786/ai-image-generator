"use client"

import { useState, useEffect } from "react"
import { ImageGeneratorForm } from "@/components/image-generator-form"
import { ImageDisplay } from "@/components/image-display"
import { ImageHistory } from "@/components/image-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import type { GeneratedImage } from "@/types/image"
import { Sparkles, Wand2 } from "lucide-react"

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([])
  const { toast } = useToast()

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

      // Add to history and keep only the last 5 images
      setImageHistory((prev) => {
        const updatedHistory = [newImage, ...prev].slice(0, 5)
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black text-white">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-black rounded-full p-4">
                <Wand2 className="h-10 w-10 text-purple-400" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text mb-4">
            AI Image Generator
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Transform your ideas into stunning visuals with our AI-powered image generator. Simply enter your prompt,
            choose a style, and watch the magic happen.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5 bg-black/40 rounded-xl p-6 backdrop-blur-md border border-purple-900/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
              Create Your Image
            </h2>
            <ImageGeneratorForm onGenerate={handleGenerateImage} isGenerating={isGenerating} />
          </div>

          {/* Display Section */}
          <div className="lg:col-span-7 bg-black/40 rounded-xl p-6 backdrop-blur-md border border-purple-900/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/60">
                <TabsTrigger
                  value="current"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Current Image
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Image History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <div className="bg-black/60 rounded-lg p-4 min-h-96">
                  <ImageDisplay image={currentImage} isLoading={isGenerating} />
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="bg-black/60 rounded-lg p-4 min-h-96">
                  <ImageHistory images={imageHistory} onSelect={handleSelectFromHistory} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-purple-900/50">
            <p className="text-gray-400 text-sm">
              Create amazing AI-generated images in seconds • © {new Date().getFullYear()} AI Image Generator
            </p>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
