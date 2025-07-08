"use client"

import { useEffect, useRef } from "react"

export default function MagicalSounds() {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    document.addEventListener("click", initAudio, { once: true })
    return () => document.removeEventListener("click", initAudio)
  }, [])

  const playMagicalSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  const playSparkleSound = () => {
    playMagicalSound(800, 0.2)
    setTimeout(() => playMagicalSound(1000, 0.15), 100)
    setTimeout(() => playMagicalSound(1200, 0.1), 200)
  }

  const playWhooshSound = () => {
    playMagicalSound(200, 0.5, "sawtooth")
  }

  const playChimeSound = () => {
    const notes = [523, 659, 784, 1047] // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => playMagicalSound(note, 0.3), index * 100)
    })
  }

  // Expose functions globally for other components to use
  useEffect(() => {
    ;(window as any).magicalSounds = {
      sparkle: playSparkleSound,
      whoosh: playWhooshSound,
      chime: playChimeSound,
    }
  }, [])

  return null
}
