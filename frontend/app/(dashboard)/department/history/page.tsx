'use client'

import { useEffect, useState } from 'react'
import { departmentApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

export default function DepartmentHistoryPage() {
  useAuth('DEPARTMENT_OFFICER')

  const { officer } = useAuthStore()
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await departmentApi.getHistory()
        setHistory(res.data.history || [])
      } catch {
        setHistory([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = history.filter((item: any) => {
    const student = item.clearanceRequest?.student
    const name = `${student?.firstName} ${student?.lastName}`.toLowerCase()
    const num = student?.studentNumber?.toLowerCase()
    const q = searchQuery.toLowerCase()
    const matchesSearch = name.includes(q) || num?.includes(q)
    const matchesFilter =
      filterStatus === 'ALL' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Clearance History
        </h2>
        <p className="text-sm text-muted-foreground">
          {officer?.department?.name} —{' '}
          {officer?.campus?.replace(/_/g, ' ')} Campus
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-base w-full sm:w-44"
        >
          <option value="ALL">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Total',
            value: history.length,
            color: 'bg-blue-50 text-blue-700 border-blue-200',
          },
          {
            label: 'Approved',
            value: history.filter((h: any) => h.status === 'APPROVED').length,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          },
          {
            label: 'Rejected',
            value: history.filter((h: any) => h.status === 'REJECTED').length,
            color: 'bg-red-50 text-red-700 border-red-200',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-3 text-center ${stat.color}`}
          >
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-base p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={6} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-clock-rotate-left"
            title="No History Found"
            description="No clearance records match your search or filter."
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
                    'Status',
                    'Remarks',
                    'Date',
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
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-cbe-primary
                                          flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {student?.firstName?.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {student?.firstName} {student?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs
                                     text-muted-foreground">
                        {student?.studentNumber}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground
                                     max-w-[140px]">
                        <span className="block truncate">
                          {student?.programme?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground
                                     max-w-[160px]">
                        {item.remarks ? (
                          <span className="text-red-500 truncate block">
                            {item.remarks}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {item.clearedAt
                          ? new Date(item.clearedAt).toLocaleDateString(
                              'en-TZ',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
