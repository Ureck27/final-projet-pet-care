import { TrainerApplicationForm } from "@/components/features/application/trainer-application-form"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2 } from "lucide-react"

export default function ApplyPage() {
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
        <TrainerApplicationForm />
      </div>
    </main>
  )
}
