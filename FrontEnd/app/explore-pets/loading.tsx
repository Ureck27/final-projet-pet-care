import { PetCardSkeleton } from "@/components/features/pets/pet-card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
      </div>
      <div className="mb-8">
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
