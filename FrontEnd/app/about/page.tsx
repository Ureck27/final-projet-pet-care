import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { Heart, Shield, Award, Users, Target, Sparkles, CheckCircle2 } from "lucide-react"

const stats = [
  { value: "10K+", label: "Happy Pet Owners" },
  { value: "500+", label: "Verified Caregivers" },
  { value: "50K+", label: "Sessions Completed" },
  { value: "4.9", label: "Average Rating" },
]

const values = [
  {
    icon: Heart,
    title: "Pet-First Approach",
    description: "Every decision we make starts with what's best for the pets in our care.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All caregivers are vetted, certified, and background-checked for your peace of mind.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in care methods and customer service.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building lasting relationships between pet owners, caregivers, and their pets.",
  },
]

const team = [
  {
    name: "Emily Chen",
    role: "CEO & Founder",
    bio: "Former veterinarian with 15 years of experience in animal care.",
    avatar: "/professional-woman-ceo-smiling-friendly.jpg",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Training",
    bio: "CPDT-KA certified trainer with expertise in behavioral modification.",
    avatar: "/professional-man-pet-trainer-smiling.jpg",
  },
  {
    name: "Sarah Williams",
    role: "Customer Success",
    bio: "Dedicated to ensuring every pet owner has an exceptional experience.",
    avatar: "/professional-woman-customer-service-smiling.jpg",
  },
  {
    name: "David Park",
    role: "Head of Technology",
    bio: "Building the platform that connects pets with the care they deserve.",
    avatar: "/professional-man-tech-developer-smiling.jpg",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/team-of-pet-caregivers-with-happy-dogs-and-cats-na.jpg"
            alt="PetCare team with happy pets"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Heart className="mr-1 h-3 w-3" />
            About Us
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Making Pet Care Safe & Accessible
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Founded in 2020, PetCare connects loving pet owners with verified caregivers to provide the safest, most
            loving care for our furry family members.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden border-y border-border bg-primary/5 px-4 py-16">
        <div className="absolute inset-0">
          <Image
            src="/happy-family-with-golden-retriever-in-park-natural.jpg"
            alt="Happy family with pet"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/90" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              To create a world where every pet receives the care, training, and love they deserve. We believe that
              well-cared-for pets lead to happier homes and stronger bonds between pets and their families.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {["Safety First", "Verified Caregivers", "Real-time Updates", "Insurance Included"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card
              key={value.title}
              className="text-center shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-secondary/20 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-2">
              <Sparkles className="mr-1 h-3 w-3" />
              Our Team
            </Badge>
            <h2 className="text-2xl font-bold md:text-3xl">Meet the People Behind PetCare</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center shadow-soft">
                <CardContent className="pt-6">
                  <Avatar className="mx-auto h-24 w-24 ring-4 ring-primary/10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">Ready to Join Our Community?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Whether you're a pet owner looking for quality care or a caregiver wanting to join our network, we'd love to
          have you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/careers">Join Our Team</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
