"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { GeneratedImage } from "@/types/image"
import { formatDistanceToNow } from "date-fns"

type ImageDisplayProps = {
  image: GeneratedImage | null
  isLoading: boolean
}

export function ImageDisplay({ image, isLoading }: ImageDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleDownload = () => {
    if (!image) return

    const link = document.createElement("a")
    link.href = image.url
    link.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!image) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Image",
          text: image.prompt,
          url: image.url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(image.url)
        .then(() => alert("Image URL copied to clipboard!"))
        .catch((err) => console.error("Could not copy URL:", err))
    }
  }

  return (
    <Card className="w-full h-full flex flex-col bg-black/40 border-purple-900/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Generated Image
        </CardTitle>
        <CardDescription>
          {image ? (
            <>
              Created {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              <Badge variant="outline" className="ml-2 bg-purple-900/30 text-purple-300 border-purple-700">
                {image.style.charAt(0).toUpperCase() + image.style.slice(1)}
              </Badge>
            </>
          ) : (
            "Your generated image will appear here"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-2 sm:p-6">
        {isLoading ? (
          <div className="w-full aspect-square max-w-md mx-auto relative">
            <Skeleton className="w-full h-full rounded-md bg-purple-900/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-purple-300">Creating your masterpiece...</p>
              </div>
            </div>
          </div>
        ) : image ? (
          <div className="w-full aspect-square max-w-md mx-auto relative rounded-md overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            {isImageLoading && <Skeleton className="absolute inset-0 bg-purple-900/20" />}
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.prompt}
              fill
              className="object-cover rounded-md"
              onLoad={() => setIsImageLoading(false)}
              onLoadStart={() => setIsImageLoading(true)}
            />
          </div>
        ) : (
          <div className="w-full aspect-square max-w-md mx-auto bg-purple-900/10 rounded-md flex items-center justify-center border border-purple-900/20">
            <div className="text-center p-4">
              <ImageIcon className="h-16 w-16 mx-auto text-purple-500/50 mb-4" />
              <p className="text-purple-300/70">
                No image generated yet. Fill out the form and click "Generate Image" to create one.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {image && (
        <CardFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/30 hover:text-white"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/30 hover:text-white"
            onClick={handleShare}
            disabled={isLoading}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
