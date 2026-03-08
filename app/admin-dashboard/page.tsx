"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockUsers, mockTrainers, mockPets, mockBookings } from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, UserCircle, PawPrint, CalendarDays } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

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
  const activeBookings = mockBookings.filter(b => b.status === "confirmed" || b.status === "in-progress").length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Owners" value={totalUsers} icon={Users} />
        <StatsCard title="Total Trainers" value={totalTrainers} icon={UserCircle} />
        <StatsCard title="Total Pets" value={totalPets} icon={PawPrint} />
        <StatsCard title="Active Bookings" value={activeBookings} description={`Total ${totalBookings}`} icon={CalendarDays} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Users List (Mock) */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.filter(u => u.role === "owner").map((u) => (
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

        {/* Recent Applications / Trainers (Mock) */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Platform Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrainers.map((t) => {
                const trainerUser = mockUsers.find(u => u.id === t.userId);
                if (!trainerUser) return null;
                return (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trainerUser.avatar || "/placeholder.svg"} alt={trainerUser.fullName} />
                        <AvatarFallback>{trainerUser.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{trainerUser.fullName}</p>
                        <p className="text-xs text-muted-foreground">Rating: {t.rating} ★</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
