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
import { ProjectDashboard, type Message as DashboardMessage, type Project as DashboardProject } from "@/components/ui/project-management-dashboard"
import { projectApi, type Project as ApiProject, type ProjectMessage } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [pets, setPets] = useState<Pet[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [projects, setProjects] = useState<DashboardProject[]>([])
  const [projectMessages, setProjectMessages] = useState<DashboardMessage[]>([])
  const [isProjectsLoading, setIsProjectsLoading] = useState(false)
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
      
      // Fetch projects from API
      fetchProjects()
    } catch (err) {
      console.error("Failed to fetch dashboard data", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    if (!user) return
    setIsProjectsLoading(true)
    try {
      const response = await projectApi.getProjects()
      const transformedProjects = response.projects.map(transformProject)
      setProjects(transformedProjects)
      
      // Fetch messages for all projects and transform to Message format
      if (response.projects.length > 0) {
        const allMessages: DashboardMessage[] = []
        for (const project of response.projects.slice(0, 3)) { // Limit to first 3 projects for demo
          try {
            const messagesResponse = await projectApi.getProjectMessages(project._id, { limit: 2 })
            const transformedMessages = messagesResponse.messages.map(transformProjectMessage)
            allMessages.push(...transformedMessages)
          } catch (err) {
            console.error(`Failed to fetch messages for project ${project._id}:`, err)
          }
        }
        setProjectMessages(allMessages)
      }
    } catch (err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setIsProjectsLoading(false)
    }
  }

  // Transform ProjectMessage to Message format for ProjectDashboard component
  const transformProjectMessage = (projectMessage: ProjectMessage): DashboardMessage => ({
    id: projectMessage._id,
    name: projectMessage.senderName,
    avatarUrl: projectMessage.senderAvatar || "https://i.pravatar.cc/96?img=1",
    text: projectMessage.text,
    date: new Date(projectMessage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    starred: projectMessage.starred
  })

  // Transform API Project to ProjectDashboard Project format
  const transformProject = (apiProject: ApiProject): DashboardProject => ({
    id: apiProject._id,
    name: apiProject.name,
    subtitle: apiProject.subtitle,
    date: apiProject.date ? new Date(apiProject.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    progress: apiProject.progress,
    status: apiProject.status,
    accentColor: apiProject.accentColor,
    participants: apiProject.participants,
    daysLeft: apiProject.daysLeft,
    bgColorClass: apiProject.bgColorClass
  })

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
              onProjectUpdate={async (proj) => {
                try {
                  // Convert back to API format
                  const apiProject: Partial<ApiProject> = {
                    _id: proj.id,
                    name: proj.name,
                    subtitle: proj.subtitle,
                    progress: proj.progress,
                    status: proj.status,
                    accentColor: proj.accentColor,
                    participants: proj.participants,
                    daysLeft: proj.daysLeft,
                    bgColorClass: proj.bgColorClass
                  }
                  await projectApi.updateProject(proj.id, apiProject)
                  setProjects((arr) => arr.map((p) => (p.id === proj.id ? proj : p)));
                } catch (error) {
                  console.error("Failed to update project:", error)
                }
              }}
              onProjectsReorder={async (ids) => {
                try {
                  await projectApi.reorderProjects(ids)
                  setProjects((arr) => {
                    const map = new Map(arr.map((p) => [p.id, p]));
                    return ids.map((id) => map.get(id)!).filter(Boolean);
                  });
                } catch (error) {
                  console.error("Failed to reorder projects:", error)
                }
              }}
              onProjectCreate={async (proj) => {
                try {
                  // Convert to API format
                  const apiProject: Partial<ApiProject> = {
                    name: proj.name,
                    subtitle: proj.subtitle,
                    progress: proj.progress,
                    status: proj.status,
                    accentColor: proj.accentColor,
                    participants: proj.participants,
                    daysLeft: proj.daysLeft,
                    bgColorClass: proj.bgColorClass
                  }
                  const newProject = await projectApi.createProject(apiProject)
                  const transformedProject = transformProject(newProject)
                  setProjects((arr) => [transformedProject, ...arr]);
                } catch (error) {
                  console.error("Failed to create project:", error)
                }
              }}
              onProjectAction={async (id, action) => {
                try {
                  switch (action) {
                    case "delete":
                      await projectApi.deleteProject(id)
                      setProjects((arr) => arr.filter((p) => p.id !== id));
                      break;
                    case "open":
                      console.log("Opening project:", id)
                      // Navigate to project details or open modal
                      break;
                    case "edit":
                      console.log("Editing project:", id)
                      // Open edit modal
                      break;
                  }
                } catch (error) {
                  console.error("Failed to perform project action:", error)
                }
              }}
              virtualizeList={true}
              estimatedRowHeight={150}
              onProjectClick={(id) => console.log("open:", id)}
              onMessageStarChange={async (messageId, starred) => {
                try {
                  // Find the project this message belongs to
                  const message = projectMessages.find(m => m.id === messageId)
                  if (message) {
                    // Find the project that contains this message
                    for (const project of projects) {
                      try {
                        await projectApi.toggleMessageStar(project.id, messageId)
                        setProjectMessages((arr) => 
                          arr.map((m) => (m.id === messageId ? { ...m, starred } : m))
                        );
                        break;
                      } catch (error) {
                        console.error("Failed to toggle message star:", error)
                      }
                    }
                  }
                } catch (error) {
                  console.error("Failed to toggle message star:", error)
                }
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
