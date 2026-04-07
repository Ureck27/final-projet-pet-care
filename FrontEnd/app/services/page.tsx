import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | PetCare",
  description: "Explore our professional pet care services including basic training, behavioral modification, cat training, dog walking, pet sitting, and more.",
}

import {
  GraduationCap,
  Dog,
  Cat,
  Scissors,
  Heart,
  Home,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
} from "lucide-react"

const services = [
  {
    icon: GraduationCap,
    title: "Basic Training",
    description:
      "Fundamental obedience training for dogs of all ages. Learn essential commands like sit, stay, come, and leash walking.",
    features: ["Sit & Stay Commands", "Leash Training", "Basic Recall", "House Manners"],
    price: "From $50/session",
    popular: true,
  },
  {
    icon: Dog,
    title: "Behavioral Modification",
    description:
      "Address problematic behaviors like aggression, anxiety, and excessive barking with proven techniques.",
    features: ["Aggression Management", "Anxiety Reduction", "Fear Response Training", "Socialization"],
    price: "From $75/session",
    popular: false,
  },
  {
    icon: Cat,
    title: "Cat Training",
    description:
      "Specialized training programs for cats including litter training, scratching redirection, and enrichment.",
    features: ["Litter Training", "Scratch Training", "Clicker Training", "Environmental Enrichment"],
    price: "From $45/session",
    popular: false,
  },
  {
    icon: MapPin,
    title: "Dog Walking",
    description: "Professional dog walking services to keep your pet active and healthy while you're away.",
    features: ["30-60 Min Walks", "GPS Tracking", "Photo Updates", "Flexible Scheduling"],
    price: "From $20/walk",
    popular: true,
  },
  {
    icon: Home,
    title: "Pet Sitting",
    description: "In-home pet sitting services ensuring your pets are comfortable in their own environment.",
    features: ["Overnight Stays", "Feeding & Medication", "Play Time", "Home Security Checks"],
    price: "From $60/night",
    popular: false,
  },
  {
    icon: Scissors,
    title: "Grooming",
    description: "Complete grooming services including bathing, haircuts, nail trimming, and ear cleaning.",
    features: ["Full Grooming", "Bath & Brush", "Nail Trimming", "Ear Cleaning"],
    price: "From $40/session",
    popular: false,
  },
  {
    icon: Heart,
    title: "Puppy Training",
    description: "Early development training for puppies to build a strong foundation for lifelong good behavior.",
    features: ["Socialization", "Crate Training", "Potty Training", "Bite Inhibition"],
    price: "From $55/session",
    popular: true,
  },
  {
    icon: Clock,
    title: "Board & Train",
    description: "Immersive training programs where your pet stays with a trainer for intensive daily sessions.",
    features: ["2-4 Week Programs", "Daily Training", "Progress Reports", "Owner Transition"],
    price: "From $800/week",
    popular: false,
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/professional-pet-grooming-salon-clean-bright-natur.jpg"
            alt="Professional pet care services"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Shield className="mr-1 h-3 w-3" />
            Trusted Services
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Professional Pet Care Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            From basic training to specialized behavioral modification, we offer a comprehensive range of services
            delivered by verified, loving caregivers.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-[24px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] py-[40px]">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`service-card relative flex flex-col transition-all duration-300 rounded-2xl dark:border-gray-800 dark:bg-slate-900 dark:shadow-none dark:hover:shadow-none dark:hover:scale-[1.02] ${service.popular ? "popular dark:border-purple-500/50" : ""}`}
            >
              {service.popular && <Badge className="absolute -top-3 right-4 bg-purple-500 text-white hover:bg-purple-600 rounded-full px-3 py-1 border-none dark:bg-purple-600">Popular</Badge>}
              <CardHeader className="gap-3">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800">
                  <service.icon className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl dark:text-white">{service.title}</CardTitle>
                <CardDescription className="line-clamp-2 dark:text-gray-400">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="mb-4 flex-1 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm dark:text-gray-300">
                      <CheckCircle2 className="feature-check h-5 w-5 dark:text-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <p className="price-text mb-4 text-xl dark:text-purple-400">{service.price}</p>
                  <Button className="card-button w-full transition-transform rounded-xl px-5 py-3 hover:scale-105 border-0" asChild>
                    <Link href="/trainers" className="flex items-center justify-center gap-2">
                      Book Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-secondary/30 px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Not sure which service is right for you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Our team is here to help you find the perfect care solution for your pet. Contact us for a free
            consultation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trainers">Browse Caregivers</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
