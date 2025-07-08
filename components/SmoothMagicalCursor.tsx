"use client"

import { useEffect, useRef, useState } from "react"

interface MagicalSparkle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  symbol: string
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  type: "sparkle" | "trail" | "burst"
  opacity: number
}

interface CursorTrail {
  id: number
  x: number
  y: number
  timestamp: number
  opacity: number
}

const magicalSymbols = {
  sparkle: ["✨", "⭐", "💫", "🌟", "✦", "❋"],
  trail: ["·", "•", "◦", "○"],
  burst: ["💥", "🎆", "🎇", "✨", "🌟"],
}

const magicalColors = {
  primary: ["#FFD700", "#FF69B4", "#9370DB", "#00CED1"],
  secondary: ["#FF1493", "#7FFFD4", "#FFA500", "#DA70D6"],
  accent: ["#40E0D0", "#FF6347", "#98FB98", "#DDA0DD"],
}

export default function SmoothMagicalCursor() {
  const [sparkles, setSparkles] = useState<MagicalSparkle[]>([])
  const [trails, setTrails] = useState<CursorTrail[]>([])
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const sparkleIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastMousePos = useRef({ x: 0, y: 0 })
  const smoothMousePos = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })
  const lastTime = useRef(0)

  // Smooth interpolation function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  const createSparkle = (x: number, y: number, type: "sparkle" | "trail" | "burst" = "sparkle"): MagicalSparkle => {
    const colorPalette =
      type === "burst" ? magicalColors.accent : type === "trail" ? magicalColors.secondary : magicalColors.primary

    const baseVelocity = type === "burst" ? 6 : type === "trail" ? 2 : 3
    const spread = type === "burst" ? 30 : type === "trail" ? 10 : 15

    return {
      id: sparkleIdRef.current++,
      x: x + (Math.random() - 0.5) * spread,
      y: y + (Math.random() - 0.5) * spread,
      targetX: x,
      targetY: y,
      size:
        type === "burst"
          ? Math.random() * 1.2 + 0.8
          : type === "trail"
            ? Math.random() * 0.4 + 0.2
            : Math.random() * 0.8 + 0.4,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      symbol: magicalSymbols[type][Math.floor(Math.random() * magicalSymbols[type].length)],
      velocity: {
        x: (Math.random() - 0.5) * baseVelocity + mouseVelocity.current.x * 0.15,
        y: (Math.random() - 0.5) * baseVelocity + mouseVelocity.current.y * 0.15,
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      life: type === "burst" ? 120 : type === "trail" ? 45 : 80,
      maxLife: type === "burst" ? 120 : type === "trail" ? 45 : 80,
      type,
      opacity: 1,
    }
  }

  const createBurst = (x: number, y: number) => {
    const burstSparkles: MagicalSparkle[] = []
    const numSparkles = 6 + Math.random() * 4

    for (let i = 0; i < numSparkles; i++) {
      burstSparkles.push(createSparkle(x, y, "burst"))
    }

    setSparkles((prev) => [...prev.slice(-20), ...burstSparkles])
  }

  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime.current
      lastTime.current = currentTime

      // Smooth cursor position interpolation
      const smoothFactor = Math.min(deltaTime * 0.01, 1)
      smoothMousePos.current.x = lerp(smoothMousePos.current.x, lastMousePos.current.x, smoothFactor)
      smoothMousePos.current.y = lerp(smoothMousePos.current.y, lastMousePos.current.y, smoothFactor)

      setCursorPos({ x: smoothMousePos.current.x, y: smoothMousePos.current.y })

      // Update sparkles with smoother animation
      setSparkles((prevSparkles) => {
        return prevSparkles
          .map((sparkle) => {
            const ageRatio = 1 - sparkle.life / sparkle.maxLife
            const damping = sparkle.type === "burst" ? 0.96 : sparkle.type === "trail" ? 0.98 : 0.97

            return {
              ...sparkle,
              x: sparkle.x + sparkle.velocity.x,
              y: sparkle.y + sparkle.velocity.y,
              rotation: sparkle.rotation + sparkle.rotationSpeed,
              life: sparkle.life - 1,
              opacity: sparkle.type === "trail" ? 1 - ageRatio : Math.max(0, 1 - ageRatio * 1.5),
              velocity: {
                x: sparkle.velocity.x * damping,
                y: sparkle.velocity.y * damping + (sparkle.type === "trail" ? 0.03 : 0.08),
              },
            }
          })
          .filter((sparkle) => sparkle.life > 0 && sparkle.opacity > 0.01)
      })

      // Update trails with smooth fading
      setTrails((prevTrails) => {
        const now = Date.now()
        return prevTrails
          .map((trail) => {
            const age = now - trail.timestamp
            return {
              ...trail,
              opacity: Math.max(0, 1 - age / 800),
            }
          })
          .filter((trail) => trail.opacity > 0.01)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let moveTimeout: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY }

      // Calculate smooth velocity
      const deltaX = currentPos.x - lastMousePos.current.x
      const deltaY = currentPos.y - lastMousePos.current.y

      mouseVelocity.current = {
        x: lerp(mouseVelocity.current.x, deltaX * 0.5, 0.3),
        y: lerp(mouseVelocity.current.y, deltaY * 0.5, 0.3),
      }

      lastMousePos.current = currentPos
      setIsMoving(true)

      // Clear existing timeout and set new one
      clearTimeout(moveTimeout)
      moveTimeout = setTimeout(() => setIsMoving(false), 100)

      // Add smooth trail points
      setTrails((prev) => [
        ...prev.slice(-8),
        {
          id: Date.now() + Math.random(),
          x: currentPos.x,
          y: currentPos.y,
          timestamp: Date.now(),
          opacity: 1,
        },
      ])

      // Create sparkles based on smooth movement
      const speed = Math.sqrt(deltaX ** 2 + deltaY ** 2)

      if (speed > 2 && Math.random() < 0.25) {
        const numSparkles = Math.min(Math.floor(speed / 20) + 1, 2)
        const newSparkles: MagicalSparkle[] = []

        for (let i = 0; i < numSparkles; i++) {
          newSparkles.push(createSparkle(currentPos.x, currentPos.y, "sparkle"))
        }

        setSparkles((prev) => [...prev.slice(-30), ...newSparkles])
      }

      // Create subtle trail sparkles
      if (speed > 1 && Math.random() < 0.15) {
        setSparkles((prev) => [...prev.slice(-30), createSparkle(currentPos.x, currentPos.y, "trail")])
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)
      createBurst(e.clientX, e.clientY)

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
      clearTimeout(moveTimeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Custom cursor indicator */}
      <div
        className="absolute w-4 h-4 pointer-events-none transition-all duration-75 ease-out"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 1.5 : isMoving ? 1.2 : 1})`,
          zIndex: 100,
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${isClicking ? "#FFD700" : "#FF69B4"}80, transparent)`,
            boxShadow: `0 0 ${isClicking ? 20 : 10}px ${isClicking ? "#FFD700" : "#FF69B4"}60`,
            opacity: isMoving ? 0.8 : 0.4,
          }}
        />
      </div>

      {/* Smooth cursor trails */}
      {trails.map((trail, index) => {
        const scale = 0.2 + trail.opacity * 0.6
        const colorIndex = index % magicalColors.primary.length

        return (
          <div
            key={trail.id}
            className="absolute w-3 h-3 rounded-full transition-all duration-100 ease-out"
            style={{
              left: trail.x,
              top: trail.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: trail.opacity * 0.5,
              background: `radial-gradient(circle, ${magicalColors.primary[colorIndex]}60, transparent)`,
              boxShadow: `0 0 ${scale * 8}px ${magicalColors.primary[colorIndex]}40`,
            }}
          />
        )
      })}

      {/* Smooth magical sparkles */}
      {sparkles.map((sparkle) => {
        const scale = sparkle.opacity * sparkle.size
        const glowIntensity = sparkle.type === "burst" ? sparkle.size * 12 : sparkle.size * 6

        return (
          <div
            key={sparkle.id}
            className="absolute select-none transition-all duration-75 ease-out"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${sparkle.rotation}deg)`,
              opacity: sparkle.opacity,
              color: sparkle.color,
              fontSize: `${10 + sparkle.size * 8}px`,
              textShadow: `0 0 ${glowIntensity}px ${sparkle.color}`,
              filter: `drop-shadow(0 0 ${sparkle.size * 4}px ${sparkle.color}) brightness(${1 + sparkle.opacity * 0.3})`,
              zIndex: sparkle.type === "burst" ? 60 : 50,
            }}
          >
            {sparkle.symbol}
          </div>
        )
      })}

      {/* Click ripple effect */}
      {isClicking && (
        <div
          className="absolute rounded-full animate-ping"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-50%, -50%)",
            width: "32px",
            height: "32px",
            background: "radial-gradient(circle, #FFD70060, transparent)",
            boxShadow: "0 0 30px #FFD700",
          }}
        />
      )}
    </div>
  )
}
