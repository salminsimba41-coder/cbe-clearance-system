const prisma = require('../config/prisma')
const { logAudit } = require('../utils/audit')
const { sendDepartmentApprovedEmail, sendDepartmentRejectedEmail } = require('../services/email.service')

const getPendingStudents = async (req, res) => {
  try {
    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
      include: { department: true },
    })
    if (!officer) return res.status(404).json({ error: 'Officer profile not found' })

    const pending = await prisma.departmentClearance.findMany({
      where: {
        departmentId: officer.departmentId,
        status: 'PENDING',
      },
      include: {
        clearanceRequest: { include: { student: true } },
        department: true,
      },
    })

    res.json({ pending })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getHistory = async (req, res) => {
  try {
    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
    })
    if (!officer) return res.status(404).json({ error: 'Officer profile not found' })

    const history = await prisma.departmentClearance.findMany({
      where: {
        departmentId: officer.departmentId,
        status: { in: ['APPROVED', 'REJECTED'] },
      },
      include: {
        clearanceRequest: { include: { student: true } },
        department: true,
        officer: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json({ history })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const approveClearance = async (req, res) => {
  try {
    const { id } = req.params
    const { remarks } = req.body

    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
      include: { department: true },
    })
    if (!officer) return res.status(404).json({ error: 'Officer not found' })

    const deptClearance = await prisma.departmentClearance.findUnique({
      where: { id },
      include: {
        clearanceRequest: { include: { student: true } },
        department: true,
      },
    })
    if (!deptClearance) return res.status(404).json({ error: 'Clearance record not found' })
    if (deptClearance.departmentId !== officer.departmentId) {
      return res.status(403).json({ error: 'You can only approve clearances for your department' })
    }

    await prisma.departmentClearance.update({
      where: { id },
      data: {
        status: 'APPROVED',
        officerId: officer.id,
        remarks: remarks || 'Cleared',
        clearedAt: new Date(),
      },
    })

    // Check if all departments approved — if so update main request
    const allClearances = await prisma.departmentClearance.findMany({
      where: { clearanceRequestId: deptClearance.clearanceRequestId },
    })
    const allApproved = allClearances.every((c) => c.status === 'APPROVED' || c.id === id)

    if (allApproved) {
      await prisma.clearanceRequest.update({
        where: { id: deptClearance.clearanceRequestId },
        data: { status: 'APPROVED' },
      })
    }

    // Send email
    const student = deptClearance.clearanceRequest.student
    const studentUser = await prisma.user.findUnique({ where: { id: student.userId } })
    await sendDepartmentApprovedEmail(
      { email: studentUser.email, firstName: student.firstName, lastName: student.lastName },
      deptClearance.department.name
    )

    await logAudit({
      userId: req.user.id,
      action: 'DEPARTMENT_APPROVED',
      entity: 'DepartmentClearance',
      entityId: id,
      details: `${officer.department.name} approved clearance for student ${student.studentNumber}`,
      ipAddress: req.ip,
    })

    res.json({ message: 'Clearance approved successfully' })
  } catch (error) {
    console.error('Approve error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const rejectClearance = async (req, res) => {
  try {
    const { id } = req.params
    const { remarks } = req.body

    if (!remarks) return res.status(400).json({ error: 'Rejection reason is required' })

    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
      include: { department: true },
    })
    if (!officer) return res.status(404).json({ error: 'Officer not found' })

    const deptClearance = await prisma.departmentClearance.findUnique({
      where: { id },
      include: {
        clearanceRequest: { include: { student: true } },
        department: true,
      },
    })
    if (!deptClearance) return res.status(404).json({ error: 'Clearance record not found' })
    if (deptClearance.departmentId !== officer.departmentId) {
      return res.status(403).json({ error: 'You can only reject clearances for your department' })
    }

    await prisma.departmentClearance.update({
      where: { id },
      data: { status: 'REJECTED', officerId: officer.id, remarks, clearedAt: new Date() },
    })

    await prisma.clearanceRequest.update({
      where: { id: deptClearance.clearanceRequestId },
      data: { status: 'IN_PROGRESS' },
    })

    const student = deptClearance.clearanceRequest.student
    const studentUser = await prisma.user.findUnique({ where: { id: student.userId } })
    await sendDepartmentRejectedEmail(
      { email: studentUser.email, firstName: student.firstName, lastName: student.lastName },
      deptClearance.department.name,
      remarks
    )

    await logAudit({
      userId: req.user.id,
      action: 'DEPARTMENT_REJECTED',
      entity: 'DepartmentClearance',
      entityId: id,
      details: `${officer.department.name} rejected clearance for student ${student.studentNumber}. Reason: ${remarks}`,
      ipAddress: req.ip,
    })

    res.json({ message: 'Clearance rejected' })
  } catch (error) {
    console.error('Reject error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const reReviewClearance = async (req, res) => {
  try {
    const { id } = req.params

    const officer = await prisma.departmentOfficer.findUnique({
      where: { userId: req.user.id },
    })
    if (!officer) return res.status(404).json({ error: 'Officer not found' })

    await prisma.departmentClearance.update({
      where: { id },
      data: { status: 'PENDING', remarks: null, officerId: null, clearedAt: null },
    })

    res.json({ message: 'Clearance set back to pending for re-review' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getPendingStudents, getHistory, approveClearance, rejectClearance, reReviewClearance }
