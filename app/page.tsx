import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  PawPrint, Users, Calendar, Shield, Star, ArrowRight, CheckCircle2, Heart, Award,
  Zap, TrendingUp, Lock, Video, Clock, Smile, Clock3, Smartphone, Bot, ClipboardList,
  Search, BarChart3, CheckSquare, UserCheck, BookOpen, Target, Sparkles
} from "lucide-react"

export default function HomePage() {
  const problemSolution = [
    {
      number: "1",
      problem: "Busy owners don't have time for daily pet activities",
      solution: "Scheduled care with verified professionals ensures pets stay active and healthy",
      icon: Clock3
    },
    {
      number: "2", 
      problem: "Fragmented pet care across multiple services",
      solution: "One unified platform for walks, training, sitting, and boarding",
      icon: Smartphone
    },
    {
      number: "3",
      problem: "No visibility into what happens during the day",
      solution: "AI-verified timeline with emotion detection shows exactly how your pet is doing",
      icon: Bot
    }
  ]

  const coreFeatures = [
    {
      icon: Calendar,
      title: "Daily Activity Management",
      description: "Schedule and track walks, play, training, meals, and rest routines personalized to your pet's needs",
    },
    {
      icon: Users,
      title: "Professional Care Booking",
      description: "Verified caregivers with credentials, certifications, and proven experience—not just random sitters",
    },
    {
      icon: Video,
      title: "AI-Verified Timeline",
      description: "Real-time photo/video updates with emotion detection showing your pet's mood and activity verification",
    },
  ]

  const howItWorks = [
    {
      title: "Create Your Pet Plan",
      description: "Set up your pet's daily routine with walks, meals, play, and training",
      icon: ClipboardList
    },
    {
      title: "Book a Caregiver",
      description: "Browse verified professionals and schedule care when you need it",
      icon: Search
    },
    {
      title: "Track Everything",
      description: "Get real-time updates and emotion detection throughout the day",
      icon: BarChart3
    },
    {
      title: "Peace of Mind",
      description: "Know exactly what happened—every walk, meal, and play session verified",
      icon: CheckSquare
    }
  ]

  const servicePackages = [
    {
      type: "Daily Care",
      price: "$45+",
      description: "Regular daily visits for walks, feeding, and play",
      features: ["1-3 visits per day", "Activity tracking", "Photo updates", "Emotion detection"],
    },
    {
      type: "Overnight Care",
      price: "$120+",
      description: "Caregiver stays in your home overnight",
      features: ["Evening routine", "Overnight supervision", "Morning care", "24-hour monitoring"],
    },
    {
      type: "Travel Care",
      price: "$85+",
      description: "Extended care while you're away",
      features: ["Full daily routine", "Multiple daily updates", "Mood tracking", "Emergency support"],
    },
  ]

  const caregiverBenefits = [
    "Build your professional reputation",
    "Flexible scheduling on your terms",
    "Fair compensation",
    "Easy mobile app for updates",
    "Professional community",
    "Ongoing training and support"
  ]

  const trustFeatures = [
    "✓ Verified Professionals Only",
    "✓ 10,000+ Happy Pets Trusted",
    "✓ AI-Verified Care",
    "✓ Real-time Transparency",
  ]

  const testimonials = [
    {
      name: "Emily R.",
      role: "Pet Owner",
      content:
        "I travel for work 3x per month. Paws & Relax gives me complete peace of mind. I can see real proof that Max is happy and cared for—not just promises.",
      rating: 5,
      avatar: "/woman-smiling-dog.png",
    },
    {
      name: "Marcus T.",
      role: "Certified Dog Trainer",
      content:
        "As a caregiver, I love this platform. It's so easy to upload activity photos and the AI verification builds trust instantly. My reputation is growing!",
      rating: 5,
      avatar: "/man-trainer-profile.jpg",
    },
    {
      name: "Sarah L.",
      role: "Pet Owner",
      content:
        "The emotion detection feature is amazing. I can see my cat is calm and happy during the day. Finally, a platform that understands what I really need.",
      rating: 5,
      avatar: "/woman-with-cat-smiling.jpg",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/happy-golden-retriever-and-tabby-cat-resting-safel.jpg"
            alt="Happy pets in a safe, warm home environment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/65 dark:from-black/80 dark:via-black/70 dark:to-black/50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20">
              <Shield className="mr-1 h-3 w-3" />
              Professional AI-Powered Pet Care
            </Badge>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              One App. One Routine. <span className="text-primary">Total Peace of Mind.</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              All-in-one platform combining daily activity management, verified professional caregivers, and AI-verified updates. 
              Professional care meets transparency.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button size="lg" className="shadow-soft bg-primary hover:bg-primary/90" asChild>
                <Link href="/register">
                  Find Your Caregiver
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/85 dark:bg-black/40 backdrop-blur border-white/50 dark:border-white/20 hover:bg-white/95 dark:hover:bg-black/50" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

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

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-sky-50/50 via-background to-amber-50/30 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/10">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-sky-300 bg-sky-50 text-sky-700 font-semibold">
              Three Problems. One Solution.
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-foreground">The Pet Care Challenge</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Paws & Relax solves the three biggest pain points pet owners face
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-8">
            {problemSolution.map((item) => (
              <Card key={item.number} className="border-2 border-sky-200 dark:border-blue-800 shadow-lg hover:shadow-xl hover:border-sky-300 dark:hover:border-blue-700 transition-all bg-white/60 dark:bg-slate-900 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-sky-200 to-cyan-100 dark:from-blue-900 dark:to-blue-800">
                    {item.icon && <item.icon className="h-8 w-8 text-blue-600" />}
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-blue-600">Problem #{item.number}</h3>
                  <p className="mb-6 text-base font-medium text-foreground leading-relaxed">{item.problem}</p>
                  <div className="pt-6 border-t border-emerald-200 dark:border-green-800 bg-gradient-to-r from-emerald-50 dark:from-green-950/30 to-transparent p-4 -mx-8 -mb-8 rounded-b-lg">
                    <p className="text-base text-emerald-700 font-medium flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      {item.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Three Core Features */}
      <section className="px-4 py-16 bg-gradient-to-b from-white/50 to-amber-50/30 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">The Paws & Relax Difference</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {coreFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-gradient-to-b from-teal-50/40 to-cyan-50/30 dark:from-slate-950 dark:to-accent/10">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              4-Step Process
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <Card key={step.title} className="border-border shadow-soft hover:shadow-md transition-all relative">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {step.icon && <step.icon className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="px-4 py-16 bg-gradient-to-b from-rose-50/30 to-white/50 dark:from-secondary/5 dark:to-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              Flexible Options
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Service Packages</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose the plan that works best for your pet's needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {servicePackages.map((pkg) => (
              <Card
                key={pkg.type}
                className="border-border shadow-soft hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-primary/20 dark:to-secondary/20 p-6">
                  <h3 className="mb-2 text-xl font-bold text-foreground">{pkg.type}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
                <CardContent className="p-6">
                  <p className="mb-6 text-3xl font-bold text-primary">{pkg.price}</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/register">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Demo Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-indigo-50/30 to-white/50 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Your Pet's Complete Timeline</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              See real proof of everything that happens during the day
            </p>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", activity: "🐕 Walk Completed", mood: "😊 Happy & Energetic", note: "25 minutes at Central Park" },
                  { time: "10:30 AM", activity: "🍽️ Breakfast Eaten", mood: "😊 Content", note: "Full portion consumed" },
                  { time: "02:00 PM", activity: "🎓 Training Session", mood: "🎾 Playful & Engaged", note: "Great progress on 'stay' command" },
                  { time: "04:30 PM", activity: "😴 Afternoon Rest", mood: "😌 Calm & Relaxed", note: "Napping peacefully" },
                ].map((item) => (
                  <div key={item.time} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <span className="font-bold text-primary min-w-24">{item.time}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.activity}</p>
                      <p className="text-sm text-muted-foreground">{item.note}</p>
                    </div>
                    <Badge variant="secondary">{item.mood}</Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6" asChild>
                <Link href="/dashboard">View Full Timeline →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="px-4 py-16 bg-gradient-to-b from-lime-50/30 to-emerald-50/20 dark:from-secondary/5 dark:to-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Built on Trust</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Three layers of protection for your pet
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <UserCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">Professional Human Caregivers</h3>
                <p className="text-sm text-muted-foreground">
                  Verified credentials, certifications, background checks, and documented experience—not just animal lovers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">Structured Daily Routines</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized care plans, scheduled activities, health monitoring, and enrichment programs tailored to your pet's needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">AI-Assisted Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Emotion detection, activity logging, mood tracking, and transparent timeline—proof that care actually happened.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Caregiver Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-violet-50/30 to-blue-50/20 dark:from-slate-950 dark:to-accent/10">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              For Caregivers
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Build Your Professional Reputation</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join our vetted network of pet care professionals
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caregiverBenefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="font-medium text-foreground">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/apply">Become a Caregiver</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 px-4 py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              { value: "10K+", label: "Happy Pets" },
              { value: "500+", label: "Verified Caregivers" },
              { value: "50K+", label: "Care Sessions" },
              { value: "4.9", label: "Star Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-gradient-to-b from-white/50 to-pink-50/30 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of satisfied pet owners and caregivers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border shadow-soft hover:shadow-md transition-shadow">
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
                      className="rounded-full border-2 border-primary/20 object-cover"
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

      {/* Why Choose Paws & Relax */}
      <section className="px-4 py-16 bg-gradient-to-b from-orange-50/40 to-amber-50/30 dark:from-secondary/5 dark:to-slate-950">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Why Choose Paws & Relax?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: "Curated Professionals", desc: "Not a marketplace—only vetted caregivers" },
              { icon: BookOpen, title: "Complete Ecosystem", desc: "Activity management + booking + tracking" },
              { icon: CheckSquare, title: "Verified Proof", desc: "AI-verified updates, not just promises" },
              { icon: Target, title: "Unified Platform", desc: "Replace 5+ services with one app" },
            ].map((item) => (
              <Card key={item.title} className="border-border shadow-soft text-center p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15 mx-auto">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-secondary px-4 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/subtle-paw-print-pattern.jpg')] bg-repeat" />
        </div>
        <div className="container relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold text-primary-foreground">
            One App. One Routine. Total Peace of Mind.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90 text-lg">
            Join 10,000+ pet owners who trust Paws & Relax with their beloved pets.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="shadow-soft bg-secondary hover:bg-secondary/90 text-foreground" asChild>
              <Link href="/register">Get Started Free →</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent shadow-soft"
              asChild
            >
              <Link href="/trainers">Browse Caregivers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
