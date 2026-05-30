'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

export default function AdminAuditLogsPage() {
  useAuth('ADMIN')

  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await adminApi.getAuditLogs()
        setLogs(res.data.auditLogs || [])
      } catch {
        setLogs([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const actions = [...new Set(logs.map((l: any) => l.action))]

  const filtered = logs.filter((log: any) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      log.action?.toLowerCase().includes(q) ||
      log.entity?.toLowerCase().includes(q) ||
      log.user?.email?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q)
    const matchesAction =
      filterAction === 'ALL' || log.action === filterAction
    return matchesSearch && matchesAction
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const ACTION_COLORS: Record<string, string> = {
    LOGIN: 'bg-blue-100 text-blue-700',
    LOGOUT: 'bg-slate-100 text-slate-700',
    APPLY_CLEARANCE: 'bg-purple-100 text-purple-700',
    APPROVE_CLEARANCE: 'bg-emerald-100 text-emerald-700',
    REJECT_CLEARANCE: 'bg-red-100 text-red-700',
    FINAL_APPROVE: 'bg-green-100 text-green-700',
    CHANGE_PASSWORD: 'bg-orange-100 text-orange-700',
  }

  const ACTION_ICONS: Record<string, string> = {
    LOGIN: 'fa-right-to-bracket',
    LOGOUT: 'fa-right-from-bracket',
    APPLY_CLEARANCE: 'fa-file-circle-plus',
    APPROVE_CLEARANCE: 'fa-circle-check',
    REJECT_CLEARANCE: 'fa-circle-xmark',
    FINAL_APPROVE: 'fa-stamp',
    CHANGE_PASSWORD: 'fa-key',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Audit Logs
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete system activity trail — {logs.length} total records
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-700 text-white
                        px-3 py-1.5 rounded-lg text-sm font-medium">
          <i className="fa-solid fa-shield" />
          Secured Log
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5
                        top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            type="text"
            placeholder="Search by action, entity, or user..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base pl-10"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => {
            setFilterAction(e.target.value)
            setCurrentPage(1)
          }}
          className="input-base w-full sm:w-52"
        >
          <option value="ALL">All Actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a?.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card-base p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={10} />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon="fa-shield"
            title="No Audit Logs Found"
            description="No activity records match your search."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {[
                      'Action',
                      'User',
                      'Entity',
                      'Details',
                      'IP Address',
                      'Time',
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
                  {paginated.map((log: any) => {
                    const colorClass =
                      ACTION_COLORS[log.action] ??
                      'bg-gray-100 text-gray-700'
                    const icon =
                      ACTION_ICONS[log.action] ?? 'fa-circle-dot'

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* Action */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5
                                        text-xs px-2.5 py-1 rounded-full
                                        font-medium ${colorClass}`}
                          >
                            <i className={`fa-solid ${icon} text-[10px]`} />
                            {log.action?.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* User */}
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {log.user?.email ?? (
                            <span className="text-muted-foreground/50">
                              System
                            </span>
                          )}
                        </td>

                        {/* Entity */}
                        <td className="py-3 px-4 text-xs">
                          <span className="font-medium text-foreground">
                            {log.entity}
                          </span>
                          {log.entityId && (
                            <span className="text-muted-foreground/50 ml-1 font-mono text-[10px]">
                              #{log.entityId.slice(0, 8)}
                            </span>
                          )}
                        </td>

                        {/* Details */}
                        <td className="py-3 px-4 text-xs text-muted-foreground
                                       max-w-[200px]">
                          <span className="block truncate">
                            {log.details ?? '—'}
                          </span>
                        </td>

                        {/* IP */}
                        <td className="py-3 px-4 text-xs font-mono
                                       text-muted-foreground">
                          {log.ipAddress ?? '—'}
                        </td>

                        {/* Time */}
                        <td className="py-3 px-4 text-xs text-muted-foreground
                                       whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('en-TZ', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3
                              border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * perPage + 1}–
                  {Math.min(currentPage * perPage, filtered.length)} of{' '}
                  {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-border flex
                               items-center justify-center text-xs
                               hover:bg-muted transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium
                                    transition-colors ${
                          currentPage === i + 1
                            ? 'bg-cbe-primary text-white'
                            : 'border border-border hover:bg-muted'
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-border flex
                               items-center justify-center text-xs
                               hover:bg-muted transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
