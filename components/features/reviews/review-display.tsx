"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockReviews, mockUsers } from "@/lib/mock-data"
import type { Review } from "@/lib/types"

interface ReviewDisplayProps {
  reviews?: Review[]
  caregiverId?: string
}

export function ReviewDisplay({
  reviews = mockReviews,
  caregiverId,
}: ReviewDisplayProps) {
  // Filter reviews by caregiver if provided
  const displayReviews = caregiverId
    ? reviews.filter((r) => r.caregiverId === caregiverId)
    : reviews

  const avgRating =
    displayReviews.length > 0
      ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) /
          displayReviews.length).toFixed(1)
      : "0"

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {displayReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Caregiver Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Average Rating */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-yellow-500">
                  {avgRating}
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(parseFloat(avgRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {displayReviews.length} review
                  {displayReviews.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="flex-1 space-y-3">
                {[
                  { label: "Professionalism", key: "professionalism" },
                  { label: "Communication", key: "communication" },
                  { label: "Care Quality", key: "careQuality" },
                  { label: "Punctuality", key: "punctuality" },
                ].map(({ label, key }) => {
                  const avgCategory =
                    displayReviews.length > 0
                      ? displayReviews.reduce(
                          (sum, r) =>
                            sum + (r.categories?.[key as keyof typeof r.categories] || 0),
                          0
                        ) / displayReviews.length
                      : 0

                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span className="font-semibold">
                          {avgCategory.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(avgCategory / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Customer Reviews ({displayReviews.length})
        </h3>

        {displayReviews.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to leave one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayReviews.map((review) => {
              const reviewer = mockUsers.find((u) => u.id === review.reviewerId)
              return (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    {/* Reviewer Info & Rating */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={reviewer?.avatar}
                            alt={reviewer?.fullName}
                          />
                          <AvatarFallback>
                            {reviewer?.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {reviewer?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Title & Content */}
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-sm text-foreground mb-4">
                      {review.comment}
                    </p>

                    {/* Category Details (optional) */}
                    {review.categories && (
                      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Detailed Ratings
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(review.categories).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="font-semibold">
                                  {value}/5
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Helpful Button */}
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
