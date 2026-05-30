const prisma = require('../config/prisma')

const getProfile = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    })
    if (!student) return res.status(404).json({ error: 'Student profile not found' })
    res.json(student)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const checkEligibility = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
      include: { clearanceRequests: true },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const hasActiveClearance = student.clearanceRequests.some(
      (r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS'
    )
    const isEligible =
      (student.academicStatus === 'COMPLETED' || student.academicStatus === 'ACTIVE') &&
      !hasActiveClearance

    res.json({
      eligible: isEligible,
      academicStatus: student.academicStatus,
      hasActiveClearance,
      reason: !isEligible
        ? hasActiveClearance
          ? 'You already have an active clearance request'
          : 'Your academic status does not qualify for clearance'
        : null,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getClearanceStatus = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const clearance = await prisma.clearanceRequest.findFirst({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
      include: {
        departmentClearances: {
          include: {
            department: true,
            officer: true,
          },
        },
        certificate: true,
      },
    })

    if (!clearance) return res.json({ clearance: null })
    res.json({ clearance })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getProfile, checkEligibility, getClearanceStatus }
