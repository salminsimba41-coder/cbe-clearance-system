import type { ClearanceCertificate, Student } from '@/types'
import { formatDate } from '@/lib/utils'
import { CAMPUS_LABELS, PROGRAMME_LABELS } from '@/types'
import type { Campus, Programme } from '@/types'

interface CertificateCardProps {
  certificate: ClearanceCertificate
  student: Student
  academicYear: string
}

export default function CertificateCard({
  certificate,
  student,
  academicYear,
}: CertificateCardProps) {
  return (
    <div className="bg-gradient-to-br from-cbe-primary to-cbe-primary-light
                    rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full
                        border-4 border-white" />
        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full
                        border-4 border-white" />
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cbe-gold flex
                            items-center justify-center">
              <i className="fa-solid fa-certificate text-xl text-gray-900" />
            </div>
            <div>
              <p className="font-heading text-lg font-bold">
                Clearance Certificate
              </p>
              <p className="text-white/70 text-xs">
                College of Business Education
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Certificate No.</p>
            <p className="font-mono font-bold text-cbe-gold text-sm">
              {certificate.certificateNumber}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20" />

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-white/60">Full Name</p>
            <p className="font-semibold text-sm">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">Student Number</p>
            <p className="font-mono font-semibold text-sm">
              {student.studentNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">Programme</p>
            <p className="font-semibold text-xs">
              {PROGRAMME_LABELS[student.programme as Programme] ??
                student.programme?.replace(/_/g, ' ')}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">Campus</p>
            <p className="font-semibold text-sm">
              {CAMPUS_LABELS[student.campus as Campus]}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">Academic Year</p>
            <p className="font-semibold text-sm">{academicYear}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Issued On</p>
            <p className="font-semibold text-sm">
              {formatDate(certificate.generatedAt)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-qrcode text-cbe-gold text-2xl" />
            <div>
              <p className="text-xs text-white/60">Scan to verify</p>
              <p className="text-xs text-white/80">authenticity</p>
            </div>
          </div>

          {certificate.fileUrl && (
            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-cbe-gold text-gray-900
                         px-4 py-2 rounded-lg text-xs font-bold
                         hover:bg-yellow-400 transition-colors"
            >
              <i className="fa-solid fa-download" />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
