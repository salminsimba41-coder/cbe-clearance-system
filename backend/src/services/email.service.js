const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    console.log(`📧 Email sent to ${to}`)
  } catch (error) {
    console.error('Email error:', error)
  }
}

const sendClearanceSubmittedEmail = async (student) => {
  await sendEmail({
    to: student.email,
    subject: 'CBE Clearance Request Submitted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">College of Business Education</h2>
        <h3>Clearance Request Submitted</h3>
        <p>Dear ${student.firstName} ${student.lastName},</p>
        <p>Your clearance request has been submitted successfully. Your request is now being reviewed by all departments.</p>
        <p>You can track your clearance progress by logging into the CBE Clearance Portal.</p>
        <p>Student Number: <strong>${student.studentNumber}</strong></p>
        <br/>
        <p>Regards,<br/>CBE Clearance System</p>
      </div>
    `,
  })
}

const sendDepartmentApprovedEmail = async (student, departmentName) => {
  await sendEmail({
    to: student.email,
    subject: `CBE Clearance - ${departmentName} Approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">College of Business Education</h2>
        <h3>Department Clearance Approved</h3>
        <p>Dear ${student.firstName} ${student.lastName},</p>
        <p>The <strong>${departmentName}</strong> has approved your clearance request.</p>
        <p>Please log in to the CBE Clearance Portal to check your overall clearance status.</p>
        <br/>
        <p>Regards,<br/>CBE Clearance System</p>
      </div>
    `,
  })
}

const sendDepartmentRejectedEmail = async (student, departmentName, remarks) => {
  await sendEmail({
    to: student.email,
    subject: `CBE Clearance - ${departmentName} Requires Attention`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">College of Business Education</h2>
        <h3>Department Clearance Rejected</h3>
        <p>Dear ${student.firstName} ${student.lastName},</p>
        <p>The <strong>${departmentName}</strong> has rejected your clearance request for the following reason:</p>
        <p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;"><strong>${remarks}</strong></p>
        <p>Please resolve the issue and the department will re-review your clearance.</p>
        <br/>
        <p>Regards,<br/>CBE Clearance System</p>
      </div>
    `,
  })
}

const sendClearanceCompletedEmail = async (student) => {
  await sendEmail({
    to: student.email,
    subject: 'CBE Clearance - Fully Cleared!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">College of Business Education</h2>
        <h3 style="color: #276749;">🎉 Clearance Complete!</h3>
        <p>Dear ${student.firstName} ${student.lastName},</p>
        <p>Congratulations! You have been fully cleared by all departments and the Registrar.</p>
        <p>Your clearance certificate is now available for download on the CBE Clearance Portal.</p>
        <p>Student Number: <strong>${student.studentNumber}</strong></p>
        <br/>
        <p>Best wishes for your future endeavors,<br/>CBE Clearance System</p>
      </div>
    `,
  })
}

module.exports = {
  sendEmail,
  sendClearanceSubmittedEmail,
  sendDepartmentApprovedEmail,
  sendDepartmentRejectedEmail,
  sendClearanceCompletedEmail,
}
