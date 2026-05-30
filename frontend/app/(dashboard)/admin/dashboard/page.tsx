'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import SummaryCard from '@/components/shared/SummaryCard'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import { CAMPUS_LABELS } from '@/types'
import type { Campus } from '@/types'

export default function AdminDashboard() {
  useAuth('ADMIN')

  const router = useRouter()
  const [reports, setReports] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const [reportsRes, studentsRes] = await Promise.all([
          adminApi.getReports(),
          adminApi.getStudents(),
        ])
        setReports(reportsRes.data)
        setStudents(studentsRes.data.students || [])
      } catch {
        setReports(null)
        setStudents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-cbe-primary rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">
              System Overview
            </h2>
            <p className="text-white/70 text-sm">
              CBE Digital Clearance System — Admin Control Panel
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10
                          px-3 py-1.5 rounded-lg">
            <i className="fa-solid fa-shield-halved text-cbe-gold" />
            <span className="text-white text-xs font-medium">Admin Access</span>
          </div>
        </div>

        {/* Campus Badges */}
        <div className="flex gap-2 mt-4">
          {(['DAR_ES_SALAAM', 'DODOMA', 'MWANZA'] as Campus[]).map((c) => (
            <span
              key={c}
              className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full
                         flex items-center gap-1"
            >
              <i className="fa-solid fa-location-dot text-cbe-gold text-[10px]" />
              {CAMPUS_LABELS[c]}
            </span>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="dashboard" />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Students"
              value={reports?.totalStudents ?? students.length}
              icon="fa-users"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <SummaryCard
              title="Total Requests"
              value={reports?.totalRequests ?? 0}
              icon="fa-file-lines"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
            <SummaryCard
              title="Completed"
              value={reports?.completed ?? 0}
              icon="fa-circle-check"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <SummaryCard
              title="Pending"
              value={reports?.pending ?? 0}
              icon="fa-clock"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'All Students',
                icon: 'fa-users',
                href: '/admin/students',
                color: 'bg-blue-600',
              },
              {
                label: 'Departments',
                icon: 'fa-building',
                href: '/admin/departments',
                color: 'bg-purple-600',
              },
              {
                label: 'Reports',
                icon: 'fa-chart-bar',
                href: '/admin/reports',
                color: 'bg-amber-600',
              },
              {
                label: 'Audit Logs',
                icon: 'fa-shield',
                href: '/admin/audit-logs',
                color: 'bg-slate-600',
              },
            ].map((action) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className={`${action.color} text-white rounded-xl p-4 text-center
                             hover:opacity-90 transition-opacity card-hover`}
              >
                <i className={`fa-solid ${action.icon} text-2xl mb-2 block`} />
                <p className="text-sm font-semibold">{action.label}</p>
              </button>
            ))}
          </div>

          {/* Recent Students Table */}
          <div className="card-base">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Recent Students
              </h3>
              <button
                onClick={() => router.push('/admin/students')}
                className="text-sm text-cbe-primary font-medium hover:underline
                           flex items-center gap-1"
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <i className="fa-solid fa-users text-3xl mb-2 block" />
                <p className="text-sm">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Student', 'Student No.', 'Campus', 'Programme', 'Status'].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-2 text-xs font-semibold
                                       text-muted-foreground uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.slice(0, 8).map((s: any) => (
                      <tr
                        key={s.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-cbe-primary
                                            flex items-center justify-center shrink-0">
                              <span className="text-white text-xs font-bold">
                                {s.firstName?.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {s.firstName} {s.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground font-mono text-xs">
                          {s.studentNumber}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {CAMPUS_LABELS[s.campus as Campus]}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs max-w-[160px] truncate">
                          {s.programme?.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            s.academicStatus === 'COMPLETED'
                              ? 'badge-approved'
                              : s.academicStatus === 'ACTIVE'
                              ? 'badge-progress'
                              : 'badge-pending'
                          }`}>
                            {s.academicStatus}
                          </span>
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
