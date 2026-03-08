"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Star, Send } from "lucide-react"

interface ReviewFormProps {
  caregiverName: string
  onSubmit?: (review: {
    rating: number
    title: string
    comment: string
    categories: {
      professionalism: number
      communication: number
      careQuality: number
      punctuality: number
    }
  }) => void
}

export function ReviewForm({ caregiverName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [categories, setCategories] = useState({
    professionalism: 5,
    communication: 5,
    careQuality: 5,
    punctuality: 5,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleCategoryChange = (category: string, value: number) => {
    setCategories({
      ...categories,
      [category]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !comment.trim()) return

    onSubmit?.({
      rating,
      title,
      comment,
      categories,
    })

    setTitle("")
    setComment("")
    setRating(5)
    setCategories({
      professionalism: 5,
      communication: 5,
      careQuality: 5,
      punctuality: 5,
    })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number
    onChange: (val: number) => void
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review for {caregiverName}</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-semibold">
              ✓ Review submitted! Thank you for your feedback.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Overall Rating
            </Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <Label className="text-base font-semibold block">
              Rate by Category
            </Label>
            {Object.entries(categories).map(([category, value]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <Badge variant="outline">{value}/5</Badge>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleCategoryChange(category, star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= value
                            ? "fill-blue-400 text-blue-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              placeholder="Summarize your experience in a few words"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience with this caregiver..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={5}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim() || !comment.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
