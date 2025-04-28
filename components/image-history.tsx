"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { GeneratedImage } from "@/types/image"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type ImageHistoryProps = {
  images: GeneratedImage[]
  onSelect: (image: GeneratedImage) => void
}

export function ImageHistory({ images, onSelect }: ImageHistoryProps) {
  if (images.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Your image history will appear here after you generate some images.</p>
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
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => onSelect(image)}
          >
            <div className="relative aspect-square">
              <Image src={image.url || "/placeholder.svg"} alt={image.prompt} fill className="object-cover" />
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{image.prompt}</p>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {image.style}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
