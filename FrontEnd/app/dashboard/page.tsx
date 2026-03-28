"use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { api, petApi } from "@/lib/api"
import type { Pet } from "@/lib/types"
import { 
  mockPetStatuses, mockTasks, mockDailyActivities, 
  mockMoodEntries, mockNotifications 
} from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { StatusTimeline } from "@/components/features/dashboard/status-timeline"
import { CalendarView } from "@/components/features/schedule/calendar-view"
import { PetCard } from "@/components/features/pets/pet-card"
import { TaskDashboard } from "@/components/features/dashboard/task-dashboard"
import { ActivityTimeline } from "@/components/features/dashboard/activity-timeline"
import { EmotionDashboard } from "@/components/features/dashboard/emotion-dashboard"
import { NotificationsCenter } from "@/components/features/dashboard/notifications-center"
import { MessagesWidget } from "@/components/features/messaging/messages-widget"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PawPrint, Calendar, Bell, TrendingUp, Plus, MessageCircle, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [pets, setPets] = useState<Pet[]>([])
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
      const petsData = await petApi.getUserPets()
      setPets(petsData || [])
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
  
  // Set default pet if none selected
  const currentPet = selectedPetId 
    ? userPets.find(p => p.id === selectedPetId)
    : userPets[0]
  
  const petTasks = currentPet ? mockTasks.filter((t) => t.petId === currentPet.id) : []
  const petActivities = currentPet ? mockDailyActivities.filter((a) => a.petId === currentPet.id) : []
  const petMood = currentPet ? mockMoodEntries.filter((m) => m.petId === currentPet.id) : []
  const userNotifications = mockNotifications.filter((n) => n.userId === user.id)

  const unreadNotifications = userNotifications.filter((n) => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">{"Here's what's happening with your pets today."}</p>
        </div>
        <Button asChild>
          <Link href="/add-pet">
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Pets" value={userPets.length} icon={PawPrint} />
        <StatsCard
          title="Pending Pets"
          value={userPets.filter(p => p.status === 'pending').length}
          icon={Calendar}
        />
        <StatsCard 
          title="Notifications" 
          value={unreadNotifications.toString()} 
          icon={Bell} 
          description={`${unreadNotifications} unread`} 
        />
        <StatsCard title="Active Pets" value={userPets.filter(p => p.status === 'accepted').length} icon={TrendingUp} />
      </div>

      {/* Tabbed Interface for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="w-4 h-4 mr-1" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {unreadNotifications}
              </span>
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
                    {userPets.slice(0, 2).map((pet) => (
                      <div
                        key={pet.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedPetId(pet.id)}
                      >
                        <PetCard pet={pet} />
                      </div>
                    ))}
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
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
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
            notifications={userNotifications}
            onMarkAsRead={(id) => {}}
            onDismiss={(id) => {}}
          />
        </TabsContent>

      </Tabs>
    </div>
  )
}
