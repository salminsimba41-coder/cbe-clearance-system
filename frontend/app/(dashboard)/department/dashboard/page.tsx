'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { departmentApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import SummaryCard from '@/components/shared/SummaryCard'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

export default function DepartmentDashboard() {
  useAuth('DEPARTMENT_OFFICER')

  const router = useRouter()
  const { officer } = useAuthStore()
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const [pendingRes, historyRes] = await Promise.all([
          departmentApi.getPending(),
          departmentApi.getHistory(),
        ])
        setPending(pendingRes.data.pendingClearances || [])
        setHistory(historyRes.data.history || [])
      } catch {
        setPending([])
        setHistory([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const approved = history.filter((h: any) => h.status === 'APPROVED').length
  const rejected = history.filter((h: any) => h.status === 'REJECTED').length

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-cbe-primary rounded-2xl p-6 text-white">
        <h2 className="font-heading text-2xl font-bold mb-1">
          {officer?.firstName} {officer?.lastName}
        </h2>
        <p className="text-white/70 text-sm">
          {officer?.department?.name} — {officer?.campus?.replace(/_/g, ' ')} Campus
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="dashboard" />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              title="Pending Review"
              value={pending.length}
              icon="fa-clock"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
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
          </div>

          {/* Pending Students Table */}
          <div className="card-base">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Pending Students
              </h3>
              <button
                onClick={() => router.push('/department/pending')}
                className="text-sm text-cbe-primary font-medium hover:underline
                           flex items-center gap-1"
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>

            {pending.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <i className="fa-solid fa-inbox text-3xl mb-2 block" />
                <p className="text-sm">No pending students</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-semibold
                                     text-muted-foreground uppercase tracking-wide">
                        Student
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold
                                     text-muted-foreground uppercase tracking-wide">
                        Programme
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold
                                     text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold
                                     text-muted-foreground uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pending.slice(0, 5).map((item: any) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          <p className="font-medium text-foreground">
                            {item.clearanceRequest?.student?.firstName}{' '}
                            {item.clearanceRequest?.student?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.clearanceRequest?.student?.studentNumber}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {item.clearanceRequest?.student?.programme
                            ?.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-2">
                          <StatusBadge status={item.status} size="sm" />
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => router.push('/department/pending')}
                            className="text-xs text-cbe-primary font-medium
                                       hover:underline"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
