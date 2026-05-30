'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import SummaryCard from '@/components/shared/SummaryCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#1E3A5F', '#F59E0B', '#10B981', '#EF4444', '#3B82F6']

export default function AdminReportsPage() {
  useAuth('ADMIN')

  const [reports, setReports] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await adminApi.getReports()
        setReports(res.data)
      } catch {
        setReports(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) return <LoadingSkeleton type="dashboard" />

  /* ── Build chart data from API response ── */
  const statusData = [
    { name: 'Pending', value: reports?.pending ?? 0 },
    { name: 'In Progress', value: reports?.inProgress ?? 0 },
    { name: 'Approved', value: reports?.approved ?? 0 },
    { name: 'Rejected', value: reports?.rejected ?? 0 },
    { name: 'Completed', value: reports?.completed ?? 0 },
  ]

  const campusData = [
    {
      campus: 'Dar es Salaam',
      students: reports?.campusStats?.DAR_ES_SALAAM?.students ?? 0,
      completed: reports?.campusStats?.DAR_ES_SALAAM?.completed ?? 0,
    },
    {
      campus: 'Dodoma',
      students: reports?.campusStats?.DODOMA?.students ?? 0,
      completed: reports?.campusStats?.DODOMA?.completed ?? 0,
    },
    {
      campus: 'Mwanza',
      students: reports?.campusStats?.MWANZA?.students ?? 0,
      completed: reports?.campusStats?.MWANZA?.completed ?? 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Reports & Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          System-wide clearance statistics and trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Students"
          value={reports?.totalStudents ?? 0}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="card-base">
          <h3 className="font-heading text-base font-bold text-foreground mb-4">
            <i className="fa-solid fa-chart-pie text-cbe-gold mr-2" />
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Campus Bar Chart */}
        <div className="card-base">
          <h3 className="font-heading text-base font-bold text-foreground mb-4">
            <i className="fa-solid fa-chart-bar text-cbe-gold mr-2" />
            Students per Campus
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={campusData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="campus"
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar
                dataKey="students"
                name="Total Students"
                fill="#1E3A5F"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown Bar Chart */}
      <div className="card-base">
        <h3 className="font-heading text-base font-bold text-foreground mb-4">
          <i className="fa-solid fa-chart-column text-cbe-gold mr-2" />
          Clearance Status Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={statusData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
            {statusData.map((entry, index) => (
              <Bar
                key={entry.name}
                dataKey="value"
                name={entry.name}
                fill={COLORS[index]}
                radius={[4, 4, 0, 0]}
              />
            ))}
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {statusData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Raw Numbers Table */}
      <div className="card-base">
        <h3 className="font-heading text-base font-bold text-foreground mb-4">
          <i className="fa-solid fa-table text-cbe-gold mr-2" />
          Summary Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {['Metric', 'Count', 'Percentage'].map((h) => (
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
              {statusData.map((row) => {
                const total = reports?.totalRequests || 1
                const pct = ((row.value / total) * 100).toFixed(1)
                return (
                  <tr key={row.name} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium text-foreground">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {row.value}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full
                                        overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-cbe-primary rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
