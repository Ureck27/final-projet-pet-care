"use client"

import type { PetStatus, Pet } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footprints, UtensilsCrossed, Gamepad2, Moon, Pill } from "lucide-react"
import { format } from "date-fns"

interface StatusTimelineProps {
  statuses: PetStatus[]
  pets: Pet[]
}

export function StatusTimeline({ statuses, pets }: StatusTimelineProps) {
  const getStatusIcons = (status: PetStatus) => {
    const icons = []
    if (status.walked) icons.push({ icon: Footprints, label: "Walked", color: "text-success" })
    if (status.fed) icons.push({ icon: UtensilsCrossed, label: "Fed", color: "text-warning" })
    if (status.played) icons.push({ icon: Gamepad2, label: "Played", color: "text-primary" })
    if (status.resting) icons.push({ icon: Moon, label: "Resting", color: "text-muted-foreground" })
    if (status.medication) icons.push({ icon: Pill, label: "Medication", color: "text-destructive" })
    return icons
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {statuses.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No recent updates</p>
        ) : (
          <div className="space-y-4">
            {statuses.map((status) => {
              const pet = pets.find((p) => p.id === status.petId)
              const icons = getStatusIcons(status)

              return (
                <div key={status.id} className="relative border-l-2 border-border pl-4">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary" />
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{pet?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(status.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {icons.map(({ icon: Icon, label, color }) => (
                      <Badge key={label} variant="secondary" className="gap-1 text-xs">
                        <Icon className={`h-3 w-3 ${color}`} />
                        {label}
                      </Badge>
                    ))}
                  </div>
                  {status.notes && <p className="text-sm text-muted-foreground">{status.notes}</p>}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
