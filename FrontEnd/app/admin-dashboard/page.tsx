"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockUsers, mockTrainers, mockPets, mockBookings } from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, UserCircle, PawPrint, CalendarDays, Activity, AlertTriangle, Camera, TrendingUp } from "lucide-react"
import type { RoutineLog } from "@/lib/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [routineLogs, setRoutineLogs] = useState<RoutineLog[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading) {
      if (user?.role === "owner") {
        router.push("/dashboard")
      } else if (user?.role === "trainer") {
        router.push("/trainer-dashboard")
      }
    }

    // Mock routine logs data - replace with API call
    const mockRoutineLogs: RoutineLog[] = [
      {
        id: "1",
        routineId: "1",
        petId: "1",
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-1.jpg",
        aiStatus: "healthy",
        aiMessage: "Pet looks active and healthy",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "2",
        routineId: "2",
        petId: "2",
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-2.jpg",
        aiStatus: "concerned",
        aiMessage: "Pet may need attention - monitor behavior",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: "3",
        routineId: "3",
        petId: "1",
        trainerId: "trainer2",
        photoUrl: "/uploads/mock-photo-3.jpg",
        aiStatus: "injured",
        aiMessage: "Pet appears injured - immediate veterinary attention needed",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        id: "4",
        routineId: "4",
        petId: "3",
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-4.jpg",
        aiStatus: "active",
        aiMessage: "Pet appears energetic and playful",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
    setRoutineLogs(mockRoutineLogs)
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  // Calculate platform statistics
  const totalUsers = mockUsers.filter(u => u.role === "owner").length
  const totalTrainers = mockTrainers.length
  const totalPets = mockPets.length
  const totalBookings = mockBookings.length
  const activeBookings = mockBookings.filter(b => b.status === "confirmed" || b.status === "completed").length
  
  // Routine monitoring statistics
  const totalRoutines = routineLogs.length
  const urgentAlerts = routineLogs.filter(log => 
    ['injured', 'sick', 'abnormal'].includes(log.aiStatus)
  ).length
  const todayRoutines = routineLogs.filter(log => {
    const today = new Date()
    const logDate = new Date(log.createdAt)
    return logDate.toDateString() === today.toDateString()
  }).length
  const healthyPets = routineLogs.filter(log => 
    ['healthy', 'active', 'resting', 'alert'].includes(log.aiStatus)
  ).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "resting":
      case "alert":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "concerned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "injured":
      case "sick":
      case "abnormal":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <StatsCard title="Total Owners" value={totalUsers} icon={Users} />
        <StatsCard title="Total Trainers" value={totalTrainers} icon={UserCircle} />
        <StatsCard title="Total Pets" value={totalPets} icon={PawPrint} />
        <StatsCard title="Active Bookings" value={activeBookings} icon={CalendarDays} />
        <StatsCard title="Total Routines" value={totalRoutines} icon={Activity} />
        <StatsCard title="Today's Routines" value={todayRoutines} icon={Camera} />
        <StatsCard title="Healthy Pets" value={healthyPets} icon={TrendingUp} />
        <StatsCard title="Urgent Alerts" value={urgentAlerts} icon={AlertTriangle} description="needs attention" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Users List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.filter(u => u.role === "owner").slice(0, 3).map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={u.avatar || "/placeholder.svg"} alt={u.fullName} />
                      <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{u.fullName}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{u.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Results & Pet Health Trends */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">AI Results & Pet Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routineLogs.slice(0, 5).map((log) => {
                const pet = mockPets.find(p => p.id === log.petId)
                const trainer = mockTrainers.find(t => t.userId === log.trainerId)
                return (
                  <div key={log.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full border text-xs ${getStatusColor(log.aiStatus)}`}>
                        {log.aiStatus}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{pet?.name || 'Unknown Pet'}</p>
                        <p className="text-xs text-muted-foreground">{log.aiMessage}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card className="border-border border-red-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Urgent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routineLogs
                .filter(log => ['injured', 'sick', 'abnormal'].includes(log.aiStatus))
                .map((log) => {
                  const pet = mockPets.find(p => p.id === log.petId)
                  const trainer = mockTrainers.find(t => t.userId === log.trainerId)
                  return (
                    <div key={log.id} className="flex items-start justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive" className="text-xs">
                          {log.aiStatus.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{pet?.name || 'Unknown Pet'}</p>
                          <p className="text-xs text-muted-foreground">{log.aiMessage}</p>
                          <p className="text-xs text-muted-foreground">
                            Trainer: {trainer ? mockUsers.find(u => u.id === trainer.userId)?.fullName : 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              {routineLogs.filter(log => ['injured', 'sick', 'abnormal'].includes(log.aiStatus)).length === 0 && (
                <p className="text-center text-muted-foreground py-4">No urgent alerts at this time</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainer Activity */}
      <Card className="border-border mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Trainer Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrainers.map((trainer) => {
              const trainerUser = mockUsers.find(u => u.id === trainer.userId)
              const trainerRoutines = routineLogs.filter(log => log.trainerId === trainer.userId)
              return (
                <div key={trainer.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={trainerUser?.avatar || "/placeholder.svg"} alt={trainerUser?.fullName} />
                      <AvatarFallback>{trainerUser?.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{trainerUser?.fullName}</p>
                      <p className="text-xs text-muted-foreground">Rating: {trainer.rating} ★</p>
                      <p className="text-xs text-muted-foreground">
                        {trainerRoutines.length} routines completed today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Badge variant="outline">{trainerRoutines.length} tasks</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
