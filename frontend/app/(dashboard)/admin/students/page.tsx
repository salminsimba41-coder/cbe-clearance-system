'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { CAMPUS_LABELS, PROGRAMME_LABELS } from '@/types'
import type { Campus, Programme } from '@/types'

export default function AdminStudentsPage() {
  useAuth('ADMIN')

  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCampus, setFilterCampus] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await adminApi.getStudents()
        setStudents(res.data.students || [])
      } catch {
        setStudents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = students.filter((s: any) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase()
    const num = s.studentNumber?.toLowerCase()
    const q = searchQuery.toLowerCase()
    const matchesSearch = name.includes(q) || num?.includes(q)
    const matchesCampus =
      filterCampus === 'ALL' || s.campus === filterCampus
    const matchesStatus =
      filterStatus === 'ALL' || s.academicStatus === filterStatus
    return matchesSearch && matchesCampus && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            All Students
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {students.length} students
          </p>
        </div>
        <div className="flex items-center gap-2 bg-cbe-primary text-white
                        px-3 py-1.5 rounded-lg text-sm font-medium">
          <i className="fa-solid fa-users" />
          {students.length} Total
        </div>
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-base pl-10"
          />
        </div>
        <select
          value={filterCampus}
          onChange={(e) => {
            setFilterCampus(e.target.value)
            setCurrentPage(1)
          }}
          className="input-base w-full sm:w-48"
        >
          <option value="ALL">All Campuses</option>
          <option value="DAR_ES_SALAAM">Dar es Salaam</option>
          <option value="DODOMA">Dodoma</option>
          <option value="MWANZA">Mwanza</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value)
            setCurrentPage(1)
          }}
          className="input-base w-full sm:w-44"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="DEFERRED">Deferred</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-base p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={8} />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon="fa-users"
            title="No Students Found"
            description="No students match your search or filter criteria."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {[
                      '#',
                      'Student',
                      'Student No.',
                      'Campus',
                      'Programme',
                      'Study Mode',
                      'Enrolled',
                      'Status',
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
                  {paginated.map((s: any, index: number) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? '' : 'bg-muted/10'
                      }`}
                    >
                      {/* Row Number */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>

                      {/* Student */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cbe-primary
                                          flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {s.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.gender} • {s.faculty}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student No */}
                      <td className="py-3 px-4 font-mono text-xs
                                     text-muted-foreground">
                        {s.studentNumber}
                      </td>

                      {/* Campus */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-location-dot text-cbe-gold" />
                          {CAMPUS_LABELS[s.campus as Campus]}
                        </span>
                      </td>

                      {/* Programme */}
                      <td className="py-3 px-4 text-xs text-muted-foreground
                                     max-w-[160px]">
                        <span className="block truncate">
                          {PROGRAMME_LABELS[s.programme as Programme] ??
                            s.programme?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Study Mode */}
                      <td className="py-3 px-4 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          s.studyMode === 'FULL_TIME'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {s.studyMode?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Enrolled */}
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {s.enrollmentYear}
                      </td>

                      {/* Academic Status */}
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.academicStatus === 'COMPLETED'
                            ? 'badge-approved'
                            : s.academicStatus === 'ACTIVE'
                            ? 'badge-progress'
                            : s.academicStatus === 'SUSPENDED'
                            ? 'badge-rejected'
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
                    className="w-8 h-8 rounded-lg border border-border flex items-center
                               justify-center text-xs hover:bg-muted transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
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
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-border flex items-center
                               justify-center text-xs hover:bg-muted transition-colors
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
