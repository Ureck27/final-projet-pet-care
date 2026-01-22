import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PawPrint, Users, Calendar, Shield, Star, ArrowRight, CheckCircle2, Heart, Award } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: PawPrint,
      title: "Pet Management",
      description: "Keep track of all your pets in one place with detailed profiles and medical records.",
    },
    {
      icon: Users,
      title: "Verified Caregivers",
      description: "Connect with background-checked, certified pet trainers you can trust.",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book sessions and manage appointments with our intuitive calendar system.",
    },
    {
      icon: Shield,
      title: "Safety Guaranteed",
      description: "Real-time updates and GPS tracking ensure your pet is always safe.",
    },
  ]

  const testimonials = [
    {
      name: "Emily R.",
      role: "Pet Owner",
      content:
        "PetCare has made managing my two dogs so much easier. The trainers are amazing and I feel completely at ease leaving my pets with them!",
      rating: 5,
      avatar: "/woman-smiling-dog.png",
    },
    {
      name: "Michael T.",
      role: "Certified Trainer",
      content:
        "Great platform for connecting with pet owners. The scheduling tools are fantastic and the verification process builds real trust.",
      rating: 5,
      avatar: "/man-professional-pet-trainer.jpg",
    },
    {
      name: "Sarah L.",
      role: "Pet Owner",
      content:
        "I love getting real-time updates when my cat is being cared for. The peace of mind is priceless. Highly recommend!",
      rating: 5,
      avatar: "/woman-with-cat-smiling.jpg",
    },
  ]

  const trustFeatures = [
    "All caregivers background-checked",
    "Insurance coverage included",
    "24/7 customer support",
    "Real-time GPS tracking",
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/happy-golden-retriever-and-tabby-cat-resting-safel.jpg"
            alt="Happy pets in a safe, warm home environment"
            fill
            className="object-cover"
            priority
          />
          {/* Improved overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/55" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20">
              <Shield className="mr-1 h-3 w-3" />
              Trusted by 10,000+ Pet Owners
            </Badge>
            <h1 className="mb-6 animate-slide-up text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Safe, Loving Care for Your <span className="text-primary">Beloved Pets</span>
            </h1>
            <p className="mb-8 animate-fade-in text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with verified, certified pet caregivers. Real-time updates, GPS tracking, and complete peace of
              mind for you and your furry family.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button size="lg" className="shadow-soft bg-primary hover:bg-primary/90" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/85 backdrop-blur border-white/50 hover:bg-white/95" asChild>
                <Link href="/trainers">Find Caregivers</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-4">
              {trustFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="relative overflow-hidden border-y border-border bg-gradient-to-b from-white to-secondary/10">
        <div className="absolute inset-0">
          <Image
            src="/professional-pet-caregiver-holding-dog-leash-smili.jpg"
            alt="Professional certified pet caregiver"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              <Shield className="mr-1 h-3 w-3" />
              Trust & Safety
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Your Pet&apos;s Safety is Our Priority</h2>
            <p className="mb-8 text-muted-foreground">
              Every caregiver on our platform goes through a rigorous verification process. We ensure your pets are in
              the safest hands possible.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border shadow-soft hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Background Checked</h3>
                  <p className="text-sm text-muted-foreground">
                    All caregivers undergo comprehensive background verification
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-soft hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
                    <Award className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Certified Professionals</h3>
                  <p className="text-sm text-muted-foreground">Licensed and trained in animal care and first aid</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-soft hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
                    <Heart className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Insurance Covered</h3>
                  <p className="text-sm text-muted-foreground">Full coverage for peace of mind during every visit</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-secondary/5 to-white">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              Features
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our platform provides all the tools for pet owners and caregivers to connect and collaborate effectively.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Boarding Section with Background */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-accent/8 to-secondary/10">
        <div className="absolute inset-0">
          <Image
            src="/cozy-home-interior-with-plants-soft-furniture-cat-.jpg"
            alt="Cozy safe home environment for pets"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/90 to-white/75" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4 border-secondary/30 bg-secondary/5 text-secondary">
                <PawPrint className="mr-1 h-3 w-3" />
                Home Care
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground">Your Pet Feels Right at Home</h2>
              <p className="mb-6 text-muted-foreground">
                Our caregivers provide loving in-home care, ensuring your pet stays comfortable in a familiar, safe
                environment. Whether it&apos;s daily walks, overnight stays, or extended boarding.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Comfortable home environment",
                  "One-on-one attention",
                  "Daily photo & video updates",
                  "Medication administration available",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="bg-secondary hover:bg-secondary/90 shadow-soft" asChild>
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 px-4 py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              { value: "10K+", label: "Happy Pets" },
              { value: "500+", label: "Verified Caregivers" },
              { value: "50K+", label: "Sessions Completed" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-white to-accent/5">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of satisfied pet owners and caregivers on our platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border shadow-soft hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground italic">{`"${testimonial.content}"`}</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-secondary px-4 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/subtle-paw-print-pattern.jpg')] bg-repeat" />
        </div>
        <div className="container relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Give Your Pet the Best Care?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90 text-lg">
            Join our community of pet lovers and verified caregivers today. Sign up for free and experience peace of
            mind!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="shadow-soft bg-secondary hover:bg-secondary/90 text-foreground" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent shadow-soft"
              asChild
            >
              <Link href="/apply">Become a Caregiver</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
