'use client'

import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { DepartmentClearance } from '@/types'

const DEPT_ICONS: Record<string, string> = {
  'Library': 'fa-book',
  'Finance & Accounts': 'fa-coins',
  'Hostel Office': 'fa-house',
  'Faculty Office': 'fa-chalkboard-teacher',
  'Examination Office': 'fa-file-pen',
  'Student Affairs': 'fa-user-graduate',
  'IT Department': 'fa-laptop',
  'Research Office': 'fa-flask',
  'Registrar Office': 'fa-stamp',
}

interface ClearanceProgressTrackerProps {
  departmentClearances: DepartmentClearance[]
  showTimeline?: boolean
}

export default function ClearanceProgressTracker({
  departmentClearances,
  showTimeline = false,
}: ClearanceProgressTrackerProps) {
  const approved = departmentClearances.filter(
    (d) => d.status === 'APPROVED'
  ).length
  const total = departmentClearances.length
  const progressPct = total > 0 ? Math.round((approved / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-cbe-primary/5 border border-cbe-primary/20
                      rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-cbe-primary">
            {progressPct}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              progressPct === 100
                ? 'bg-emerald-500'
                : progressPct >= 50
                ? 'bg-blue-500'
                : 'bg-orange-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {approved} of {total} departments cleared
          </span>
          <span className="text-xs text-muted-foreground">
            {total - approved} remaining
          </span>
        </div>
      </div>

      {/* Department List */}
      <div className="space-y-2">
        {departmentClearances.map((dept, index) => {
          const icon =
            DEPT_ICONS[dept.department?.name ?? ''] ?? 'fa-building'

          return (
            <div
              key={dept.id}
              className={`relative flex items-start gap-3 p-3 rounded-xl
                          border transition-all duration-200 ${
                dept.status === 'APPROVED'
                  ? 'bg-emerald-50 border-emerald-200'
                  : dept.status === 'REJECTED'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-muted/30 border-border'
              }`}
            >
              {/* Timeline Line */}
              {showTimeline && index < departmentClearances.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-4 bg-border" />
              )}

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center
                             shrink-0 ${
                  dept.status === 'APPROVED'
                    ? 'bg-emerald-500'
                    : dept.status === 'REJECTED'
                    ? 'bg-red-500'
                    : 'bg-muted'
                }`}
              >
                {dept.status === 'APPROVED' ? (
                  <i className="fa-solid fa-check text-white text-sm" />
                ) : dept.status === 'REJECTED' ? (
                  <i className="fa-solid fa-xmark text-white text-sm" />
                ) : (
                  <i className={`fa-solid ${icon} text-muted-foreground text-sm`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {dept.department?.name}
                  </p>
                  <StatusBadge status={dept.status} size="sm" />
                </div>

                {dept.officer && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <i className="fa-solid fa-user mr-1" />
                    {dept.officer.firstName} {dept.officer.lastName}
                  </p>
                )}

                {dept.clearedAt && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    <i className="fa-solid fa-calendar-check mr-1" />
                    Cleared on {formatDate(dept.clearedAt)}
                  </p>
                )}

                {dept.remarks && (
                  <div className="mt-2 bg-red-100 border border-red-200
                                  rounded-lg px-3 py-2">
                    <p className="text-xs text-red-700">
                      <i className="fa-solid fa-circle-exclamation mr-1" />
                      <strong>Issue: </strong>
                      {dept.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
