"use client"

import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { settings, moods } from "@/lib/stories"
import { useSpring, animated } from "@react-spring/web"

const randomNames = [
  "Sparkle",
  "Moonbeam",
  "Whiskers",
  "Buttercup",
  "Stardust",
  "Pebble",
  "Marshmallow",
  "Dewdrop",
  "Twinkle",
  "Blossom",
  "Cuddles",
  "Shimmer",
  "Snuggles",
  "Glimmer",
  "Puff",
  "Honey",
  "Velvet",
  "Sugar",
  "Comet",
  "Fizz",
]

export default function RandomStoryButton({ onGenerate }) {
  const buttonAnimation = useSpring({
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
    config: { duration: 500 },
    reset: true,
  })

  const handleRandomStory = () => {
    const randomFormData = {
      name: randomNames[Math.floor(Math.random() * randomNames.length)],
      setting: settings[Math.floor(Math.random() * settings.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
    }

    // Play magical sound
    if ((window as any).magicalSounds) {
      ;(window as any).magicalSounds.chime()
    }

    onGenerate(randomFormData)
  }

  return (
    <animated.div>
      <Button
        onClick={handleRandomStory}
        variant="outline"
        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-bold py-2 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:shadow-xl hover:scale-105"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Random Magic!
      </Button>
    </animated.div>
  )
}
