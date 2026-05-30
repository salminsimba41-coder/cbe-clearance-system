'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { registrarApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import SummaryCard from '@/components/shared/SummaryCard'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export default function RegistrarDashboard() {
  useAuth('REGISTRAR')

  const router = useRouter()
  const { user } = useAuthStore()
  const [readyStudents, setReadyStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [approveLoading, setApproveLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

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
    try {
      await registrarApi.finalApprove(approveId)
      setSuccessMsg('Student clearance completed and certificate generated!')
      setApproveId(null)
      await fetchReady()
    } catch {
      setApproveId(null)
    } finally {
      setApproveLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-cbe-primary rounded-2xl p-6 text-white">
        <h2 className="font-heading text-2xl font-bold mb-1">
          Registrar Dashboard
        </h2>
        <p className="text-white/70 text-sm">
          {user?.email} — Final Approval Authority
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="dashboard" />
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard
              title="Ready for Final Approval"
              value={readyStudents.length}
              icon="fa-user-check"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <SummaryCard
              title="Awaiting Your Action"
              value={readyStudents.length}
              icon="fa-stamp"
              iconBg="bg-cbe-gold/20"
              iconColor="text-amber-600"
            />
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-700 flex items-center gap-2">
                <i className="fa-solid fa-circle-check" />
                {successMsg}
              </p>
            </div>
          )}

          {/* Ready Students */}
          <div className="card-base">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Students Ready for Final Approval
              </h3>
              <button
                onClick={() => router.push('/registrar/ready')}
                className="text-sm text-cbe-primary font-medium hover:underline
                           flex items-center gap-1"
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>

            {readyStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <i className="fa-solid fa-inbox text-3xl mb-2 block" />
                <p className="text-sm">No students ready for final approval yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readyStudents.slice(0, 5).map((req: any) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4
                               rounded-xl border border-border bg-muted/30
                               hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100
                                      flex items-center justify-center">
                        <i className="fa-solid fa-user text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {req.student?.firstName} {req.student?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.student?.studentNumber} •{' '}
                          {req.student?.programme?.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} size="sm" />
                      <button
                        onClick={() => setApproveId(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white
                                   text-xs font-semibold hover:bg-emerald-700
                                   transition-colors flex items-center gap-1"
                      >
                        <i className="fa-solid fa-stamp" />
                        Final Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!approveId}
        title="Give Final Approval"
        message="This will complete the student's clearance and automatically generate their official clearance certificate. This action cannot be undone."
        confirmLabel="Yes, Approve & Generate Certificate"
        variant="success"
        isLoading={approveLoading}
        onConfirm={handleFinalApprove}
        onCancel={() => setApproveId(null)}
      />
    </div>
  )
}
