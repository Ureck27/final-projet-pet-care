"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { petSchema, type PetFormData } from "@/lib/validation"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, CheckCircle, PawPrint, Plus } from "lucide-react"
import { petApi } from "@/lib/api"
import type { Pet } from "@/lib/types"

export default function AddPetPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchUserPets()
    }
  }, [user, isAuthLoading, router])

  const fetchUserPets = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await petApi.getPetsByUserId(user.id)
      setPets(data)
    } catch (err) {
      console.error("Failed to fetch pets", err)
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
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      type: "dog",
      age: 0,
      photo: "",
    },
  })

  const onSubmit = async (data: PetFormData) => {
    if (!user) return
    setIsSubmitting(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('type', data.type)
      formData.append('breed', data.breed || '')
      formData.append('age', data.age.toString())
      formData.append('weight', data.weight?.toString() || '')
      formData.append('color', data.color || '')
      formData.append('medicalNotes', data.medicalNotes || '')
      formData.append('description', data.description || '')
      
      // Add image if provided
      if (data.photo && data.photo !== "/placeholder.svg") {
        formData.append('petImage', data.photo)
      }

      await petApi.createPet(formData)

      setSuccessMessage("Pet submitted for approval")
      setShowSuccessMessage(true)
      reset()
      fetchUserPets() // Refresh list

      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to add pet", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/pets">
          <Button variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Pets
          </Button>
        </Link>

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
            <PawPrint className="h-8 w-8" />
            Add Your Pet
          </h1>
          <p className="mt-2 text-gray-600">Tell us about your new furry friend</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
              <CardDescription>Add your pet's details below</CardDescription>
            </CardHeader>
            <CardContent>
              {showSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Pet Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Pet Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Max, Bella, Charlie"
                    {...register("name")}
                    className={`text-base ${errors.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    Full Name (optional)
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g., Maximilian the Great"
                    {...register("fullName")}
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">A more formal name for your pet</p>
                </div>

                {/* Type & Age */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="species" className="text-base font-semibold">
                      Pet Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={watch("type")}
                      onValueChange={(value) => setValue("type", value as "dog" | "cat" | "bird" | "rabbit" | "other")}
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">🐕 Dog</SelectItem>
                        <SelectItem value="cat">🐈 Cat</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base font-semibold">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      placeholder="e.g., 3"
                      {...register("age", { valueAsNumber: true })}
                      className={`text-base ${errors.age ? "border-destructive" : ""}`}
                    />
                    <p className="text-xs text-muted-foreground">Age in years</p>
                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                  </div>
                </div>

                {/* Breed */}
                <div className="space-y-2">
                  <Label htmlFor="breed" className="text-base font-semibold">
                    Breed <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Golden Retriever, Siamese"
                    {...register("breed")}
                    className={`text-base ${errors.breed ? "border-destructive" : ""}`}
                  />
                  {errors.breed && <p className="text-sm text-destructive">{errors.breed.message}</p>}
                </div>

                {/* Weight & Color */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-base font-semibold">
                      Weight (optional)
                    </Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 30 kg"
                      {...register("weight")}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-base font-semibold">
                      Color (optional)
                    </Label>
                    <Input
                      id="color"
                      placeholder="e.g., Golden, Black"
                      {...register("color")}
                      className="text-base"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us a little bit about your pet's personality..."
                    {...register("description")}
                    rows={3}
                    className="text-base"
                  />
                </div>

                {/* Medical Notes */}
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes" className="text-base font-semibold">
                    Medical Notes (optional)
                  </Label>
                  <Textarea
                    id="medicalNotes"
                    placeholder="Any allergies, medications, or special health needs..."
                    {...register("medicalNotes")}
                    rows={3}
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">This helps trainers provide better care</p>
                </div>

                {/* Photo Upload */}
                <ImageUpload
                  value={watch("photo")}
                  onChange={(value) => setValue("photo", value)}
                  label="Pet Photo (optional)"
                  placeholder="Upload a photo of your pet"
                />

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/pets")} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Pet...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Pet
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Pets Summary Section */}
        <div>
          <Card className="border-border sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Your Pets</CardTitle>
            </CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <div className="text-center">
                  <PawPrint className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No pets added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <img
                        src={pet.photo || "/placeholder.svg"}
                        alt={pet.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{pet.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {pet.type} • {pet.breed}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/pets">View All Pets</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
