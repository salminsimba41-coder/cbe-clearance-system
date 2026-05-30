'use client'

import { useState, useEffect, useCallback } from 'react'
import { clearanceApi } from '@/lib/api'
import type { ClearanceRequest } from '@/types'

export function useClearance() {
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClearance = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await clearanceApi.getMyClearance()
      setClearance(res.data.clearanceRequest || null)
    } catch (err: any) {
      setError(
        err?.response?.data?.error || 'Failed to load clearance data.'
      )
      setClearance(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClearance()
  }, [fetchClearance])

  const apply = async () => {
    try {
      await clearanceApi.apply()
      await fetchClearance()
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.response?.data?.error ||
          'Failed to submit clearance application.',
      }
    }
  }

  const approved = clearance?.departmentClearances?.filter(
    (d) => d.status === 'APPROVED'
  ).length ?? 0

  const rejected = clearance?.departmentClearances?.filter(
    (d) => d.status === 'REJECTED'
  ).length ?? 0

  const pending = clearance?.departmentClearances?.filter(
    (d) => d.status === 'PENDING'
  ).length ?? 0

  const total = clearance?.departmentClearances?.length ?? 0

  const progressPct = total > 0 ? Math.round((approved / total) * 100) : 0

  return {
    clearance,
    isLoading,
    error,
    apply,
    refetch: fetchClearance,
    stats: { approved, rejected, pending, total, progressPct },
  }
}
