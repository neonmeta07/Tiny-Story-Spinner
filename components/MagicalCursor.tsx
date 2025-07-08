"use client"

import { useEffect, useRef, useState } from "react"
import { useSpring } from "@react-spring/web"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  symbol: string
  velocity: { x: number; y: number }
  life: number
  maxLife: number
}

const sparkleSymbols = ["✨", "⭐", "💫", "🌟", "✦", "❋", "⚡", "💎", "🔮", "🌙"]
const sparkleColors = [
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#9370DB", // Medium Purple
  "#00CED1", // Dark Turquoise
  "#FF1493", // Deep Pink
  "#7FFFD4", // Aquamarine
  "#FFA500", // Orange
  "#DA70D6", // Orchid
  "#40E0D0", // Turquoise
  "#FF6347", // Tomato
]

export default function MagicalCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [isActive, setIsActive] = useState(false)
  const sparkleIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastMousePos = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })

  const cursorAnimation = useSpring({
    opacity: isActive ? 1 : 0,
    transform: isActive ? "scale(1)" : "scale(0.8)",
    config: { tension: 300, friction: 30 },
  })

  useEffect(() => {
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const updateSparkles = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        setSparkles((prevSparkles) => {
          return prevSparkles
            .map((sparkle) => ({
              ...sparkle,
              x: sparkle.x + sparkle.velocity.x,
              y: sparkle.y + sparkle.velocity.y,
              life: sparkle.life - 1,
              velocity: {
                x: sparkle.velocity.x * 0.98, // Slight deceleration
                y: sparkle.velocity.y * 0.98 + 0.1, // Gravity effect
              },
            }))
            .filter((sparkle) => sparkle.life > 0)
        })
        lastTime = currentTime
      }
      animationFrameRef.current = requestAnimationFrame(updateSparkles)
    }

    animationFrameRef.current = requestAnimationFrame(updateSparkles)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY }

      // Calculate velocity
      mouseVelocity.current = {
        x: currentPos.x - lastMousePos.current.x,
        y: currentPos.y - lastMousePos.current.y,
      }

      lastMousePos.current = currentPos
      setIsActive(true)

      // Create sparkles based on mouse speed
      const speed = Math.sqrt(mouseVelocity.current.x ** 2 + mouseVelocity.current.y ** 2)
      const shouldCreateSparkle = speed > 2 && Math.random() < 0.3

      if (shouldCreateSparkle) {
        const newSparkles: Sparkle[] = []
        const numSparkles = Math.min(Math.floor(speed / 10) + 1, 3)

        for (let i = 0; i < numSparkles; i++) {
          const sparkle: Sparkle = {
            id: sparkleIdRef.current++,
            x: currentPos.x + (Math.random() - 0.5) * 20,
            y: currentPos.y + (Math.random() - 0.5) * 20,
            size: Math.random() * 0.8 + 0.4,
            color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
            symbol: sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)],
            velocity: {
              x: (Math.random() - 0.5) * 4 + mouseVelocity.current.x * 0.1,
              y: (Math.random() - 0.5) * 4 + mouseVelocity.current.y * 0.1,
            },
            life: 60 + Math.random() * 30, // 1-1.5 seconds at 60fps
            maxLife: 60 + Math.random() * 30,
          }
          newSparkles.push(sparkle)
        }

        setSparkles((prev) => [...prev.slice(-20), ...newSparkles]) // Keep max 20 sparkles
      }
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    const handleMouseEnter = () => {
      setIsActive(true)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((sparkle) => {
        const opacity = sparkle.life / sparkle.maxLife
        const scale = (sparkle.life / sparkle.maxLife) * sparkle.size

        return (
          <div
            key={sparkle.id}
            className="absolute transition-all duration-100 ease-out"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              color: sparkle.color,
              fontSize: `${16 + sparkle.size * 8}px`,
              textShadow: `0 0 ${sparkle.size * 10}px ${sparkle.color}`,
              filter: `drop-shadow(0 0 ${sparkle.size * 5}px ${sparkle.color})`,
              animation: `sparkleFloat ${sparkle.maxLife / 60}s ease-out forwards`,
            }}
          >
            {sparkle.symbol}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes sparkleFloat {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.2) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
