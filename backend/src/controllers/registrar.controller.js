const prisma = require('../config/prisma')
const { logAudit } = require('../utils/audit')
const { sendClearanceCompletedEmail } = require('../services/email.service')

const getReadyStudents = async (req, res) => {
  try {
    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
    })
    if (!officer) return res.status(404).json({ error: 'Registrar profile not found' })

    const ready = await prisma.clearanceRequest.findMany({
      where: {
        status: 'APPROVED',
        student: { campus: officer.campus },
        certificate: null,
      },
      include: {
        student: true,
        departmentClearances: { include: { department: true } },
      },
    })

    res.json({ ready })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const finalApprove = async (req, res) => {
  try {
    const { id } = req.params

    const clearance = await prisma.clearanceRequest.findUnique({
      where: { id },
      include: { student: true },
    })
    if (!clearance) return res.status(404).json({ error: 'Clearance not found' })
    if (clearance.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Clearance is not fully approved by all departments yet' })
    }

    await prisma.clearanceRequest.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    })

    // Generate certificate number
    const certNumber = `CBE/CLR/${new Date().getFullYear()}/${Math.floor(Math.random() * 90000) + 10000}`

    const certificate = await prisma.clearanceCertificate.create({
      data: {
        clearanceRequestId: id,
        certificateNumber: certNumber,
      },
    })

    const student = clearance.student
    const studentUser = await prisma.user.findUnique({ where: { id: student.userId } })
    await sendClearanceCompletedEmail({
      email: studentUser.email,
      firstName: student.firstName,
      lastName: student.lastName,
      studentNumber: student.studentNumber,
    })

    await logAudit({
      userId: req.user.id,
      action: 'REGISTRAR_FINAL_APPROVED',
      entity: 'ClearanceRequest',
      entityId: id,
      details: `Registrar completed clearance for ${student.studentNumber}. Certificate: ${certNumber}`,
      ipAddress: req.ip,
    })

    res.json({ message: 'Final clearance approved. Certificate generated.', certificate })
  } catch (error) {
    console.error('Final approve error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getReadyStudents, finalApprove }
