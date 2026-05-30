interface SummaryCardProps {
  title: string
  value: number | string
  icon: string
  iconBg: string
  iconColor: string
  trend?: {
    value: string
    positive: boolean
  }
}

export default function SummaryCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
}: SummaryCardProps) {
  return (
    <div className="card-base card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-heading font-bold text-foreground">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                trend.positive ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              <i
                className={`fa-solid ${
                  trend.positive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                }`}
              />
              {trend.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <i className={`fa-solid ${icon} text-xl ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}
