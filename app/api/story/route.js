import { NextResponse } from "next/server"
import { storyTemplates } from "@/lib/stories"

export async function POST(request) {
  try {
    const { name, setting, mood } = await request.json()

    // Validate input
    if (!name || !setting || !mood) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (name.length < 2 || name.length > 20) {
      return NextResponse.json({ error: "Name must be between 2-20 characters" }, { status: 400 })
    }

    // Select random story template
    const randomTemplate = storyTemplates[Math.floor(Math.random() * storyTemplates.length)]

    // Replace placeholders with user input
    let storyText = randomTemplate.template
      .replace(/{name}/g, name)
      .replace(/{setting}/g, setting.toLowerCase())
      .replace(/{mood}/g, mood.toLowerCase())

    // Capitalize first letter after periods for better readability
    storyText = storyText.replace(/\. ([a-z])/g, (match, letter) => ". " + letter.toUpperCase())

    return NextResponse.json({
      text: storyText,
      illustration: randomTemplate.illustration,
      metadata: {
        name,
        setting,
        mood,
        templateId: randomTemplate.id,
      },
    })
  } catch (error) {
    console.error("Story generation error:", error)
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 })
  }
}
