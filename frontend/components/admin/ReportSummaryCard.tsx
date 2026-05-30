interface ReportSummaryCardProps {
  title: string
  value: number
  total: number
  color: string
  icon: string
}

export default function ReportSummaryCard({
  title,
  value,
  total,
  color,
  icon,
}: ReportSummaryCardProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="card-base space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <i className={`fa-solid ${icon} text-white text-sm`} />
        </div>
      </div>
      <p className="text-3xl font-heading font-bold text-foreground">
        {value}
      </p>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{pct}% of total</span>
          <span>{total} total</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
