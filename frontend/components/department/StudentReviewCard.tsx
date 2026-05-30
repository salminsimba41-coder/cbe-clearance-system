'use client'

import { useState } from 'react'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { PROGRAMME_LABELS, CAMPUS_LABELS } from '@/types'
import type { Programme, Campus } from '@/types'

interface StudentReviewCardProps {
  item: any
  onApprove: (id: string) => void
  onReject: (item: any) => void
  isLoading?: boolean
}

export default function StudentReviewCard({
  item,
  onApprove,
  onReject,
  isLoading = false,
}: StudentReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const student = item.clearanceRequest?.student

  return (
    <div className="card-base p-0 overflow-hidden">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Student Info */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-cbe-primary flex
                            items-center justify-center shrink-0">
              <span className="text-white font-bold">
                {student?.firstName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {student?.firstName} {student?.lastName}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {student?.studentNumber}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {PROGRAMME_LABELS[student?.programme as Programme] ??
                  student?.programme?.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Status */}
          <StatusBadge status={item.status} />
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Campus
            </p>
            <p className="text-xs font-medium text-foreground">
              {CAMPUS_LABELS[student?.campus as Campus]}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Faculty
            </p>
            <p className="text-xs font-medium text-foreground">
              {student?.faculty}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Submitted
            </p>
            <p className="text-xs font-medium text-foreground">
              {formatDate(item.clearanceRequest?.submittedAt)}
            </p>
          </div>
        </div>

        {/* Remarks (if rejected before) */}
        {item.remarks && (
          <div className="mt-3 bg-orange-50 border border-orange-200
                          rounded-lg px-3 py-2">
            <p className="text-xs text-orange-700">
              <i className="fa-solid fa-clock-rotate-left mr-1" />
              <strong>Previous remarks: </strong>
              {item.remarks}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 bg-muted/20">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Gender: </span>
              <span className="font-medium">{student?.gender}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Study Mode: </span>
              <span className="font-medium">
                {student?.studyMode?.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Enrolled: </span>
              <span className="font-medium">{student?.enrollmentYear}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Graduation: </span>
              <span className="font-medium">
                {student?.expectedGraduation}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              <span className="font-medium">{student?.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Home Region: </span>
              <span className="font-medium">{student?.homeRegion}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-border px-4 py-3 flex items-center
                      justify-between gap-3 bg-muted/10">
        {/* Toggle Details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground
                     flex items-center gap-1 transition-colors"
        >
          <i className={`fa-solid ${
            expanded ? 'fa-chevron-up' : 'fa-chevron-down'
          } text-[10px]`} />
          {expanded ? 'Hide details' : 'View details'}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReject(item)}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white
                       text-xs font-semibold hover:bg-red-700
                       transition-colors flex items-center gap-1
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-xmark" />
            Reject
          </button>
          <button
            onClick={() => onApprove(item.id)}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white
                       text-xs font-semibold hover:bg-emerald-700
                       transition-colors flex items-center gap-1
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-check" />
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}
