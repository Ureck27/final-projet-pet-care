"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockPets, mockBookings, mockTrainers } from "@/lib/mock-data"
import { StatsCard } from "@/components/features/dashboard/stats-card"
import { CalendarView } from "@/components/features/schedule/calendar-view"
import { StatusUpdateForm } from "@/components/features/trainer/status-update-form"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PawPrint, Calendar, DollarSign, Star, ClipboardCheck } from "lucide-react"
import type { Pet } from "@/lib/types"
import type { StatusUpdateFormData } from "@/lib/validation"

export default function TrainerDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [statusFormOpen, setStatusFormOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user?.role === "owner") {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const trainer = mockTrainers.find((t) => t.userId === user.id)
  const trainerBookings = mockBookings.filter((b) => b.trainerId === trainer?.id)
  const assignedPetIds = [...new Set(trainerBookings.map((b) => b.petId))]
  const assignedPets = mockPets.filter((p) => assignedPetIds.includes(p.id))

  const handleStatusUpdate = (data: StatusUpdateFormData) => {
    console.log("Status updated:", data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
        <p className="text-muted-foreground">Manage your assigned pets and track daily tasks.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatsCard title="Assigned Pets" value={assignedPets.length} icon={PawPrint} />
        <StatsCard
          title="Today's Sessions"
          value={trainerBookings.filter((b) => b.status === "confirmed").length}
          icon={Calendar}
        />
        <StatsCard
          title="This Week"
          value={`$${(trainer?.pricing || 0) * 8}`}
          icon={DollarSign}
          description="Earnings"
        />
        <StatsCard title="Rating" value={trainer?.rating || 0} icon={Star} description="out of 5.0" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Assigned Pets */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Assigned Pets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedPets.map((pet) => (
                  <div key={pet.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={pet.photo || "/placeholder.svg"} alt={pet.name} />
                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{pet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed} • {pet.age} years old
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{pet.species}</Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPet(pet)
                          setStatusFormOpen(true)
                        }}
                      >
                        <ClipboardCheck className="mr-2 h-4 w-4" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))}
                {assignedPets.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No pets assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Tasks */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{"Today's Tasks"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainerBookings
                  .filter((b) => b.status === "confirmed")
                  .map((booking) => {
                    const pet = mockPets.find((p) => p.id === booking.petId)
                    return (
                      <div key={booking.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <div>
                          <p className="font-medium">{booking.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {pet?.name} • {booking.time}
                          </p>
                        </div>
                        <Badge>{booking.status}</Badge>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <CalendarView bookings={trainerBookings} />
        </div>
      </div>

      <StatusUpdateForm
        open={statusFormOpen}
        onOpenChange={setStatusFormOpen}
        pet={selectedPet}
        onSubmit={handleStatusUpdate}
      />
    </div>
  )
}
