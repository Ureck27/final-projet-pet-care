"use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Activity, 
  Brain, 
  Camera, 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Pill,
  Thermometer,
  MapPin,
  MessageSquare,
  Bell,
  Plus,
  Eye
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { api } from "@/lib/api"
import type { Pet, DailyActivity, MoodEntry, PetStatus } from "@/lib/types"

interface PetDashboard {
  pet: Pet
  healthScore: number
  moodStatus: string
  activityLevel: string
  lastUpdate: Date
  recentActivities: DailyActivity[]
  nextAppointments: any[]
  alerts: Array<{
    type: "health" | "medication" | "appointment"
    message: string
    priority: "high" | "medium" | "low"
  }>
  aiInsights: {
    overallStatus: string
    confidence: number
    recommendations: string[]
  }
}

export default function PetDashboardPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [dashboard, setDashboard] = useState<PetDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchPets()
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (selectedPet) {
      fetchDashboardData()
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

  const fetchDashboardData = async () => {
    if (!selectedPet) return
    setIsLoading(true)
    
    try {
      // In a real app, fetch from API
      const mockDashboard = generateMockDashboard(selectedPet)
      setDashboard(mockDashboard)
    } catch (err) {
      console.error("Failed to fetch dashboard data", err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockDashboard = (pet: Pet): PetDashboard => {
    const now = new Date()
    
    return {
      pet,
      healthScore: 87,
      moodStatus: "content",
      activityLevel: "moderate",
      lastUpdate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      recentActivities: [
        {
          id: "1",
          petId: pet.id,
          caregiverId: "trainer1",
          activityType: "walk",
          title: "Morning Walk",
          description: "30-minute walk in the park",
          duration: 30,
          startTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 3.5 * 60 * 60 * 1000),
          emotion: "happy",
          emotionConfidence: 85,
          aiVerified: true,
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000)
        },
        {
          id: "2",
          petId: pet.id,
          caregiverId: "trainer1",
          activityType: "meal",
          title: "Breakfast",
          description: "Regular morning meal",
          startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          aiVerified: true,
          createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000)
        },
        {
          id: "3",
          petId: pet.id,
          caregiverId: "trainer1",
          activityType: "play",
          title: "Playtime",
          description: "Interactive play session with toys",
          duration: 20,
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          emotion: "playful",
          emotionConfidence: 92,
          aiVerified: true,
          createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000)
        }
      ],
      nextAppointments: [
        {
          id: "1",
          title: "Regular Checkup",
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          type: "veterinary"
        },
        {
          id: "2",
          title: "Grooming Session",
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          type: "grooming"
        }
      ],
      alerts: [
        {
          type: "medication",
          message: "Monthly heartworm prevention due in 5 days",
          priority: "medium"
        },
        {
          type: "appointment",
          message: "Veterinary checkup scheduled in 3 days",
          priority: "low"
        }
      ],
      aiInsights: {
        overallStatus: "healthy",
        confidence: 87,
        recommendations: [
          "Maintain current exercise routine",
          "Continue regular feeding schedule",
          "Monitor for any changes in behavior"
        ]
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-50"
      case "attention-needed": return "text-yellow-600 bg-yellow-50"
      case "concerning": return "text-orange-600 bg-orange-50"
      case "urgent": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "walk": return <Activity className="h-4 w-4 text-blue-500" />
      case "meal": return <Heart className="h-4 w-4 text-red-500" />
      case "play": return <Brain className="h-4 w-4 text-purple-500" />
      case "medication": return <Pill className="h-4 w-4 text-orange-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "health": return <Stethoscope className="h-4 w-4 text-red-500" />
      case "medication": return <Pill className="h-4 w-4 text-orange-500" />
      case "appointment": return <Calendar className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
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
              <Heart className="h-8 w-8 text-primary" />
              Pet Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview of your pet's health and activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Pet Selection */}
      <div className="mb-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`flex-shrink-0 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedPet?.id === pet.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() => setSelectedPet(pet)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
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
        </div>
      </div>

      {dashboard && (
        <div className="space-y-6">
          {/* Health Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="text-2xl font-bold">{dashboard.healthScore}%</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <Progress value={dashboard.healthScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mood Status</p>
                    <p className="text-2xl font-bold capitalize">{dashboard.moodStatus}</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                <Badge className={`mt-2 ${getStatusColor(dashboard.aiInsights.overallStatus)}`}>
                  {dashboard.aiInsights.overallStatus}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activity Level</p>
                    <p className="text-2xl font-bold capitalize">{dashboard.activityLevel}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+15% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Update</p>
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(dashboard.lastUpdate, { addSuffix: true })}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(dashboard.lastUpdate, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${getStatusColor(dashboard.aiInsights.overallStatus)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium capitalize">{dashboard.aiInsights.overallStatus}</span>
                    </div>
                    <Badge variant="outline">
                      {dashboard.aiInsights.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommendations:</p>
                    <ul className="space-y-1">
                      {dashboard.aiInsights.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-muted">
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {activity.duration && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {activity.duration} minutes
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.startTime, { addSuffix: true })}
                        </p>
                        {activity.emotion && (
                          <Badge variant="outline" className="mt-1">
                            {activity.emotion}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Appointments */}
            <div className="space-y-6">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboard.alerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          <Badge 
                            variant={alert.priority === "high" ? "destructive" : "outline"}
                            className="mt-1 text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboard.nextAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{appointment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(appointment.date, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">AI Analysis</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">Chat with AI</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule Care</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">View Timeline</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!dashboard && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a pet to view their dashboard</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
