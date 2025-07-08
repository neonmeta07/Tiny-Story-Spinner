"use client"

import { useMemo } from "react"
import { useSpring, animated } from "@react-spring/web"

const avatarStyles = {
  Happy: { color: "#FFD700", expression: "😊", aura: "#FFE55C" },
  Curious: { color: "#87CEEB", expression: "🤔", aura: "#B0E0E6" },
  Brave: { color: "#FF6347", expression: "😤", aura: "#FFA07A" },
  Dreamy: { color: "#DDA0DD", expression: "😴", aura: "#E6E6FA" },
  Silly: { color: "#98FB98", expression: "🤪", aura: "#F0FFF0" },
}

const settingBackgrounds = {
  "Enchanted Forest": "🌲🍄🦋",
  "Cozy Bakery": "🧁🍰🥐",
  "Starry Sky": "⭐🌙✨",
  "Mystic Ocean": "🌊🐚🐠",
  "Fluffy Clouds": "☁️🌈🕊️",
}

export default function CharacterAvatar({ name, mood, setting, className = "" }) {
  const style = avatarStyles[mood] || avatarStyles.Happy
  const background = settingBackgrounds[setting] || "✨"

  const avatarAnimation = useSpring({
    from: { transform: "scale(0) rotate(-180deg)", opacity: 0 },
    to: { transform: "scale(1) rotate(0deg)", opacity: 1 },
    config: { tension: 200, friction: 20 },
  })

  const pulseAnimation = useSpring({
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.05)" },
    config: { duration: 2000 },
    loop: { reverse: true },
  })

  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [name])

  return (
    <animated.div style={avatarAnimation} className={`relative ${className}`}>
      <animated.div
        style={pulseAnimation}
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${style.color}, ${style.aura})`,
          boxShadow: `0 0 20px ${style.aura}`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-30 animate-ping"
          style={{ backgroundColor: style.aura }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-xs font-comic">{initials}</div>
          <div className="text-lg">{style.expression}</div>
        </div>
      </animated.div>

      <div className="absolute -top-2 -right-2 text-xs opacity-70">
        {background.split("").map((emoji, index) => (
          <span
            key={index}
            className="absolute animate-bounce"
            style={{
              animationDelay: `${index * 0.2}s`,
              transform: `rotate(${index * 45}deg) translateY(-${10 + index * 2}px)`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </animated.div>
  )
}
