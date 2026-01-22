"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockPets } from "@/lib/mock-data"
import { PetCard } from "@/components/features/pets/pet-card"
import { PetForm } from "@/components/features/pets/pet-form"
import { BookingForm } from "@/components/features/bookings/booking-form"
import { EmptyState } from "@/components/common/empty-state"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { PawPrint, Plus } from "lucide-react"
import type { Pet } from "@/lib/types"
import type { PetFormData, BookingFormData } from "@/lib/validation"

export default function PetsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [petFormOpen, setPetFormOpen] = useState(false)
  const [bookingFormOpen, setBookingFormOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      setPets(mockPets.filter((pet) => pet.ownerId === user.id))
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const handleAddPet = (data: PetFormData) => {
    const newPet: Pet = {
      id: String(pets.length + 10),
      ownerId: user.id,
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      medicalNotes: data.medicalNotes,
      photo: `/placeholder.svg?height=200&width=200&query=${data.species} ${data.breed}`,
      createdAt: new Date(),
    }
    setPets([...pets, newPet])
  }

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet)
    setPetFormOpen(true)
  }

  const handleDeletePet = (pet: Pet) => {
    setPets(pets.filter((p) => p.id !== pet.id))
  }

  const handleBookPet = (pet: Pet) => {
    setSelectedPet(pet)
    setBookingFormOpen(true)
  }

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log("Booking created:", data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Pets</h1>
          <p className="text-muted-foreground">Manage your pets and their information.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPet(null)
            setPetFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first pet to start managing their care and book sessions with trainers."
          action={
            <Button onClick={() => setPetFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Pet
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onEdit={handleEditPet} onDelete={handleDeletePet} onBook={handleBookPet} />
          ))}
        </div>
      )}

      <PetForm open={petFormOpen} onOpenChange={setPetFormOpen} pet={selectedPet} onSubmit={handleAddPet} />

      <BookingForm
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
        pet={selectedPet}
        onSubmit={handleBookingSubmit}
      />
    </div>
  )
}
