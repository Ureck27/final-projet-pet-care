"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { services, timeSlots } from "@/lib/mock-data" // Removed mock data imports
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema, type BookingFormData } from "@/lib/validation"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, CheckCircle, Calendar } from "lucide-react"
import { api } from "@/lib/api" // Added API import
import type { Booking, Pet, Trainer, User } from "@/lib/types" // Added User type
import Link from "next/link"
import { format } from "date-fns"

export default function NewBookingPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth() // Renamed isLoading to isAuthLoading
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [userPets, setUserPets] = useState<Pet[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([]) 
  const [selectedPetId, setSelectedPetId] = useState("")
  const [selectedTrainerId, setSelectedTrainerId] = useState("")
  const [isLoading, setIsLoading] = useState(true) 

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchInitialData()
    }
  }, [user, isAuthLoading, router])

  const fetchInitialData = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [petsData, bookingsData, trainersData] = await Promise.all([
        api.get<Pet[]>(`/pets?ownerId=${user._id || user.id}`),
        api.get<Booking[]>(`/bookings?ownerId=${user._id || user.id}`),
        api.get<Trainer[]>('/trainers')
      ])
      
      setUserPets(petsData)
      setBookings(bookingsData)
      setTrainers(trainersData)
      
      if (petsData.length > 0) {
        setSelectedPetId(petsData[0]._id || petsData[0].id)
      }
    } catch (err) {
      console.error("Failed to fetch initial booking data", err)
    } finally {
      setIsLoading(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      trainerId: "",
      date: "",
      time: "",
      notes: "",
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    if (!user) return
    if (!selectedPetId) {
      alert("Please select a pet")
      return
    }

    setIsSubmitting(true)
    try {
      const newBookingData = {
        ownerId: user.id,
        petId: selectedPetId,
        trainerId: data.trainerId,
        service: data.service,
        date: new Date(data.date),
        time: data.time,
        notes: data.notes,
        packageType: "Standard" // Default for now
      }

      await api.post('/bookings', newBookingData)

      setSuccessMessage("Booking confirmed! Your pet care appointment is scheduled.")
      setShowSuccessMessage(true)
      reset()
      
      // Refresh bookings
      const updatedBookings = await api.get<Booking[]>(`/bookings?ownerId=${user.id}`)
      setBookings(updatedBookings)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to create booking", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading || isLoading || !user) { // Updated loading condition
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const selectedPet = userPets.find((p) => p._id === selectedPetId || p.id === selectedPetId)
  const selectedTrainer = trainers.find((t) => t._id === selectedTrainerId || t.id === selectedTrainerId)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/bookings">
          <Button variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
            <Calendar className="h-8 w-8" />
            New Pet Care Booking
          </h1>
          <p className="mt-2 text-gray-600">Schedule a professional caregiver for your pet</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Fill in the information for your pet care appointment</CardDescription>
            </CardHeader>
            <CardContent>
              {showSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {userPets.length === 0 ? (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    You need to add a pet before booking. 
                    <Link href="/add-pet" className="ml-1 font-semibold underline">Add a pet now</Link>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Pet Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="pet" className="text-base font-semibold">
                      Select Your Pet <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a pet" />
                      </SelectTrigger>
                      <SelectContent>
                        {userPets.map((pet) => (
                          <SelectItem key={pet._id || pet.id} value={pet._id as string || pet.id}>
                            {pet.name} ({pet.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-base font-semibold">
                      Service Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={watch("service")} onValueChange={(value) => setValue("service", value)}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && <p className="text-sm text-destructive">{errors.service.message}</p>}
                  </div>

                  {/* Trainer Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="trainer" className="text-base font-semibold">
                      Select Caregiver <span className="text-destructive">*</span>
                    </Label>
                    <Select value={watch("trainerId")} onValueChange={(value) => {
                      setValue("trainerId", value)
                      setSelectedTrainerId(value)
                    }}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a professional caregiver" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((trainer) => {
                          return (
                            <SelectItem key={trainer._id as string || trainer.id} value={trainer._id as string || trainer.id}>
                              {trainer.name} ⭐ {trainer.rating}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {errors.trainerId && <p className="text-sm text-destructive">{errors.trainerId.message}</p>}
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base font-semibold">
                      Preferred Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date")}
                      className={`text-base ${errors.date ? "border-destructive" : ""}`}
                    />
                    {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-base font-semibold">
                      Preferred Time <span className="text-destructive">*</span>
                    </Label>
                    <Select value={watch("time")} onValueChange={(value) => setValue("time", value)}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base font-semibold">
                      Special Requests (optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions, preferences, or notes for the caregiver..."
                      {...register("notes")}
                      rows={4}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground">Let the caregiver know about your pet's needs</p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/bookings")} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div>
          <Card className="border-border sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPet && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">PET</p>
                  <p className="font-semibold">{selectedPet.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPet.breed}</p>
                </div>
              )}

              {watch("service") && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">SERVICE</p>
                  <p className="font-semibold">{watch("service")}</p>
                </div>
              )}

              {selectedTrainer && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">CAREGIVER</p>
                  <p className="font-semibold">{selectedTrainer.name}</p>
                  <p className="text-sm text-muted-foreground">⭐ {selectedTrainer.rating}</p>
                </div>
              )}

              {watch("date") && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">DATE & TIME</p>
                  <p className="font-semibold">{format(new Date(watch("date")), "MMM dd, yyyy")}</p>
                  {watch("time") && <p className="text-sm text-muted-foreground">{watch("time")}</p>}
                </div>
              )}

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/bookings">View All Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
