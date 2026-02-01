"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockPets } from "@/lib/mock-data"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { PetCard } from "@/components/features/pets/pet-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, PawPrint } from "lucide-react"
import Link from "next/link"

export default function PetsPage() {
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

  const userPets = mockPets.filter((pet) => pet.ownerId === user.id)

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
            <div key={pet.id} onClick={() => router.push(`/pets/${pet.id}`)}>
              <PetCard pet={pet} className="cursor-pointer hover:shadow-lg transition-shadow" />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
