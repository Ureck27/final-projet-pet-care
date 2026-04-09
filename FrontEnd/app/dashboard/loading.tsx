import { StatsCard } from '@/components/features/dashboard/stats-card';
import { PawPrint, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Stats Skeleton */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
