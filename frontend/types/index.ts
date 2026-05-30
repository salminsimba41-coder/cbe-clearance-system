// ─── ENUMS ───────────────────────────────────────────────────────────────────

export type Role = 'STUDENT' | 'DEPARTMENT_OFFICER' | 'REGISTRAR' | 'ADMIN'

export type Campus = 'DAR_ES_SALAAM' | 'DODOMA' | 'MWANZA'

export type Programme =
  | 'BACHELOR_OF_COMMERCE'
  | 'BACHELOR_OF_BUSINESS_ADMINISTRATION'
  | 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE'
  | 'POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN'
  | 'MASTER_OF_BUSINESS_ADMINISTRATION'
  | 'DIPLOMA_ACCOUNTANCY'
  | 'DIPLOMA_MARKETING'
  | 'DIPLOMA_PROCUREMENT_LOGISTICS'
  | 'DIPLOMA_HUMAN_RESOURCE_MANAGEMENT'
  | 'DIPLOMA_BUSINESS_ADMINISTRATION'
  | 'CERTIFICATE_ACCOUNTANCY'
  | 'CERTIFICATE_BUSINESS_ADMINISTRATION'

export type StudyMode = 'FULL_TIME' | 'PART_TIME'

export type AcademicStatus = 'ACTIVE' | 'COMPLETED' | 'DEFERRED' | 'SUSPENDED'

export type ClearanceStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'

export type DepartmentClearanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// ─── USER ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  role: Role
  isFirstLogin: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── STUDENT ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string
  userId: string
  studentNumber: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  nationalId: string
  phone: string
  homeRegion: string
  campus: Campus
  faculty: string
  programme: Programme
  specialization?: string
  enrollmentYear: number
  expectedGraduation: number
  studyMode: StudyMode
  academicStatus: AcademicStatus
  nacteRegNo?: string
  createdAt: string
  updatedAt: string
  user?: User
}

// ─── DEPARTMENT ──────────────────────────────────────────────────────────────

export interface Department {
  id: string
  name: string
  campus: Campus
  createdAt: string
  updatedAt: string
}

// ─── DEPARTMENT OFFICER ──────────────────────────────────────────────────────

export interface DepartmentOfficer {
  id: string
  userId: string
  departmentId: string
  firstName: string
  lastName: string
  phone: string
  campus: Campus
  createdAt: string
  updatedAt: string
  department?: Department
  user?: User
}

// ─── CLEARANCE REQUEST ───────────────────────────────────────────────────────

export interface ClearanceRequest {
  id: string
  studentId: string
  academicYear: string
  status: ClearanceStatus
  submittedAt: string
  completedAt?: string
  updatedAt: string
  student?: Student
  departmentClearances?: DepartmentClearance[]
  certificate?: ClearanceCertificate
}

// ─── DEPARTMENT CLEARANCE ────────────────────────────────────────────────────

export interface DepartmentClearance {
  id: string
  clearanceRequestId: string
  departmentId: string
  officerId?: string
  status: DepartmentClearanceStatus
  remarks?: string
  clearedAt?: string
  createdAt: string
  updatedAt: string
  department?: Department
  officer?: DepartmentOfficer
}

// ─── CLEARANCE CERTIFICATE ───────────────────────────────────────────────────

export interface ClearanceCertificate {
  id: string
  clearanceRequestId: string
  certificateNumber: string
  fileUrl?: string
  generatedAt: string
}

// ─── NOTIFICATION ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

// ─── AUDIT LOG ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  userId?: string
  action: string
  entity: string
  entityId?: string
  details?: string
  ipAddress?: string
  createdAt: string
  user?: User
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  student?: Student
  officer?: DepartmentOfficer
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

// ─── API RESPONSE ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export interface AdminStats {
  totalStudents: number
  totalClearanceRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  completedRequests: number
}

export interface DepartmentStats {
  totalPending: number
  totalApproved: number
  totalRejected: number
}

export interface RegistrarStats {
  totalReady: number
  totalCompleted: number
}

// ─── DISPLAY HELPERS ─────────────────────────────────────────────────────────

export const CAMPUS_LABELS: Record<Campus, string> = {
  DAR_ES_SALAAM: 'Dar es Salaam',
  DODOMA: 'Dodoma',
  MWANZA: 'Mwanza',
}

export const PROGRAMME_LABELS: Record<Programme, string> = {
  BACHELOR_OF_COMMERCE: 'Bachelor of Commerce',
  BACHELOR_OF_BUSINESS_ADMINISTRATION: 'Bachelor of Business Administration',
  BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE: 'BSc Accounting & Finance',
  POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN: 'Postgraduate Diploma in Business Admin',
  MASTER_OF_BUSINESS_ADMINISTRATION: 'Master of Business Administration',
  DIPLOMA_ACCOUNTANCY: 'Diploma in Accountancy',
  DIPLOMA_MARKETING: 'Diploma in Marketing',
  DIPLOMA_PROCUREMENT_LOGISTICS: 'Diploma in Procurement & Logistics',
  DIPLOMA_HUMAN_RESOURCE_MANAGEMENT: 'Diploma in Human Resource Management',
  DIPLOMA_BUSINESS_ADMINISTRATION: 'Diploma in Business Administration',
  CERTIFICATE_ACCOUNTANCY: 'Certificate in Accountancy',
  CERTIFICATE_BUSINESS_ADMINISTRATION: 'Certificate in Business Administration',
}

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
}

export const ACADEMIC_STATUS_LABELS: Record<AcademicStatus, string> = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  DEFERRED: 'Deferred',
  SUSPENDED: 'Suspended',
}
