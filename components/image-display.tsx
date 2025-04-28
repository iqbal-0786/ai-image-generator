"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, ImageIcon, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { GeneratedImage } from "@/types/image"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    <Card className="w-full h-full flex flex-col bg-[#0F0F1A]/60 border-[#ffffff10] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#00BFFF]">
            Generated Image
          </CardTitle>
          {image && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Info className="h-4 w-4 text-[#E9B8FF]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{image.prompt}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription className="text-[#E9B8FF]/60">
          {image ? (
            <>
              Created {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              <Badge
                variant="outline"
                className="ml-2 bg-[#0F0F1A]/80 text-[#E9B8FF] border-[#ffffff20] backdrop-blur-sm"
              >
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
            <Skeleton className="w-full h-full rounded-md bg-[#0F0F1A]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-2 border-[#FF00FF] animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-r-2 border-[#00BFFF] animate-spin animation-delay-500"></div>
                  <div className="absolute inset-0 rounded-full border-b-2 border-[#E9B8FF] animate-spin animation-delay-1000"></div>
                </div>
                <p className="mt-6 text-sm text-[#E9B8FF]/80">Creating your masterpiece...</p>
              </div>
            </div>
          </div>
        ) : image ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-square max-w-md mx-auto relative rounded-md overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.2)]"
          >
            {isImageLoading && <Skeleton className="absolute inset-0 bg-[#0F0F1A]" />}
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.prompt}
              fill
              className="object-cover rounded-md"
              onLoad={() => setIsImageLoading(false)}
              onLoadStart={() => setIsImageLoading(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full aspect-square max-w-md mx-auto bg-[#0F0F1A]/40 rounded-md flex items-center justify-center border border-[#ffffff10]">
            <div className="text-center p-6">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E9B8FF]/20 animate-slow-spin"></div>
                <ImageIcon className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#E9B8FF]/40" />
              </div>
              <p className="text-[#E9B8FF]/60 max-w-xs">
                No image generated yet. Fill out the form and click "Generate Image" to create one.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {image && (
        <CardFooter className="flex justify-between gap-2 p-4">
          <Button
            variant="outline"
            className="w-full border-[#ffffff20] text-[#E9B8FF] hover:bg-[#FF00FF]/20 hover:text-white transition-all duration-300"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#ffffff20] text-[#E9B8FF] hover:bg-[#00BFFF]/20 hover:text-white transition-all duration-300"
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
