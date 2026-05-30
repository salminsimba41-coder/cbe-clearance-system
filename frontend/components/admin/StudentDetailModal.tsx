'use client'

import { CAMPUS_LABELS, PROGRAMME_LABELS } from '@/types'
import type { Student, Campus, Programme } from '@/types'
import { formatDate } from '@/lib/utils'

interface StudentDetailModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

export default function StudentDetailModal({
  student,
  isOpen,
  onClose,
}: StudentDetailModalProps) {
  if (!isOpen || !student) return null

  const fields = [
    { label: 'Full Name', value: `${student.firstName} ${student.lastName}` },
    { label: 'Student Number', value: student.studentNumber, mono: true },
    { label: 'National ID', value: student.nationalId, mono: true },
    { label: 'Gender', value: student.gender },
    {
      label: 'Date of Birth',
      value: formatDate(student.dateOfBirth),
    },
    { label: 'Phone', value: student.phone },
    { label: 'Home Region', value: student.homeRegion },
    {
      label: 'Campus',
      value: CAMPUS_LABELS[student.campus as Campus],
    },
    { label: 'Faculty', value: student.faculty },
    {
      label: 'Programme',
      value:
        PROGRAMME_LABELS[student.programme as Programme] ??
        student.programme?.replace(/_/g, ' '),
    },
    {
      label: 'Specialization',
      value: student.specialization ?? '—',
    },
    {
      label: 'Study Mode',
      value: student.studyMode?.replace(/_/g, ' '),
    },
    { label: 'Enrollment Year', value: student.enrollmentYear },
    { label: 'Expected Graduation', value: student.expectedGraduation },
    {
      label: 'Academic Status',
      value: student.academicStatus,
    },
    { label: 'NACTE Reg No.', value: student.nacteRegNo ?? '—', mono: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl
                      max-h-[90vh] overflow-hidden border border-border
                      animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-cbe-primary px-6 py-4 flex items-center
                        justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cbe-gold flex
                            items-center justify-center">
              <span className="text-gray-900 font-bold">
                {student.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-heading font-bold text-white">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-white/60 text-xs font-mono">
                {student.studentNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center
                       justify-center text-white hover:bg-white/20
                       transition-colors"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]
                        scrollbar-thin p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div
                key={field.label}
                className="bg-muted/30 rounded-lg px-4 py-3"
              >
                <p className="text-xs text-muted-foreground mb-0.5">
                  {field.label}
                </p>
                <p className={`text-sm font-medium text-foreground ${
                  field.mono ? 'font-mono' : ''
                }`}>
                  {String(field.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
