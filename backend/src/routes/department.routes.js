const express = require('express')
const router = express.Router()
const { getPendingStudents, getHistory, approveClearance, rejectClearance, reReviewClearance } = require('../controllers/department.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.use(authenticate, authorize('DEPARTMENT_OFFICER'))
router.get('/pending', getPendingStudents)
router.get('/history', getHistory)
router.patch('/approve/:id', approveClearance)
router.patch('/reject/:id', rejectClearance)
router.patch('/re-review/:id', reReviewClearance)

module.exports = router
