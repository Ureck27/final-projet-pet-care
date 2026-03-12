"use client"

import { 
  PawPrint, Users, Calendar, Shield, Star, ArrowRight, CheckCircle2, Heart, Award, CheckCircle,
  Zap, TrendingUp, Lock, Video, Clock, Smile, Clock3, Smartphone, Bot, ClipboardList,
  Search, BarChart3, CheckSquare, UserCheck, BookOpen, Target, Sparkles, Utensils, Droplets,
  Dumbbell, Wind, Coffee, Moon, Box, Settings, Brain, Stethoscope, Bell
} from "lucide-react"
import dynamic from 'next/dynamic'
import { TiltCard } from "@/components/ui/tilt-card"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/fade-in"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProfessionalCard, FeatureCard } from "@/components/ui/professional-card"
import { AnimationWrapper, animationPresets, useStaggeredAnimation } from "@/components/ui/animation-wrapper"
import { PawPrintBackground, FloatingPets, AnimatedPawTrail, PetCareIcons } from "@/components/ui/pet-illustrations"
import { cn } from "@/lib/utils"
import { useScrollAnimation, useParallax } from "@/hooks/use-scroll-animation"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import SplitText from "@/components/ui/split-text"

// Lazy load the HeroSlider because it has heavy embla carousel logic and images 
const HeroSlider = dynamic(() => import('@/components/layout/hero-slider').then(mod => mod.HeroSlider), {
  ssr: false, // Ensure it's purely client side to avoid hydration mismatches with carousels
  loading: () => <div className="w-full h-[300px] md:h-[400px] bg-muted/20 animate-pulse rounded-2xl" />
})

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const parallaxRef = useParallax(0.3)
  const heroRef = useScrollAnimation<HTMLDivElement>('fadeIn', { delay: 200 })
  const featuresRef = useScrollAnimation('slideInLeft', { delay: 300 })
  const howItWorksRef = useScrollAnimation('slideInRight', { delay: 400 })
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
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
    {
      icon: Brain,
      title: "AI Health Assistant",
      description: "Chat with AI for pet health advice, analyze photos/videos for health insights, and get personalized recommendations",
    },
    {
      icon: Stethoscope,
      title: "Health Monitoring",
      description: "Track your pet's health status, get AI-powered insights, and receive notifications for important care reminders",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay informed with intelligent alerts for medications, appointments, and changes in your pet's behavior or routine",
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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <PawPrintBackground />
        <FloatingPets />
        <motion.div style={{ y: yHero }} className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="flex flex-col items-start text-left max-w-3xl space-y-8">
              <FadeIn direction="up">
                <Badge className="mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary-foreground hover:from-primary/30 hover:to-secondary/30 border border-primary/30 px-6 py-3 text-sm font-body font-medium shadow-medium glow-primary transition-all duration-300 badge-visible">
                  <Sparkles className="mr-2 h-4 w-4 icon-visible" />
                  Professional AI-Powered Pet Care Platform
                </Badge>
              </FadeIn>
              <FadeIn direction="up" delay={0.1}>
                <div ref={heroRef} className="space-y-4 leading-tight">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-foreground text-visible">
                    <span className="block mb-2">One App.</span>
                    <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Total Peace of Mind.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground font-body font-medium leading-relaxed max-w-2xl text-visible">
                    All-in-one platform combining daily activity management, verified professional caregivers, and AI-verified updates.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.3} className="w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" className="h-14 px-8 text-lg font-body font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-large glow-primary w-full sm:w-auto transition-all duration-300 btn-visible" asChild>
                      <Link href="/register">
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5 icon-visible" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-body font-semibold border-2 border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/10 w-full sm:w-auto transition-all duration-300 btn-visible" asChild>
                      <Link href="#how-it-works">See How It Works</Link>
                    </Button>
                  </motion.div>
                </div>
              </FadeIn>

              <StaggerChildren staggerDelay={0.4} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trustFeatures.map((feature) => (
                  <StaggerItem key={feature}>
                    <div className="flex items-center gap-3 text-sm font-body font-medium text-purple-200 group text-visible">
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 transition-smooth glow-accent"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-400 icon-visible" />
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

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 relative section-dark">
        <AnimatedPawTrail />
        <PetCareIcons />
        <div className="container mx-auto">
          <FadeIn direction="up" className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary-foreground font-body font-semibold shadow-soft-lg hover:shadow-xl transition-smooth glow-primary">
              Three Problems. One Solution.
            </Badge>
            <h2 className="mb-4 text-5xl font-heading font-bold gradient-text bg-clip-text bg-gradient-to-r from-primary to-secondary">The Paws & Relax Difference</h2>
            <p className="mx-auto max-w-3xl text-xl font-body text-secondary">
              Paws & Relax solves the three biggest pain points pet owners face
            </p>
          </FadeIn>

          <StaggerChildren className="grid gap-8 md:grid-cols-3 mb-8">
            {problemSolution.map((item) => (
              <StaggerItem key={item.number}>
                <TiltCard intensity={10}>
                  <Card className="feature-card h-full card-modern shadow-soft-lg hover:shadow-2xl hover:border-primary/30 transition-smooth overflow-hidden group">
                    <CardContent className="p-8 pb-10">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-animated transition-smooth group-hover:scale-110 float-element shadow-soft-lg"
                      >
                        {item.icon && <item.icon className="h-10 w-10 text-white" />}
                      </motion.div>
                      <p className="mb-6 text-lg font-body font-semibold text-primary leading-relaxed">{item.problem}</p>
                      <div className="pt-6 border-t border-border bg-gradient-to-r from-primary/10 to-secondary/10 p-6 -mx-8 -mb-10 rounded-b-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-smooth">
                        <p className="text-lg font-body text-primary font-medium flex items-start gap-2">
                          <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0 text-success" />
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
      <section id="features" ref={featuresRef} className="px-4 py-20 relative section-gradient">
        <div className="container mx-auto">
          <FadeIn direction="down" className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth glow-primary">
              Core Services
            </Badge>
            <h2 className="mb-4 text-5xl font-heading font-bold text-foreground">Everything You Need</h2>
            <p className="mx-auto max-w-3xl text-xl font-body text-secondary">
              Professional pet care with modern technology
            </p>
          </FadeIn>

          <StaggerChildren staggerDelay={0.15} className="grid gap-8 md:grid-cols-3">
            {coreFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 relative">
        <div className="container mx-auto">
          <FadeIn direction="up" className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth">
              4-Step Process
            </Badge>
            <h2 className="mb-4 text-4xl font-heading font-bold text-foreground">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg font-body text-secondary">
              Get started in 4 simple steps
            </p>
          </FadeIn>

          <StaggerChildren staggerDelay={0.2} className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <StaggerItem key={step.title}>
                <Card className="card-modern shadow-soft-lg hover:shadow-2xl hover:-translate-y-2 transition-smooth relative bg-glass group overflow-hidden">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    whileInView={{ scale: 1 }} 
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className="absolute -right-8 -top-8 w-20 h-20 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"
                  />
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-heading font-bold text-primary group-hover:from-primary group-hover:to-secondary transition-colors shadow-lg">
                      {index + 1}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      {step.icon && <step.icon className="h-7 w-7 text-primary" />}
                    </div>
                    <h3 className="mb-2 font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-base font-body text-secondary">{step.description}</p>
                  </CardContent>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6 text-primary/40" />
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
      <section id="pricing" className="px-4 py-16 relative section-dark">
        <div className="container mx-auto">
          <FadeIn direction="down" className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth">
              Flexible Options
            </Badge>
            <h2 className="mb-4 text-4xl font-heading font-bold text-foreground">Service Packages</h2>
            <p className="mx-auto max-w-2xl text-lg font-body text-secondary">
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
              icon={<Coffee className="h-4 w-4 text-amber-500" />}
              title="Morning Routine & Hydration"
              description="Fresh water, breakfast, and a happy tail to start the day right."
            />
            <TimelineGridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<PawPrint className="h-4 w-4 text-primary" />}
              title="Adventure Walk & Sniff Time"
              description="Guided walk with GPS proof, photos, and mood check-ins from the trainer."
            />
            <TimelineGridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Video className="h-4 w-4 text-violet-500" />}
              title="Training & Enrichment Session"
              description="Short videos, AI-verified progress, and badges earned for good behavior."
            />
            <TimelineGridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Moon className="h-4 w-4 text-blue-500" />}
              title="Cozy Nap & Calm Time"
              description="Heart rate, mood, and comfort logged—see exactly how relaxed they are."
            />
            <TimelineGridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Sparkles className="h-4 w-4 text-pink-500" />}
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
      <section className="px-4 py-20 relative section-gradient">
        <div className="container mx-auto">
          <FadeIn direction="up" className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth glow-primary">
              Built on Trust
            </Badge>
            <h2 className="mb-4 text-5xl font-heading font-bold text-foreground">Why Choose Paws & Relax</h2>
            <p className="mx-auto max-w-3xl text-xl font-body text-secondary">
              Three layers of protection for your peace of mind
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="card-modern shadow-soft-lg hover:shadow-2xl hover:-translate-y-2 transition-smooth relative bg-glass group overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">Verified Professionals</h3>
                <p className="text-lg font-body text-secondary leading-relaxed">
                  Background-checked caregivers with verified credentials and real experience
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-body font-medium text-success">Background verified</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern shadow-soft-lg hover:shadow-2xl hover:-translate-y-2 transition-smooth relative bg-glass group overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">Structured Care</h3>
                <p className="text-lg font-body text-secondary leading-relaxed">
                  Personalized routines and activities tailored to your pet's specific needs
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-body font-medium text-success">Customized plans</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern shadow-soft-lg hover:shadow-2xl hover:-translate-y-2 transition-smooth relative bg-glass group overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">AI Verification</h3>
                <p className="text-lg font-body text-secondary leading-relaxed">
                  Real-time updates with emotion detection and activity verification
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-body font-medium text-success">Smart monitoring</span>
                </div>
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
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="font-medium text-foreground">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/caregiver-apply">Become a Verified Caregiver</Link>
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
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">Why Choose Paws & Relax?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: "Curated Professionals", desc: "Not a marketplace—only vetted caregivers" },
              { icon: BookOpen, title: "Complete Ecosystem", desc: "Activity management + booking + tracking" },
              { icon: CheckSquare, title: "Verified Proof", desc: "AI-verified updates, not just promises" },
              { icon: Target, title: "Unified Platform", desc: "Replace 5+ services with one app" },
            ].map((item) => (
              <Card key={item.title} className="border-border shadow-soft text-center p-6 bg-glass transition-smooth hover:shadow-md hover:border-primary/30">
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
      <section className="relative overflow-hidden hero-gradient px-4 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/subtle-paw-print-pattern.jpg')] bg-repeat opacity-10" />
        </div>
        <div className="container relative z-10 mx-auto text-center">
          <FadeIn direction="up" className="mb-8">
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth glow-primary">
              Ready to Get Started?
            </Badge>
            <h2 className="mb-6 text-5xl font-heading font-black text-foreground">
              One App. Total Peace of Mind.
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-xl font-body text-secondary leading-relaxed">
              Join thousands of pet owners who trust Paws & Relax with their beloved family members
            </p>
          </FadeIn>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="h-16 px-12 text-xl font-heading font-bold btn-gradient shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                variant="outline" 
                className="h-16 px-12 text-xl font-heading font-bold border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300" 
                asChild
              >
                <Link href="/trainers">
                  Browse Caregivers
                  <Users className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
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

