import type { Role } from '@/types'

interface RoleBadgeProps {
  role: Role
  size?: 'sm' | 'md'
}

const ROLE_CONFIG: Record<
  Role,
  { label: string; icon: string; className: string }
> = {
  STUDENT: {
    label: 'Student',
    icon: 'fa-graduation-cap',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  DEPARTMENT_OFFICER: {
    label: 'Officer',
    icon: 'fa-building',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  REGISTRAR: {
    label: 'Registrar',
    icon: 'fa-stamp',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  ADMIN: {
    label: 'Admin',
    icon: 'fa-shield-halved',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
}

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role]
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium
                  border ${sizeClass} ${config.className}`}
    >
      <i className={`fa-solid ${config.icon} text-[10px]`} />
      {config.label}
    </span>
  )
}
