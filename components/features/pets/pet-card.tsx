"use client"

import type { Pet } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dog, Cat, MoreVertical, Edit, Trash2, Calendar } from "lucide-react"

interface PetCardProps {
  pet: Pet
  onEdit?: (pet: Pet) => void
  onDelete?: (pet: Pet) => void
  onBook?: (pet: Pet) => void
}

export function PetCard({ pet, onEdit, onDelete, onBook }: PetCardProps) {
  const PetIcon = pet.species === "dog" ? Dog : Cat

  return (
    <Card className="group overflow-hidden border-border transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={pet.photo || "/placeholder.svg"} alt={pet.name} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(pet)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onBook && (
                <DropdownMenuItem onClick={() => onBook(pet)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Trainer
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(pet)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{pet.name}</h3>
          <Badge variant="secondary" className="gap-1">
            <PetIcon className="h-3 w-3" />
            {pet.species}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{pet.breed}</p>
        <p className="text-sm text-muted-foreground">{pet.age} years old</p>
        {pet.medicalNotes && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{pet.medicalNotes}</p>}
      </CardContent>
    </Card>
  )
}
