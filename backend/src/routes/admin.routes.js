const express = require('express')
const router = express.Router()
const { getAllStudents, getDepartments, getReports, getAuditLogs } = require('../controllers/admin.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.use(authenticate, authorize('ADMIN'))
router.get('/students', getAllStudents)
router.get('/departments', getDepartments)
router.get('/reports', getReports)
router.get('/audit-logs', getAuditLogs)

module.exports = router
