"use client"

import type { Trainer, User } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, DollarSign, Award } from "lucide-react"

interface TrainerCardProps {
  trainer: Trainer
  user: User
  onBook?: (trainer: Trainer) => void
}

export function TrainerCard({ trainer, user, onBook }: TrainerCardProps) {
  return (
    <Card className="border-border transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback className="bg-primary text-lg text-primary-foreground">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold">{user.fullName}</h3>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{trainer.rating}</span>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {trainer.experience} years
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {trainer.pricing ? `$${trainer.pricing}/hr` : "Contact for price"}
              </span>
            </div>

            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{trainer.bio}</p>

            <div className="mb-4 flex flex-wrap gap-1">
              {trainer.services.slice(0, 3).map((service, idx) => {
                const serviceName = typeof service === "string" ? service : service.serviceName;
                return (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {serviceName}
                  </Badge>
                );
              })}
              {trainer.services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{trainer.services.length - 3}
                </Badge>
              )}
            </div>

            {onBook && (
              <Button onClick={() => onBook(trainer)} className="w-full">
                Book Session
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
