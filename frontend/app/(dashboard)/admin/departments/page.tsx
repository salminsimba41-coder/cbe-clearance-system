'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { CAMPUS_LABELS } from '@/types'
import type { Campus } from '@/types'

export default function AdminDepartmentsPage() {
  useAuth('ADMIN')

  const [departments, setDepartments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterCampus, setFilterCampus] = useState<string>('ALL')

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await adminApi.getDepartments()
        setDepartments(res.data.departments || [])
      } catch {
        setDepartments([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered =
    filterCampus === 'ALL'
      ? departments
      : departments.filter((d: any) => d.campus === filterCampus)

  const grouped = filtered.reduce((acc: any, dept: any) => {
    const campus = dept.campus
    if (!acc[campus]) acc[campus] = []
    acc[campus].push(dept)
    return acc
  }, {})

  const DEPT_ICONS: Record<string, string> = {
    Library: 'fa-book',
    'Finance & Accounts': 'fa-coins',
    'Hostel Office': 'fa-house',
    'Faculty Office': 'fa-chalkboard-teacher',
    'Examination Office': 'fa-file-pen',
    'Student Affairs': 'fa-user-graduate',
    'IT Department': 'fa-laptop',
    'Research Office': 'fa-flask',
    'Registrar Office': 'fa-stamp',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Departments
          </h2>
          <p className="text-sm text-muted-foreground">
            {departments.length} departments across all campuses
          </p>
        </div>
        <select
          value={filterCampus}
          onChange={(e) => setFilterCampus(e.target.value)}
          className="input-base w-full sm:w-48"
        >
          <option value="ALL">All Campuses</option>
          <option value="DAR_ES_SALAAM">Dar es Salaam</option>
          <option value="DODOMA">Dodoma</option>
          <option value="MWANZA">Mwanza</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="dashboard" />
      ) : filtered.length === 0 ? (
        <div className="card-base">
          <EmptyState
            icon="fa-building"
            title="No Departments Found"
            description="No departments match your filter."
          />
        </div>
      ) : (
        Object.entries(grouped).map(([campus, depts]: any) => (
          <div key={campus} className="space-y-3">
            {/* Campus Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cbe-primary flex
                              items-center justify-center">
                <i className="fa-solid fa-location-dot text-cbe-gold text-sm" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {CAMPUS_LABELS[campus as Campus]} Campus
              </h3>
              <span className="bg-muted text-muted-foreground text-xs
                               px-2 py-0.5 rounded-full">
                {depts.length} departments
              </span>
            </div>

            {/* Department Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {depts.map((dept: any, index: number) => {
                const icon =
                  DEPT_ICONS[dept.name] || 'fa-building'
                const officer = dept.officers?.[0]

                return (
                  <div
                    key={dept.id}
                    className="card-base card-hover flex items-start gap-3"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-cbe-primary/10
                                    flex items-center justify-center shrink-0">
                      <i className={`fa-solid ${icon} text-cbe-primary`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">
                        {dept.name}
                      </p>
                      {officer ? (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <i className="fa-solid fa-user mr-1" />
                          {officer.firstName} {officer.lastName}
                        </p>
                      ) : (
                        <p className="text-xs text-orange-500 mt-0.5">
                          <i className="fa-solid fa-triangle-exclamation mr-1" />
                          No officer assigned
                        </p>
                      )}
                      {officer && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                          <i className="fa-solid fa-envelope mr-1" />
                          {officer.user?.email}
                        </p>
                      )}
                    </div>

                    {/* Index Badge */}
                    <span className="text-xs text-muted-foreground/50 shrink-0">
                      #{index + 1}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
