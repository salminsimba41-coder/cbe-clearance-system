const prisma = require('../config/prisma')
const { logAudit } = require('../utils/audit')
const { sendClearanceSubmittedEmail } = require('../services/email.service')

const applyClearance = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    // Check eligibility
    const existing = await prisma.clearanceRequest.findFirst({
      where: {
        studentId: student.id,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    })
    if (existing) {
      return res.status(400).json({ error: 'You already have an active clearance request' })
    }

    // Get all departments for this campus (excluding Registrar Office — added last)
    const departments = await prisma.department.findMany({
      where: {
        campus: student.campus,
        name: { not: 'Registrar Office' },
      },
    })

    const academicYear = `${student.enrollmentYear}/${student.expectedGraduation}`

    // Create clearance request
    const clearanceRequest = await prisma.clearanceRequest.create({
      data: {
        studentId: student.id,
        academicYear,
        status: 'IN_PROGRESS',
        departmentClearances: {
          create: departments.map((dept) => ({
            departmentId: dept.id,
            status: 'PENDING',
          })),
        },
      },
      include: {
        departmentClearances: { include: { department: true } },
      },
    })

    // Send email notification
    await sendClearanceSubmittedEmail({
      email: req.user.email,
      firstName: student.firstName,
      lastName: student.lastName,
      studentNumber: student.studentNumber,
    })

    await logAudit({
      userId: req.user.id,
      action: 'CLEARANCE_APPLIED',
      entity: 'ClearanceRequest',
      entityId: clearanceRequest.id,
      ipAddress: req.ip,
    })

    res.status(201).json({ message: 'Clearance request submitted successfully', clearanceRequest })
  } catch (error) {
    console.error('Apply clearance error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getMyClearance = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const clearance = await prisma.clearanceRequest.findFirst({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
      include: {
        departmentClearances: { include: { department: true, officer: true } },
        certificate: true,
        student: true,
      },
    })

    res.json({ clearance })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getAllClearances = async (req, res) => {
  try {
    const { campus, status, programme, academicYear } = req.query
    const where = {}
    if (status) where.status = status
    if (academicYear) where.academicYear = academicYear
    if (campus || programme) {
      where.student = {}
      if (campus) where.student.campus = campus
      if (programme) where.student.programme = programme
    }

    const clearances = await prisma.clearanceRequest.findMany({
      where,
      include: {
        student: true,
        departmentClearances: { include: { department: true } },
        certificate: true,
      },
      orderBy: { submittedAt: 'desc' },
    })

    res.json({ clearances })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getClearanceById = async (req, res) => {
  try {
    const clearance = await prisma.clearanceRequest.findUnique({
      where: { id: req.params.id },
      include: {
        student: true,
        departmentClearances: { include: { department: true, officer: true } },
        certificate: true,
      },
    })
    if (!clearance) return res.status(404).json({ error: 'Clearance not found' })
    res.json({ clearance })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { applyClearance, getMyClearance, getAllClearances, getClearanceById }
