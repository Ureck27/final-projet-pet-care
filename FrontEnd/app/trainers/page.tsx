"use client"

import { useState } from "react"
import Link from "next/link"
import { mockTrainers, mockUsers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Award, Calendar } from "lucide-react"

export default function CaregiversPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  // Filter and sort caregivers
  let filtered = mockTrainers

  if (searchTerm) {
    filtered = filtered.filter((trainer) =>
      trainer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  filtered.sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "experience") return b.experience - a.experience
    if (sortBy === "price") return a.pricing - b.pricing
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Find Your Perfect Caregiver</h1>
        <p className="text-lg text-muted-foreground">
          Browse verified and certified pet care professionals in your area
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Search by service or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 h-10"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No caregivers found matching your criteria. Try adjusting your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caregiver) => {
            const user = mockUsers.find(u => u.id === caregiver.userId)
            return (
              <Card
                key={caregiver.id}
                className="border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Header with avatar placeholder */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                  <div className="absolute -bottom-6 left-4 h-20 w-20 rounded-full bg-white border-4 border-white overflow-hidden shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                      {user?.fullName[0] || "C"}
                    </div>
                  </div>
                </div>

                <CardHeader className="pt-10 flex-1">
                  <CardTitle className="text-lg">{user?.fullName || "Pet Caregiver"}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(caregiver.rating)
                              ? "fill-accent text-accent"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{caregiver.rating}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {caregiver.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{caregiver.experience}+ years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{caregiver.availability.length} days/week</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1">
                    {caregiver.services.slice(0, 2).map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {caregiver.services.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{caregiver.services.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Certifications */}
                  {caregiver.certifications.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Certifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {caregiver.certifications.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between pt-2 border-t gap-2">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${caregiver.pricing}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">/visit</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/reviews?trainer=${caregiver.id}`}>
                          Reviews
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/profile?id=${caregiver.userId}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Stats */}
      <div className="mt-16 border-t pt-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Why Choose Our Caregivers?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center border-border">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold text-foreground">Verified Credentials</h3>
              <p className="text-sm text-muted-foreground">
                All caregivers are vetted, background-checked, and certified professionals
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-border">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold text-foreground">Daily Updates</h3>
              <p className="text-sm text-muted-foreground">
                Real-time photos, emotion detection, and activity verification
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-border">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold text-foreground">Reliable & Professional</h3>
              <p className="text-sm text-muted-foreground">
                Insurance covered, highly rated, and committed to excellence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
