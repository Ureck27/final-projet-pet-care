"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema, type BookingFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import type { Trainer, Pet } from "@/lib/types"
import { services, timeSlots, mockTrainers, mockUsers } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"

interface BookingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet?: Pet | null
  trainer?: Trainer | null
  onSubmit: (data: BookingFormData) => void
}

export function BookingForm({ open, onOpenChange, pet, trainer, onSubmit }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      trainerId: trainer?.id || "",
    },
  })

  const handleFormSubmit = async (data: BookingFormData) => {
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
          <DialogTitle>Book a Training Session</DialogTitle>
          <DialogDescription>
            {pet ? `Schedule a session for ${pet.name}` : "Select a service and schedule your session"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={watch("service")} onValueChange={(value) => setValue("service", value)}>
              <SelectTrigger className={errors.service ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && <p className="text-xs text-destructive">{errors.service.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Trainer</Label>
            <Select
              value={watch("trainerId")}
              onValueChange={(value) => setValue("trainerId", value)}
              disabled={!!trainer}
            >
              <SelectTrigger className={errors.trainerId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a trainer" />
              </SelectTrigger>
              <SelectContent>
                {mockTrainers.map((t) => {
                  const trainerUser = mockUsers.find((u) => u.id === t.userId)
                  return (
                    <SelectItem key={t.id} value={t.id}>
                      {trainerUser?.fullName} - ${t.pricing}/hr
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {errors.trainerId && <p className="text-xs text-destructive">{errors.trainerId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} className={errors.date ? "border-destructive" : ""} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={watch("time")} onValueChange={(value) => setValue("time", value)}>
                <SelectTrigger className={errors.time ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea placeholder="Any special instructions or requests..." {...register("notes")} rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
