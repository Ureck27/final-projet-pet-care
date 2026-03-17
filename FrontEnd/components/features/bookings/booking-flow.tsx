"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Package, FileText, Check, ArrowRight, AlertCircle, Zap } from "lucide-react"
import { format } from "date-fns"
import type { Pet, Trainer, User as UserType, CarePackageType } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

interface BookingFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet: Pet
  trainer: Trainer
  onConfirm: (data: any) => void
}

const packageDetails = {
  daily: {
    name: "Daily Care",
    price: 45,
    duration: "1-3 hours daily",
    features: ["Walks", "Meals", "Play time", "Basic training"],
  },
  overnight: {
    name: "Overnight Care",
    price: 75,
    duration: "24 hours",
    features: ["All-day care", "Meals", "Bathroom breaks", "Sleeping accommodations"],
  },
  travel: {
    name: "Travel Care",
    price: 120,
    duration: "Multi-day trips",
    features: ["Full care during travel", "New environment adaptation", "Daily updates", "Emergency handling"],
  },
  custom: {
    name: "Custom Package",
    price: 0,
    duration: "Customized",
    features: ["Tailored to your needs", "Flexible scheduling", "Special accommodations"],
  },
}

type Step = "package" | "schedule" | "careplan" | "confirmation"

export function BookingFlow({ open, onOpenChange, pet, trainer, onConfirm }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("package")
  const [selectedPackage, setSelectedPackage] = useState<CarePackageType | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showMeetAndGreet, setShowMeetAndGreet] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    meetAndGreetDate: "",
    customInstructions: "",
    specialNeeds: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const trainerUser = mockUsers.find((u) => u.id === trainer.userId)

  const handlePackageSelect = (pkg: CarePackageType) => {
    setSelectedPackage(pkg)
    setTotalPrice(packageDetails[pkg as keyof typeof packageDetails].price)
  }

  const handleContinue = () => {
    if (step === "package" && selectedPackage) {
      setStep("schedule")
    } else if (step === "schedule" && formData.date && formData.time) {
      setStep("careplan")
    }
  }

  const handleConfirmBooking = () => {
    const summary = {
      petId: pet.id,
      trainerId: trainer.id,
      packageType: selectedPackage,
      date: formData.date,
      time: formData.time,
      meetAndGreetDate: formData.meetAndGreetDate,
      customInstructions: formData.customInstructions,
      specialNeeds: formData.specialNeeds,
      medications: formData.medications,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      totalPrice,
    }
    onConfirm(summary)
    onOpenChange(false)
    setStep("package")
    setSelectedPackage(null)
  }

  if (!open) return null

  // Step 1: Package Selection
  if (step === "package") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Care Package
            </DialogTitle>
            <DialogDescription>
              Choose the best package for {pet.name} with {trainerUser?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {(["daily", "overnight", "travel", "custom"] as const).map((key) => {
              const pkg = packageDetails[key]
              return (
                <Card
                  key={key}
                  className={`cursor-pointer border-2 transition-all ${
                    selectedPackage === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handlePackageSelect(key)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-2xl font-bold text-primary">${pkg.price}</p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleContinue} disabled={!selectedPackage}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 2: Schedule & Meet & Greet
  if (step === "schedule") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Booking
            </DialogTitle>
            <DialogDescription>
              Plan when {trainerUser?.fullName} will care for {pet.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Service Start Date */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Start Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Meet & Greet Option */}
            <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Schedule Meet & Greet</p>
                  <p className="text-sm text-muted-foreground">
                    Let {trainerUser?.fullName} meet {pet.name} before care begins
                  </p>
                </div>
                <Button
                  type="button"
                  variant={showMeetAndGreet ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMeetAndGreet(!showMeetAndGreet)}
                >
                  {showMeetAndGreet ? "Cancel" : "Add"}
                </Button>
              </div>

              {showMeetAndGreet && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="meetDate">Meet & Greet Date</Label>
                  <Input
                    id="meetDate"
                    type="date"
                    value={formData.meetAndGreetDate}
                    onChange={(e) => setFormData({ ...formData, meetAndGreetDate: e.target.value })}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended at least 3 days before service starts
                  </p>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{packageDetails[selectedPackage!].name}</span>
                    <span className="font-medium">${packageDetails[selectedPackage!].price}</span>
                  </div>
                  {showMeetAndGreet && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Meet & Greet (included)</span>
                      <span>Free</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("package")}>
                Back
              </Button>
              <Button type="button" onClick={handleContinue} disabled={!formData.date || !formData.time}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 3: Care Plan
  if (step === "careplan") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create Care Plan
            </DialogTitle>
            <DialogDescription>
              Tell {trainerUser?.fullName} about {pet.name}'s special needs and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Special Needs */}
            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Special Needs</Label>
              <Textarea
                id="specialNeeds"
                placeholder="Any mobility issues, behavioral concerns, or special requirements?"
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <Label htmlFor="medications">Medications & Supplements</Label>
              <Textarea
                id="medications"
                placeholder="List all medications with dosage and frequency (e.g., Aspirin 500mg twice daily)"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <Label htmlFor="customInstructions">Care Instructions</Label>
              <Textarea
                id="customInstructions"
                placeholder="Feeding times, walking routes, favorite toys, preferred activities, training goals..."
                value={formData.customInstructions}
                onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <p className="font-medium">Emergency Contact</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency">Contact Name</Label>
                  <Input
                    id="emergency"
                    placeholder="Your name or emergency contact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    placeholder="24/7 contact number"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                This information will be securely shared with {trainerUser?.fullName} and help ensure the best care
                for {pet.name}.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("schedule")}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep("confirmation")}>
                Review Booking <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 4: Confirmation
  if (step === "confirmation") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              Review Your Booking
            </DialogTitle>
            <DialogDescription>Confirm these details before completing your booking</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Caregiver & Pet */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <p className="text-sm text-muted-foreground">Caregiver</p>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{trainerUser?.fullName}</p>
                  <Badge className="mt-2">{trainer.experience}+ years experience</Badge>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <p className="text-sm text-muted-foreground">Pet</p>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{pet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed} • {pet.age} years old
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{packageDetails[selectedPackage!].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Time</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
                {formData.meetAndGreetDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meet & Greet</span>
                    <span className="font-medium">{formData.meetAndGreetDate}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-success/50 bg-success/5">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{packageDetails[selectedPackage!].name}</span>
                    <span className="font-medium">${packageDetails[selectedPackage!].price}</span>
                  </div>
                  <div className="border-t border-border pt-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount Due</span>
                    <span className="text-xl font-bold text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-50 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Booking is pending confirmation. You'll receive a notification once {trainerUser?.fullName} accepts.
                Payment will be processed upon confirmation.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep("careplan")}>
              Back to Care Plan
            </Button>
            <Button onClick={handleConfirmBooking} className="gap-2">
              <Check className="h-4 w-4" />
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
