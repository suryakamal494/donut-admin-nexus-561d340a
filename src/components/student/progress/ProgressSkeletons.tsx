import { Skeleton } from "@/components/ui/skeleton";

/** Generic card wrapper skeleton */
export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3 ${className}`}>
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-20 w-full rounded-xl" />
    <Skeleton className="h-3 w-40" />
  </div>
);

/** Hero card with circle gauge */
export const HeroSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg">
    <div className="flex items-start gap-3 sm:gap-4">
      <Skeleton className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5 pt-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  </div>
);

/** Batch standing bar skeleton */
export const StandingSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <Skeleton className="h-3 w-full rounded-full" />
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-12 rounded-lg" />
      <Skeleton className="h-12 rounded-lg" />
      <Skeleton className="h-12 rounded-lg" />
    </div>
  </div>
);

/** Subject grid skeleton */
export const SubjectGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3">
    <Skeleton className="h-4 w-16" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  </div>
);

/** Chart skeleton */
export const ChartSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-[200px] sm:h-[260px] w-full rounded-xl" />
    <Skeleton className="h-3 w-48 mx-auto" />
  </div>
);

/** Timeline skeleton */
export const TimelineSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3">
    <Skeleton className="h-4 w-24" />
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-1 h-14 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Insight banner skeleton */
export const InsightSkeleton = () => (
  <div className="bg-gradient-to-br from-[hsl(var(--donut-coral))]/5 to-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-[hsl(var(--donut-coral))]/10 shadow-lg space-y-3">
    <div className="flex items-center gap-2">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="h-4 w-36" />
    </div>
    <Skeleton className="h-12 w-full rounded" />
    <Skeleton className="h-3 w-48" />
    <Skeleton className="h-3 w-40" />
  </div>
);

/** Radar chart skeleton */
export const RadarSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3">
    <Skeleton className="h-4 w-36" />
    <Skeleton className="h-[200px] sm:h-[260px] w-full rounded-full mx-auto max-w-[260px]" />
    <Skeleton className="h-3 w-56 mx-auto" />
  </div>
);

/** Streak calendar skeleton */
export const StreakSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/50 shadow-lg space-y-3">
    <Skeleton className="h-4 w-24" />
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 28 }).map((_, i) => (
        <Skeleton key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
      ))}
    </div>
    <Skeleton className="h-3 w-32" />
  </div>
);