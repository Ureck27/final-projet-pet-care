"use client"

import { useEffect, useState } from "react"
import { petApi } from "@/lib/api"
import type { Pet } from "@/lib/types"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { PetCard } from "@/components/features/pets/pet-card"
import { PawPrint } from "lucide-react"

export default function ExplorePetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApprovedPets()
  }, [])

  const fetchApprovedPets = async () => {
    setIsLoading(true)
    try {
      const data = await petApi.getPets()
      setPets(data)
    } catch (err) {
      console.error("Failed to fetch pets", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            Explore Pets
          </h1>
          <p className="text-gray-600 mt-2">Discover wonderful companions ready for your love and care.</p>
        </div>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets available"
          description="Check back later for new furry friends."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pets.map((pet) => (
            <PetCard 
              key={pet._id || pet.id} 
              pet={pet} 
              className="hover:shadow-lg transition-shadow" 
            />
          ))}
        </div>
      )}
    </main>
  )
}
