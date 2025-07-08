"use client"

import { useEffect, useRef, useState } from "react"

interface CursorTrail {
  id: number
  x: number
  y: number
  timestamp: number
}

interface MagicalSparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  symbol: string
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  type: "sparkle" | "trail" | "burst"
}

const magicalSymbols = {
  sparkle: ["✨", "⭐", "💫", "🌟", "✦", "❋"],
  trail: ["·", "•", "◦", "○", "◯"],
  burst: ["💥", "🎆", "🎇", "✨", "🌟"],
}

const magicalColors = {
  primary: ["#FFD700", "#FF69B4", "#9370DB", "#00CED1"],
  secondary: ["#FF1493", "#7FFFD4", "#FFA500", "#DA70D6"],
  accent: ["#40E0D0", "#FF6347", "#98FB98", "#DDA0DD"],
}

export default function EnhancedMagicalCursor() {
  const [sparkles, setSparkles] = useState<MagicalSparkle[]>([])
  const [trails, setTrails] = useState<CursorTrail[]>([])
  const [isClicking, setIsClicking] = useState(false)
  const sparkleIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastMousePos = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })

  const createSparkle = (x: number, y: number, type: "sparkle" | "trail" | "burst" = "sparkle"): MagicalSparkle => {
    const colorPalette =
      type === "burst" ? magicalColors.accent : type === "trail" ? magicalColors.secondary : magicalColors.primary

    return {
      id: sparkleIdRef.current++,
      x: x + (Math.random() - 0.5) * (type === "burst" ? 40 : 15),
      y: y + (Math.random() - 0.5) * (type === "burst" ? 40 : 15),
      size:
        type === "burst"
          ? Math.random() * 1.5 + 0.8
          : type === "trail"
            ? Math.random() * 0.5 + 0.3
            : Math.random() * 1 + 0.5,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      symbol: magicalSymbols[type][Math.floor(Math.random() * magicalSymbols[type].length)],
      velocity: {
        x: (Math.random() - 0.5) * (type === "burst" ? 8 : 3) + mouseVelocity.current.x * 0.1,
        y: (Math.random() - 0.5) * (type === "burst" ? 8 : 3) + mouseVelocity.current.y * 0.1,
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life:
        type === "burst"
          ? 90 + Math.random() * 30
          : type === "trail"
            ? 30 + Math.random() * 20
            : 60 + Math.random() * 40,
      maxLife:
        type === "burst"
          ? 90 + Math.random() * 30
          : type === "trail"
            ? 30 + Math.random() * 20
            : 60 + Math.random() * 40,
      type,
    }
  }

  const createBurst = (x: number, y: number) => {
    const burstSparkles: MagicalSparkle[] = []
    const numSparkles = 8 + Math.random() * 4

    for (let i = 0; i < numSparkles; i++) {
      burstSparkles.push(createSparkle(x, y, "burst"))
    }

    setSparkles((prev) => [...prev.slice(-15), ...burstSparkles])
  }

  useEffect(() => {
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const updateParticles = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Update sparkles
        setSparkles((prevSparkles) => {
          return prevSparkles
            .map((sparkle) => ({
              ...sparkle,
              x: sparkle.x + sparkle.velocity.x,
              y: sparkle.y + sparkle.velocity.y,
              rotation: sparkle.rotation + sparkle.rotationSpeed,
              life: sparkle.life - 1,
              velocity: {
                x: sparkle.velocity.x * (sparkle.type === "burst" ? 0.95 : 0.98),
                y:
                  sparkle.velocity.y * (sparkle.type === "burst" ? 0.95 : 0.98) +
                  (sparkle.type === "trail" ? 0.05 : 0.1),
              },
            }))
            .filter((sparkle) => sparkle.life > 0)
        })

        // Update trails
        setTrails((prevTrails) => {
          const now = Date.now()
          return prevTrails.filter((trail) => now - trail.timestamp < 500)
        })

        lastTime = currentTime
      }
      animationFrameRef.current = requestAnimationFrame(updateParticles)
    }

    animationFrameRef.current = requestAnimationFrame(updateParticles)

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

      // Add trail point
      setTrails((prev) => [
        ...prev.slice(-10),
        {
          id: Date.now(),
          x: currentPos.x,
          y: currentPos.y,
          timestamp: Date.now(),
        },
      ])

      // Create sparkles based on mouse speed
      const speed = Math.sqrt(mouseVelocity.current.x ** 2 + mouseVelocity.current.y ** 2)

      if (speed > 3 && Math.random() < 0.4) {
        const numSparkles = Math.min(Math.floor(speed / 15) + 1, 2)
        const newSparkles: MagicalSparkle[] = []

        for (let i = 0; i < numSparkles; i++) {
          newSparkles.push(createSparkle(currentPos.x, currentPos.y, "sparkle"))
        }

        setSparkles((prev) => [...prev.slice(-25), ...newSparkles])
      }

      // Create trail sparkles occasionally
      if (speed > 1 && Math.random() < 0.2) {
        setSparkles((prev) => [...prev.slice(-25), createSparkle(currentPos.x, currentPos.y, "trail")])
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)
      createBurst(e.clientX, e.clientY)

      // Play click sound if available
      if ((window as any).magicalSounds) {
        ;(window as any).magicalSounds.sparkle()
      }
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Cursor trails */}
      {trails.map((trail, index) => {
        const age = Date.now() - trail.timestamp
        const opacity = Math.max(0, 1 - age / 500)
        const scale = 0.3 + (1 - age / 500) * 0.7

        return (
          <div
            key={trail.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: trail.x,
              top: trail.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.6,
              background: `radial-gradient(circle, ${magicalColors.primary[index % magicalColors.primary.length]}40, transparent)`,
              boxShadow: `0 0 ${scale * 10}px ${magicalColors.primary[index % magicalColors.primary.length]}60`,
            }}
          />
        )
      })}

      {/* Magical sparkles */}
      {sparkles.map((sparkle) => {
        const opacity = sparkle.life / sparkle.maxLife
        const scale = (sparkle.life / sparkle.maxLife) * sparkle.size
        const glowIntensity = sparkle.type === "burst" ? sparkle.size * 15 : sparkle.size * 8

        return (
          <div
            key={sparkle.id}
            className="absolute select-none"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${sparkle.rotation}deg)`,
              opacity: opacity,
              color: sparkle.color,
              fontSize: `${12 + sparkle.size * 6}px`,
              textShadow: `0 0 ${glowIntensity}px ${sparkle.color}`,
              filter: `drop-shadow(0 0 ${sparkle.size * 3}px ${sparkle.color}) brightness(${1 + opacity * 0.5})`,
              zIndex: sparkle.type === "burst" ? 60 : 50,
            }}
          >
            {sparkle.symbol}
          </div>
        )
      })}

      {/* Click indicator */}
      {isClicking && (
        <div
          className="absolute w-8 h-8 rounded-full animate-ping"
          style={{
            left: lastMousePos.current.x,
            top: lastMousePos.current.y,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, #FFD70080, transparent)",
            boxShadow: "0 0 20px #FFD700",
          }}
        />
      )}
    </div>
  )
}
