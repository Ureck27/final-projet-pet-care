"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockBookings, mockPets, mockTrainers, mockUsers } from "@/lib/mock-data"
import { CalendarView } from "@/components/features/schedule/calendar-view"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"

export default function SchedulePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

  const userBookings =
    user.role === "user"
      ? mockBookings.filter((b) => b.ownerId === user.id)
      : mockBookings.filter((b) => {
          const trainer = mockTrainers.find((t) => t.userId === user.id)
          return b.trainerId === trainer?.id
        })

  const selectedDateBookings = userBookings.filter((b) => isSameDay(new Date(b.date), selectedDate))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-muted-foreground">View and manage your upcoming sessions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarView bookings={userBookings} onDateClick={setSelectedDate} />
        </div>

        <div>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateBookings.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No sessions scheduled</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateBookings.map((booking) => {
                    const pet = mockPets.find((p) => p.id === booking.petId)
                    const trainer = mockTrainers.find((t) => t.id === booking.trainerId)
                    const trainerUser = mockUsers.find((u) => u.id === trainer?.userId)

                    return (
                      <div key={booking.id} className="rounded-lg border border-border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{booking.time}</span>
                          <Badge variant="secondary">{booking.status}</Badge>
                        </div>
                        <p className="text-sm">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role === "user" ? `Trainer: ${trainerUser?.fullName}` : `Pet: ${pet?.name}`}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
