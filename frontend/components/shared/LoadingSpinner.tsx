interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
}

const SIZE_MAP = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-3',
  lg: 'w-16 h-16 border-4',
}

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message = 'Loading...',
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${SIZE_MAP[size]} border-cbe-primary border-t-cbe-gold
                    rounded-full animate-spin`}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm
                      flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}
