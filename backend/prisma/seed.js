const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding CBE Clearance Database...')

  // ─── CLEAN EXISTING DATA ────────────────────────────────────────────
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.clearanceCertificate.deleteMany()
  await prisma.departmentClearance.deleteMany()
  await prisma.clearanceRequest.deleteMany()
  await prisma.departmentOfficer.deleteMany()
  await prisma.student.deleteMany()
  await prisma.department.deleteMany()
  await prisma.user.deleteMany()
  console.log('🧹 Cleaned existing data')

  const defaultPassword = await bcrypt.hash('CBE@2024', 10)

  // ─── DEPARTMENTS ────────────────────────────────────────────────────
  const departmentNames = [
    'Library',
    'Finance and Accounts',
    'Hostel Office',
    'Faculty Office',
    'Examination Office',
    'Student Affairs',
    'IT Department',
    'Research Office',
    'Registrar Office',
  ]

  const campuses = ['DAR_ES_SALAAM', 'DODOMA', 'MWANZA']

  const departments = []
  for (const campus of campuses) {
    for (const name of departmentNames) {
      const dept = await prisma.department.create({
        data: { name, campus },
      })
      departments.push(dept)
    }
  }
  console.log(`✅ Created ${departments.length} departments`)

  // ─── HELPER: GET DEPT BY NAME AND CAMPUS ───────────────────────────
  const getDept = (name, campus) =>
    departments.find((d) => d.name === name && d.campus === campus)

  // ─── ADMIN ──────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admin@cbe.ac.tz',
      password: defaultPassword,
      role: 'ADMIN',
      isFirstLogin: false,
    },
  })
  console.log('✅ Created admin account')

  // ─── DEPARTMENT OFFICERS ────────────────────────────────────────────
  const officersData = [
    // DAR ES SALAAM
    { firstName: 'Joseph', lastName: 'Mwamba', phone: '+255711000001', campus: 'DAR_ES_SALAAM', dept: 'Library', email: 'library.dar@cbe.ac.tz' },
    { firstName: 'Grace', lastName: 'Kimaro', phone: '+255711000002', campus: 'DAR_ES_SALAAM', dept: 'Finance and Accounts', email: 'finance.dar@cbe.ac.tz' },
    { firstName: 'Peter', lastName: 'Msigwa', phone: '+255711000003', campus: 'DAR_ES_SALAAM', dept: 'Hostel Office', email: 'hostel.dar@cbe.ac.tz' },
    { firstName: 'Agnes', lastName: 'Lyimo', phone: '+255711000004', campus: 'DAR_ES_SALAAM', dept: 'Faculty Office', email: 'faculty.dar@cbe.ac.tz' },
    { firstName: 'Charles', lastName: 'Ngowi', phone: '+255711000005', campus: 'DAR_ES_SALAAM', dept: 'Examination Office', email: 'exams.dar@cbe.ac.tz' },
    { firstName: 'Rehema', lastName: 'Juma', phone: '+255711000006', campus: 'DAR_ES_SALAAM', dept: 'Student Affairs', email: 'studentaffairs.dar@cbe.ac.tz' },
    { firstName: 'Edwin', lastName: 'Moshi', phone: '+255711000007', campus: 'DAR_ES_SALAAM', dept: 'IT Department', email: 'it.dar@cbe.ac.tz' },
    { firstName: 'Fatuma', lastName: 'Hassan', phone: '+255711000008', campus: 'DAR_ES_SALAAM', dept: 'Research Office', email: 'research.dar@cbe.ac.tz' },
    // DODOMA
    { firstName: 'Samwel', lastName: 'Kileo', phone: '+255711000009', campus: 'DODOMA', dept: 'Library', email: 'library.dod@cbe.ac.tz' },
    { firstName: 'Neema', lastName: 'Mhina', phone: '+255711000010', campus: 'DODOMA', dept: 'Finance and Accounts', email: 'finance.dod@cbe.ac.tz' },
    { firstName: 'Godfrey', lastName: 'Pallangyo', phone: '+255711000011', campus: 'DODOMA', dept: 'Hostel Office', email: 'hostel.dod@cbe.ac.tz' },
    { firstName: 'Lilian', lastName: 'Mrema', phone: '+255711000012', campus: 'DODOMA', dept: 'Faculty Office', email: 'faculty.dod@cbe.ac.tz' },
    { firstName: 'Baraka', lastName: 'Swai', phone: '+255711000013', campus: 'DODOMA', dept: 'Examination Office', email: 'exams.dod@cbe.ac.tz' },
    { firstName: 'Consolata', lastName: 'Mlay', phone: '+255711000014', campus: 'DODOMA', dept: 'Student Affairs', email: 'studentaffairs.dod@cbe.ac.tz' },
    { firstName: 'Hamisi', lastName: 'Ally', phone: '+255711000015', campus: 'DODOMA', dept: 'IT Department', email: 'it.dod@cbe.ac.tz' },
    { firstName: 'Veronica', lastName: 'Kimaro', phone: '+255711000016', campus: 'DODOMA', dept: 'Research Office', email: 'research.dod@cbe.ac.tz' },
    // MWANZA
    { firstName: 'Mathias', lastName: 'Chacha', phone: '+255711000017', campus: 'MWANZA', dept: 'Library', email: 'library.mwz@cbe.ac.tz' },
    { firstName: 'Stella', lastName: 'Rweyemamu', phone: '+255711000018', campus: 'MWANZA', dept: 'Finance and Accounts', email: 'finance.mwz@cbe.ac.tz' },
    { firstName: 'Pascal', lastName: 'Magessa', phone: '+255711000019', campus: 'MWANZA', dept: 'Hostel Office', email: 'hostel.mwz@cbe.ac.tz' },
    { firstName: 'Dorah', lastName: 'Nyamhanga', phone: '+255711000020', campus: 'MWANZA', dept: 'Faculty Office', email: 'faculty.mwz@cbe.ac.tz' },
    { firstName: 'Fidelis', lastName: 'Buganza', phone: '+255711000021', campus: 'MWANZA', dept: 'Examination Office', email: 'exams.mwz@cbe.ac.tz' },
    { firstName: 'Mariam', lastName: 'Kabigi', phone: '+255711000022', campus: 'MWANZA', dept: 'Student Affairs', email: 'studentaffairs.mwz@cbe.ac.tz' },
    { firstName: 'Innocent', lastName: 'Nkwabi', phone: '+255711000023', campus: 'MWANZA', dept: 'IT Department', email: 'it.mwz@cbe.ac.tz' },
    { firstName: 'Perpetua', lastName: 'Mwita', phone: '+255711000024', campus: 'MWANZA', dept: 'Research Office', email: 'research.mwz@cbe.ac.tz' },
  ]

  for (const o of officersData) {
    const user = await prisma.user.create({
      data: {
        email: o.email,
        password: defaultPassword,
        role: 'DEPARTMENT_OFFICER',
        isFirstLogin: false,
      },
    })
    await prisma.departmentOfficer.create({
      data: {
        userId: user.id,
        departmentId: getDept(o.dept, o.campus).id,
        firstName: o.firstName,
        lastName: o.lastName,
        phone: o.phone,
        campus: o.campus,
      },
    })
  }
  console.log('✅ Created department officers')

  // ─── REGISTRARS ─────────────────────────────────────────────────────
  const registrars = [
    { email: 'registrar.dar@cbe.ac.tz', firstName: 'Dorothy', lastName: 'Massawe', phone: '+255711000025', campus: 'DAR_ES_SALAAM', dept: 'Registrar Office' },
    { email: 'registrar.dod@cbe.ac.tz', firstName: 'Emmanuel', lastName: 'Makwaia', phone: '+255711000026', campus: 'DODOMA', dept: 'Registrar Office' },
    { email: 'registrar.mwz@cbe.ac.tz', firstName: 'Beatrice', lastName: 'Sanga', phone: '+255711000027', campus: 'MWANZA', dept: 'Registrar Office' },
  ]

  for (const r of registrars) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: defaultPassword,
        role: 'REGISTRAR',
        isFirstLogin: false,
      },
    })
    await prisma.departmentOfficer.create({
      data: {
        userId: user.id,
        departmentId: getDept(r.dept, r.campus).id,
        firstName: r.firstName,
        lastName: r.lastName,
        phone: r.phone,
        campus: r.campus,
      },
    })
  }
  console.log('✅ Created registrar accounts')

  // ─── STUDENTS ───────────────────────────────────────────────────────
  const studentsData = [
    // DAR ES SALAAM - 25 students
    { studentNumber: 'CBE/DAR/2021/0001', firstName: 'Amina', lastName: 'Juma', gender: 'Female', dateOfBirth: '2000-03-15', nationalId: '20000315-12345-00001-1', phone: '+255712100001', homeRegion: 'Dar es Salaam', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Accounting', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0002', firstName: 'Brian', lastName: 'Mwangi', gender: 'Male', dateOfBirth: '1999-07-22', nationalId: '19990722-12345-00002-1', phone: '+255712100002', homeRegion: 'Morogoro', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Finance', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0003', firstName: 'Cynthia', lastName: 'Kimaro', gender: 'Female', dateOfBirth: '2000-11-05', nationalId: '20001105-12345-00003-1', phone: '+255712100003', homeRegion: 'Kilimanjaro', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Marketing', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0004', firstName: 'David', lastName: 'Msigwa', gender: 'Male', dateOfBirth: '1999-02-18', nationalId: '19990218-12345-00004-1', phone: '+255712100004', homeRegion: 'Arusha', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Human Resource', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0005', firstName: 'Esther', lastName: 'Lyimo', gender: 'Female', dateOfBirth: '2000-06-30', nationalId: '20000630-12345-00005-1', phone: '+255712100005', homeRegion: 'Mbeya', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE', specialization: 'Accounting', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0006', firstName: 'Frank', lastName: 'Ngowi', gender: 'Male', dateOfBirth: '1999-09-14', nationalId: '19990914-12345-00006-1', phone: '+255712100006', homeRegion: 'Dodoma', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'MASTER_OF_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0007', firstName: 'Gloria', lastName: 'Hassan', gender: 'Female', dateOfBirth: '1998-12-01', nationalId: '19981201-12345-00007-1', phone: '+255712100007', homeRegion: 'Tanga', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'MASTER_OF_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'PART_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0008', firstName: 'Hassan', lastName: 'Ally', gender: 'Male', dateOfBirth: '2001-04-25', nationalId: '20010425-12345-00008-1', phone: '+255712100008', homeRegion: 'Pwani', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_ACCOUNTANCY', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0009', firstName: 'Irene', lastName: 'Moshi', gender: 'Female', dateOfBirth: '2001-08-17', nationalId: '20010817-12345-00009-1', phone: '+255712100009', homeRegion: 'Lindi', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_ACCOUNTANCY', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0010', firstName: 'James', lastName: 'Pallangyo', gender: 'Male', dateOfBirth: '2001-01-09', nationalId: '20010109-12345-00010-1', phone: '+255712100010', homeRegion: 'Mtwara', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_MARKETING', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0011', firstName: 'Khadija', lastName: 'Mrema', gender: 'Female', dateOfBirth: '2000-05-21', nationalId: '20000521-12345-00011-1', phone: '+255712100011', homeRegion: 'Ruvuma', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_HUMAN_RESOURCE_MANAGEMENT', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0012', firstName: 'Leonard', lastName: 'Swai', gender: 'Male', dateOfBirth: '2000-10-13', nationalId: '20001013-12345-00012-1', phone: '+255712100012', homeRegion: 'Iringa', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_PROCUREMENT_LOGISTICS', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0013', firstName: 'Mary', lastName: 'Mlay', gender: 'Female', dateOfBirth: '2001-03-07', nationalId: '20010307-12345-00013-1', phone: '+255712100013', homeRegion: 'Njombe', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'CERTIFICATE_ACCOUNTANCY', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0014', firstName: 'Nathaniel', lastName: 'Chacha', gender: 'Male', dateOfBirth: '2001-07-29', nationalId: '20010729-12345-00014-1', phone: '+255712100014', homeRegion: 'Kagera', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'CERTIFICATE_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0015', firstName: 'Olivia', lastName: 'Rweyemamu', gender: 'Female', dateOfBirth: '2000-02-14', nationalId: '20000214-12345-00015-1', phone: '+255712100015', homeRegion: 'Mwanza', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Procurement', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0016', firstName: 'Patrick', lastName: 'Magessa', gender: 'Male', dateOfBirth: '1999-11-20', nationalId: '19991120-12345-00016-1', phone: '+255712100016', homeRegion: 'Shinyanga', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Marketing', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0017', firstName: 'Qamar', lastName: 'Nyamhanga', gender: 'Female', dateOfBirth: '2000-08-03', nationalId: '20000803-12345-00017-1', phone: '+255712100017', homeRegion: 'Geita', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0018', firstName: 'Robert', lastName: 'Buganza', gender: 'Male', dateOfBirth: '1997-04-11', nationalId: '19970411-12345-00018-1', phone: '+255712100018', homeRegion: 'Simiyu', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'PART_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0019', firstName: 'Salma', lastName: 'Kabigi', gender: 'Female', dateOfBirth: '2001-06-16', nationalId: '20010616-12345-00019-1', phone: '+255712100019', homeRegion: 'Tabora', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0020', firstName: 'Thomas', lastName: 'Nkwabi', gender: 'Male', dateOfBirth: '2000-12-28', nationalId: '20001228-12345-00020-1', phone: '+255712100020', homeRegion: 'Kigoma', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0021', firstName: 'Upendo', lastName: 'Mwita', gender: 'Female', dateOfBirth: '2001-09-04', nationalId: '20010904-12345-00021-1', phone: '+255712100021', homeRegion: 'Singida', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE', specialization: 'Finance', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0022', firstName: 'Victor', lastName: 'Massawe', gender: 'Male', dateOfBirth: '1999-05-19', nationalId: '19990519-12345-00022-1', phone: '+255712100022', homeRegion: 'Katavi', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Finance', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0023', firstName: 'Winifred', lastName: 'Makwaia', gender: 'Female', dateOfBirth: '2000-01-26', nationalId: '20000126-12345-00023-1', phone: '+255712100023', homeRegion: 'Rukwa', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_ACCOUNTANCY', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0024', firstName: 'Xavier', lastName: 'Sanga', gender: 'Male', dateOfBirth: '2001-10-08', nationalId: '20011008-12345-00024-1', phone: '+255712100024', homeRegion: 'Mara', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'DIPLOMA_MARKETING', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DAR/2021/0025', firstName: 'Yohana', lastName: 'Kileo', gender: 'Male', dateOfBirth: '2000-07-12', nationalId: '20000712-12345-00025-1', phone: '+255712100025', homeRegion: 'Songwe', campus: 'DAR_ES_SALAAM', faculty: 'Faculty of Business', programme: 'CERTIFICATE_ACCOUNTANCY', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },

    // DODOMA - 15 students
    { studentNumber: 'CBE/DOD/2021/0001', firstName: 'Zainab', lastName: 'Mhina', gender: 'Female', dateOfBirth: '2000-04-03', nationalId: '20000403-22345-00001-1', phone: '+255712200001', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Accounting', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0002', firstName: 'Adam', lastName: 'Kileo', gender: 'Male', dateOfBirth: '1999-08-15', nationalId: '19990815-22345-00002-1', phone: '+255712200002', homeRegion: 'Singida', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Finance', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0003', firstName: 'Beatrice', lastName: 'Mwamba', gender: 'Female', dateOfBirth: '2000-12-27', nationalId: '20001227-22345-00003-1', phone: '+255712200003', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Human Resource', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0004', firstName: 'Collins', lastName: 'Mwangi', gender: 'Male', dateOfBirth: '2001-02-09', nationalId: '20010209-22345-00004-1', phone: '+255712200004', homeRegion: 'Tabora', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'DIPLOMA_ACCOUNTANCY', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0005', firstName: 'Diana', lastName: 'Kimaro', gender: 'Female', dateOfBirth: '2001-06-21', nationalId: '20010621-22345-00005-1', phone: '+255712200005', homeRegion: 'Kondoa', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'DIPLOMA_HUMAN_RESOURCE_MANAGEMENT', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0006', firstName: 'Emmanuel', lastName: 'Msigwa', gender: 'Male', dateOfBirth: '1999-10-14', nationalId: '19991014-22345-00006-1', phone: '+255712200006', homeRegion: 'Mpwapwa', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'DIPLOMA_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0007', firstName: 'Flora', lastName: 'Lyimo', gender: 'Female', dateOfBirth: '2000-03-18', nationalId: '20000318-22345-00007-1', phone: '+255712200007', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'CERTIFICATE_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0008', firstName: 'George', lastName: 'Ngowi', gender: 'Male', dateOfBirth: '2001-07-05', nationalId: '20010705-22345-00008-1', phone: '+255712200008', homeRegion: 'Manyara', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE', specialization: 'Accounting', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0009', firstName: 'Hadija', lastName: 'Hassan', gender: 'Female', dateOfBirth: '2000-09-22', nationalId: '20000922-22345-00009-1', phone: '+255712200009', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'DIPLOMA_PROCUREMENT_LOGISTICS', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0010', firstName: 'Ibrahim', lastName: 'Ally', gender: 'Male', dateOfBirth: '1999-01-30', nationalId: '19990130-22345-00010-1', phone: '+255712200010', homeRegion: 'Kongwa', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'MASTER_OF_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'PART_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0011', firstName: 'Janeth', lastName: 'Moshi', gender: 'Female', dateOfBirth: '2000-05-16', nationalId: '20000516-22345-00011-1', phone: '+255712200011', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Marketing', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0012', firstName: 'Kevin', lastName: 'Pallangyo', gender: 'Male', dateOfBirth: '2001-11-08', nationalId: '20011108-22345-00012-1', phone: '+255712200012', homeRegion: 'Chamwino', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'DIPLOMA_MARKETING', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0013', firstName: 'Loveness', lastName: 'Mrema', gender: 'Female', dateOfBirth: '2000-08-24', nationalId: '20000824-22345-00013-1', phone: '+255712200013', homeRegion: 'Bahi', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'CERTIFICATE_ACCOUNTANCY', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0014', firstName: 'Michael', lastName: 'Swai', gender: 'Male', dateOfBirth: '1999-04-01', nationalId: '19990401-22345-00014-1', phone: '+255712200014', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/DOD/2021/0015', firstName: 'Naomi', lastName: 'Mlay', gender: 'Female', dateOfBirth: '2001-01-17', nationalId: '20010117-22345-00015-1', phone: '+255712200015', homeRegion: 'Dodoma', campus: 'DODOMA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Procurement', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },

    // MWANZA - 10 students
    { studentNumber: 'CBE/MWZ/2021/0001', firstName: 'Oscar', lastName: 'Chacha', gender: 'Male', dateOfBirth: '2000-06-09', nationalId: '20000609-32345-00001-1', phone: '+255712300001', homeRegion: 'Mwanza', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'DIPLOMA_MARKETING', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0002', firstName: 'Prisca', lastName: 'Rweyemamu', gender: 'Female', dateOfBirth: '2000-10-21', nationalId: '20001021-32345-00002-1', phone: '+255712300002', homeRegion: 'Ukerewe', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'DIPLOMA_PROCUREMENT_LOGISTICS', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0003', firstName: 'Quickson', lastName: 'Magessa', gender: 'Male', dateOfBirth: '1999-03-14', nationalId: '19990314-32345-00003-1', phone: '+255712300003', homeRegion: 'Mwanza', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_COMMERCE', specialization: 'Accounting', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0004', firstName: 'Rachel', lastName: 'Nyamhanga', gender: 'Female', dateOfBirth: '2001-07-26', nationalId: '20010726-32345-00004-1', phone: '+255712300004', homeRegion: 'Sengerema', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'DIPLOMA_ACCOUNTANCY', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0005', firstName: 'Samuel', lastName: 'Buganza', gender: 'Male', dateOfBirth: '2000-01-03', nationalId: '20000103-32345-00005-1', phone: '+255712300005', homeRegion: 'Kwimba', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'DIPLOMA_HUMAN_RESOURCE_MANAGEMENT', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0006', firstName: 'Teresa', lastName: 'Kabigi', gender: 'Female', dateOfBirth: '2001-05-15', nationalId: '20010515-32345-00006-1', phone: '+255712300006', homeRegion: 'Mwanza', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_BUSINESS_ADMINISTRATION', specialization: 'Marketing', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0007', firstName: 'Ulrich', lastName: 'Nkwabi', gender: 'Male', dateOfBirth: '1999-09-28', nationalId: '19990928-32345-00007-1', phone: '+255712300007', homeRegion: 'Geita', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'CERTIFICATE_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0008', firstName: 'Violet', lastName: 'Mwita', gender: 'Female', dateOfBirth: '2000-11-10', nationalId: '20001110-32345-00008-1', phone: '+255712300008', homeRegion: 'Misungwi', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'DIPLOMA_BUSINESS_ADMINISTRATION', specialization: null, enrollmentYear: 2022, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0009', firstName: 'Wilson', lastName: 'Massawe', gender: 'Male', dateOfBirth: '2001-02-22', nationalId: '20010222-32345-00009-1', phone: '+255712300009', homeRegion: 'Mwanza', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE', specialization: 'Finance', enrollmentYear: 2021, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
    { studentNumber: 'CBE/MWZ/2021/0010', firstName: 'Xenia', lastName: 'Makwaia', gender: 'Female', dateOfBirth: '2000-08-06', nationalId: '20000806-32345-00010-1', phone: '+255712300010', homeRegion: 'Ilemela', campus: 'MWANZA', faculty: 'Faculty of Business', programme: 'CERTIFICATE_ACCOUNTANCY', specialization: null, enrollmentYear: 2023, expectedGraduation: 2024, studyMode: 'FULL_TIME', academicStatus: 'COMPLETED' },
  ]

  for (const s of studentsData) {
    const email = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@cbe.ac.tz`
    const user = await prisma.user.create({
      data: {
        email,
        password: defaultPassword,
        role: 'STUDENT',
        isFirstLogin: true,
      },
    })
    await prisma.student.create({
      data: {
        userId: user.id,
        studentNumber: s.studentNumber,
        firstName: s.firstName,
        lastName: s.lastName,
        gender: s.gender,
        dateOfBirth: new Date(s.dateOfBirth),
        nationalId: s.nationalId,
        phone: s.phone,
        homeRegion: s.homeRegion,
        campus: s.campus,
        faculty: s.faculty,
        programme: s.programme,
        specialization: s.specialization,
        enrollmentYear: s.enrollmentYear,
        expectedGraduation: s.expectedGraduation,
        studyMode: s.studyMode,
        academicStatus: s.academicStatus,
      },
    })
  }
  console.log('✅ Created 50 students')
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 CBE Database Seeded Successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔑 Default password for ALL accounts: CBE@2024')
  console.log('👤 Admin login:    admin@cbe.ac.tz')
  console.log('🏫 Registrar DAR:  registrar.dar@cbe.ac.tz')
  console.log('🏫 Registrar DOD:  registrar.dod@cbe.ac.tz')
  console.log('🏫 Registrar MWZ:  registrar.mwz@cbe.ac.tz')
  console.log('📚 Library DAR:    library.dar@cbe.ac.tz')
  console.log('💰 Finance DAR:    finance.dar@cbe.ac.tz')
  console.log('🎓 Student DAR:    amina.juma@cbe.ac.tz')
  console.log('🎓 Student DOD:    zainab.mhina@cbe.ac.tz')
  console.log('🎓 Student MWZ:    oscar.chacha@cbe.ac.tz')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
