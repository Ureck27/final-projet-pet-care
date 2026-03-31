"use client"

import { TrainerApplicationForm } from "@/components/features/application/trainer-application-form"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2 } from "lucide-react"
import { trainerRequestApi, type TrainerApplicationFormData } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ApplyPage() {
  const router = useRouter()

  const handleTrainerSubmit = async (data: TrainerApplicationFormData) => {
    try {
      // Map the complex form data to the simpler backend model requirements
      const mappedData = {
        experience: `${data.yearsExperience} years experience with ${data.petExperience.join(", ")}`,
        message: `Motivation: ${data.motivation}\n\nBio: ${data.bio}\n\nHome Type: ${data.homeType}\nCapacity: ${data.maxPetsCapacity}`,
        phone: data.phone,
        certifications: data.education,
        // Optional: Include other relevant fields if needed
      }

      await trainerRequestApi.createRequest(mappedData as any)
      
      // Success is handled by the form component showing the success card
      // but we can add a global toast too
      toast.success("Application submitted successfully!")
    } catch (error: any) {
      console.error("Submission error:", error)
      toast.error(error.message || "Failed to submit application. Please try again.")
      // We might want to tell the form to reset its isSubmitted state here, 
      // but current implementation doesn't support that easily.
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
