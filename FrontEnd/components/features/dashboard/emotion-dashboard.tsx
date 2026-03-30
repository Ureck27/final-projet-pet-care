"use client"

import { MoodEntry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

interface EmotionDashboardProps {
  moodEntries: MoodEntry[]
  petName: string
}

export function EmotionDashboard({ moodEntries, petName }: EmotionDashboardProps) {
  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: "😊",
      sad: "😔",
      anxious: "😰",
      calm: "😌",
      playful: "🎾",
      stressed: "😟",
      neutral: "😐",
      distressed: "😫",
      content: "😊",
    }
    return emojis[emotion] || "😐"
  }

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-yellow-100 text-yellow-800",
      sad: "bg-blue-100 text-blue-800",
      anxious: "bg-orange-100 text-orange-800",
      calm: "bg-green-100 text-green-800",
      playful: "bg-purple-100 text-purple-800",
      stressed: "bg-red-100 text-red-800",
      neutral: "bg-gray-100 text-gray-800",
      distressed: "bg-red-100 text-red-800",
      content: "bg-yellow-100 text-yellow-800",
    }
    return colors[emotion] || "bg-gray-100 text-gray-800"
  }

  const getMoodTrend = () => {
    if (moodEntries.length === 0) return "No data"

    const dominantEmotion = moodEntries.reduce((prev, current) =>
      current.confidence > prev.confidence ? current : prev
    )

    const happyScore = moodEntries.filter((m) =>
      ["happy", "playful", "content"].includes(m.emotion)
    ).length / moodEntries.length * 100

    return {
      emotion: dominantEmotion.emotion,
      confidence: dominantEmotion.confidence,
      happyScore: Math.round(happyScore),
    }
  }

  const trend = getMoodTrend()

  const emotionCounts = moodEntries.reduce(
    (acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const sortedEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Daily Mood Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{petName}'s Daily Mood</span>
            {trend !== "No data" && (
              <span className="text-3xl">{getEmotionEmoji(trend.emotion)}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trend !== "No data" ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dominant Emotion</span>
                  <span className="text-sm text-muted-foreground">
                    {trend.confidence}% confidence
                  </span>
                </div>
                <Badge className={`mt-2 capitalize ${getEmotionColor(trend.emotion)}`}>
                  {trend.emotion}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Daily Happiness Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {trend.happyScore}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${trend.happyScore}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Based on {moodEntries.length} activity{" "}
                {moodEntries.length === 1 ? "update" : "updates"} today
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No mood data available yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Emotion Breakdown */}
      {sortedEmotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emotion Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedEmotions.map(([emotion, count]) => (
                <div key={emotion}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getEmotionEmoji(emotion)}
                      </span>
                      <span className="capitalize text-sm font-medium">
                        {emotion}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} time{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${(count / moodEntries.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Mood Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mood updates yet
              </p>
            ) : (
              moodEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-lg border p-3 ${getEmotionColor(
                    entry.emotion
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    {entry.photoUrl && (
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={entry.photoUrl}
                          alt={entry.emotion}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getEmotionEmoji(entry.emotion)}
                        </span>
                        <span className="font-semibold capitalize">
                          {entry.emotion}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.confidence}%
                        </span>
                      </div>
                      {entry.caregiverNotes && (
                        <p className="mt-1 text-sm">
                          {entry.caregiverNotes}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Alerts */}
      {moodEntries.some((m) =>
        ["sad", "anxious", "stressed", "distressed"].includes(m.emotion)
      ) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-orange-900">
              <AlertCircle className="h-5 w-5" />
              Behavioral Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              We've detected some stressful moments today. Consider adjusting
              {petName}'s routine or consulting with a trainer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
