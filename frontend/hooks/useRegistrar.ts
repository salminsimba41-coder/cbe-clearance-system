'use client'

import { useState, useEffect, useCallback } from 'react'
import { registrarApi } from '@/lib/api'

export function useRegistrar() {
  const [readyStudents, setReadyStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReady = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await registrarApi.getReadyStudents()
      setReadyStudents(res.data.readyStudents || [])
    } catch (err: any) {
      setError(
        err?.response?.data?.error || 'Failed to load ready students.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReady()
  }, [fetchReady])

  const finalApprove = async (clearanceRequestId: string) => {
    setActionLoading(true)
    try {
      await registrarApi.finalApprove(clearanceRequestId)
      await fetchReady()
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.response?.data?.error || 'Failed to give final approval.',
      }
    } finally {
      setActionLoading(false)
    }
  }

  return {
    readyStudents,
    isLoading,
    actionLoading,
    error,
    finalApprove,
    refetch: fetchReady,
    stats: {
      ready: readyStudents.length,
    },
  }
}
