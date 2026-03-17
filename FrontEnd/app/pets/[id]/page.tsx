"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi } from "@/lib/api"
import type { Pet, PetProfile } from "@/lib/types"
import { Loader } from "@/components/common/loader"
import { EmptyState } from "@/components/common/empty-state"
import { PetProfileDetail } from "@/components/features/pets/pet-profile-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading: isAuthLoading } = useAuth()
  const petId = params.id as string
  
  const [pet, setPet] = useState<Pet | null>(null)
  const [profile, setProfile] = useState<PetProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (user && petId) {
      fetchPetData()
    }
  }, [user, isAuthLoading, router, petId])

  const fetchPetData = async () => {
    setIsLoading(true)
    try {
      const data = await petApi.getPetById(petId)
      setPet(data.pet)
      setProfile(data.profile)
    } catch (err) {
      console.error(err)
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

  if (!petId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={ArrowLeft}
          title="Pet not found"
          description="Please select a pet from the pets page."
          action={<Button onClick={() => router.push("/pets")}>Back to Pets</Button>}
        />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={ArrowLeft}
          title="Pet not found"
          description="The pet you're looking for doesn't exist or you don't have access to it."
          action={<Button onClick={() => router.push("/pets")}>Back to Pets</Button>}
        />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.push("/pets")} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Pets
      </Button>

      {profile ? (
        <PetProfileDetail pet={pet} profile={profile} />
      ) : (
        <EmptyState
          icon={ArrowLeft}
          title="Profile not available"
          description="This pet doesn't have a detailed profile yet."
          action={<Button onClick={() => router.push("/pets")}>Back to Pets</Button>}
        />
      )}
    </main>
  )
}
