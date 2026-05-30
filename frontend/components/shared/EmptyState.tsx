interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  icon = 'fa-inbox',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <i className={`fa-solid ${icon} text-3xl text-muted-foreground`} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                     bg-cbe-primary text-white text-sm font-medium
                     hover:bg-cbe-primary-light transition-colors duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
