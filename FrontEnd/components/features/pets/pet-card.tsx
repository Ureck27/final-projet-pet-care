"use client"

import Link from "next/link"
import type { Pet } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dog, Cat, MoreVertical, Edit, Trash2, Calendar, FileText } from "lucide-react"

interface PetCardProps {
  pet: Pet
  onEdit?: (pet: Pet) => void
  onDelete?: (pet: Pet) => void
  onBook?: (pet: Pet) => void
  className?: string
}

export function PetCard({ pet, onEdit, onDelete, onBook, className }: PetCardProps) {
  const PetIcon = pet.type === "dog" ? Dog : Cat

  return (
    <Card className={`group overflow-hidden border-border transition-shadow hover:shadow-md ${className || ""}`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={(pet as any).image || pet.photo || pet.imageUrl || "/placeholder.svg"} alt={pet.name} className="h-full w-full object-cover" />
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
              <DropdownMenuItem asChild>
                <Link href={`/pets/${pet._id || pet.id}`} className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
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
          <div>
            <h3 className="font-semibold">{pet.name}</h3>
            {pet.fullName && <p className="text-xs text-muted-foreground">{pet.fullName}</p>}
          </div>
          <Badge variant="secondary" className="gap-1">
            <PetIcon className="h-3 w-3" />
            {pet.type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{pet.breed}</p>
        <p className="text-sm text-muted-foreground">{pet.age} years old</p>
        {pet.weight && <p className="text-xs text-muted-foreground">Weight: {pet.weight}</p>}
        {pet.color && <p className="text-xs text-muted-foreground">Color: {pet.color}</p>}
        {pet.medicalNotes && <p className="mt-2 text-xs text-muted-foreground line-clamp-2"><strong>Med:</strong> {pet.medicalNotes}</p>}
        {pet.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{pet.description}</p>}
      </CardContent>
    </Card>
  )
}
