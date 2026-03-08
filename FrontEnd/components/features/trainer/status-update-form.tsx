"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { statusUpdateSchema, type StatusUpdateFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, Footprints, UtensilsCrossed, Gamepad2, Moon, Pill } from "lucide-react"
import { useState } from "react"
import type { Pet } from "@/lib/types"

interface StatusUpdateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet: Pet | null
  onSubmit: (data: StatusUpdateFormData) => void
}

export function StatusUpdateForm({ open, onOpenChange, pet, onSubmit }: StatusUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StatusUpdateFormData>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      walked: false,
      fed: false,
      played: false,
      resting: false,
      medication: false,
      notes: "",
    },
  })

  const handleFormSubmit = async (data: StatusUpdateFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit(data)
    reset()
    onOpenChange(false)
    setIsLoading(false)
  }

  const statusOptions = [
    { id: "walked", label: "Walked", icon: Footprints, color: "text-success" },
    { id: "fed", label: "Fed", icon: UtensilsCrossed, color: "text-warning" },
    { id: "played", label: "Played", icon: Gamepad2, color: "text-primary" },
    { id: "resting", label: "Resting", icon: Moon, color: "text-muted-foreground" },
    { id: "medication", label: "Medication", icon: Pill, color: "text-destructive" },
  ] as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>{pet ? `Update status for ${pet.name}` : "Update pet status"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-3">
            <Label>Activities</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                >
                  <Checkbox
                    checked={watch(option.id)}
                    onCheckedChange={(checked) => setValue(option.id, checked as boolean)}
                  />
                  <option.icon className={`h-4 w-4 ${option.color}`} />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Add any notes about the pet's activity or behavior..."
              {...register("notes")}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
