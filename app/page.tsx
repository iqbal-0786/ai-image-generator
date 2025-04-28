"use client"

import { useState, useEffect } from "react"
import { ImageGeneratorForm } from "@/components/image-generator-form"
import { ImageDisplay } from "@/components/image-display"
import { ImageHistory } from "@/components/image-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import type { GeneratedImage } from "@/types/image"

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
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text">
        AI Image Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <ImageGeneratorForm onGenerate={handleGenerateImage} isGenerating={isGenerating} />
        </div>

        <div className="lg:col-span-7">
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Image</TabsTrigger>
              <TabsTrigger value="history">Image History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              <ImageDisplay image={currentImage} isLoading={isGenerating} />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <ImageHistory images={imageHistory} onSelect={handleSelectFromHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
