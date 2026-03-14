"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { petSchema, type PetFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import type { Pet } from "@/lib/types"

interface PetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet?: Pet | null
  onSubmit: (data: PetFormData) => void
}

export function PetForm({ open, onOpenChange, pet, onSubmit }: PetFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          fullName: pet.fullName || "",
          type: pet.type,
          breed: pet.breed,
          age: pet.age,
          weight: pet.weight || 0,
          color: pet.color || "",
          medicalNotes: pet.medicalNotes || "",
          photo: pet.photo || "",
        }
      : {
          type: "dog",
          age: 0,
          photo: "",
        },
  })

  const handleFormSubmit = async (data: PetFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit(data)
    reset()
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{pet ? "Edit Pet" : "Add New Pet"}</DialogTitle>
          <DialogDescription>
            {pet ? "Update your pet's information below." : "Add a new pet to your profile."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name</Label>
            <Input
              id="name"
              placeholder="Max"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (optional)</Label>
            <Input
              id="fullName"
              placeholder="Maximilian Golden Retriever"
              {...register("fullName")}
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={watch("type")} onValueChange={(value) => setValue("type", value as "dog" | "cat")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                {...register("age", { valueAsNumber: true })}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              placeholder="Golden Retriever"
              {...register("breed")}
              className={errors.breed ? "border-destructive" : ""}
            />
            {errors.breed && <p className="text-xs text-destructive">{errors.breed.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (optional)</Label>
              <Input
                id="weight"
                placeholder="30 kg"
                {...register("weight")}
                className={errors.weight ? "border-destructive" : ""}
              />
              {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color (optional)</Label>
              <Input
                id="color"
                placeholder="Golden"
                {...register("color")}
                className={errors.color ? "border-destructive" : ""}
              />
              {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNotes">Medical Notes (optional)</Label>
            <Textarea
              id="medicalNotes"
              placeholder="Any allergies, medications, or special needs..."
              {...register("medicalNotes")}
              rows={3}
            />
          </div>

          <ImageUpload
            value={watch("photo")}
            onChange={(value) => setValue("photo", value)}
            label="Pet Photo (optional)"
            placeholder="Upload a photo of your pet"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : pet ? (
                "Save Changes"
              ) : (
                "Add Pet"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
