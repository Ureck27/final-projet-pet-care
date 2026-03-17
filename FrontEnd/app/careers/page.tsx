import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Zap,
  Users,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
} from "lucide-react"

const openings = [
  {
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Help us build the next generation of pet care technology.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Design delightful experiences for pet owners and trainers.",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Ensure our customers and their pets have an amazing experience.",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
    description: "Lead our growth initiatives and brand strategy.",
  },
  {
    title: "Trainer Success Specialist",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Support our network of certified trainers to succeed.",
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    description: "Turn data into insights that improve pet care outcomes.",
  },
]

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage" },
  { icon: Laptop, title: "Remote-First", description: "Work from anywhere with flexible hours" },
  { icon: Coffee, title: "Pet-Friendly", description: "Bring your pet to work + pet care benefits" },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need to recharge" },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000 annual professional development" },
  { icon: Users, title: "Team Events", description: "Quarterly offsites and pet-friendly gatherings" },
]

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/30 px-4 py-16 md:py-24">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Careers
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Join Our Pack</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Help us build the future of pet care. We're looking for passionate people who love animals and want to make
            a difference.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="#openings">View Open Positions</Link>
          </Button>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Why Join PetCare?</h2>
          <p className="mt-4 text-muted-foreground">
            At PetCare, we're more than just a company – we're a community of animal lovers working together to improve
            the lives of pets and their owners. Here's what makes us different.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Meaningful Work</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your work directly impacts the lives of thousands of pets and their families.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <Users className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Amazing Team</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Work alongside talented, passionate people who share your love for animals.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <Heart className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">Great Culture</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A supportive, inclusive environment where everyone can thrive and grow.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/20 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Benefits & Perks</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="container mx-auto scroll-mt-20 px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Open Positions</h2>
        <div className="mx-auto max-w-4xl space-y-4">
          {openings.map((job) => (
            <Card key={job.title} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.description}</CardDescription>
                  </div>
                  <Button className="shrink-0" asChild>
                    <Link href="/contact">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5 px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold">Don't see a role that fits?</h2>
          <p className="mt-2 text-muted-foreground">We're always looking for talented people. Send us your resume!</p>
          <Button className="mt-6 bg-transparent" variant="outline" size="lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
