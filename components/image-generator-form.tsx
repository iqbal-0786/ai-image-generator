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
import { Loader2, Sparkles } from "lucide-react"

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Image</CardTitle>
        <CardDescription>Enter a detailed description of the image you want to create.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="A futuristic cityscape with flying cars and neon lights..."
                        className="resize-none min-h-[120px]"
                        {...field}
                        onChange={handlePromptChange}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{promptLength}/500</div>
                    </div>
                  </FormControl>
                  <FormDescription>Be specific and detailed for better results.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="anime">Studio Ghibli Style</SelectItem>
                      <SelectItem value="fantasy">Fantasy Character</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk Art</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose a style for your generated image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
