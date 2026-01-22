import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, X, Zap, Crown, Building2 } from "lucide-react"

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
  { service: "Basic Training", duration: "60 min", price: "$50 - $75" },
  { service: "Behavioral Modification", duration: "60 min", price: "$75 - $100" },
  { service: "Puppy Training", duration: "45 min", price: "$55 - $70" },
  { service: "Cat Training", duration: "45 min", price: "$45 - $65" },
  { service: "Dog Walking", duration: "30 min", price: "$20 - $30" },
  { service: "Dog Walking", duration: "60 min", price: "$35 - $50" },
  { service: "Pet Sitting", duration: "Per night", price: "$60 - $100" },
  { service: "Grooming (Small)", duration: "60-90 min", price: "$40 - $60" },
  { service: "Grooming (Large)", duration: "90-120 min", price: "$60 - $100" },
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
          <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Price Range</th>
                </tr>
              </thead>
              <tbody>
                {serviceRates.map((rate, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-sm">{rate.service}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{rate.duration}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-primary">{rate.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
