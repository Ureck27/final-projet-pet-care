"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewForm } from "@/components/features/reviews/review-form"
import { ReviewDisplay } from "@/components/features/reviews/review-display"
import { mockTrainers, mockUsers } from "@/lib/mock-data"
import { Star, MessageSquare } from "lucide-react"

export default function ReviewsPage() {
  const [selectedTrainer, setSelectedTrainer] = useState<string>("2")

  const trainer = mockTrainers.find((t) => t.id === selectedTrainer)
  const trainerUser = trainer ? mockUsers.find((u) => u.id === trainer.userId) : null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          Share your experience with caregivers and help other pet owners make informed decisions
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Trainer Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select a Caregiver</h2>
          <div className="space-y-2">
            {mockTrainers.map((t) => {
              const user = mockUsers.find((u) => u.id === t.userId)
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrainer(t.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTrainer === t.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <p className="font-semibold text-sm">{user?.fullName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Math.round(t.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{t.rating.toFixed(1)} rating</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.experience}+ years experience
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reviews & Form */}
        <div className="lg:col-span-2">
          {trainer && trainerUser ? (
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews" className="flex gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="form" className="flex gap-2">
                  <Star className="w-4 h-4" />
                  Leave Review
                </TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <ReviewDisplay caregiverId={trainer.id} />
              </TabsContent>

              {/* Form Tab */}
              <TabsContent value="form" className="mt-6">
                <ReviewForm caregiverName={trainerUser.fullName} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Select a caregiver to view and leave reviews
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
