import { TrainerCardSkeleton } from "@/components/features/trainers/trainer-card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TrainerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
