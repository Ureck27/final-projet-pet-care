"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  BellRing, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Heart, 
  Pill, 
  Calendar,
  MessageSquare,
  Settings,
  Smartphone,
  Mail,
  Volume2,
  VolumeX
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { api } from "@/lib/api"
import type { Notification, NotificationPreferences, Pet } from "@/lib/types"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchNotificationsData()
    }
  }, [user, isAuthLoading, router])

  const fetchNotificationsData = async () => {
    if (!user) return
    setIsLoading(true)
    
    try {
      // In a real app, fetch from API
      const mockNotifications = generateMockNotifications(user.id)
      const mockPreferences = generateMockPreferences(user.id)
      const mockPets = await api.get<Pet[]>(`/pets?ownerId=${user.id}`)
      
      setNotifications(mockNotifications)
      setPreferences(mockPreferences)
      setPets(mockPets)
    } catch (err) {
      console.error("Failed to fetch notifications data", err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockNotifications = (userId: string): Notification[] => {
    const now = new Date()
    return [
      {
        id: "1",
        userId,
        type: "task-reminder",
        priority: "high",
        title: "Medication Reminder",
        message: "Max is due for his monthly heartworm prevention medication",
        actionUrl: "/pets/max",
        read: false,
        sentAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        createdAt: new Date(now.getTime() - 30 * 60 * 1000)
      },
      {
        id: "2",
        userId,
        type: "activity-update",
        priority: "medium",
        title: "Activity Completed",
        message: "Sarah completed Max's morning walk - 30 minutes in Central Park",
        actionUrl: "/pet-timeline",
        read: false,
        sentAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        id: "3",
        userId,
        type: "health-alert",
        priority: "high",
        title: "AI Health Analysis",
        message: "Recent photo analysis shows Max is in good health with high energy levels",
        actionUrl: "/ai-pet-assistant",
        read: true,
        readAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        sentAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      },
      {
        id: "4",
        userId,
        type: "booking-update",
        priority: "medium",
        title: "Booking Confirmed",
        message: "Your pet care appointment for tomorrow has been confirmed",
        actionUrl: "/bookings",
        read: true,
        readAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        sentAt: new Date(now.getTime() - 25 * 60 * 60 * 1000), // 25 hours ago
        createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1000)
      },
      {
        id: "5",
        userId,
        type: "emotion-alert",
        priority: "low",
        title: "Mood Update",
        message: "Max seems particularly playful today! Great mood detected.",
        actionUrl: "/pet-timeline",
        read: true,
        readAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        sentAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000)
      }
    ]
  }

  const generateMockPreferences = (userId: string): NotificationPreferences => {
    return {
      userId,
      pushNotificationsEnabled: true,
      emailEnabled: true,
      emailFrequency: "daily-digest",
      smsEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      workModeEnabled: false,
      notificationTypes: {
        taskReminders: true,
        activityUpdates: true,
        behavioralAlerts: true,
        healthAlerts: true,
        bookingUpdates: true,
        messages: true,
        systemUpdates: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true, readAt: new Date() }
          : notif
      )
    )
  }

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
    )
  }

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const updatePreferences = async (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return
    
    setPreferences(prev => prev ? { ...prev, [key]: value } : null)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task-reminder": return <Clock className="h-4 w-4 text-blue-500" />
      case "activity-update": return <Heart className="h-4 w-4 text-green-500" />
      case "health-alert": return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "booking-update": return <Calendar className="h-4 w-4 text-purple-500" />
      case "emotion-alert": return <Heart className="h-4 w-4 text-pink-500" />
      case "message": return <MessageSquare className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-50 text-red-700 border-red-200"
      case "high": return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low": return "bg-blue-50 text-blue-700 border-blue-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount} new</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay updated about your pet's care and health
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? "border-primary/30 bg-primary/5" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(notification.priority)} variant="outline">
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.sentAt, { addSuffix: true })}
                          </span>
                          {notification.actionUrl && (
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              View Details
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter(n => !n.read).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">All caught up! No unread notifications.</p>
              </CardContent>
            </Card>
          ) : (
            notifications
              .filter(n => !n.read)
              .map((notification) => (
                <Card key={notification.id} className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-muted">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(notification.priority)} variant="outline">
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.sentAt, { addSuffix: true })}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {preferences && (
            <>
              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Notification Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={preferences.pushNotificationsEnabled}
                      onCheckedChange={(checked) => updatePreferences("pushNotificationsEnabled", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get updates via email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailEnabled}
                      onCheckedChange={(checked) => updatePreferences("emailEnabled", checked)}
                    />
                  </div>

                  {preferences.emailEnabled && (
                    <div className="ml-4 space-y-2">
                      <p className="text-sm font-medium">Email Frequency</p>
                      <div className="space-y-1">
                        {["immediate", "daily-digest", "weekly-digest"].map((frequency) => (
                          <label key={frequency} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="emailFrequency"
                              value={frequency}
                              checked={preferences.emailFrequency === frequency}
                              onChange={(e) => updatePreferences("emailFrequency", e.target.value)}
                              className="text-blue-600"
                            />
                            <span className="text-sm">
                              {frequency === "immediate" && "Immediately"}
                              {frequency === "daily-digest" && "Daily digest"}
                              {frequency === "weekly-digest" && "Weekly digest"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive text messages for urgent alerts
                      </p>
                    </div>
                    <Switch
                      checked={preferences.smsEnabled}
                      onCheckedChange={(checked) => updatePreferences("smsEnabled", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BellRing className="h-5 w-5" />
                    Notification Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Task Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Medication, feeding, and care schedule reminders
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.taskReminders}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          taskReminders: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Activity Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Real-time updates on pet activities
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.activityUpdates}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          activityUpdates: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Behavioral Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        AI-detected mood and behavior changes
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.behavioralAlerts}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          behavioralAlerts: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Health Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Important health notifications and AI analysis results
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.healthAlerts}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          healthAlerts: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Booking Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Changes to pet care appointments
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.bookingUpdates}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          bookingUpdates: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        New messages from caregivers and trainers
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.messages}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          messages: checked
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Platform updates and announcements
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificationTypes.systemUpdates}
                      onCheckedChange={(checked) => 
                        updatePreferences("notificationTypes", {
                          ...preferences.notificationTypes,
                          systemUpdates: checked
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quiet Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <VolumeX className="h-5 w-5" />
                    Quiet Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Enable Quiet Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Limit notifications during specific times
                      </p>
                    </div>
                    <Switch
                      checked={!!preferences.quietHoursStart}
                      onCheckedChange={(checked) => {
                        updatePreferences("quietHoursStart", checked ? "22:00" : undefined)
                        updatePreferences("quietHoursEnd", checked ? "07:00" : undefined)
                      }}
                    />
                  </div>
                  
                  {preferences.quietHoursStart && (
                    <div className="ml-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <input
                          type="time"
                          value={preferences.quietHoursStart}
                          onChange={(e) => updatePreferences("quietHoursStart", e.target.value)}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <input
                          type="time"
                          value={preferences.quietHoursEnd}
                          onChange={(e) => updatePreferences("quietHoursEnd", e.target.value)}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
