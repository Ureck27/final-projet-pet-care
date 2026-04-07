"use client"

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { api, petApi } from "@/lib/api"
import type { Pet } from "@/lib/types"
import { 
  mockPetStatuses, mockTasks, mockDailyActivities, mockMoodEntries
} from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { StatusTimeline } from "@/components/features/dashboard/status-timeline"
import { NotificationsCenter } from "@/components/features/dashboard/notifications-center"
import { CalendarView } from "@/components/features/schedule/calendar-view"
import { PetCard } from "@/components/features/pets/pet-card"
import { TaskDashboard } from "@/components/features/dashboard/task-dashboard"
import { ActivityTimeline } from "@/components/features/dashboard/activity-timeline"
import { EmotionDashboard } from "@/components/features/dashboard/emotion-dashboard"
import { MessagesWidget } from "@/components/features/messaging/messages-widget"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PawPrint, Calendar, TrendingUp, Plus, MessageCircle, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [pets, setPets] = useState<Pet[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading) {
      if (user?.role === "trainer") {
        router.push("/trainer-dashboard")
      } else if (user?.role === "admin") {
        router.push("/admin-dashboard")
      } else {
        fetchDashboardData()
      }
    }
  }, [user, isAuthLoading, router])

  const fetchDashboardData = async (isRetry = false) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    if (isRetry) setIsRetrying(true)
    
    try {
      const [petsData, notificationsData] = await Promise.all([
        petApi.getUserPets(),
        api.get<any[]>('/notifications').catch(() => []) // Catch error if router isn't fully ready
      ])
      
      setPets(petsData || [])
      
      // Map sentAt strings to Date objects for NotificationsCenter
      const formattedNotifs = (notificationsData || []).map(n => ({
        ...n,
        sentAt: new Date(n.sentAt)
      }))
      setNotifications(formattedNotifs)
      
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch dashboard data", err)
      
      // Handle specific backend down error
      if (err.message && err.message.startsWith('BACKEND_DOWN')) {
        setError('The server is currently unavailable. Please try again later or contact support if the problem persists.')
      } else if (err.message && err.message.includes('timed out')) {
        setError('Request timed out. The server may be slow to respond. Please try again.')
      } else {
        setError(err.message || 'Failed to load dashboard data. Please try again.')
      }
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const handleRetry = () => {
    fetchDashboardData(true)
  }



  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, {})
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  if (isAuthLoading || (!isLoading && !error && !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              className="min-w-[120px]"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-muted-foreground">
            {isRetrying ? 'Retrying connection...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  const userPets = pets
  
  // Debug duplicate IDs:
  console.log("userPets IDs:", userPets.map(p => p.id || (p as any)._id))
  
  // Set default pet if none selected
  const currentPet = selectedPetId 
    ? userPets.find(p => p.id === selectedPetId || (p as any)._id?.toString() === selectedPetId)
    : userPets[0]
  
  const petTasks = currentPet ? (mockTasks?.filter((t) => t.petId === currentPet.id) || []) : []
  const petActivities = currentPet ? (mockDailyActivities?.filter((a) => a.petId === currentPet.id) || []) : []
  const petMood = currentPet ? (typeof mockMoodEntries !== "undefined" && Array.isArray(mockMoodEntries) ? mockMoodEntries.filter((m) => m.petId === currentPet.id) : []) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">{"Here's what's happening with your pets today."}</p>
        </div>
        <Button asChild data-testid="dashboard-add-pet">
          <Link href="/add-pet">
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Pets" value={userPets.length} icon={PawPrint} />
        <StatsCard
          title="Pending Pets"
          value={userPets.filter(p => p.status === 'pending').length}
          icon={Calendar}
        />
        <StatsCard title="Active Pets" value={userPets.filter(p => p.status === 'accepted').length} icon={TrendingUp} />
      </div>

      {/* Tabbed Interface for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="w-4 h-4 mr-1" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Pets */}
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">My Pets</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/pets">View all</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {userPets?.length > 0 && userPets.slice(0, 2).map((pet, index) => {
                      const petId = pet.id || (pet as any)._id?.toString();
                      return (
                        <div
                          key={petId || index}
                          className="cursor-pointer"
                          onClick={() => setSelectedPetId(petId)}
                        >
                          <PetCard pet={pet} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <StatusTimeline statuses={[]} pets={userPets} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Calendar */}
              <CalendarView bookings={[]} />

              {/* Messages Widget */}
              <MessagesWidget userId={user.id} />

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild data-testid="dashboard-book-session">
                    <Link href="/trainers">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Session
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/pets">
                      <PawPrint className="mr-2 h-4 w-4" />
                      Manage Pets
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          {currentPet ? (
            <TaskDashboard tasks={petTasks} petName={currentPet.name} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No pets found. Please add a pet first.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          {currentPet ? (
            <ActivityTimeline activities={petActivities} petName={currentPet.name} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No activities recorded yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Mood Tab */}
        <TabsContent value="mood">
          {currentPet ? (
            <EmotionDashboard moodEntries={petMood} petName={currentPet.name} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No mood data available yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <MessagesWidget userId={user.id} />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationsCenter 
            notifications={notifications} 
            onMarkAsRead={handleMarkAsRead} 
          />
        </TabsContent>

      </Tabs>
    </div>
  )
}
