"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import type { Pet, Booking } from "@/lib/types"
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
import { PawPrint, Calendar, Bell, TrendingUp, Plus, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ProjectDashboard } from "@/components/ui/project-management-dashboard"
import type { Project, Message } from "@/components/ui/project-management-dashboard"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [pets, setPets] = useState<Pet[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [projectMessages, setProjectMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const fetchDashboardData = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [petsData, bookingsData] = await Promise.all([
        api.get<Pet[]>(`/pets?ownerId=${user.id}`),
        api.get<Booking[]>(`/bookings?ownerId=${user.id}`)
      ])
      setPets(petsData)
      setBookings(bookingsData)
      
      // Initialize sample project data for demonstration
      setProjects([
        {
          id: "p1",
          name: "Pet Training Program",
          subtitle: "Basic Obedience Training",
          date: "2025-07-10",
          progress: 60,
          status: "inProgress",
          accentColor: "#f59e0b",
          participants: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=64&q=80&auto=format&fit=crop",
          ],
          daysLeft: 2,
          bgColorClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
          id: "p2",
          name: "Pet Health Check",
          subtitle: "Veterinary Appointment",
          date: "2025-06-15",
          progress: 50,
          status: "upcoming",
          accentColor: "#6366f1",
          participants: [
            "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=64&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=64&q=80&auto=format&fit=crop",
          ],
          daysLeft: "Due Friday",
          bgColorClass: "bg-indigo-50 dark:bg-indigo-900/20",
        },
        {
          id: "p3",
          name: "Grooming Schedule",
          subtitle: "Monthly Care Routine",
          date: "2025-03-02",
          progress: 100,
          status: "completed",
          accentColor: "#10b981",
          participants: [
            "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=64&q=80&auto=format&fit=crop",
          ],
          daysLeft: 0,
          bgColorClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
      ])
      
      setProjectMessages([
        {
          id: "m1",
          name: "Dr. Sarah Johnson",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80&auto=format&fit=crop",
          text: "Your pet's vaccination schedule is due next week. Please book an appointment.",
          date: "Aug 20",
          starred: true,
        },
        {
          id: "m2",
          name: "Mike Thompson",
          avatarUrl: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=96&q=80&auto=format&fit=crop",
          text: "Training session went great! Your dog is making excellent progress.",
          date: "Aug 21",
        },
      ])
    } catch (err) {
      console.error("Failed to fetch dashboard data", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const userPets = pets
  const userBookings = bookings
  const petStatuses = mockPetStatuses.filter((status) => userPets.some((pet) => pet.id === status.petId))
  
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
          <h1 className="text-3xl font-bold">Welcome back, {user.fullName.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">{"Here's what's happening with your pets today."}</p>
        </div>
        <Button asChild>
          <Link href="/pets">
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Pets" value={userPets.length} icon={PawPrint} />
        <StatsCard
          title="Upcoming Sessions"
          value={userBookings.filter((b) => b.status === "confirmed").length}
          icon={Calendar}
        />
        <StatsCard 
          title="Notifications" 
          value={unreadNotifications.toString()} 
          icon={Bell} 
          description={`${unreadNotifications} unread`} 
        />
        <StatsCard title="Activity" value="+12%" icon={TrendingUp} description="vs last month" trend="up" />
      </div>

      {/* Tabbed Interface for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
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
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
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
              <StatusTimeline statuses={petStatuses} pets={userPets} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Calendar */}
              <CalendarView bookings={userBookings} />

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
            onMarkAsRead={(id) => {
              console.log("Marking notification as read:", id)
            }}
            onDismiss={(id) => {
              console.log("Dismissing notification:", id)
            }}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="h-[calc(100vh-12rem)]">
            <ProjectDashboard
              title="Pet Care Projects"
              user={{ 
                name: user.fullName, 
                avatarUrl: "https://i.pravatar.cc/96?img=12" 
              }}
              projects={projects}
              messages={projectMessages}
              persistKey="pet-care-projects"
              onProjectUpdate={(proj) => {
                setProjects((arr) => arr.map((p) => (p.id === proj.id ? proj : p)));
              }}
              onProjectsReorder={(ids) => {
                setProjects((arr) => {
                  const map = new Map(arr.map((p) => [p.id, p]));
                  return ids.map((id) => map.get(id)!).filter(Boolean);
                });
              }}
              virtualizeList={true}
              estimatedRowHeight={150}
              onProjectAction={(id, a) => console.log("action:", a, id)}
              onProjectClick={(id) => console.log("open:", id)}
              onMessageStarChange={(id, s) => console.log("star:", id, s)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
