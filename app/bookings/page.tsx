"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockBookings, mockPets, mockTrainers, mockUsers } from "@/lib/mock-data"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, X } from "lucide-react"
import { format } from "date-fns"

export default function BookingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const userBookings = mockBookings.filter((booking) => booking.ownerId === user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-warning/10 text-warning"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your training sessions.</p>
      </div>

      {userBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="Book a session with a trainer to get started with your pet's training journey."
          action={<Button onClick={() => router.push("/trainers")}>Browse Trainers</Button>}
        />
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking) => {
            const pet = mockPets.find((p) => p.id === booking.petId)
            const trainer = mockTrainers.find((t) => t.id === booking.trainerId)
            const trainerUser = mockUsers.find((u) => u.id === trainer?.userId)

            return (
              <Card key={booking.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trainerUser?.avatar || "/placeholder.svg"} alt={trainerUser?.fullName} />
                        <AvatarFallback>
                          {trainerUser?.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">
                          with {trainerUser?.fullName} for {pet?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.date), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {booking.time}
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      {booking.status === "pending" && (
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
