"use client"

import { 
  PawPrint, Users, Calendar, Shield, Star, ArrowRight, CheckCircle2, Heart, Award,
  Zap, TrendingUp, Lock, Video, Clock, Smile, Clock3, Smartphone, Bot, ClipboardList,
  Search, BarChart3, CheckSquare, UserCheck, BookOpen, Target, Sparkles, Utensils, Droplets,
  Dumbbell, Wind, Coffee, Moon, Box, Settings
} from "lucide-react"
import dynamic from 'next/dynamic'
import { TiltCard } from "@/components/ui/tilt-card"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/fade-in"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AnimationWrapper, animationPresets, useStaggeredAnimation } from "@/components/ui/animation-wrapper"
import { PawPrintBackground, FloatingPets, AnimatedPawTrail, PetCareIcons } from "@/components/ui/pet-illustrations"

// Simple HeroBackground component
const HeroBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
  </div>
)
import { cn } from "@/lib/utils"
import { useScrollAnimation, useParallax } from "@/hooks/use-scroll-animation"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import SplitText from "@/components/ui/split-text"

// Lazy load the HeroSlider because it has heavy embla carousel logic and images 
const HeroSlider = dynamic(() => import('@/components/layout/hero-slider').then(mod => mod.HeroSlider), {
  ssr: false, // Ensure it's purely client side to avoid hydration mismatches with carousels
  loading: () => <div className="w-full aspect-video md:aspect-[4/3] bg-muted/20 animate-pulse rounded-2xl" />
})

