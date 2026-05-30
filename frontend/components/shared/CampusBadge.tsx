import type { Campus } from '@/types'
import { CAMPUS_LABELS } from '@/types'

interface CampusBadgeProps {
  campus: Campus
  size?: 'sm' | 'md'
}

const CAMPUS_COLORS: Record<Campus, string> = {
  DAR_ES_SALAAM: 'bg-blue-100 text-blue-700 border-blue-200',
  DODOMA: 'bg-green-100 text-green-700 border-green-200',
  MWANZA: 'bg-orange-100 text-orange-700 border-orange-200',
}

export default function CampusBadge({
  campus,
  size = 'md',
}: CampusBadgeProps) {
  const sizeClass =
    size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium
                  border ${sizeClass} ${CAMPUS_COLORS[campus]}`}
    >
      <i className="fa-solid fa-location-dot text-[10px]" />
      {CAMPUS_LABELS[campus]}
    </span>
  )
}
