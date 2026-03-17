import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, X, Zap, Crown, Building2, Clock, DollarSign, Dog, Cat, Scissors, Home } from "lucide-react"

const plans = [
  {
    name: "Basic",
    description: "Perfect for occasional pet care needs",
    icon: Zap,
    price: 0,
    period: "Free to join",
    features: [
      { text: "Access to trainer directory", included: true },
      { text: "Book individual sessions", included: true },
      { text: "Basic pet profiles", included: true },
      { text: "Email support", included: true },
      { text: "Priority booking", included: false },
      { text: "Discounted rates", included: false },
      { text: "Progress tracking", included: false },
      { text: "Dedicated account manager", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    description: "Best for regular pet owners",
    icon: Crown,
    price: 29,
    period: "/month",
    features: [
      { text: "Access to trainer directory", included: true },
      { text: "Book individual sessions", included: true },
      { text: "Unlimited pet profiles", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Priority booking", included: true },
      { text: "10% discount on all services", included: true },
      { text: "Progress tracking dashboard", included: true },
      { text: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For multi-pet households & businesses",
    icon: Building2,
    price: 79,
    period: "/month",
    features: [
      { text: "Access to trainer directory", included: true },
      { text: "Book individual sessions", included: true },
      { text: "Unlimited pet profiles", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Priority booking", included: true },
      { text: "20% discount on all services", included: true },
      { text: "Advanced analytics & reports", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const serviceRates = [
  { service: "Basic Training", duration: "60 min", price: "$50 - $75", icon: Dog, color: "from-blue-500 to-cyan-500", category: "Training" },
  { service: "Behavioral Modification", duration: "60 min", price: "$75 - $100", icon: Dog, color: "from-purple-500 to-pink-500", category: "Training" },
  { service: "Puppy Training", duration: "45 min", price: "$55 - $70", icon: Dog, color: "from-orange-500 to-yellow-500", category: "Training" },
  { service: "Cat Training", duration: "45 min", price: "$45 - $65", icon: Cat, color: "from-pink-500 to-rose-500", category: "Training" },
  { service: "Dog Walking", duration: "30 min", price: "$20 - $30", icon: Dog, color: "from-green-500 to-emerald-500", category: "Walking" },
  { service: "Dog Walking", duration: "60 min", price: "$35 - $50", icon: Dog, color: "from-green-600 to-teal-500", category: "Walking" },
  { service: "Pet Sitting", duration: "Per night", price: "$60 - $100", icon: Home, color: "from-indigo-500 to-purple-500", category: "Sitting" },
  { service: "Grooming (Small)", duration: "60-90 min", price: "$40 - $60", icon: Scissors, color: "from-cyan-500 to-blue-500", category: "Grooming" },
  { service: "Grooming (Large)", duration: "90-120 min", price: "$60 - $100", icon: Scissors, color: "from-violet-500 to-purple-500", category: "Grooming" },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/30 px-4 py-16 md:py-24">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Choose the plan that works best for you. All plans include access to our network of certified trainers.
          </p>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Membership Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4">Most Popular</Badge>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Rates */}
      <section className="border-t border-border bg-secondary/20 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-2 text-center text-2xl font-bold">Service Rates</h2>
          <p className="mb-8 text-center text-muted-foreground">
            Individual service pricing varies by trainer and location
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceRates.map((rate, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${rate.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${rate.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <rate.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {rate.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{rate.service}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {rate.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price Range</p>
                      <p className={`text-xl font-bold bg-gradient-to-r ${rate.color} bg-clip-text text-transparent`}>
                        {rate.price}
                      </p>
                    </div>
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${rate.color} opacity-0 transition-all duration-300 group-hover:opacity-20 group-hover:scale-150`} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>Varies by trainer & location</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Have questions about pricing?</h2>
        <p className="mt-2 text-muted-foreground">Our team is happy to help you find the best plan for your needs.</p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </section>
    </main>
  )
}
