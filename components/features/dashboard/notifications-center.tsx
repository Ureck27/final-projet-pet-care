"use client"

import { Notification } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, X } from "lucide-react"
import { useState } from "react"

interface NotificationsCenterProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function NotificationsCenter({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationsCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">>("all")

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      "task-reminder": "🔔",
      "task-overdue": "⚠️",
      "activity-update": "✅",
      "emotion-alert": "😊",
      "health-alert": "🏥",
      "booking-update": "📅",
      message: "💬",
      review: "⭐",
      "platform-update": "🆕",
    }
    return icons[type] || "🔔"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "high":
        return "border-orange-200 bg-orange-50"
      case "medium":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "critical") return n.priority === "critical"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critical")
    .length

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🔔 Notifications</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          {unreadCount > 0 && (
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="relative"
            >
              Unread
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            </Button>
          )}
          {criticalCount > 0 && (
            <Button
              variant={filter === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("critical")}
              className="relative"
            >
              Critical
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-500 p-0 text-xs">
                {criticalCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {filter === "unread"
                    ? "No unread notifications"
                    : filter === "critical"
                      ? "No critical notifications"
                      : "No notifications"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getPriorityColor(
                notification.priority
              )} ${!notification.read ? "ring-1 ring-primary/20" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {notification.sentAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && onMarkAsRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(notification.id)}
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {notification.actionUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    asChild
                  >
                    <a href={notification.actionUrl}>View Details</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Daily Summary */}
      {filteredNotifications.length > 0 && (
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">📊 Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>
                ✅{" "}
                {notifications.filter((n) => n.type === "activity-update")
                  .length}{" "}
                activity updates
              </li>
              <li>
                🔔{" "}
                {notifications.filter((n) => n.type === "task-reminder").length}{" "}
                task reminders
              </li>
              <li>
                😊{" "}
                {notifications.filter((n) => n.type === "emotion-alert").length}{" "}
                mood updates
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