export default function HomePage() {
  const parallaxRef = useParallax(0.3)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useScrollAnimation('slideInLeft', { delay: 300 })
  const howItWorksRef = useScrollAnimation('slideInRight', { delay: 400 })
  
  // Stagger animations for cards
  useStaggeredAnimation('.feature-card', 'scaleIn', 150)
  useStaggeredAnimation('.testimonial-card', 'slideInUp', 200)
  
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

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yStats = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="flex flex-col">
      <HeroBackground>
        <PawPrintBackground />
        <FloatingPets />
        <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
          <motion.div style={{ y: yHero }} className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {/* Text Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <FadeIn direction="up">
                <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-400/30 px-4 py-2 text-sm shadow-soft-lg transition-smooth glow-primary">
                  <Shield className="mr-2 h-4 w-4" />
                  Professional AI-Powered Pet Care
                </Badge>
              </FadeIn>
              <FadeIn direction="up" delay={0.1}>
                <div ref={heroRef} className="mb-6 space-y-2 leading-tight text-shadow-sm float-element">
                  <SplitText
                    text="One App. One Routine."
                    tag="h1"
                    className="block text-balance text-5xl font-extrabold tracking-tight hero-text-white md:text-6xl lg:text-7xl"
                    delay={40}
                    duration={1.1}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.2}
                    rootMargin="-100px"
                    textAlign="left"
                  />
                  <SplitText
                    text="Total Peace of Mind."
                    tag="h1"
                    className="block text-balance text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text-light dark:gradient-text-dark md:text-transparent bg-clip-text"
                    delay={50}
                    duration={1.2}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 60 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.25}
                    rootMargin="-80px"
                    textAlign="left"
                  />
                </div>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <p className="mb-8 text-pretty text-lg text-purple-200 md:text-xl leading-relaxed">
                  All-in-one platform combining daily activity management, verified professional caregivers, and AI-verified updates. 
                  <strong className="text-emerald-500 block mt-2 font-medium">Professional care meets transparency.</strong>
                </p>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.3} className="w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" className="h-14 px-8 text-base gradient-animated text-white shadow-soft-lg glow-primary w-full sm:w-auto transition-smooth border-0" asChild>
                      <Link href="/register">
                        Find Your Caregiver
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" className="h-14 px-8 text-base glass-effect text-purple-300 hover:text-white border-purple-400/30 hover:border-purple-400/50 w-full sm:w-auto transition-smooth shadow-soft-lg" asChild>
                      <Link href="#how-it-works">See How It Works</Link>
                    </Button>
                  </motion.div>
                </div>
              </FadeIn>

              <StaggerChildren staggerDelay={0.4} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trustFeatures.map((feature) => (
                  <StaggerItem key={feature}>
                    <div className="flex items-center gap-3 text-sm text-purple-200 font-medium group">
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 transition-smooth glow-accent"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </motion.div>
                      {feature}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>

            {/* Image Slider Component */}
            <FadeIn direction="left" delay={0.2} className="w-full relative px-2 sm:px-0">
              <HeroSlider />
              {/* Optional glowing effect behind slider to blend with background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50 dark:opacity-20 pointer-events-none" />
            </FadeIn>
          </div>
        </motion.div>
      </section>
      </HeroBackground>

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 relative">
        <AnimatedPawTrail />
        <PetCareIcons />
        <div className="container mx-auto">
          <FadeIn direction="up" className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 font-semibold shadow-soft-lg hover:shadow-xl transition-smooth glow-primary">
              Three Problems. One Solution.
            </Badge>
            <h2 className="mb-4 text-4xl font-bold gradient-text bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">The Paws & Relax Difference</h2>
            <p className="mx-auto max-w-2xl text-lg text-purple-200">
              Paws & Relax solves the three biggest pain points pet owners face
            </p>
          </FadeIn>

          <StaggerChildren className="grid gap-8 md:grid-cols-3 mb-8">
            {problemSolution.map((item) => (
              <StaggerItem key={item.number}>
                <TiltCard intensity={10}>
                  <Card className="feature-card h-full glass-effect shadow-soft-lg hover:shadow-2xl hover:border-purple-400/50 transition-smooth overflow-hidden group">
                    <CardContent className="p-8 pb-10">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-animated transition-smooth group-hover:scale-110 float-element shadow-soft-lg"
                      >
                        {item.icon && <item.icon className="h-8 w-8 icon-visible" />}
                      </motion.div>
                      <p className="mb-6 text-base font-medium text-purple-100 leading-relaxed">{item.problem}</p>
                      <div className="pt-6 border-t border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 -mx-8 -mb-10 rounded-b-lg group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-smooth">
                        <p className="text-base text-purple-200 font-medium flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 icon-visible" />
                          {item.solution}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Three Core Features */}
      <section id="features" ref={featuresRef} className="px-4 py-20 relative">
        <div className="container mx-auto">
          <FadeIn direction="down" className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary shadow-sm hover:shadow transition-smooth">
              Core Services
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-foreground">Everything You Need</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Professional pet care with modern technology
            </p>
          </FadeIn>

          <StaggerChildren staggerDelay={0.15} className="grid gap-8 md:grid-cols-3">
            {coreFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div whileHover={{ y: -8 }} className="h-full">
                  <Card className="feature-card border-border shadow-soft hover:shadow-xl hover:border-primary/50 transition-smooth glass-effect h-full group overflow-hidden">
                    <CardContent className="p-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: -5 }} 
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-soft group-hover:shadow-lg float-element"
                      >
                        <feature.icon className="h-8 w-8 icon-visible text-primary-foreground" />
                      </motion.div>
                      <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 relative">
        <div className="container mx-auto">
          <FadeIn direction="up" className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary shadow-sm hover:shadow transition-smooth">
              4-Step Process
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-primary">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </FadeIn>

          <StaggerChildren staggerDelay={0.2} className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <StaggerItem key={step.title}>
                <Card className="border-border shadow-soft hover:shadow-md hover:-translate-y-1 transition-smooth relative bg-glass group overflow-hidden">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    whileInView={{ scale: 1 }} 
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"
                  />
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow">
                      {index + 1}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {step.icon && <step.icon className="h-6 w-6 icon-visible text-primary" />}
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6 icon-visible text-primary/40" />
                      </motion.div>
                    </div>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Service Packages */}
      <section id="pricing" className="px-4 py-16">
        <div className="container mx-auto">
          <FadeIn direction="down" className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary shadow-sm hover:shadow transition-smooth">
              Flexible Options
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-primary">Service Packages</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose the plan that works best for your pet's needs
            </p>
          </FadeIn>

          <StaggerChildren className="grid gap-6 md:grid-cols-3">
            {servicePackages.map((pkg) => (
              <StaggerItem key={pkg.type}>
                <TiltCard intensity={8}>
                  <Card className="border-border shadow-soft hover:shadow-xl hover:border-primary/50 transition-smooth overflow-hidden bg-glass h-full flex flex-col group">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">{pkg.type}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <motion.p whileHover={{ scale: 1.05 }} className="mb-6 text-3xl font-bold text-primary">{pkg.price}</motion.p>
                      <ul className="space-y-2 flex-1">
                        {pkg.features.map((feature, i) => (
                          <motion.li 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            key={feature} 
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full mt-6 shadow-soft hover:shadow-md transition-smooth" variant="outline" asChild>
                          <Link href="/register">Learn More</Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Timeline Demo Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">
              Your Pet&apos;s Magical Day
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              See real proof of every walk, cuddle, snack, and nap—brought to life with playful cards and motion.
            </p>
          </div>

          <ul className="grid grid-cols-1 grid-rows-none gap-6 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[34rem] xl:grid-rows-2">
            <TimelineGridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Coffee className="h-4 w-4 icon-visible" />}
              title="Morning Routine & Hydration"
              description="Fresh water, breakfast, and a happy tail to start the day right."
            />
            <TimelineGridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<PawPrint className="h-4 w-4 icon-visible" />}
              title="Adventure Walk & Sniff Time"
              description="Guided walk with GPS proof, photos, and mood check-ins from the trainer."
            />
            <TimelineGridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Video className="h-4 w-4 icon-visible" />}
              title="Training & Enrichment Session"
              description="Short videos, AI-verified progress, and badges earned for good behavior."
            />
            <TimelineGridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Moon className="h-4 w-4 icon-visible" />}
              title="Cozy Nap & Calm Time"
              description="Heart rate, mood, and comfort logged—see exactly how relaxed they are."
            />
            <TimelineGridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Sparkles className="h-4 w-4 icon-visible" />}
              title="End-of-Day Story Recap"
              description={
                <>
                  A sharable story with highlights and{" "}
                  <strong>proof-backed memories</strong> you can revisit anytime.
                </>
              }
            />
          </ul>

          <div className="mt-10 flex justify-center">
            <Button size="lg" className="shadow-soft" asChild>
              <Link href="/dashboard">Open Full Timeline View →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">Built on Trust</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Three layers of protection for your pet
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border shadow-soft bg-glass">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <UserCheck className="h-7 w-7 icon-visible" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">Professional Human Caregivers</h3>
                <p className="text-sm text-muted-foreground">
                  Verified credentials, certifications, background checks, and documented experience—not just animal lovers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft bg-glass">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <Calendar className="h-7 w-7 icon-visible" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">Structured Daily Routines</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized care plans, scheduled activities, health monitoring, and enrichment programs tailored to your pet's needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft bg-glass">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <Bot className="h-7 w-7 icon-visible" />
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
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              For Caregivers
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-primary">Build Your Professional Reputation</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join our vetted network of pet care professionals
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caregiverBenefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <Star className="h-5 w-5 icon-visible flex-shrink-0 mt-0.5" />
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

      {/* Stats with Parallax */}
      <section className="relative border-y border-border px-4 py-20 overflow-hidden text-shadow-sm">
        <motion.div 
          style={{ y: yStats }} 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-70 pointer-events-none" 
        />
        <div className="container mx-auto relative z-10">
          <StaggerChildren className="grid gap-8 text-center md:grid-cols-4">
            {[
              { value: "10K+", label: "Happy Pets" },
              { value: "500+", label: "Verified Caregivers" },
              { value: "50K+", label: "Care Sessions" },
              { value: "4.9", label: "Star Rating" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <p className="text-5xl font-extrabold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground mt-2 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of satisfied pet owners and caregivers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border shadow-soft hover:shadow-md transition-shadow bg-glass">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 icon-visible fill-accent text-accent" />
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
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">Why Choose Paws & Relax?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
            { icon: BookOpen, title: "Complete Ecosystem", desc: "Activity management + booking + tracking" },
            { icon: BookOpen, title: "Complete Ecosystem", desc: "Activity management + booking + tracking" },
            { icon: CheckSquare, title: "Verified Proof", desc: "AI-verified updates, not just promises" },
            { icon: Target, title: "Unified Platform", desc: "Replace 5+ services with one app" },
          ].map((item, index) => (
            <Card key={`${item.title}-${index}`} className="border-border shadow-soft text-center p-6 bg-glass transition-smooth hover:shadow-md hover:border-primary/30">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15 mx-auto">
                  <item.icon className="h-7 w-7 icon-visible" />
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
          <h2 className="mb-4 text-4xl font-bold text-purple-600 dark:text-white">
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

interface TimelineGridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const TimelineGridItem = ({ area, icon, title, description }: TimelineGridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background/80 backdrop-blur-md p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6"
        >
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted/60 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </li>
  )
}

