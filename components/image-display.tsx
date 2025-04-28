"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
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
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
        <CardDescription>
          {image ? (
            <>
              Created {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              <Badge variant="outline" className="ml-2">
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
            <Skeleton className="w-full h-full rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-center">
                <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-muted-foreground">Creating your masterpiece...</p>
              </div>
            </div>
          </div>
        ) : image ? (
          <div className="w-full aspect-square max-w-md mx-auto relative rounded-md overflow-hidden shadow-lg">
            {isImageLoading && <Skeleton className="absolute inset-0" />}
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
          <div className="w-full aspect-square max-w-md mx-auto bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground text-center p-4">
              No image generated yet. Fill out the form and click "Generate Image" to create one.
            </p>
          </div>
        )}
      </CardContent>
      {image && (
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" className="w-full" onClick={handleDownload} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" className="w-full" onClick={handleShare} disabled={isLoading}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
