"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Heart, 
  Activity, 
  Camera, 
  Stethoscope,
  Pill,
  Thermometer,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  User,
  Brain
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { api } from "@/lib/api"
import type { Pet, DailyActivity, MoodEntry, PetStatus } from "@/lib/types"

interface TimelineEvent {
  id: string
  petId: string
  timestamp: Date
  type: "activity" | "mood" | "health" | "medication" | "care" | "ai-analysis"
  title: string
  description: string
  data: any
  caregiver?: {
    id: string
    name: string
    avatar?: string
  }
  location?: string
  attachments?: Array<{ type: "image" | "video"; url: string }>
  aiInsights?: {
    status: string
    confidence: number
    recommendations: string[]
  }
}

export default function PetTimelinePage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchPets()
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (selectedPet) {
      fetchTimelineData()
    }
  }, [selectedPet])

  const fetchPets = async () => {
    if (!user) return
    try {
      const petsData = await api.get<Pet[]>(`/pets?ownerId=${user.id}`)
      setPets(petsData)
      if (petsData.length > 0) {
        setSelectedPet(petsData[0])
      }
    } catch (err) {
      console.error("Failed to fetch pets", err)
    }
  }

  const fetchTimelineData = async () => {
    if (!selectedPet) return
    setIsLoading(true)
    
    try {
      // In a real app, fetch from API
      const mockEvents = generateMockTimelineEvents(selectedPet)
      setTimelineEvents(mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
    } catch (err) {
      console.error("Failed to fetch timeline data", err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockTimelineEvents = (pet: Pet): TimelineEvent[] => {
    const now = new Date()
    const events: TimelineEvent[] = []

    // AI Analysis Event
    events.push({
      id: "1",
      petId: pet.id,
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: "ai-analysis",
      title: "AI Health Analysis",
      description: "Photo analysis completed",
      data: {
        overallStatus: "healthy",
        confidence: 87,
        moodAnalysis: {
          dominantEmotion: "content",
          emotions: [
            { emotion: "content", confidence: 78 },
            { emotion: "calm", confidence: 65 }
          ]
        }
      },
      attachments: [{ type: "image", url: "/api/placeholder/300/200" }],
      aiInsights: {
        status: "healthy",
        confidence: 87,
        recommendations: [
          "Maintain current routine",
          "Continue regular exercise",
          "Monitor activity levels"
        ]
      }
    })

    // Activity Events
    events.push({
      id: "2",
      petId: pet.id,
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      type: "activity",
      title: "Morning Walk",
      description: "30-minute walk in the park",
      data: {
        duration: 30,
        distance: 1.2,
        heartRate: 120
      },
      caregiver: {
        id: "trainer1",
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40"
      },
      location: "Central Park"
    })

    // Mood Event
    events.push({
      id: "3",
      petId: pet.id,
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      type: "mood",
      title: "Mood Check: Playful",
      description: "Showing high energy and playful behavior",
      data: {
        emotion: "playful",
        confidence: 82,
        triggers: ["toy interaction", "human presence"]
      },
      caregiver: {
        id: "trainer1",
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40"
      }
    })

    // Medication Event
    events.push({
      id: "4",
      petId: pet.id,
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      type: "medication",
      title: "Medication Administered",
      description: "Monthly heartworm prevention",
      data: {
        medication: "Heartgard Plus",
        dosage: "1 chewable tablet",
        nextDue: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      },
      caregiver: {
        id: "trainer1",
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40"
      }
    })

    // Care Event
    events.push({
      id: "5",
      petId: pet.id,
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      type: "care",
      title: "Feeding Time",
      description: "Regular meal served",
      data: {
        foodType: "Dry kibble",
        amount: "1.5 cups",
        appetite: "good"
      },
      caregiver: {
        id: "trainer1",
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40"
      }
    })

    return events
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "ai-analysis": return <Brain className="h-4 w-4 text-purple-500" />
      case "activity": return <Activity className="h-4 w-4 text-blue-500" />
      case "mood": return <Heart className="h-4 w-4 text-blue-500" />
      case "health": return <Stethoscope className="h-4 w-4 text-green-500" />
      case "medication": return <Pill className="h-4 w-4 text-orange-500" />
      case "care": return <Heart className="h-4 w-4 text-red-500" />
      default: return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-50 text-green-700 border-green-200"
      case "attention-needed": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "concerning": return "bg-orange-50 text-orange-700 border-orange-200"
      case "urgent": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down": return <TrendingDown className="h-3 w-3 text-red-500" />
      case "stable": return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

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
              <Clock className="h-8 w-8 text-primary" />
              Pet Timeline
            </h1>
            <p className="text-muted-foreground">
              Track your pet's activities, health, and mood over time
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Pet Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Pet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPet?.id === pet.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedPet(pet)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={pet.photo} alt={pet.name} />
                      <AvatarFallback>{pet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} • {pet.age} years
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {pets.length === 0 && (
                <p className="text-sm text-muted-foreground">No pets registered</p>
              )}
            </CardContent>
          </Card>

          {/* Health Summary */}
          {selectedPet && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Status</span>
                  <Badge className={getStatusColor("healthy")}>Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Activity Level</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon("up")}
                    <span className="text-sm font-medium">High</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mood</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon("stable")}
                    <span className="text-sm font-medium">Content</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Check</span>
                  <span className="text-sm text-muted-foreground">2h ago</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Timeline */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedPet ? `${selectedPet.name}'s Timeline` : "Select a Pet"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {!selectedPet ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a pet to view their timeline</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      {/* Today's Summary */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Today's Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">5</div>
                              <p className="text-sm text-muted-foreground">Activities</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">Good</div>
                              <p className="text-sm text-muted-foreground">Mood Status</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-secondary">87%</div>
                              <p className="text-sm text-muted-foreground">Health Score</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Timeline Events */}
                      <div className="space-y-4">
                        {timelineEvents.map((event) => (
                          <div key={event.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="p-2 rounded-full bg-muted">
                                {getEventIcon(event.type)}
                              </div>
                              {event.id !== timelineEvents[timelineEvents.length - 1].id && (
                                <div className="w-0.5 h-full bg-border mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-medium">{event.title}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {event.description}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {format(event.timestamp, "MMM d, yyyy 'at' h:mm a")}
                                      </p>
                                    </div>
                                  </div>

                                  {/* AI Insights */}
                                  {event.aiInsights && (
                                    <div className={`mt-3 p-3 rounded-lg border ${getStatusColor(event.aiInsights.status)}`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Brain className="h-4 w-4" />
                                        <span className="font-medium text-sm">AI Insights</span>
                                        <Badge variant="outline" className="text-xs">
                                          {event.aiInsights.confidence}% confidence
                                        </Badge>
                                      </div>
                                      <div className="space-y-1">
                                        {event.aiInsights.recommendations.map((rec, idx) => (
                                          <p key={idx} className="text-xs">• {rec}</p>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Event Details */}
                                  <div className="mt-3 space-y-2">
                                    {event.caregiver && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                        <span>{event.caregiver.name}</span>
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Attachments */}
                                  {event.attachments && event.attachments.length > 0 && (
                                    <div className="mt-3">
                                      <div className="grid gap-2 sm:grid-cols-2">
                                        {event.attachments.map((attachment, idx) => (
                                          <div key={idx} className="relative group">
                                            {attachment.type === "image" ? (
                                              <img
                                                src={attachment.url}
                                                alt="Event attachment"
                                                className="rounded-lg w-full h-32 object-cover"
                                              />
                                            ) : (
                                              <video
                                                src={attachment.url}
                                                className="rounded-lg w-full h-32 object-cover"
                                                controls
                                              />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activities" className="mt-6">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Activity Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span>Walking</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                                </div>
                                <span className="text-sm">75%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Playing</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                                <span className="text-sm">60%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Resting</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted rounded-full h-2">
                                  <div className="bg-secondary h-2 rounded-full" style={{ width: "85%" }}></div>
                                </div>
                                <span className="text-sm">85%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Activity Events Filtered */}
                      <div className="space-y-4">
                        {timelineEvents
                          .filter(event => event.type === "activity")
                          .map((event) => (
                            <Card key={event.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-primary/5">
                                    <Activity className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="health" className="mt-6">
                    <div className="space-y-4">
                      {/* Health Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Health Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                              <Heart className="h-8 w-8 text-red-500" />
                              <div>
                                <p className="font-medium">Heart Rate</p>
                                <p className="text-2xl font-bold">120 bpm</p>
                                <p className="text-xs text-muted-foreground">Normal range</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Activity className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="font-medium">Activity Level</p>
                                <p className="text-2xl font-bold">High</p>
                                <p className="text-xs text-muted-foreground">Above average</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Health Events Filtered */}
                      <div className="space-y-4">
                        {timelineEvents
                          .filter(event => ["ai-analysis", "health", "medication"].includes(event.type))
                          .map((event) => (
                            <Card key={event.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-green-50">
                                    {getEventIcon(event.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
