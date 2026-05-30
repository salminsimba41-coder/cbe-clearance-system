const express = require('express')
const router = express.Router()
const { applyClearance, getMyClearance, getAllClearances, getClearanceById } = require('../controllers/clearance.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.post('/apply', authenticate, authorize('STUDENT'), applyClearance)
router.get('/my-clearance', authenticate, authorize('STUDENT'), getMyClearance)
router.get('/all', authenticate, authorize('ADMIN', 'REGISTRAR'), getAllClearances)
router.get('/:id', authenticate, getClearanceById)

module.exports = router
