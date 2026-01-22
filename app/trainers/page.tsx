"use client"

import { useState } from "react"
import { mockTrainers, mockUsers, services } from "@/lib/mock-data"
import { TrainerCard } from "@/components/features/trainers/trainer-card"
import { BookingForm } from "@/components/features/bookings/booking-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Trainer } from "@/lib/types"
import type { BookingFormData } from "@/lib/validation"

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [bookingFormOpen, setBookingFormOpen] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)

  const filteredTrainers = mockTrainers.filter((trainer) => {
    const user = mockUsers.find((u) => u.id === trainer.userId)
    const matchesSearch =
      user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesService = selectedService === "all" || trainer.services.includes(selectedService)
    return matchesSearch && matchesService
  })

  const handleBookTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setBookingFormOpen(true)
  }

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log("Booking created:", data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Find a Trainer</h1>
        <p className="text-muted-foreground">Browse certified pet trainers and book a session.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Trainers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredTrainers.map((trainer) => {
          const user = mockUsers.find((u) => u.id === trainer.userId)
          if (!user) return null
          return <TrainerCard key={trainer.id} trainer={trainer} user={user} onBook={handleBookTrainer} />
        })}
      </div>

      {filteredTrainers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No trainers found matching your criteria.</p>
        </div>
      )}

      <BookingForm
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
        trainer={selectedTrainer}
        onSubmit={handleBookingSubmit}
      />
    </div>
  )
}
