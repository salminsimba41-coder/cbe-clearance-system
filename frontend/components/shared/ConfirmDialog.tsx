'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'success' | 'warning'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const VARIANT_CONFIG = {
  danger: {
    icon: 'fa-triangle-exclamation',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  success: {
    icon: 'fa-circle-check',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  warning: {
    icon: 'fa-circle-exclamation',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    btnClass: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const config = VARIANT_CONFIG[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md
                      border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center
                           mx-auto mb-4 ${config.iconBg}`}>
            <i className={`fa-solid ${config.icon} text-2xl ${config.iconColor}`} />
          </div>

          {/* Text */}
          <div className="text-center mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border
                         text-sm font-medium text-foreground
                         hover:bg-muted transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                          transition-colors duration-150 flex items-center
                          justify-center gap-2
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${config.btnClass}`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
