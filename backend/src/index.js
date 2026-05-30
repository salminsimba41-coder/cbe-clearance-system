const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const studentRoutes = require('./routes/student.routes')
const clearanceRoutes = require('./routes/clearance.routes')
const departmentRoutes = require('./routes/department.routes')
const registrarRoutes = require('./routes/registrar.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}))
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'http://192.168.137.73:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true 
}))
app.use(express.json())

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many login attempts, please try again later.' },
})

app.use('/api', limiter)
app.use('/api/auth/login', authLimiter)

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/clearance', clearanceRoutes)
app.use('/api/department', departmentRoutes)
app.use('/api/registrar', registrarRoutes)
app.use('/api/admin', adminRoutes)

// ─── ROOT ROUTE ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: 'CBE Clearance API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      clearance: '/api/clearance',
      department: '/api/department',
      registrar: '/api/registrar',
      admin: '/api/admin'
    }
  })
})

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'CBE Clearance API is running', timestamp: new Date() })
})

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 CBE Clearance API running on port ${PORT}`)
})
