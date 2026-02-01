"use client"

import { DailyActivity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

interface ActivityTimelineProps {
  activities: DailyActivity[]
  petName: string
}

export function ActivityTimeline({ activities, petName }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      walk: "🐕",
      meal: "🍽️",
      play: "🎾",
      training: "🎓",
      medication: "💊",
      rest: "😴",
      other: "📋",
    }
    return icons[type] || "📋"
  }

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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📅 {petName}'s Timeline</span>
          <Badge variant="outline">Today</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No activities recorded yet today.
              </p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-4 top-12 h-8 w-0.5 bg-gray-200" />
                )}

                <div className="flex gap-4">
                  {/* Timeline icon */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg">
                      {getActivityIcon(activity.activityType)}
                    </div>
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{activity.title}</h4>
                          {activity.aiVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              AI Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(activity.startTime)}
                          {activity.duration &&
                            ` • ${activity.duration} minutes`}
                        </p>
                      </div>
                      {activity.emotion && (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-2xl">
                            {getEmotionEmoji(activity.emotion)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {activity.emotionConfidence}%
                          </span>
                        </div>
                      )}
                    </div>

                    {activity.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    )}

                    {/* Activity Photo */}
                    {activity.photo && (
                      <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg">
                        <Image
                          src={activity.photo}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Caregiver Notes */}
                    {activity.caregiveNotes && (
                      <div className="mt-3 rounded-lg bg-blue-50 p-3">
                        <p className="text-xs font-semibold text-blue-900">
                          Caregiver Notes:
                        </p>
                        <p className="text-sm text-blue-900">
                          {activity.caregiveNotes}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    {activity.location?.address && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        📍 {activity.location.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
