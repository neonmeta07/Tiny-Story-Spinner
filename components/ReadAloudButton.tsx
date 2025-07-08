"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, VolumeX, Settings } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"

export default function ReadAloudButton({ text }) {
  const [isReading, setIsReading] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [showVoiceSelect, setShowVoiceSelect] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef(null)

  const buttonAnimation = useSpring({
    transform: isReading ? "scale(1.05)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  })

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Set default voice (prefer English voices)
        const defaultVoice =
          availableVoices.find((voice) => voice.lang.startsWith("en") && voice.default) ||
          availableVoices.find((voice) => voice.lang.startsWith("en")) ||
          availableVoices[0]

        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name)
        }
      }

      loadVoices()
      speechSynthesis.addEventListener("voiceschanged", loadVoices)

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [])

  const handleReadAloud = () => {
    if (!isSupported) return

    if (isReading) {
      speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Set voice if selected
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice)
      if (voice) {
        utterance.voice = voice
      }
    }

    utterance.rate = 0.9
    utterance.pitch = 1.1

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => setIsReading(false)
    utterance.onerror = () => setIsReading(false)

    speechSynthesis.speak(utterance)
  }

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName)
    setShowVoiceSelect(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <animated.div style={buttonAnimation}>
        <Button
          onClick={handleReadAloud}
          className={`${
            isReading ? "bg-red-400 hover:bg-red-500" : "bg-green-400 hover:bg-green-500"
          } text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl`}
          aria-label={isReading ? "Stop reading story" : "Read story aloud"}
        >
          <div className="flex items-center gap-2">
            {isReading ? (
              <>
                <VolumeX className="w-5 h-5" />
                Stop Reading
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Read Aloud
              </>
            )}
          </div>
        </Button>
      </animated.div>

      {voices.length > 1 && (
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowVoiceSelect(!showVoiceSelect)}
            className="rounded-full border-2 border-purple-200 hover:border-purple-300"
            aria-label="Voice settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {showVoiceSelect && (
            <div className="absolute top-full mt-2 right-0 z-10">
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger className="w-48 border-2 border-purple-200 rounded-xl bg-white">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
