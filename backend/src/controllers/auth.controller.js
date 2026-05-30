const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')
const { generateToken } = require('../utils/jwt')
const { logAudit } = require('../utils/audit')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        student: true,
        departmentOfficer: { include: { department: true } },
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive. Contact admin.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user.id, user.role)

    await logAudit({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      details: `User logged in: ${user.email}`,
      ipAddress: req.ip,
    })

    const profile = user.student || user.departmentOfficer || null

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        profile,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed, isFirstLogin: false },
    })

    await logAudit({
      userId: req.user.id,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: req.user.id,
      ipAddress: req.ip,
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: true,
        departmentOfficer: { include: { department: true } },
      },
    })
    const { password, ...safeUser } = user
    res.json(safeUser)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { login, changePassword, getMe }
