const express = require('express')
const router = express.Router()
const { getProfile, checkEligibility, getClearanceStatus } = require('../controllers/student.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.use(authenticate, authorize('STUDENT'))
router.get('/profile', getProfile)
router.get('/eligibility', checkEligibility)
router.get('/clearance-status', getClearanceStatus)

module.exports = router
