"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi, type Pet } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { PetCard } from "@/components/features/pets/pet-card"
import { PetForm } from "@/components/features/pets/pet-form"
import { Button } from "@/components/ui/button"
import { Plus, PawPrint } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function PetsPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchPets()
    }
  }, [user, isAuthLoading, router])

  const fetchPets = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await petApi.getPets(user.id)
      setPets(data)
    } catch (err) {
      console.error("Failed to fetch pets", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setIsFormOpen(true)
  }

  const handleDeletePet = async (pet: Pet) => {
    if (confirm(`Are you sure you want to delete ${pet.name}? This action cannot be undone.`)) {
      try {
        await petApi.deletePet(pet.id)
        toast.success(`${pet.name} has been deleted successfully`)
        fetchPets()
      } catch (error) {
        toast.error("Failed to delete pet. Please try again.")
        console.error("Failed to delete pet:", error)
      }
    }
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPet) {
        await petApi.updatePet(editingPet.id, data)
        toast.success(`${data.name} has been updated successfully`)
      } else {
        await petApi.createPet({ ...data, ownerId: user?.id })
        toast.success(`${data.name} has been added successfully`)
      }
      fetchPets()
      setIsFormOpen(false)
      setEditingPet(null)
    } catch (error) {
      toast.error(`Failed to ${editingPet ? 'update' : 'add'} pet. Please try again.`)
      console.error(`Failed to ${editingPet ? 'update' : 'add'} pet:`, error)
    }
  }

  if (isAuthLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  const userPets = pets

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Pets</h1>
          <p className="text-gray-600">Manage and track your pets</p>
        </div>
        <Button onClick={() => { setIsFormOpen(true); setEditingPet(null) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Pet
        </Button>
      </div>

      {userPets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Start by adding your first pet to get started with PetCare."
          action={<Button onClick={() => { setIsFormOpen(true); setEditingPet(null) }}>Add Your First Pet</Button>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              onEdit={handleEditPet}
              onDelete={handleDeletePet}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            />
          ))}
        </div>
      )}

      <PetForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        pet={editingPet}
        onSubmit={handleFormSubmit}
      />
    </main>
  )
}
