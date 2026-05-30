const prisma = require('../config/prisma')

const logAudit = async ({ userId, action, entity, entityId, details, ipAddress }) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entity, entityId, details, ipAddress },
    })
  } catch (error) {
    console.error('Audit log error:', error)
  }
}

module.exports = { logAudit }
