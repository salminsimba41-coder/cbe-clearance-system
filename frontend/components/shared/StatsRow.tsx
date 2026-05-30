interface StatItem {
  label: string
  value: number | string
  color: string
  icon: string
}

interface StatsRowProps {
  stats: StatItem[]
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border p-3 text-center ${stat.color}`}
        >
          <i className={`fa-solid ${stat.icon} text-xl mb-1 block`} />
          <p className="text-2xl font-heading font-bold">{stat.value}</p>
          <p className="text-xs font-medium mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
