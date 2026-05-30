'use client'

import { useEffect, useState } from 'react'
import { registrarApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { CAMPUS_LABELS, PROGRAMME_LABELS } from '@/types'
import type { Campus, Programme } from '@/types'

export default function RegistrarReadyPage() {
  useAuth('REGISTRAR')

  const [readyStudents, setReadyStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [approveLoading, setApproveLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchReady()
  }, [])

  const fetchReady = async () => {
    setIsLoading(true)
    try {
      const res = await registrarApi.getReadyStudents()
      setReadyStudents(res.data.readyStudents || [])
    } catch {
      setReadyStudents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalApprove = async () => {
    if (!approveId) return
    setApproveLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await registrarApi.finalApprove(approveId)
      setSuccessMsg('Certificate generated and student clearance completed!')
      setApproveId(null)
      await fetchReady()
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error || 'Failed to approve student.'
      )
      setApproveId(null)
    } finally {
      setApproveLoading(false)
    }
  }

  const filtered = readyStudents.filter((req: any) => {
    const s = req.student
    const name = `${s?.firstName} ${s?.lastName}`.toLowerCase()
    const num = s?.studentNumber?.toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || num?.includes(q)
  })

  const approveItem = readyStudents.find((r) => r.id === approveId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Ready for Final Approval
          </h2>
          <p className="text-sm text-muted-foreground">
            Students who have been cleared by all departments
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 text-blue-700
                        px-3 py-1.5 rounded-lg text-sm font-medium">
          <i className="fa-solid fa-user-check" />
          {readyStudents.length} Ready
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
            icon="fa-user-check"
            title="No Students Ready"
            description="No students have completed all department clearances yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {[
                    'Student',
                    'Student No.',
                    'Campus',
                    'Programme',
                    'Academic Year',
                    'Status',
                    'Action',
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
                {filtered.map((req: any) => {
                  const s = req.student
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Student */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-cbe-primary
                                          flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-bold">
                              {s?.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {s?.firstName} {s?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s?.faculty}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student No */}
                      <td className="py-3 px-4 font-mono text-xs
                                     text-muted-foreground">
                        {s?.studentNumber}
                      </td>

                      {/* Campus */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-location-dot text-cbe-gold" />
                          {CAMPUS_LABELS[s?.campus as Campus]}
                        </span>
                      </td>

                      {/* Programme */}
                      <td className="py-3 px-4 text-xs text-muted-foreground
                                     max-w-[160px]">
                        <span className="block truncate">
                          {PROGRAMME_LABELS[s?.programme as Programme] ??
                            s?.programme?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Academic Year */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {req.academicYear}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={req.status} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setApproveId(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-cbe-primary
                                     text-white text-xs font-semibold
                                     hover:bg-cbe-primary-light transition-colors
                                     flex items-center gap-1"
                        >
                          <i className="fa-solid fa-stamp" />
                          Final Approve
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!approveId}
        title="Issue Final Clearance"
        message={`You are about to give final approval for ${
          approveItem?.student?.firstName
        } ${approveItem?.student?.lastName}. This will generate their official clearance certificate. This action is irreversible.`}
        confirmLabel="Approve & Generate Certificate"
        variant="success"
        isLoading={approveLoading}
        onConfirm={handleFinalApprove}
        onCancel={() => setApproveId(null)}
      />
    </div>
  )
}
