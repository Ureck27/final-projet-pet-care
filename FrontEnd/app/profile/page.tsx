"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { mockTrainers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainerServicesManager } from "@/components/features/trainers/trainer-services-manager"
import { Camera, Mail, Phone, Calendar, Award, Star, Briefcase, Clock, Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
  })

  if (!user) {
    router.push("/login")
    return null
  }

  const trainerProfile = user.role === "trainer" ? mockTrainers.find((t) => t.userId === user.id) : null

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {user.role === "user" ? "Pet Owner" : user.role}
                    </Badge>
                  </div>
                  <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>

                {trainerProfile && (
                  <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {trainerProfile.rating} Rating
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      {trainerProfile.experience} Years Experience
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />${trainerProfile.pricing}/hour
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            {user.role === "trainer" && <TabsTrigger value="professional">Professional</TabsTrigger>}
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === "trainer" && trainerProfile && (
            <TabsContent value="professional" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Manage your trainer profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} defaultValue={trainerProfile.bio} disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {trainerProfile.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t pb-4">
                    <TrainerServicesManager />
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="flex flex-wrap gap-2">
                      {trainerProfile.availability.map((day) => (
                        <Badge key={day} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        defaultValue={trainerProfile.experience}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricing">Hourly Rate ($)</Label>
                      <Input id="pricing" type="number" defaultValue={trainerProfile.pricing} disabled={!isEditing} />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="security" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
