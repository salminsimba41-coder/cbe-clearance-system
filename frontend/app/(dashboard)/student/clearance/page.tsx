'use client'

import { useEffect, useState } from 'react'
import { clearanceApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import type { ClearanceRequest } from '@/types'

export default function StudentClearancePage() {
  useAuth('STUDENT')

  const [clearance, setClearance] = useState<ClearanceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await clearanceApi.getMyClearance()
        setClearance(res.data.clearanceRequest || null)
      } catch {
        setClearance(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />
  }

  if (!clearance) {
    return (
      <div className="card-base">
        <EmptyState
          icon="fa-file-circle-xmark"
          title="No Clearance Application"
          description="You have not submitted a clearance application yet. Go to your dashboard to apply."
        />
      </div>
    )
  }

  const depts = clearance.departmentClearances ?? []

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card-base">
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">
              Clearance Application Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Academic Year: <span className="font-medium">{clearance.academicYear}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Submitted:{' '}
              <span className="font-medium">
                {new Date(clearance.submittedAt).toLocaleDateString('en-TZ', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
            {clearance.completedAt && (
              <p className="text-sm text-muted-foreground">
                Completed:{' '}
                <span className="font-medium text-emerald-600">
                  {new Date(clearance.completedAt).toLocaleDateString('en-TZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            )}
          </div>
          <StatusBadge status={clearance.status} />
        </div>
      </div>

      {/* Department Clearances */}
      <div className="card-base">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">
          Department Clearances
        </h3>
        <div className="space-y-3">
          {depts.map((dept, index) => (
            <div
              key={dept.id}
              className="p-4 rounded-xl border border-border bg-muted/30
                         hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Step Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center
                                   justify-center text-xs font-bold shrink-0 ${
                    dept.status === 'APPROVED'
                      ? 'bg-emerald-500 text-white'
                      : dept.status === 'REJECTED'
                      ? 'bg-red-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {dept.status === 'APPROVED' ? (
                      <i className="fa-solid fa-check text-xs" />
                    ) : dept.status === 'REJECTED' ? (
                      <i className="fa-solid fa-xmark text-xs" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {dept.department?.name}
                    </p>

                    {dept.officer && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <i className="fa-solid fa-user mr-1" />
                        Reviewed by: {dept.officer.firstName} {dept.officer.lastName}
                      </p>
                    )}

                    {dept.clearedAt && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <i className="fa-solid fa-calendar-check mr-1" />
                        {new Date(dept.clearedAt).toLocaleDateString('en-TZ', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}

                    {dept.remarks && (
                      <div className="mt-2 bg-red-50 border border-red-200
                                      rounded-lg px-3 py-2">
                        <p className="text-xs text-red-600">
                          <i className="fa-solid fa-circle-exclamation mr-1" />
                          <strong>Reason:</strong> {dept.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <StatusBadge status={dept.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Section */}
      {clearance.status === 'COMPLETED' && clearance.certificate && (
        <div className="card-base bg-gradient-to-br from-emerald-50 to-teal-50
                        border-emerald-200">
          <div className="text-center py-4">
            <i className="fa-solid fa-certificate text-5xl text-emerald-500 mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-1">
              🎉 Clearance Complete!
            </h3>
            <p className="text-muted-foreground text-sm mb-1">
              Certificate Number:{' '}
              <span className="font-mono font-bold text-foreground">
                {clearance.certificate.certificateNumber}
              </span>
            </p>
            <p className="text-muted-foreground text-xs mb-6">
              Generated on{' '}
              {new Date(clearance.certificate.generatedAt).toLocaleDateString('en-TZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {clearance.certificate.fileUrl && (
              <a
                href={clearance.certificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-emerald-600 text-white font-semibold text-sm
                           hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <i className="fa-solid fa-file-pdf" />
                Download Official Certificate (PDF)
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
