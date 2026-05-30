const express = require('express')
const router = express.Router()
const { getReadyStudents, finalApprove } = require('../controllers/registrar.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.use(authenticate, authorize('REGISTRAR'))
router.get('/ready', getReadyStudents)
router.patch('/final-approve/:id', finalApprove)

module.exports = router
