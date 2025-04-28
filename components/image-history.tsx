"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { GeneratedImage } from "@/types/image"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"

type ImageHistoryProps = {
  images: GeneratedImage[]
  onSelect: (image: GeneratedImage) => void
}

export function ImageHistory({ images, onSelect }: ImageHistoryProps) {
  if (images.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center bg-black/40 border-purple-900/30">
        <CardContent className="text-center p-6">
          <History className="h-16 w-16 mx-auto text-purple-500/50 mb-4" />
          <p className="text-purple-300/70">Your image history will appear here after you generate some images.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[500px] w-full pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all bg-black/40 border-purple-900/30"
            onClick={() => onSelect(image)}
          >
            <div className="relative aspect-square">
              <Image src={image.url || "/placeholder.svg"} alt={image.prompt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-purple-300 line-clamp-2">{image.prompt}</p>
                <Badge
                  variant="outline"
                  className="shrink-0 text-xs bg-purple-900/30 text-purple-300 border-purple-700"
                >
                  {image.style}
                </Badge>
              </div>
              <p className="text-xs text-purple-400/70 mt-1">
                {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
