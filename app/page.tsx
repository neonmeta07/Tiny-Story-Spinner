"use client"

import { useState } from "react"
import StoryForm from "@/components/StoryForm"
import StoryCard from "@/components/StoryCard"
import StoryHistory from "@/components/StoryHistory"
import MagicalBackground from "@/components/MagicalBackground"
import MagicalSounds from "@/components/MagicalSounds"
import RandomStoryButton from "@/components/RandomStoryButton"
import { useSpring, animated } from "@react-spring/web"
import SmoothMagicalCursor from "@/components/SmoothMagicalCursor"

export default function Home() {
  const [story, setStory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const headerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 60 },
  })

  const generateStory = async (formData) => {
    setIsLoading(true)
    setStory(null)

    // Play magical sound
    if ((window as any).magicalSounds) {
      ;(window as any).magicalSounds.whoosh()
    }

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate story")
      }

      const storyData = await response.json()
      setStory(storyData)

      // Play success sound
      if ((window as any).magicalSounds) {
        setTimeout(() => (window as any).magicalSounds.sparkle(), 500)
      }
    } catch (error) {
      console.error("Error generating story:", error)
      setStory({
        text: "Oops! Something magical went wrong. Please try again! ✨",
        illustration: "💫",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MagicalBackground />
      <MagicalSounds />
      <SmoothMagicalCursor />
      <StoryHistory currentStory={story} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <animated.header style={headerAnimation} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-bounce">✨</span>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 font-comic dark:text-purple-200 drop-shadow-lg">
              Tiny Story Spinner
            </h1>
            <span className="text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>
              ✨
            </span>
          </div>
          <p className="text-lg text-purple-600 font-quicksand font-medium dark:text-purple-400 drop-shadow-sm">
            Create magical micro-stories with your favorite characters!
          </p>

          <div className="mt-6">
            <RandomStoryButton onGenerate={generateStory} />
          </div>
        </animated.header>

        <main className="space-y-8">
          <StoryForm onGenerate={generateStory} isLoading={isLoading} />
          {(story || isLoading) && <StoryCard story={story} isLoading={isLoading} />}
        </main>

        <footer className="text-center mt-16 py-8">
          <p className="text-purple-500 font-quicksand font-medium dark:text-purple-400 drop-shadow-sm">
            Made with ❤️ and a sprinkle of magic
          </p>
        </footer>
      </div>
    </div>
  )
}
