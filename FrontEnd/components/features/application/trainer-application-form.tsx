"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trainerApplicationSchema, type TrainerApplicationFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  User,
  GraduationCap,
  Home,
  Clock,
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Experience", icon: GraduationCap },
  { id: 3, title: "Living Conditions", icon: Home },
  { id: 4, title: "Availability", icon: Clock },
  { id: 5, title: "Trust & Safety", icon: Shield },
  { id: 6, title: "About You", icon: Heart },
]

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface TrainerApplicationFormProps {
  onSubmit?: (data: TrainerApplicationFormData) => void
  savedData?: Partial<TrainerApplicationFormData>
}

export function TrainerApplicationForm({ onSubmit, savedData }: TrainerApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<TrainerApplicationFormData>({
    resolver: zodResolver(trainerApplicationSchema),
    defaultValues: {
      fullName: savedData?.fullName || "",
      email: savedData?.email || "",
      phone: savedData?.phone || "",
      city: savedData?.city || "",
      country: savedData?.country || "",
      yearsExperience: savedData?.yearsExperience || "0-1",
      petExperience: savedData?.petExperience || [],
      education: savedData?.education || "no-formal",
      canHostPets: savedData?.canHostPets || false,
      homeType: savedData?.homeType || "apartment",
      hasPetsAtHome: savedData?.hasPetsAtHome || false,
      maxPetsCapacity: savedData?.maxPetsCapacity || 1,
      allowPetsOnFurniture: savedData?.allowPetsOnFurniture || false,
      availableDays: savedData?.availableDays || [],
      availableHours: savedData?.availableHours || [],
      servicesOffered: savedData?.servicesOffered || [],
      emergencyAvailability: savedData?.emergencyAvailability || false,
      backgroundCheckConsent: savedData?.backgroundCheckConsent || false,
      agreeToPlatformRules: savedData?.agreeToPlatformRules || false,
      bio: savedData?.bio || "",
      motivation: savedData?.motivation || "",
    },
    mode: "onChange",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = form

  const progress = (currentStep / STEPS.length) * 100

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step: number): (keyof TrainerApplicationFormData)[] => {
    switch (step) {
      case 1:
        return ["fullName", "email", "phone", "city", "country"]
      case 2:
        return ["yearsExperience", "petExperience", "education"]
      case 3:
        return ["canHostPets", "homeType", "hasPetsAtHome", "maxPetsCapacity", "allowPetsOnFurniture"]
      case 4:
        return ["availableDays", "availableHours", "servicesOffered", "emergencyAvailability"]
      case 5:
        return ["backgroundCheckConsent", "agreeToPlatformRules"]
      case 6:
        return ["bio", "motivation"]
      default:
        return []
    }
  }

  const handleFormSubmit = (data: TrainerApplicationFormData) => {
    setIsSubmitted(true)
    onSubmit?.(data)
  }

  const watchedPetExperience = watch("petExperience")
  const watchedAvailableDays = watch("availableDays")
  const watchedAvailableHours = watch("availableHours")
  const watchedServicesOffered = watch("servicesOffered")

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg border-0">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for applying to become a trainer. We&apos;ll review your application and get back to you within
            3-5 business days.
          </p>
          <div className="bg-muted/50 rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-sm font-medium mb-1">Application Status</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/20 text-warning">
              Pending Review
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Trainer Application</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {STEPS.map((step) => {
            const StepIcon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-1",
                  isCurrent && "text-primary",
                  isCompleted && "text-success",
                  !isCurrent && !isCompleted && "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-smooth",
                    isCurrent && "bg-primary text-primary-foreground",
                    isCompleted && "bg-success text-primary-foreground",
                    !isCurrent && !isCompleted && "bg-muted",
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = STEPS[currentStep - 1].icon
                return <StepIcon className="w-5 h-5 text-primary" />
              })()}
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself so pet owners can get to know you."}
              {currentStep === 2 && "Share your experience and qualifications with pets."}
              {currentStep === 3 && "Help us understand your living situation for pet care."}
              {currentStep === 4 && "Let us know when you're available and what services you offer."}
              {currentStep === 5 && "We take safety seriously. Help us verify your identity."}
              {currentStep === 6 && "Tell pet owners why they should trust you with their pets."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Your city"
                      {...register("city")}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      placeholder="Your country"
                      {...register("country")}
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <ImageUpload
                    value={watch("profilePhoto")}
                    onChange={(value) => setValue("profilePhoto", value)}
                    placeholder="Upload your profile photo"
                  />
                </div>
              </>
            )}

            {/* Step 2: Experience & Qualifications */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Years of Experience *</Label>
                  <Select
                    value={watch("yearsExperience")}
                    onValueChange={(value) =>
                      setValue("yearsExperience", value as TrainerApplicationFormData["yearsExperience"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Type of Experience *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "dogs", label: "Dogs" },
                      { value: "cats", label: "Cats" },
                      { value: "both", label: "Both Dogs & Cats" },
                      { value: "special-needs", label: "Special Needs Pets" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth",
                          watchedPetExperience?.includes(option.value as (typeof watchedPetExperience)[number])
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50",
                        )}
                      >
                        <Checkbox
                          checked={watchedPetExperience?.includes(
                            option.value as (typeof watchedPetExperience)[number],
                          )}
                          onCheckedChange={(checked) => {
                            const current = watchedPetExperience || []
                            if (checked) {
                              setValue("petExperience", [
                                ...current,
                                option.value as (typeof watchedPetExperience)[number],
                              ])
                            } else {
                              setValue(
                                "petExperience",
                                current.filter((v) => v !== option.value),
                              )
                            }
                          }}
                        />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.petExperience && <p className="text-sm text-destructive">{errors.petExperience.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Education / Degree *</Label>
                  <RadioGroup
                    value={watch("education")}
                    onValueChange={(value) => setValue("education", value as TrainerApplicationFormData["education"])}
                    className="space-y-2"
                  >
                    {[
                      { value: "veterinary", label: "Veterinary Degree" },
                      { value: "certification", label: "Pet Training Certification" },
                      { value: "online-course", label: "Online Course" },
                      { value: "no-formal", label: "No Formal Degree" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth",
                          watch("education") === option.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50",
                        )}
                      >
                        <RadioGroupItem value={option.value} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Upload Certifications (Optional)</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload certificates (PDF or Images)</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Living & Care Conditions */}
            {currentStep === 3 && (
              <>
                <div className="space-y-3">
                  <Label>Do you have space to host pets at home? *</Label>
                  <RadioGroup
                    value={watch("canHostPets") ? "yes" : "no"}
                    onValueChange={(value) => setValue("canHostPets", value === "yes")}
                    className="flex gap-4"
                  >
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        watch("canHostPets") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="yes" />
                      <span className="font-medium">Yes</span>
                    </label>
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        !watch("canHostPets") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="no" />
                      <span className="font-medium">No</span>
                    </label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Home Type *</Label>
                  <RadioGroup
                    value={watch("homeType")}
                    onValueChange={(value) => setValue("homeType", value as TrainerApplicationFormData["homeType"])}
                    className="flex gap-4"
                  >
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        watch("homeType") === "apartment" ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="apartment" />
                      <span className="font-medium">Apartment</span>
                    </label>
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        watch("homeType") === "house-with-yard"
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="house-with-yard" />
                      <span className="font-medium">House with Yard</span>
                    </label>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have pets currently at home? *</Label>
                  <RadioGroup
                    value={watch("hasPetsAtHome") ? "yes" : "no"}
                    onValueChange={(value) => setValue("hasPetsAtHome", value === "yes")}
                    className="flex gap-4"
                  >
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        watch("hasPetsAtHome") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="yes" />
                      <span className="font-medium">Yes</span>
                    </label>
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        !watch("hasPetsAtHome") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="no" />
                      <span className="font-medium">No</span>
                    </label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPetsCapacity">Maximum pets you can care for at once *</Label>
                  <Input
                    id="maxPetsCapacity"
                    type="number"
                    min={1}
                    max={20}
                    {...register("maxPetsCapacity", { valueAsNumber: true })}
                    className={errors.maxPetsCapacity ? "border-destructive" : ""}
                  />
                  {errors.maxPetsCapacity && (
                    <p className="text-sm text-destructive">{errors.maxPetsCapacity.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Do you allow pets on furniture? *</Label>
                  <RadioGroup
                    value={watch("allowPetsOnFurniture") ? "yes" : "no"}
                    onValueChange={(value) => setValue("allowPetsOnFurniture", value === "yes")}
                    className="flex gap-4"
                  >
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        watch("allowPetsOnFurniture") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="yes" />
                      <span className="font-medium">Yes</span>
                    </label>
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-smooth",
                        !watch("allowPetsOnFurniture") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem value="no" />
                      <span className="font-medium">No</span>
                    </label>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Step 4: Availability & Services */}
            {currentStep === 4 && (
              <>
                <div className="space-y-3">
                  <Label>Available Days *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-smooth text-sm",
                          watchedAvailableDays?.includes(day)
                            ? "border-primary bg-primary/5 font-medium"
                            : "hover:border-primary/50",
                        )}
                      >
                        <Checkbox
                          checked={watchedAvailableDays?.includes(day)}
                          onCheckedChange={(checked) => {
                            const current = watchedAvailableDays || []
                            if (checked) {
                              setValue("availableDays", [...current, day])
                            } else {
                              setValue(
                                "availableDays",
                                current.filter((d) => d !== day),
                              )
                            }
                          }}
                          className="sr-only"
                        />
                        {day.slice(0, 3)}
                      </label>
                    ))}
                  </div>
                  {errors.availableDays && <p className="text-sm text-destructive">{errors.availableDays.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Available Hours *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "morning", label: "Morning", time: "6AM - 12PM" },
                      { value: "afternoon", label: "Afternoon", time: "12PM - 6PM" },
                      { value: "night", label: "Night", time: "6PM - 12AM" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-smooth",
                          watchedAvailableHours?.includes(option.value as (typeof watchedAvailableHours)[number])
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50",
                        )}
                      >
                        <Checkbox
                          checked={watchedAvailableHours?.includes(
                            option.value as (typeof watchedAvailableHours)[number],
                          )}
                          onCheckedChange={(checked) => {
                            const current = watchedAvailableHours || []
                            if (checked) {
                              setValue("availableHours", [
                                ...current,
                                option.value as (typeof watchedAvailableHours)[number],
                              ])
                            } else {
                              setValue(
                                "availableHours",
                                current.filter((h) => h !== option.value),
                              )
                            }
                          }}
                          className="sr-only"
                        />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.time}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availableHours && <p className="text-sm text-destructive">{errors.availableHours.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Services Offered *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: "daily-walking", label: "Daily Walking", desc: "Regular walks and exercise" },
                      { value: "overnight-care", label: "Overnight Care", desc: "Stay with pets overnight" },
                      { value: "long-term-boarding", label: "Long-term Boarding", desc: "Extended pet stays" },
                      { value: "training-sessions", label: "Training Sessions", desc: "Behavioral training" },
                      { value: "medical-support", label: "Medical Support", desc: "Medication & care" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth",
                          watchedServicesOffered?.includes(option.value as (typeof watchedServicesOffered)[number])
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50",
                        )}
                      >
                        <Checkbox
                          checked={watchedServicesOffered?.includes(
                            option.value as (typeof watchedServicesOffered)[number],
                          )}
                          onCheckedChange={(checked) => {
                            const current = watchedServicesOffered || []
                            if (checked) {
                              setValue("servicesOffered", [
                                ...current,
                                option.value as (typeof watchedServicesOffered)[number],
                              ])
                            } else {
                              setValue(
                                "servicesOffered",
                                current.filter((s) => s !== option.value),
                              )
                            }
                          }}
                          className="mt-0.5"
                        />
                        <div>
                          <span className="font-medium block">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.servicesOffered && (
                    <p className="text-sm text-destructive">{errors.servicesOffered.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Emergency Availability</Label>
                  <label
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-smooth",
                      watch("emergencyAvailability") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                    )}
                  >
                    <Checkbox
                      checked={watch("emergencyAvailability")}
                      onCheckedChange={(checked) => setValue("emergencyAvailability", !!checked)}
                    />
                    <div>
                      <span className="font-medium block">I&apos;m available for emergencies</span>
                      <span className="text-xs text-muted-foreground">Can be contacted outside regular hours</span>
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Step 5: Trust & Safety */}
            {currentStep === 5 && (
              <>
                <div className="bg-secondary/30 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Why we need this information</p>
                    <p className="text-muted-foreground">
                      Pet owners trust us with their beloved companions. Verifying your identity helps build trust and
                      ensures the safety of all pets on our platform.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Government ID Upload</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload a valid government-issued ID</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Passport, Driver&apos;s License, or National ID
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth",
                      watch("backgroundCheckConsent") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      errors.backgroundCheckConsent && "border-destructive",
                    )}
                  >
                    <Checkbox
                      checked={watch("backgroundCheckConsent")}
                      onCheckedChange={(checked) => setValue("backgroundCheckConsent", !!checked)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-medium block">Background Check Consent *</span>
                      <span className="text-sm text-muted-foreground">
                        I consent to a background check being performed as part of the verification process.
                      </span>
                    </div>
                  </label>
                  {errors.backgroundCheckConsent && (
                    <p className="text-sm text-destructive">{errors.backgroundCheckConsent.message}</p>
                  )}

                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth",
                      watch("agreeToPlatformRules") ? "border-primary bg-primary/5" : "hover:border-primary/50",
                      errors.agreeToPlatformRules && "border-destructive",
                    )}
                  >
                    <Checkbox
                      checked={watch("agreeToPlatformRules")}
                      onCheckedChange={(checked) => setValue("agreeToPlatformRules", !!checked)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-medium block">Platform Rules Agreement *</span>
                      <span className="text-sm text-muted-foreground">
                        I agree to follow all platform rules, guidelines, and best practices for pet care.
                      </span>
                    </div>
                  </label>
                  {errors.agreeToPlatformRules && (
                    <p className="text-sm text-destructive">{errors.agreeToPlatformRules.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 6: About You */}
            {currentStep === 6 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Short Bio *
                    <span className="text-muted-foreground font-normal ml-2">({watch("bio")?.length || 0}/1000)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tell pet owners why they should trust you with their pet
                  </p>
                  <Textarea
                    id="bio"
                    placeholder="I've been caring for pets for over 5 years and have a deep love for animals..."
                    rows={5}
                    {...register("bio")}
                    className={errors.bio ? "border-destructive" : ""}
                  />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Motivation for Joining *
                    <span className="text-muted-foreground font-normal ml-2">
                      ({watch("motivation")?.length || 0}/500)
                    </span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Why do you want to become a trainer on our platform?
                  </p>
                  <Textarea
                    id="motivation"
                    placeholder="I want to help pet owners feel confident knowing their pets are in good hands..."
                    rows={4}
                    {...register("motivation")}
                    className={errors.motivation ? "border-destructive" : ""}
                  />
                  {errors.motivation && <p className="text-sm text-destructive">{errors.motivation.message}</p>}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" className="gap-2">
              Submit Application
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
