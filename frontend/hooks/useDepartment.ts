'use client'

import { useState, useEffect, useCallback } from 'react'
import { departmentApi } from '@/lib/api'

export function useDepartment() {
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [pendingRes, historyRes] = await Promise.all([
        departmentApi.getPending(),
        departmentApi.getHistory(),
      ])
      setPending(pendingRes.data.pendingClearances || [])
      setHistory(historyRes.data.history || [])
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const approve = async (id: string) => {
    setActionLoading(true)
    try {
      await departmentApi.approve(id)
      await fetchAll()
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.response?.data?.error || 'Failed to approve student.',
      }
    } finally {
      setActionLoading(false)
    }
  }

  const reject = async (id: string, remarks: string) => {
    setActionLoading(true)
    try {
      await departmentApi.reject(id, remarks)
      await fetchAll()
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.response?.data?.error || 'Failed to reject student.',
      }
    } finally {
      setActionLoading(false)
    }
  }

  const approvedCount = history.filter((h: any) => h.status === 'APPROVED').length
  const rejectedCount = history.filter((h: any) => h.status === 'REJECTED').length

  return {
    pending,
    history,
    isLoading,
    actionLoading,
    error,
    approve,
    reject,
    refetch: fetchAll,
    stats: {
      pending: pending.length,
      approved: approvedCount,
      rejected: rejectedCount,
    },
  }
}
