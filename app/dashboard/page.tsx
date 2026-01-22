"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockPets, mockBookings, mockPetStatuses } from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { StatusTimeline } from "@/components/features/dashboard/status-timeline"
import { CalendarView } from "@/components/features/schedule/calendar-view"
import { PetCard } from "@/components/features/pets/pet-card"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, Calendar, Bell, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user?.role === "trainer") {
      router.push("/trainer-dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const userPets = mockPets.filter((pet) => pet.ownerId === user.id)
  const userBookings = mockBookings.filter((booking) => booking.ownerId === user.id)
  const petStatuses = mockPetStatuses.filter((status) => userPets.some((pet) => pet.id === status.petId))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]}!</h1>
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
        <StatsCard title="Notifications" value="2" icon={Bell} description="2 unread" />
        <StatsCard title="Activity" value="+12%" icon={TrendingUp} description="vs last month" trend="up" />
      </div>

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
                  <PetCard key={pet.id} pet={pet} />
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
    </div>
  )
}
