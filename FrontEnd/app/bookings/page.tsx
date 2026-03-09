"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockBookings, mockPets, mockTrainers, mockUsers, mockCarePlans } from "@/lib/mock-data"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingFlow } from "@/components/features/bookings/booking-flow"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Package, MapPin, AlertCircle, Plus, CheckCircle, Clock4 } from "lucide-react"
import { format } from "date-fns"
import type { Pet as PetType, Trainer } from "@/lib/types"

const packageDetails: Record<string, any> = {
  daily: { name: "Daily Care", icon: "☀️", duration: "1-3 hours/day" },
  overnight: { name: "Overnight Care", icon: "🌙", duration: "24 hours" },
  travel: { name: "Travel Care", icon: "✈️", duration: "Multi-day" },
  custom: { name: "Custom Package", icon: "⚙️", duration: "Custom duration" },
}

const packageColors: Record<string, string> = {
  daily: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  overnight: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  travel: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  custom: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
}

import { api } from "@/lib/api"
import type { Booking, Trainer, User } from "@/lib/types"

export default function BookingsPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [bookingFlow, setBookingFlow] = useState({ open: false, pet: null as PetType | null, trainer: null as Trainer | null })
  const [activeTab, setActiveTab] = useState("active")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pets, setPets] = useState<PetType[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [trainerUsers, setTrainerUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchBookingsData()
    }
  }, [user, isAuthLoading, router])

  const fetchBookingsData = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [bookingsData, petsData, trainersData, tUsersData] = await Promise.all([
        api.get<Booking[]>(`/bookings?ownerId=${user.id}`),
        api.get<PetType[]>(`/pets?ownerId=${user.id}`),
        api.get<Trainer[]>('/trainers'),
        api.get<User[]>('/users?role=trainer')
      ])
      setBookings(bookingsData)
      setPets(petsData)
      setTrainers(trainersData)
      setTrainerUsers(tUsersData)
    } catch (err) {
      console.error("Failed to fetch bookings data", err)
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

  const userBookings = bookings
  const activeBookings = userBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const completedBookings = userBookings.filter((b) => b.status === "completed")

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock4 className="h-4 w-4" />
      default:
        return null
    }
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const pet = pets.find((p) => p.id === booking.petId)
    const trainer = trainers.find((t) => t.id === booking.trainerId)
    const trainerUser = trainerUsers.find((u) => u.id === trainer?.userId)
    const carePlan = null // Mocking care plan as null for now
    const pkg = booking.packageType ? packageDetails[booking.packageType] : null

    return (
      <Card className={`border-2 ${booking.packageType ? packageColors[booking.packageType] : "border-border"}`}>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={trainerUser?.avatar || "/placeholder.svg"} alt={trainerUser?.fullName} />
                <AvatarFallback>
                  {trainerUser?.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-lg">{pet?.name}'s Care with {trainerUser?.fullName}</p>
                    {pkg && (
                      <p className="text-sm text-muted-foreground">
                        {pkg.icon} {pkg.name} • {pkg.duration}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(booking.status)} variant="secondary">
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Schedule Info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{format(new Date(booking.date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Starts at {booking.time}</span>
            </div>
          </div>

          {/* Meet & Greet Status */}
          {booking.meetAndGreetScheduled && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm font-medium">
                {booking.meetAndGreetCompleted ? "✓ Meet & Greet Completed" : "📅 Meet & Greet Scheduled"}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(booking.meetAndGreetScheduled), "MMM d, yyyy")}
              </p>
            </div>
          )}

          {/* Care Plan Summary */}
          {carePlan && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm font-medium">Care Plan on File</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {carePlan.dietaryRequirements && (
                  <p>
                    <span className="font-medium">Diet:</span> {carePlan.dietaryRequirements}
                  </p>
                )}
                {carePlan.medications && carePlan.medications.length > 0 && (
                  <p>
                    <span className="font-medium">Medications:</span> {carePlan.medications.length} medication(s)
                  </p>
                )}
                {carePlan.specialNeeds && carePlan.specialNeeds.length > 0 && (
                  <p>
                    <span className="font-medium">Special Needs:</span> {carePlan.specialNeeds.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pricing & Payment */}
          {booking.totalPrice && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-xs text-muted-foreground">
                  {booking.paymentStatus === "paid" ? "✓ Paid" : "Pending payment"}
                </p>
              </div>
              <p className="text-lg font-bold text-primary">${booking.totalPrice}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {booking.status === "pending" && (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                Waiting for Approval
              </Button>
            )}
            {booking.status === "confirmed" && (
              <>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  Message Caregiver
                </Button>
              </>
            )}
            {booking.status === "completed" && (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                Leave Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your pet care appointments and schedules</p>
          </div>
          <Button onClick={() => router.push("/new-booking")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {userBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="Schedule your first pet care appointment to get started."
          action={
            <Button onClick={() => router.push("/new-booking")}>Schedule an Appointment</Button>
          }
        />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Active Bookings</p>
                <p className="text-2xl font-bold">{activeBookings.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedBookings.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${userBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No active bookings"
                  description="Your next booking will appear here once scheduled."
                />
              ) : (
                activeBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedBookings.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  title="No completed bookings"
                  description="Once your bookings are complete, they'll appear here."
                />
              ) : (
                completedBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Booking Flow Modal */}
      {userBookings.length > 0 && (
        <BookingFlow
          open={bookingFlow.open}
          onOpenChange={(open) => setBookingFlow({ ...bookingFlow, open })}
          pet={bookingFlow.pet || pets[0]}
          trainer={bookingFlow.trainer || trainers[0]}
          onConfirm={(data) => {
            console.log("Booking confirmed:", data)
            // Handle booking confirmation
          }}
        />
      )}
    </div>
  )
}
