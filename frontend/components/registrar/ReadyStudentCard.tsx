'use client'

import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { CAMPUS_LABELS, PROGRAMME_LABELS } from '@/types'
import type { Campus, Programme } from '@/types'

interface ReadyStudentCardProps {
  request: any
  onApprove: (id: string) => void
  isLoading?: boolean
}

export default function ReadyStudentCard({
  request,
  onApprove,
  isLoading = false,
}: ReadyStudentCardProps) {
  const student = request.student
  const depts = request.departmentClearances ?? []
  const approvedCount = depts.filter((d: any) => d.status === 'APPROVED').length

  return (
    <div className="card-base card-hover">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-cbe-primary flex
                          items-center justify-center shrink-0">
            <span className="text-white font-heading font-bold text-lg">
              {student?.firstName?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-heading font-bold text-foreground">
              {student?.firstName} {student?.lastName}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {student?.studentNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {student?.faculty}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted/40 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Programme
          </p>
          <p className="text-xs font-medium text-foreground truncate">
            {PROGRAMME_LABELS[student?.programme as Programme] ??
              student?.programme?.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="bg-muted/40 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Campus
          </p>
          <p className="text-xs font-medium text-foreground">
            <i className="fa-solid fa-location-dot text-cbe-gold mr-1" />
            {CAMPUS_LABELS[student?.campus as Campus]}
          </p>
        </div>
        <div className="bg-muted/40 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Academic Year
          </p>
          <p className="text-xs font-medium text-foreground">
            {request.academicYear}
          </p>
        </div>
        <div className="bg-muted/40 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Submitted
          </p>
          <p className="text-xs font-medium text-foreground">
            {formatDate(request.submittedAt)}
          </p>
        </div>
      </div>

      {/* Departments Cleared */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Departments Cleared
          </p>
          <p className="text-xs font-bold text-emerald-600">
            {approvedCount}/{depts.length}
          </p>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{
              width: `${depts.length > 0
                ? (approvedCount / depts.length) * 100
                : 0}%`,
            }}
          />
        </div>
      </div>

      {/* All Clear Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg
                      px-3 py-2 mb-4">
        <p className="text-xs text-emerald-700 flex items-center gap-2">
          <i className="fa-solid fa-circle-check" />
          All {depts.length} departments have approved this student
        </p>
      </div>

      {/* Action */}
      <button
        onClick={() => onApprove(request.id)}
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-cbe-primary text-white
                   font-semibold text-sm hover:bg-cbe-primary-light
                   transition-colors flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <i className="fa-solid fa-stamp" />
            Give Final Approval & Generate Certificate
          </>
        )}
      </button>
    </div>
  )
}
