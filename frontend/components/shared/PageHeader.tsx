interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  actions?: React.ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center
                    justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-cbe-primary flex
                          items-center justify-center shrink-0">
            <i className={`fa-solid ${icon} text-white`} />
          </div>
        )}
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
