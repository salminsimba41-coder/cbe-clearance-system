'use client'

import { useState } from 'react'

interface RejectModalProps {
  isOpen: boolean
  studentName: string
  departmentName: string
  isLoading?: boolean
  onConfirm: (remarks: string) => void
  onCancel: () => void
}

export default function RejectModal({
  isOpen,
  studentName,
  departmentName,
  isLoading = false,
  onConfirm,
  onCancel,
}: RejectModalProps) {
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!remarks.trim()) {
      setError('Please provide a reason for rejection')
      return
    }
    if (remarks.trim().length < 10) {
      setError('Reason must be at least 10 characters')
      return
    }
    setError('')
    onConfirm(remarks.trim())
  }

  const handleCancel = () => {
    setRemarks('')
    setError('')
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-lg
                      border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <i className="fa-solid fa-circle-xmark text-xl text-red-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Reject Clearance
              </h3>
              <p className="text-sm text-muted-foreground">
                {departmentName} — {studentName}
              </p>
            </div>
          </div>

          {/* Remarks Input */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-foreground">
              Reason for Rejection
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value)
                if (error) setError('')
              }}
              placeholder="Explain why this student cannot be cleared by your department. Be specific so the student knows what to fix..."
              rows={4}
              className={`input-base resize-none ${
                error ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {remarks.length} characters
            </p>
          </div>

          {/* Warning Note */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-orange-700 flex items-start gap-2">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
              The student will be notified via email with this reason.
              They must resolve the issue before reapplying.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border
                         text-sm font-medium text-foreground
                         hover:bg-muted transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !remarks.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700
                         text-white text-sm font-medium transition-colors duration-150
                         flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs" />
                  Rejecting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-xmark text-xs" />
                  Reject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
