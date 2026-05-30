'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { studentApi, clearanceApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import SummaryCard from '@/components/shared/SummaryCard'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import type { Student, ClearanceRequest, DepartmentClearance } from '@/types'

export default function StudentDashboard() {
  useAuth('STUDENT')

  const { student } = useAuthStore()
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applyLoading, setApplyLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    fetchClearance()
  }, [])

  const fetchClearance = async () => {
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

  const handleApply = async () => {
    setApplyLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      await clearanceApi.apply()
      setSuccessMsg('Clearance application submitted successfully!')
      await fetchClearance()
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        'Failed to submit clearance application.'
      )
    } finally {
      setApplyLoading(false)
    }
  }

  const depts = clearance?.departmentClearances ?? []
  const approved = depts.filter((d) => d.status === 'APPROVED').length
  const rejected = depts.filter((d) => d.status === 'REJECTED').length
  const pending = depts.filter((d) => d.status === 'PENDING').length
  const total = depts.length

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-cbe-primary rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">
              Welcome, {student?.firstName}! 👋
            </h2>
            <p className="text-white/70 text-sm">
              {student?.studentNumber} — {student?.faculty}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {student?.programme?.replace(/_/g, ' ')} •{' '}
              {student?.campus?.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              Expected Graduation: {student?.expectedGraduation}
            </span>
            <span className="bg-cbe-gold/20 text-cbe-gold text-xs px-3 py-1 rounded-full">
              {student?.academicStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <LoadingSkeleton type="dashboard" />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Departments"
              value={total || 8}
              icon="fa-building"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <SummaryCard
              title="Approved"
              value={approved}
              icon="fa-circle-check"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <SummaryCard
              title="Rejected"
              value={rejected}
              icon="fa-circle-xmark"
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
            <SummaryCard
              title="Pending"
              value={pending}
              icon="fa-clock"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-700 flex items-center gap-2">
                <i className="fa-solid fa-circle-check" />
                {successMsg}
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <i className="fa-solid fa-circle-xmark" />
                {error}
              </p>
            </div>
          )}

          {/* No Clearance Yet */}
          {!clearance ? (
            <div className="card-base text-center py-12">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center
                              justify-center mx-auto mb-4">
                <i className="fa-solid fa-file-circle-plus text-3xl text-blue-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                No Clearance Application Yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                You have not submitted a clearance request. Apply now to start
                the clearance process before graduation.
              </p>
              <button
                onClick={handleApply}
                disabled={applyLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                           bg-cbe-primary text-white font-semibold text-sm
                           hover:bg-cbe-primary-light transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {applyLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane" />
                    Apply for Clearance
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Clearance Progress */
            <div className="card-base">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Clearance Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Academic Year: {clearance.academicYear}
                  </p>
                </div>
                <StatusBadge status={clearance.status} />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{approved} of {total} departments cleared</span>
                  <span>{total > 0 ? Math.round((approved / total) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${total > 0 ? (approved / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Department List */}
              <div className="space-y-3">
                {depts.map((dept: DepartmentClearance) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-3
                               rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center
                                       justify-center shrink-0 ${
                        dept.status === 'APPROVED'
                          ? 'bg-emerald-100'
                          : dept.status === 'REJECTED'
                          ? 'bg-red-100'
                          : 'bg-orange-100'
                      }`}>
                        <i className={`fa-solid text-sm ${
                          dept.status === 'APPROVED'
                            ? 'fa-check text-emerald-600'
                            : dept.status === 'REJECTED'
                            ? 'fa-xmark text-red-600'
                            : 'fa-clock text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {dept.department?.name}
                        </p>
                        {dept.remarks && (
                          <p className="text-xs text-red-500 mt-0.5">
                            <i className="fa-solid fa-circle-exclamation mr-1" />
                            {dept.remarks}
                          </p>
                        )}
                        {dept.clearedAt && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Cleared:{' '}
                            {new Date(dept.clearedAt).toLocaleDateString('en-TZ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={dept.status} size="sm" />
                  </div>
                ))}
              </div>

              {/* Certificate Download */}
              {clearance.status === 'COMPLETED' && clearance.certificate && (
                <div className="mt-6 bg-emerald-50 border border-emerald-200
                                rounded-xl p-4 text-center">
                  <i className="fa-solid fa-certificate text-3xl text-emerald-600 mb-2" />
                  <h4 className="font-heading font-bold text-foreground mb-1">
                    Clearance Certificate Ready!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Certificate No: {clearance.certificate.certificateNumber}
                  </p>
                  {clearance.certificate.fileUrl && (
                    <a
                      href={clearance.certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                                 bg-emerald-600 text-white text-sm font-semibold
                                 hover:bg-emerald-700 transition-colors"
                    >
                      <i className="fa-solid fa-download" />
                      Download Certificate (PDF)
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
