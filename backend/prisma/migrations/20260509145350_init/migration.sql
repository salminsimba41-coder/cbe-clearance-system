-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'DEPARTMENT_OFFICER', 'REGISTRAR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('DAR_ES_SALAAM', 'DODOMA', 'MWANZA');

-- CreateEnum
CREATE TYPE "Programme" AS ENUM ('BACHELOR_OF_COMMERCE', 'BACHELOR_OF_BUSINESS_ADMINISTRATION', 'BACHELOR_OF_SCIENCE_ACCOUNTING_FINANCE', 'POSTGRADUATE_DIPLOMA_BUSINESS_ADMIN', 'MASTER_OF_BUSINESS_ADMINISTRATION', 'DIPLOMA_ACCOUNTANCY', 'DIPLOMA_MARKETING', 'DIPLOMA_PROCUREMENT_LOGISTICS', 'DIPLOMA_HUMAN_RESOURCE_MANAGEMENT', 'DIPLOMA_BUSINESS_ADMINISTRATION', 'CERTIFICATE_ACCOUNTANCY', 'CERTIFICATE_BUSINESS_ADMINISTRATION');

-- CreateEnum
CREATE TYPE "StudyMode" AS ENUM ('FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "AcademicStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DEFERRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ClearanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DepartmentClearanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "homeRegion" TEXT NOT NULL,
    "campus" "Campus" NOT NULL,
    "faculty" TEXT NOT NULL,
    "programme" "Programme" NOT NULL,
    "specialization" TEXT,
    "enrollmentYear" INTEGER NOT NULL,
    "expectedGraduation" INTEGER NOT NULL,
    "studyMode" "StudyMode" NOT NULL DEFAULT 'FULL_TIME',
    "academicStatus" "AcademicStatus" NOT NULL DEFAULT 'ACTIVE',
    "nacteRegNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campus" "Campus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_officers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "campus" "Campus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_officers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clearance_requests" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "status" "ClearanceStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clearance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_clearances" (
    "id" TEXT NOT NULL,
    "clearanceRequestId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "officerId" TEXT,
    "status" "DepartmentClearanceStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "clearedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_clearances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clearance_certificates" (
    "id" TEXT NOT NULL,
    "clearanceRequestId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "fileUrl" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clearance_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_studentNumber_key" ON "students"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_nationalId_key" ON "students"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_campus_key" ON "departments"("name", "campus");

-- CreateIndex
CREATE UNIQUE INDEX "department_officers_userId_key" ON "department_officers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "department_clearances_clearanceRequestId_departmentId_key" ON "department_clearances"("clearanceRequestId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "clearance_certificates_clearanceRequestId_key" ON "clearance_certificates"("clearanceRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "clearance_certificates_certificateNumber_key" ON "clearance_certificates"("certificateNumber");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_officers" ADD CONSTRAINT "department_officers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_officers" ADD CONSTRAINT "department_officers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance_requests" ADD CONSTRAINT "clearance_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_clearances" ADD CONSTRAINT "department_clearances_clearanceRequestId_fkey" FOREIGN KEY ("clearanceRequestId") REFERENCES "clearance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_clearances" ADD CONSTRAINT "department_clearances_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_clearances" ADD CONSTRAINT "department_clearances_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "department_officers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance_certificates" ADD CONSTRAINT "clearance_certificates_clearanceRequestId_fkey" FOREIGN KEY ("clearanceRequestId") REFERENCES "clearance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
