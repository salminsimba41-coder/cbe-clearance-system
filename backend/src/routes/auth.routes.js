const express = require('express')
const router = express.Router()
const { login, changePassword, getMe } = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.post('/login', login)
router.post('/change-password', authenticate, changePassword)
router.get('/me', authenticate, getMe)

module.exports = router
