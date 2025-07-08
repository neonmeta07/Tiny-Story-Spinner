"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useSpring, animated } from "@react-spring/web"
import { History, Heart, Share2, Trash2 } from "lucide-react"

export default function StoryHistory({ currentStory }) {
  const [stories, setStories] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [isOpen, setIsOpen] = useState(false)

  const panelAnimation = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    opacity: isOpen ? 1 : 0,
    config: { tension: 280, friction: 60 },
  })

  useEffect(() => {
    const savedStories = localStorage.getItem("storyHistory")
    const savedFavorites = localStorage.getItem("storyFavorites")

    if (savedStories) {
      setStories(JSON.parse(savedStories))
    }
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  useEffect(() => {
    if (currentStory) {
      const newStory = {
        ...currentStory,
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
      }

      setStories((prev) => {
        const updated = [newStory, ...prev.slice(0, 19)] // Keep last 20 stories
        localStorage.setItem("storyHistory", JSON.stringify(updated))
        return updated
      })
    }
  }, [currentStory])

  const toggleFavorite = (storyId) => {
    setFavorites((prev) => {
      const updated = new Set(prev)
      if (updated.has(storyId)) {
        updated.delete(storyId)
      } else {
        updated.add(storyId)
      }
      localStorage.setItem("storyFavorites", JSON.stringify([...updated]))
      return updated
    })
  }

  const deleteStory = (storyId) => {
    setStories((prev) => {
      const updated = prev.filter((story) => story.id !== storyId)
      localStorage.setItem("storyHistory", JSON.stringify(updated))
      return updated
    })

    setFavorites((prev) => {
      const updated = new Set(prev)
      updated.delete(storyId)
      localStorage.setItem("storyFavorites", JSON.stringify([...updated]))
      return updated
    })
  }

  const shareStory = async (story) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A magical story about ${story.metadata?.name}`,
          text: story.text,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(story.text)
      // You could add a toast notification here
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg"
        aria-label="Open story history"
      >
        <History className="w-5 h-5" />
      </Button>

      <animated.div
        style={panelAnimation}
        className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md border-l-2 border-purple-200 shadow-2xl z-40 overflow-hidden"
      >
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2 font-comic">
              <History className="w-5 h-5" />
              Story History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full p-4">
              {stories.length === 0 ? (
                <div className="text-center py-8 text-purple-600">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="font-quicksand">No stories yet!</p>
                  <p className="text-sm text-purple-400">Create your first magical tale</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stories.map((story) => (
                    <Card key={story.id} className="border-purple-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-2xl">{story.illustration}</div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(story.id)}
                              className={favorites.has(story.id) ? "text-red-500" : "text-gray-400"}
                            >
                              <Heart className="w-4 h-4" fill={favorites.has(story.id) ? "currentColor" : "none"} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => shareStory(story)}
                              className="text-blue-500"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteStory(story.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-3 mb-2 font-quicksand">{story.text}</p>

                        {story.metadata && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {story.metadata.name}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {story.metadata.setting}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {story.metadata.mood}
                            </Badge>
                          </div>
                        )}

                        <p className="text-xs text-purple-400">{story.timestamp}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </animated.div>

      {isOpen && <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
