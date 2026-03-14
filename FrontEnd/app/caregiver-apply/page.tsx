"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type CaregiverApplication } from "@/lib/api"
import { caregiverApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, User, Mail, Phone, MapPin, Award, FileText, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ImageUpload } from "@/components/ui/image-upload"

export default function CaregiverApplicationPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CaregiverApplication>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      petTypes: [],
    },
  })

  const petTypesOptions = [
    { id: "dog", label: "Dogs" },
    { id: "cat", label: "Cats" },
    { id: "bird", label: "Birds" },
    { id: "rabbit", label: "Rabbits" },
    { id: "fish", label: "Fish" },
    { id: "reptile", label: "Reptiles" },
    { id: "other", label: "Other" },
  ]

  const onSubmit = async (data: CaregiverApplication) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await caregiverApi.submitApplication(data)
      setSubmitted(true)
      toast.success("Application submitted successfully! We'll review it and get back to you soon.")
    } catch (error) {
      toast.error("Failed to submit application. Please try again.")
      console.error("Application submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to become a verified caregiver. Our team will review your application within 3-5 business days.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You'll receive an email at <strong>{user.email}</strong> once we've reviewed your application.
                </p>
              </div>
              <Button asChild className="mt-6">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <User className="mr-2 h-4 w-4" />
            Verified Caregiver Program
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Join Our Trusted Caregiver Network</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Become a verified caregiver and provide professional pet care services to pet owners in your area.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Caregiver Application Form
            </CardTitle>
            <CardDescription>
              Please fill out all the required information below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City/Country) *</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="New York, USA"
                      className={errors.location ? "border-destructive" : ""}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                  </div>
                </div>
              </div>

              {/* Caregiver Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Caregiver Details
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience with Pets *</Label>
                  <Textarea
                    id="experience"
                    {...register("experience")}
                    placeholder="Describe your experience with pets, including years of experience, specific training, etc."
                    rows={4}
                    className={errors.experience ? "border-destructive" : ""}
                  />
                  {errors.experience && <p className="text-sm text-destructive">{errors.experience.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Types of Pets You Care For *</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {petTypesOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          value={option.id}
                          onCheckedChange={(checked) => {
                            const currentPetTypes = watch("petTypes") || []
                            if (checked) {
                              setValue("petTypes", [...currentPetTypes, option.id])
                            } else {
                              setValue("petTypes", currentPetTypes.filter((type: string) => type !== option.id))
                            }
                          }}
                        />
                        <Label htmlFor={option.id} className="text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.petTypes && <p className="text-sm text-destructive">{errors.petTypes.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (Optional)</Label>
                  <Input
                    id="certifications"
                    {...register("certifications")}
                    placeholder="Pet First Aid, Dog Training Certificate, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio / Description *</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us about yourself and why you'd make a great caregiver..."
                    rows={4}
                    className={errors.bio ? "border-destructive" : ""}
                  />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Documents
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Photo (Optional)</Label>
                    <ImageUpload
                      value={watch("profileImage")}
                      onChange={(value) => setValue("profileImage", value)}
                      label="Upload Profile Photo"
                      placeholder="Click to upload or drag and drop"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idDocument">ID Document (Optional)</Label>
                    <ImageUpload
                      value={watch("idDocument")}
                      onChange={(value) => setValue("idDocument", value)}
                      label="Upload ID Document"
                      placeholder="Click to upload or drag and drop"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Apply to Become a Verified Caregiver
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
