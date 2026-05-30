type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertBannerProps {
  type: AlertType
  message: string
  onClose?: () => void
}

const ALERT_CONFIG: Record<
  AlertType,
  { icon: string; bg: string; text: string; border: string; closeColor: string }
> = {
  success: {
    icon: 'fa-circle-check',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    closeColor: 'text-emerald-500 hover:text-emerald-700',
  },
  error: {
    icon: 'fa-circle-xmark',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    closeColor: 'text-red-400 hover:text-red-600',
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    closeColor: 'text-orange-400 hover:text-orange-600',
  },
  info: {
    icon: 'fa-circle-info',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    closeColor: 'text-blue-400 hover:text-blue-600',
  },
}

export default function AlertBanner({
  type,
  message,
  onClose,
}: AlertBannerProps) {
  const config = ALERT_CONFIG[type]

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                  ${config.bg} ${config.border}`}
    >
      <i className={`fa-solid ${config.icon} ${config.text} shrink-0`} />
      <p className={`text-sm font-medium flex-1 ${config.text}`}>
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className={`shrink-0 transition-colors ${config.closeColor}`}
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>
      )}
    </div>
  )
}
