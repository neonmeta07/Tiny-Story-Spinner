"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSpring, animated } from "@react-spring/web"
import { settings, moods } from "@/lib/stories"
import { Sparkles, Heart } from "lucide-react"
import CharacterAvatar from "./CharacterAvatar"

export default function StoryForm({ onGenerate, isLoading }) {
  const [formData, setFormData] = useState({
    name: "Sparkle",
    setting: "Enchanted Forest",
    mood: "Happy",
  })
  const [errors, setErrors] = useState({})

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 280, friction: 60 },
  })

  const buttonAnimation = useSpring({
    transform: isLoading ? "scale(0.95)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a name for your character!"
    } else if (formData.name.length < 2 || formData.name.length > 20) {
      newErrors.name = "Name must be between 2-20 characters!"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onGenerate(formData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <animated.div style={cardAnimation}>
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-purple-700 font-comic flex items-center justify-center gap-2 dark:text-purple-300">
            <Sparkles className="w-6 h-6" />
            Create Your Story
            <Sparkles className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <CharacterAvatar name={formData.name} mood={formData.mood} setting={formData.setting} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-700 font-quicksand font-semibold dark:text-purple-300">
                Character Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your character's name..."
                className={`border-2 rounded-xl ${errors.name ? "border-red-300" : "border-purple-200"} focus:border-purple-400 bg-white/50`}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-500 text-sm font-medium" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="setting" className="text-purple-700 font-quicksand font-semibold dark:text-purple-300">
                  Setting
                </Label>
                <Select value={formData.setting} onValueChange={(value) => handleInputChange("setting", value)}>
                  <SelectTrigger
                    id="setting"
                    className="border-2 border-purple-200 rounded-xl focus:border-purple-400 bg-white/50"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.map((setting) => (
                      <SelectItem key={setting} value={setting}>
                        {setting}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood" className="text-purple-700 font-quicksand font-semibold dark:text-purple-300">
                  Mood
                </Label>
                <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                  <SelectTrigger
                    id="mood"
                    className="border-2 border-purple-200 rounded-xl focus:border-purple-400 bg-white/50"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <animated.div style={buttonAnimation} className="text-center pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isLoading ? "Generating story..." : "Generate magical story"}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 animate-spin" />
                    Creating Magic...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Story
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </animated.div>
          </form>
        </CardContent>
      </Card>
    </animated.div>
  )
}
