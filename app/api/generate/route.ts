import { NextResponse } from "next/server"

// Style prompts to enhance the base prompt
const stylePrompts = {
  realistic: "ultra realistic, highly detailed, 8k resolution, professional photography",
  anime: "Studio Ghibli style, anime, hand-drawn, colorful, Hayao Miyazaki inspired",
  fantasy: "fantasy art, magical, detailed, ethereal lighting, vibrant colors, digital painting",
  cyberpunk: "cyberpunk, neon lights, futuristic, dystopian, high contrast, digital art",
}

export async function POST(req: Request) {
  try {
    // Check if API key is set
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Parse request body
    const { prompt, style } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Enhance prompt with style
    const enhancedPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.realistic}`

    // Call HuggingFace API
    const response = await fetch(
      process.env.HUGGINGFACE_API_URL ||
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: "blurry, bad anatomy, bad hands, cropped, worst quality, low quality",
          },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      console.error("HuggingFace API error:", error)
      return NextResponse.json({ error: "Failed to generate image" }, { status: response.status })
    }

    // Get the image data as buffer
    const imageBuffer = await response.arrayBuffer()

    // Convert to base64
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const imageUrl = `data:image/jpeg;base64,${base64Image}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
