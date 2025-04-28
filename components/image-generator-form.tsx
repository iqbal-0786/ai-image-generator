"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Palette, Lightbulb, Wand2 } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  prompt: z
    .string()
    .min(3, {
      message: "Prompt must be at least 3 characters.",
    })
    .max(500, {
      message: "Prompt must not exceed 500 characters.",
    }),
  style: z.string(),
})

type ImageGeneratorFormProps = {
  onGenerate: (prompt: string, style: string) => Promise<void>
  isGenerating: boolean
}

export function ImageGeneratorForm({ onGenerate, isGenerating }: ImageGeneratorFormProps) {
  const [promptLength, setPromptLength] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "realistic",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values.prompt, values.style)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptLength(e.target.value.length)
    form.setValue("prompt", e.target.value)
  }

  // Example prompts
  const examplePrompts = [
    "A futuristic cityscape with flying cars and neon lights",
    "A serene mountain landscape at sunset with a lake reflection",
    "A magical forest with glowing plants and mythical creatures",
    "An underwater scene with colorful coral reefs and exotic fish",
  ]

  const handleExampleClick = (prompt: string) => {
    form.setValue("prompt", prompt)
    setPromptLength(prompt.length)
  }

  return (
    <Card className="w-full bg-[#0F0F1A]/60 border-[#ffffff10]">
      <CardHeader className="pb-2">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-[#E9B8FF]" />
          Describe Your Vision
        </CardTitle>
        <CardDescription className="text-[#E9B8FF]/60">
          Enter a detailed description of the image you want to create.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#E9B8FF]">Image Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="A futuristic cityscape with flying cars and neon lights..."
                        className="resize-none min-h-[120px] bg-[#0F0F1A]/80 border-[#ffffff20] focus:border-[#FF00FF] focus:ring-[#FF00FF]/20 placeholder:text-[#E9B8FF]/40 text-white"
                        {...field}
                        onChange={handlePromptChange}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-[#E9B8FF]/60">{promptLength}/500</div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-[#E9B8FF]/60">
                    Be specific and detailed for better results.
                  </FormDescription>
                  <FormMessage className="text-[#FF00FF]" />
                </FormItem>
              )}
            />

            {/* Example prompts */}
            <div className="space-y-2">
              <p className="text-xs text-[#E9B8FF]/60">Try one of these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleExampleClick(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#0F0F1A]/80 border border-[#ffffff10] text-[#E9B8FF]/80 hover:bg-[#FF00FF]/20 hover:border-[#FF00FF]/50 transition-all duration-300"
                  >
                    {prompt.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#E9B8FF] flex items-center">
                    <Palette className="mr-2 h-4 w-4 text-[#E9B8FF]" />
                    Image Style
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#0F0F1A]/80 border-[#ffffff20] focus:ring-[#FF00FF]/20 text-white">
                        <SelectValue placeholder="Select a style" className="text-white" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F1A] border-[#ffffff20]">
                      <SelectItem value="realistic" className="text-white hover:bg-[#FF00FF]/20">Realistic</SelectItem>
                      <SelectItem value="anime" className="text-white hover:bg-[#FF00FF]/20">Studio Ghibli Style</SelectItem>
                      <SelectItem value="fantasy" className="text-white hover:bg-[#FF00FF]/20">Fantasy Character</SelectItem>
                      <SelectItem value="cyberpunk" className="text-white hover:bg-[#FF00FF]/20">Cyberpunk Art</SelectItem>
                      <SelectItem value="abstract" className="text-white hover:bg-[#FF00FF]/20">Abstract Art</SelectItem>
                      <SelectItem value="watercolor" className="text-white hover:bg-[#FF00FF]/20">Watercolor Painting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[#E9B8FF]/60">
                    Choose a style for your generated image.
                  </FormDescription>
                  <FormMessage className="text-[#FF00FF]" />
                </FormItem>
              )}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <Button
                type="submit"
                className="relative w-full bg-gradient-to-r from-[#FF00FF] to-[#00BFFF] hover:from-[#FF00FF]/90 hover:to-[#00BFFF]/90 transition-all duration-300 shadow-[0_0_15px_rgba(255,0,255,0.5)] rounded-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}