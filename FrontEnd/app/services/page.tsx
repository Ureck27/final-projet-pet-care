import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="relative flex flex-col shadow-none transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white"
            >
              {service.popular && <Badge className="absolute -top-2 right-4 bg-primary">Popular</Badge>}
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="mb-4 flex-1 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <p className="mb-3 text-lg font-semibold text-primary">{service.price}</p>
                  <Button className="w-full" asChild>
                    <Link href="/trainers">
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
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
