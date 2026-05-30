'use client'

import { useEffect, useState } from 'react'
import { departmentApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import RejectModal from '@/components/shared/RejectModal'

export default function DepartmentPendingPage() {
  useAuth('DEPARTMENT_OFFICER')

  const { officer } = useAuthStore()
  const [pending, setPending] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectItem, setRejectItem] = useState<any | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    setIsLoading(true)
    try {
      const res = await departmentApi.getPending()
      setPending(res.data.pendingClearances || [])
    } catch {
      setPending([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!approveId) return
    setActionLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await departmentApi.approve(approveId)
      setSuccessMsg('Student approved successfully!')
      setApproveId(null)
      await fetchPending()
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error || 'Failed to approve student.'
      )
      setApproveId(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (remarks: string) => {
    if (!rejectItem) return
    setActionLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await departmentApi.reject(rejectItem.id, remarks)
      setSuccessMsg('Student rejection submitted.')
      setRejectItem(null)
      await fetchPending()
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error || 'Failed to reject student.'
      )
      setRejectItem(null)
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = pending.filter((item: any) => {
    const student = item.clearanceRequest?.student
    const name = `${student?.firstName} ${student?.lastName}`.toLowerCase()
    const num = student?.studentNumber?.toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || num?.includes(q)
  })

  const approveItem = pending.find((p) => p.id === approveId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Pending Students
          </h2>
          <p className="text-sm text-muted-foreground">
            {officer?.department?.name} —{' '}
            {officer?.campus?.replace(/_/g, ' ')} Campus
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700
                        px-3 py-1.5 rounded-lg text-sm font-medium">
          <i className="fa-solid fa-clock" />
          {pending.length} Pending
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700 flex items-center gap-2">
            <i className="fa-solid fa-circle-check" />
            {successMsg}
          </p>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <i className="fa-solid fa-circle-xmark" />
            {errorMsg}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5
                      top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
        <input
          type="text"
          placeholder="Search by name or student number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base pl-10"
        />
      </div>

      {/* Table */}
      <div className="card-base p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-inbox"
            title="No Pending Students"
            description="All students have been reviewed or there are no pending requests for your department."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {[
                    'Student',
                    'Student No.',
                    'Programme',
                    'Submitted',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-xs font-semibold
                                 text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item: any) => {
                  const student = item.clearanceRequest?.student
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Student */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cbe-primary
                                          flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {student?.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {student?.firstName} {student?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student?.faculty}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student No */}
                      <td className="py-3 px-4 font-mono text-xs
                                     text-muted-foreground">
                        {student?.studentNumber}
                      </td>

                      {/* Programme */}
                      <td className="py-3 px-4 text-xs text-muted-foreground
                                     max-w-[160px]">
                        <span className="block truncate">
                          {student?.programme?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {new Date(
                          item.clearanceRequest?.submittedAt
                        ).toLocaleDateString('en-TZ', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setApproveId(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600
                                       text-white text-xs font-semibold
                                       hover:bg-emerald-700 transition-colors
                                       flex items-center gap-1"
                          >
                            <i className="fa-solid fa-check" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-red-600
                                       text-white text-xs font-semibold
                                       hover:bg-red-700 transition-colors
                                       flex items-center gap-1"
                          >
                            <i className="fa-solid fa-xmark" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!approveId}
        title="Approve Student Clearance"
        message={`Are you sure you want to approve clearance for ${
          approveItem?.clearanceRequest?.student?.firstName
        } ${approveItem?.clearanceRequest?.student?.lastName}?`}
        confirmLabel="Yes, Approve"
        variant="success"
        isLoading={actionLoading}
        onConfirm={handleApprove}
        onCancel={() => setApproveId(null)}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={!!rejectItem}
        studentName={`${rejectItem?.clearanceRequest?.student?.firstName} ${rejectItem?.clearanceRequest?.student?.lastName}`}
        departmentName={officer?.department?.name ?? 'Department'}
        isLoading={actionLoading}
        onConfirm={handleReject}
        onCancel={() => setRejectItem(null)}
      />
    </div>
  )
}
