"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { GeneratedImage } from "@/types/image"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"

type ImageHistoryProps = {
  images: GeneratedImage[]
  onSelect: (image: GeneratedImage) => void
}

export function ImageHistory({ images, onSelect }: ImageHistoryProps) {
  if (images.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center bg-[#0F0F1A]/60 border-[#ffffff10]">
        <CardContent className="text-center p-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E9B8FF]/20 animate-slow-spin"></div>
            <Clock className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#E9B8FF]/40" />
          </div>
          <p className="text-[#E9B8FF]/60 max-w-xs">
            Your image history will appear here after you generate some images.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[500px] w-full pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FF00FF]/50 transition-all duration-300 bg-[#0F0F1A]/60 border-[#ffffff10]"
              onClick={() => onSelect(image)}
            >
              <div className="relative aspect-square">
                <Image src={image.url || "/placeholder.svg"} alt={image.prompt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 w-full">
                    <p className="text-white text-xs line-clamp-2">{image.prompt}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs text-[#E9B8FF]/80 line-clamp-1">{image.prompt}</p>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-xs bg-[#0F0F1A]/80 text-[#E9B8FF] border-[#ffffff20]"
                  >
                    {image.style}
                  </Badge>
                </div>
                <p className="text-xs text-[#E9B8FF]/40 mt-1">
                  {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}
