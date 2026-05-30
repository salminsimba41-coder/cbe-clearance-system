import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
})

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cbe_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cbe_token')
        localStorage.removeItem('cbe_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ─── AUTH ENDPOINTS ──────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  getMe: () =>
    api.get('/auth/me'),
}

// ─── STUDENT ENDPOINTS ───────────────────────────────────────────────────────
export const studentApi = {
  getProfile: () =>
    api.get('/students/profile'),

  getEligibility: () =>
    api.get('/students/eligibility'),

  getClearanceStatus: () =>
    api.get('/students/clearance-status'),
}

// ─── CLEARANCE ENDPOINTS ─────────────────────────────────────────────────────
export const clearanceApi = {
  apply: () =>
    api.post('/clearance/apply'),

  getMyClearance: () =>
    api.get('/clearance/my-clearance'),

  getAll: () =>
    api.get('/clearance/all'),

  getById: (id: string) =>
    api.get(`/clearance/${id}`),
}

// ─── DEPARTMENT ENDPOINTS ────────────────────────────────────────────────────
export const departmentApi = {
  getPending: () =>
    api.get('/department/pending'),

  getHistory: () =>
    api.get('/department/history'),

  approve: (departmentClearanceId: string) =>
    api.post(`/department/approve/${departmentClearanceId}`),

  reject: (departmentClearanceId: string, remarks: string) =>
    api.post(`/department/reject/${departmentClearanceId}`, { remarks }),

  reReview: (departmentClearanceId: string) =>
    api.post(`/department/re-review/${departmentClearanceId}`),
}

// ─── REGISTRAR ENDPOINTS ─────────────────────────────────────────────────────
export const registrarApi = {
  getReadyStudents: () =>
    api.get('/registrar/ready'),

  finalApprove: (clearanceRequestId: string) =>
    api.post(`/registrar/approve/${clearanceRequestId}`),
}

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────
export const adminApi = {
  getStudents: () =>
    api.get('/admin/students'),

  getDepartments: () =>
    api.get('/admin/departments'),

  getReports: () =>
    api.get('/admin/reports'),

  getAuditLogs: () =>
    api.get('/admin/audit-logs'),
}
