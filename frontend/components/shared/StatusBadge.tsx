import type { ClearanceStatus, DepartmentClearanceStatus } from '@/types'

type Status = ClearanceStatus | DepartmentClearanceStatus

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<Status, { label: string; className: string; icon: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'badge-pending',
    icon: 'fa-clock',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'badge-progress',
    icon: 'fa-spinner',
  },
  APPROVED: {
    label: 'Approved',
    className: 'badge-approved',
    icon: 'fa-circle-check',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'badge-rejected',
    icon: 'fa-circle-xmark',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'badge-completed',
    icon: 'fa-badge-check',
  },
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium
                  ${sizeClass} ${config.className}`}
    >
      <i className={`fa-solid ${config.icon} text-[10px]`} />
      {config.label}
    </span>
  )
}
