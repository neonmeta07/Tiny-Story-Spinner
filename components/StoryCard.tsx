"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSpring, animated } from "@react-spring/web"
import ReadAloudButton from "./ReadAloudButton"
import { Heart } from "lucide-react"
import { useEffect } from "react"

export default function StoryCard({ story, isLoading }) {
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px) scale(0.95)" },
    to: {
      opacity: isLoading || story ? 1 : 0,
      transform: isLoading || story ? "translateY(0px) scale(1)" : "translateY(30px) scale(0.95)",
    },
    config: { tension: 280, friction: 60 },
  })

  const illustrationAnimation = useSpring({
    from: { transform: "translateY(-20px) scale(0.8)", opacity: 0 },
    to: {
      transform: story ? "translateY(0px) scale(1)" : "translateY(-20px) scale(0.8)",
      opacity: story ? 1 : 0,
    },
    config: { tension: 200, friction: 20 },
    delay: story ? 200 : 0,
  })

  const textAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: story ? 1 : 0 },
    config: { tension: 280, friction: 60 },
    delay: story ? 400 : 0,
  })

  // In the story display section, add sound effect on story appearance:
  useEffect(() => {
    if (story && (window as any).magicalSounds) {
      setTimeout(() => (window as any).magicalSounds.sparkle(), 600)
    }
  }, [story])

  if (!isLoading && !story) return null

  return (
    <animated.div style={cardAnimation}>
      <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-2 border-purple-200 shadow-2xl">
        <CardContent className="p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-pink-400 animate-spin" />
              </div>
              <p className="text-purple-600 font-quicksand font-semibold text-lg dark:text-purple-400">
                Sprinkling magic dust... ✨
              </p>
            </div>
          ) : story ? (
            <div className="space-y-6">
              <animated.div style={illustrationAnimation} className="text-center">
                <div className="text-6xl mb-4" role="img" aria-label="Story illustration">
                  {story.illustration}
                </div>
              </animated.div>

              <animated.div style={textAnimation}>
                <p className="text-gray-700 leading-relaxed text-lg font-comic text-center dark:text-gray-300">
                  {story.text}
                </p>
              </animated.div>

              <animated.div style={textAnimation} className="flex justify-center pt-4">
                <ReadAloudButton text={story.text} />
              </animated.div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </animated.div>
  )
}
