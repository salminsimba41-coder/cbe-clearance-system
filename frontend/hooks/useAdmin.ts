'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import { Student, Department, AuditLog } from '@/types'

interface AdminReports {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  completedRequests: number
  byCampus: Record<string, number>
  byDepartment: Record<string, number>
}

export function useAdminStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getStudents()
      setStudents(res.data.students || [])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load students.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await fetch()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { students, isLoading, error, refetch: fetch }
}

export function useAdminReports() {
  const [reports, setReports] = useState<AdminReports | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getReports()
      setReports(res.data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await fetch()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { reports, isLoading, error, refetch: fetch }
}

export function useAdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getAuditLogs()
      setLogs(res.data.auditLogs || [])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await fetch()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { logs, isLoading, error, refetch: fetch }
}

export function useAdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getDepartments()
      setDepartments(res.data.departments || [])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load departments.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await fetch()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { departments, isLoading, error, refetch: fetch }
}
