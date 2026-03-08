"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Heart, 
  Pill, 
  Apple, 
  AlertTriangle, 
  Stethoscope, 
  Zap, 
  Eye, 
  Briefcase,
  Edit2,
  Info,
  FileText
} from "lucide-react"
import type { Pet, PetProfile } from "@/lib/types"
import { format } from "date-fns"

interface PetProfileDetailProps {
  pet: Pet
  profile: PetProfile
}

export function PetProfileDetail({ pet, profile }: PetProfileDetailProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pet.name}'s Profile</h1>
          <p className="text-muted-foreground">
            {pet.breed} • {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} • {pet.age} years old
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
          <Edit2 className="h-4 w-4" />
          {isEditing ? "View" : "Edit"} Profile
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          {/* Veterinarian Card */}
          {profile.veterinarian && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Veterinarian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{profile.veterinarian.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clinic</p>
                    <p className="font-medium">{profile.veterinarian.clinic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.veterinarian.phone}</p>
                  </div>
                  {profile.veterinarian.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-primary">{profile.veterinarian.email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.weight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-lg font-semibold">{profile.weight} lbs</p>
                  </div>
                )}
                {profile.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="text-lg font-semibold">{profile.color}</p>
                  </div>
                )}
                {profile.microchipId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Microchip ID</p>
                    <p className="font-mono text-sm">{profile.microchipId}</p>
                  </div>
                )}
                {profile.dateOfBirth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{format(new Date(profile.dateOfBirth), "MMM d, yyyy")}</p>
                  </div>
                )}
              </div>

              {/* Allergies Alert */}
              {profile.allergies && profile.allergies.length > 0 && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Allergies:</strong> {profile.allergies.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Medical History */}
          {profile.medicalHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.medicalHistory.map((record, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4">
                    <p className="font-medium">{record.condition}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(record.date), "MMM d, yyyy")}</p>
                    <p className="text-sm">Treatment: {record.treatment}</p>
                    {record.notes && <p className="text-xs text-muted-foreground">Notes: {record.notes}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Vaccinations */}
          {profile.vaccinations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vaccination Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.vaccinations.map((vax, i) => {
                  const isExpired = vax.expiryDate && new Date(vax.expiryDate) < new Date()
                  return (
                    <div
                      key={i}
                      className={`rounded-lg p-3 ${
                        isExpired ? "bg-yellow-50 dark:bg-yellow-950" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{vax.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Date: {format(new Date(vax.date), "MMM d, yyyy")}
                          </p>
                          {vax.expiryDate && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {format(new Date(vax.expiryDate), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        {isExpired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diet Tab */}
        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Dietary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.dietaryRequirements && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dietary Requirements</p>
                    <p className="font-medium">{profile.dietaryRequirements}</p>
                  </div>
                )}
                {profile.foodBrand && (
                  <div>
                    <p className="text-sm text-muted-foreground">Current Food</p>
                    <p className="font-medium">{profile.foodBrand}</p>
                  </div>
                )}
                {profile.mealsPerDay && (
                  <div>
                    <p className="text-sm text-muted-foreground">Meals Per Day</p>
                    <p className="font-medium">{profile.mealsPerDay}</p>
                  </div>
                )}
                {profile.waterIntakeGoal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Water Intake Goal</p>
                    <p className="font-medium">{profile.waterIntakeGoal} ml/day</p>
                  </div>
                )}
              </div>

              {profile.mealTimes && profile.mealTimes.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Meal Times</p>
                  <div className="flex gap-2">
                    {profile.mealTimes.map((time, i) => (
                      <Badge key={i} variant="secondary">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.restrictions && profile.restrictions.length > 0 && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Food Restrictions:</strong> {profile.restrictions.join(", ")}
                  </AlertDescription>
                </Alert>
              )}

              {profile.treats && profile.treats.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
                  <p className="text-sm font-medium">Approved Treats</p>
                  <p className="text-sm text-muted-foreground">{profile.treats.join(", ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medications & Supplements */}
          {(profile.medications.length > 0 || profile.supplements.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medications & Supplements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.medications.length > 0 && (
                  <div>
                    <p className="mb-2 font-medium">Medications</p>
                    <div className="space-y-2">
                      {profile.medications.map((med, i) => (
                        <div key={i} className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                          <p className="font-medium">{med.name}</p>
                          <div className="grid gap-1 text-sm text-muted-foreground">
                            <p>Dosage: {med.dosage}</p>
                            <p>Frequency: {med.frequency}</p>
                            <p>Purpose: {med.purpose}</p>
                            {med.instructions && <p>Instructions: {med.instructions}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.supplements.length > 0 && (
                  <div>
                    <p className="mb-2 font-medium">Supplements</p>
                    <div className="space-y-2">
                      {profile.supplements.map((supp, i) => (
                        <div key={i} className="rounded-lg bg-secondary/10 p-3">
                          <p className="font-medium">{supp.name}</p>
                          <div className="grid gap-1 text-sm text-muted-foreground">
                            <p>Dosage: {supp.dosage}</p>
                            <p>Frequency: {supp.frequency}</p>
                            <p>Purpose: {supp.purpose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Behavioral Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.temperament && profile.temperament.length > 0 && (
                <div>
                  <p className="mb-2 font-medium">Temperament</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.temperament.map((trait, i) => (
                      <Badge key={i} variant="outline">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.positiveBehaviors && profile.positiveBehaviors.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
                  <p className="mb-2 font-medium">Positive Behaviors ✓</p>
                  <ul className="space-y-1 text-sm">
                    {profile.positiveBehaviors.map((behavior, i) => (
                      <li key={i}>• {behavior}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.knownBehaviors && profile.knownBehaviors.length > 0 && (
                <div className="rounded-lg border border-secondary/20 bg-secondary/10 p-3">
                  <p className="mb-2 font-medium">Known Behaviors</p>
                  <ul className="space-y-1 text-sm">
                    {profile.knownBehaviors.map((behavior, i) => (
                      <li key={i}>• {behavior}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.fears && profile.fears.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fears:</strong> {profile.fears.join(", ")}
                  </AlertDescription>
                </Alert>
              )}

              {profile.triggers && profile.triggers.length > 0 && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Triggers:</strong> {profile.triggers.join(", ")}
                  </AlertDescription>
                </Alert>
              )}

              {profile.trainingStatus && (
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Training Status</p>
                  <p className="font-medium">{profile.trainingStatus}</p>
                </div>
              )}

              {profile.preferredActivities && profile.preferredActivities.length > 0 && (
                <div>
                  <p className="mb-2 font-medium">Preferred Activities</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredActivities.map((activity, i) => (
                      <Badge key={i} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.exerciseNeeds && (
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Exercise Needs</p>
                  <p className="font-medium capitalize">{profile.exerciseNeeds}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {profile.sleepSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sleep Schedule</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Bedtime</p>
                  <p className="text-lg font-semibold">{profile.sleepSchedule.bedtime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wake Time</p>
                  <p className="text-lg font-semibold">{profile.sleepSchedule.wakeTime}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {profile.grooming && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grooming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-medium">{profile.grooming.frequency}</p>
                  </div>
                  {profile.grooming.groomer && (
                    <div>
                      <p className="text-sm text-muted-foreground">Groomer</p>
                      <p className="font-medium">{profile.grooming.groomer}</p>
                    </div>
                  )}
                </div>
                {profile.grooming.lastGrooming && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Grooming</p>
                    <p className="font-medium">{format(new Date(profile.grooming.lastGrooming), "MMM d, yyyy")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-4">
          {profile.emergencyContacts.length > 0 && (
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.emergencyContacts.map((contact, i) => (
                  <div key={i} className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    <p className="text-sm font-mono">{contact.phone}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(profile.insuranceProvider || profile.insurancePolicyNumber) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Insurance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.insuranceProvider && (
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{profile.insuranceProvider}</p>
                  </div>
                )}
                {profile.insurancePolicyNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Number</p>
                    <p className="font-mono font-medium">{profile.insurancePolicyNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {profile.specialInstructions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Special Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{profile.specialInstructions}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
