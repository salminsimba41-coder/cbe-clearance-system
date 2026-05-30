'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

export function useAdminStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getStudents()
      setStudents(res.data.students || [])
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load students.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { students, isLoading, error, refetch: fetch }
}

export function useAdminReports() {
  const [reports, setReports] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getReports()
      setReports(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load reports.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { reports, isLoading, error, refetch: fetch }
}

export function useAdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getAuditLogs()
      setLogs(res.data.auditLogs || [])
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load audit logs.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { logs, isLoading, error, refetch: fetch }
}

export function useAdminDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getDepartments()
      setDepartments(res.data.departments || [])
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load departments.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { departments, isLoading, error, refetch: fetch }
}
