'use client'

import { useState } from 'react'
import EmptyState from './EmptyState'

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  striped?: boolean
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  isLoading = false,
  emptyTitle = 'No Data Found',
  emptyDescription = 'There are no records to display.',
  striped = true,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon="fa-table"
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3 px-4 text-xs font-semibold
                            text-muted-foreground uppercase tracking-wide
                            ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, index) => (
            <tr
              key={row[keyField]}
              className={`hover:bg-muted/30 transition-colors ${
                striped && index % 2 !== 0 ? 'bg-muted/10' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 ${col.className ?? ''}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
