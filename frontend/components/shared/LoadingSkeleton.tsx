interface LoadingSkeletonProps {
  rows?: number
  type?: 'table' | 'card' | 'dashboard'
}

function SkeletonBox({ className }: { className: string }) {
  return (
    <div className={`bg-muted animate-pulse rounded-lg ${className}`} />
  )
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      <SkeletonBox className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} className="h-14 w-full" />
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card-base space-y-3">
      <SkeletonBox className="h-4 w-1/3" />
      <SkeletonBox className="h-8 w-1/2" />
      <SkeletonBox className="h-3 w-1/4" />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="card-base">
        <TableSkeleton rows={5} />
      </div>
    </div>
  )
}

export default function LoadingSkeleton({
  rows = 5,
  type = 'table',
}: LoadingSkeletonProps) {
  if (type === 'dashboard') return <DashboardSkeleton />
  if (type === 'card') return <CardSkeleton />
  return <TableSkeleton rows={rows} />
}
