"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi } from "@/lib/api"
import type { Pet as ApiPet } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { PetCard } from "@/components/features/pets/pet-card"
import { Button } from "@/components/ui/button"
import { Plus, PawPrint } from "lucide-react"
import Link from "next/link"
import { PetForm } from "@/components/features/pets/pet-form"
import { toast } from "sonner"

type Pet = ApiPet

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
      // Use the correct endpoint for getting current user's pets
      console.log('[Pets] Fetching pets for user:', user.id, user.role)
      const data = await petApi.getUserPets()
      console.log('[Pets] Successfully fetched pets:', data.length)
      setPets(data)
    } catch (err: any) {
      console.error("[Pets] Failed to fetch pets:", err)
      
      // Check if it's an authentication error
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        console.log('[Pets] Authentication error - redirecting to login')
        // Token is invalid, redirect to login
        router.push('/login')
        return
      }
      
      // Check if it's a forbidden error (permission issue)
      if (err.message?.includes('403') || err.message?.includes('Forbidden')) {
        console.log('[Pets] Permission error - user role:', user.role)
        // Don't try admin fallback for 403, as it's a permission issue
        return
      }
      
      // For other errors, try the admin endpoint as fallback (only if user is admin)
      if (user.role === 'admin') {
        console.log('[Pets] Trying admin endpoint as fallback')
        try {
          const data = await petApi.getPets(user.id)
          setPets(data)
        } catch (fallbackErr) {
          console.error("[Pets] Admin fallback failed:", fallbackErr)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (pet: Pet) => {
    if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
      try {
        await petApi.deletePet(pet._id || pet.id)
        fetchPets()
      } catch (err) {
        console.error("Failed to delete pet", err)
      }
    }
  }

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("age", data.age.toString());
      if (data.breed) formData.append("breed", data.breed);
      if (data.medicalNotes) formData.append("description", data.medicalNotes);
      
      if (data.photo instanceof File) {
        formData.append("image", data.photo);
      } else if (typeof data.photo === "string" && data.photo) {
        formData.append("image", data.photo);
      }

      if (editingPet) {
        await petApi.updatePet(editingPet._id || editingPet.id, formData)
        toast.success("Pet updated successfully!")
      } else {
        await petApi.createPet(formData)
        toast.success("Pet added successfully!")
      }
      fetchPets()
    } catch (err: any) {
      console.error("Failed to save pet", err)
      toast.error("Failed to save pet: " + (err.message || "Unknown error"))
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
        <Button asChild>
          <Link href="/add-pet">
            <Plus className="mr-2 h-4 w-4" />
            Add New Pet
          </Link>
        </Button>
      </div>

      {userPets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Start by adding your first pet to get started with PetCare."
          action={<Button asChild><Link href="/add-pet">Add Your First Pet</Link></Button>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPets.map((pet) => (
            <PetCard 
              key={pet._id || pet.id} 
              pet={pet as any} 
              onEdit={handleEdit as any}
              onDelete={handleDelete as any}
              className="hover:shadow-lg transition-shadow" 
            />
          ))}
        </div>
      )}

      <PetForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        pet={editingPet as any} 
        onSubmit={handleFormSubmit} 
      />
    </main>
  )
}
