"use client"

import { TrainerApplicationForm } from "@/components/features/application/trainer-application-form"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2 } from "lucide-react"
import { caregiverApi, type CaregiverApplication } from "@/lib/api"
import { type TrainerApplicationFormData } from "@/lib/validation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ApplyPage() {
  const router = useRouter()

  const handleTrainerSubmit = async (data: TrainerApplicationFormData) => {
    try {
      // Use FormData to support file uploads
      const formData = new FormData()
      
      // Map and append the complex form data to the simpler backend model requirements
      formData.append("experience", `${data.yearsExperience} years experience with ${data.petExperience.join(", ")}`)
      formData.append("message", `Bio: ${data.bio}\n\nMotivation: ${data.motivation}\n\nHome Type: ${data.homeType}\nCapacity: ${data.maxPetsCapacity}`)
      formData.append("phone", data.phone)
      formData.append("location", `${data.city}, ${data.country}`)
      formData.append("name", data.fullName)
      formData.append("email", data.email)
      formData.append("bio", data.bio)
      
      // Handle array data - backend expects string or handles concatenation
      formData.append("petTypes", JSON.stringify(data.petExperience))

      // Append binary files
      if (data.profilePhoto instanceof File) {
        formData.append("profileImage", data.profilePhoto)
      }
      
      if (data.certificationFile instanceof File) {
        formData.append("certificateImage", data.certificationFile)
      }

      await caregiverApi.submitApplication(formData as any)
      
      toast.success("Application submitted successfully!")
    } catch (error: any) {
      console.error("Submission error:", error)
      toast.error(error.message || "Failed to submit application. Please try again.")
    }
  }

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border py-16">
        <div className="absolute inset-0">
          <Image
            src="/minimal-abstract-soft-blue-green-gradient-backgrou.jpg"
            alt="Professional application background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Shield className="mr-1 h-3 w-3" />
            Verified Caregiver Program
          </Badge>
          <h1 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Join Our Trusted Caregiver Network</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Become a verified pet caregiver and connect with loving pet owners in your area. Complete the application
            below to start your journey.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {["Background verification", "Training certification", "Insurance coverage", "Flexible schedule"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <TrainerApplicationForm onSubmit={handleTrainerSubmit} />
      </div>
    </main>
  )
}
