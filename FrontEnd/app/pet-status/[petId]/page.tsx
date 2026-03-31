"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getMediaUrl } from "@/lib/api"
import { mockPets } from "@/lib/mock-data"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Camera, Heart, AlertTriangle, CheckCircle } from "lucide-react"
import type { Pet, RoutineLog } from "@/lib/types"

interface PetStatusPageProps {
  params: Promise<{
    petId: string
  }>
}

export default function PetStatusPage({ params }: PetStatusPageProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [routineLogs, setRoutineLogs] = useState<RoutineLog[]>([])
  const [loading, setLoading] = useState(true)
  const [petId, setPetId] = useState<string>("")

  useEffect(() => {
    const getPetId = async () => {
      const resolvedParams = await params
      setPetId(resolvedParams.petId)
    }
    getPetId()
  }, [params])

  useEffect(() => {
    if (!petId) return
    
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Load pet data
    const foundPet = mockPets.find(p => p.id === petId)
    if (!foundPet) {
      router.push("/dashboard")
      return
    }

    // Check if user is authorized (owner or trainer)
    if (user?.role === "user" && foundPet.ownerId !== user.id) {
      router.push("/dashboard")
      return
    }

    setPet(foundPet)

    // Mock routine logs data - replace with API call
    const mockLogs: RoutineLog[] = [
      {
        id: "1",
        routineId: "1",
        petId: petId,
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-1.jpg",
        aiStatus: "healthy",
        aiMessage: "Pet looks active and healthy",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: "2",
        routineId: "2",
        petId: petId,
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-2.jpg",
        aiStatus: "active",
        aiMessage: "Pet appears energetic and playful",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        id: "3",
        routineId: "3",
        petId: petId,
        trainerId: "trainer1",
        photoUrl: "/uploads/mock-photo-3.jpg",
        aiStatus: "resting",
        aiMessage: "Pet is resting calmly",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]

    setRoutineLogs(mockLogs)
    setLoading(false)
  }, [user, isLoading, router, petId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "resting":
      case "alert":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "concerned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "injured":
      case "sick":
      case "abnormal":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "resting":
      case "alert":
        return <Heart className="h-4 w-4 text-blue-600" />
      case "concerned":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "injured":
      case "sick":
      case "abnormal":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Pet not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back
        </Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={getMediaUrl(pet.photo)} alt={pet.name} />
            <AvatarFallback>{pet.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{pet.name}</h1>
            <p className="text-muted-foreground">
              {pet.breed} • {pet.age} years old • {pet.type}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pet Information */}
        <div className="space-y-8 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="capitalize">{pet.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Breed</label>
                <p>{pet.breed}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p>{pet.age} years old</p>
              </div>
              {pet.weight && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Weight</label>
                  <p>{pet.weight}</p>
                </div>
              )}
              {pet.color && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Color</label>
                  <p>{pet.color}</p>
                </div>
              )}
              {pet.medicalNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Medical Notes</label>
                  <p className="text-sm">{pet.medicalNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Check</span>
                  <Badge variant="secondary">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activity Level</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Appetite</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Routine History */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Routine History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {routineLogs.length > 0 ? (
                <div className="space-y-4">
                  {routineLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(log.aiStatus)}`}>
                            {getStatusIcon(log.aiStatus)}
                            <span className="capitalize">{log.aiStatus}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Photo */}
                        <div className="relative">
                          <img
                            src={getMediaUrl(log.photoUrl)}
                            alt="Pet during routine"
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90">
                              <Camera className="mr-1 h-3 w-3" />
                              Photo
                            </Badge>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-2">AI Analysis</h4>
                            <p className="text-sm text-muted-foreground">{log.aiMessage}</p>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>Trainer ID: {log.trainerId}</p>
                            <p>Routine ID: {log.routineId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No routine history available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
