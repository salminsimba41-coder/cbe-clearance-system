const prisma = require('../config/prisma')

const getAllStudents = async (req, res) => {
  try {
    const { campus, programme, academicStatus, search } = req.query
    const where = {}
    if (campus) where.campus = campus
    if (programme) where.programme = programme
    if (academicStatus) where.academicStatus = academicStatus
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { email: true, isActive: true } },
        clearanceRequests: { select: { status: true } },
      },
      orderBy: { studentNumber: 'asc' },
    })

    res.json({ students })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: { officers: true },
      orderBy: [{ campus: 'asc' }, { name: 'asc' }],
    })
    res.json({ departments })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getReports = async (req, res) => {
  try {
    const totalStudents = await prisma.student.count()
    const totalClearances = await prisma.clearanceRequest.count()
    const completed = await prisma.clearanceRequest.count({ where: { status: 'COMPLETED' } })
    const inProgress = await prisma.clearanceRequest.count({ where: { status: 'IN_PROGRESS' } })
    const approved = await prisma.clearanceRequest.count({ where: { status: 'APPROVED' } })

    const byCampusus = await prisma.student.groupBy({
      by: ['campus'],
      _count: { campus: true },
    })

    const byprogramme = await prisma.student.groupBy({
      by: ['programme'],
      _count: { programme: true },
    })

    res.json({
      totalStudents,
      totalClearances,
      completed,
      inProgress,
      approved,
      byCampus: byCampus,
      byProgramme: byprogramme,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    res.json({ logs })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getAllStudents, getDepartments, getReports, getAuditLogs }
