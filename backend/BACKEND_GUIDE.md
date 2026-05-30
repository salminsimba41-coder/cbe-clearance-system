# Backend Architecture Guide for Beginners

This guide explains how the CBE Clearance System backend works in simple terms, perfect for someone who wants to understand the system without being an expert programmer.

---

## 📚 Table of Contents
1. [What is a Backend?](#what-is-a-backend)
2. [Prisma Schema - The Database Blueprint](#prisma-schema---the-database-blueprint)
3. [Migrations - Building the Database](#migrations---building-the-database)
4. [Seed.js - Filling the Database with Data](#seedjs---filling-the-database-with-data)
5. [Controllers - The Decision Makers](#controllers---the-decision-makers)
6. [Middleware - The Security Guards](#middleware---the-security-guards)
7. [Routes - The Street Signs](#routes---the-street-signs)
8. [Services - The Specialists](#services---the-specialists)
9. [Utils - The Helper Tools](#utils---the-helper-tools)
10. [How Everything Works Together](#how-everything-works-together)

---

## What is a Backend?

Think of the backend as the "kitchen" of a restaurant. When you (the frontend) order food (make a request), the kitchen (backend) prepares it and sends it back to you. You don't see what happens in the kitchen, but you get the results.

**In simple terms:**
- **Frontend** = The restaurant menu and dining area (what users see)
- **Backend** = The kitchen where food is prepared (where data is processed)
- **Database** = The pantry and refrigerator (where ingredients/data are stored)

---

## Prisma Schema - The Database Blueprint

### What is a Schema?

A schema is like a blueprint or a plan for your database. It tells the computer exactly what kind of data you want to store and how different pieces of data relate to each other.

**Real-world example:** 
Think of building a house. Before you start building, you need a blueprint that shows:
- How many bedrooms you want
- Where the kitchen goes
- How rooms connect to each other

The Prisma schema is the same thing for your database - it's a blueprint that shows:
- What kinds of data you'll store (students, departments, etc.)
- How they connect to each other (students belong to departments)
- What rules each piece of data must follow

### How Prisma Schema Works

The schema file is located at `backend/prisma/schema.prisma`. Let's break it down:

```prisma
model Student {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  email       String   @unique
  studentId   String   @unique
  campus      Campus
  programme   Programme
}
```

**What this means in simple terms:**
- `model Student` = We want to store information about students
- `id` = Every student needs a unique ID (like a social security number)
- `firstName` = We need to store their first name
- `email` = We need their email, and it must be unique (no two students can have the same email)
- `campus` = Which campus they attend (Dar es Salaam, Dodoma, or Mwanza)

### Why Do We Need This?

Without a schema, the database wouldn't know:
- What kind of data to accept (should "age" be a number or text?)
- What data is required (can a student exist without a name?)
- How data relates (how do we know which department a student belongs to?)

The schema acts as the "rules of the game" for your database.

---

## Migrations - Building the Database

### What are Migrations?

Migrations are like construction workers who build your database based on the blueprint (schema). When you change your blueprint, migrations update the actual database to match.

**Real-world example:**
Imagine you have a house blueprint. First, workers build the house according to the blueprint. Then you decide to add a garage. You update the blueprint, and workers come back to add the garage to your actual house.

In the same way:
- **Schema** = The blueprint
- **Migration** = The construction workers
- **Database** = The actual house

### How Migrations Work

The migration files are located in `backend/prisma/migrations/`. Each migration file contains SQL (Structured Query Language) - a special language that databases understand.

**Example from migration.sql:**

```sql
CREATE TABLE "Student" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  PRIMARY KEY ("id")
);
```

**What this does:**
- `CREATE TABLE "Student"` = Create a storage container called "Student"
- `"id" TEXT NOT NULL` = The ID field must contain text and cannot be empty
- `PRIMARY KEY ("id")` = The ID is the main identifier for each student

### The Migration Process

1. **You write the schema** (the blueprint)
2. **Prisma generates a migration** (the construction plan)
3. **You run the migration** (construction happens)
4. **Your database is created** (the house is built)

**Important:** Migrations are reversible. If you make a mistake, you can "undo" a migration, just like you can knock down a wall if you built it in the wrong place.

### Why Do We Need Migrations?

Without migrations, you would have to manually write SQL commands every time you want to change your database. Migrations automate this process and:
- Keep track of all changes to your database
- Allow you to undo changes if needed
- Make it easy to share database changes with your team
- Ensure everyone's database has the same structure

---

## Seed.js - Filling the Database with Data

### What is Seed.js?

Seed.js is like a "starter pack" for your database. It fills your empty database with initial data so you can test and work with the system immediately.

**Real-world example:**
Imagine you open a new restaurant. Before customers arrive, you need to:
- Stock the pantry with ingredients
- Set up sample dishes
- Create a menu

Seed.js does the same thing for your database - it fills it with:
- Sample users (admin, students, department officers)
- Sample departments
- Initial settings

### How Seed.js Works

The seed file is located at `backend/prisma/seed.js`. Let's look at a simplified example:

```javascript
const prisma = require('./client')

async function main() {
  // Create an admin user
  await prisma.user.create({
    data: {
      email: 'admin@cbe.ac.tz',
      password: 'hashed_password',
      role: 'ADMIN',
    }
  })

  // Create sample students
  await prisma.student.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@cbe.ac.tz',
      studentId: '2024001',
      campus: 'DAR_ES_SALAAM',
    }
  })
}

main()
```

**What this does:**
- Connects to the database
- Creates an admin user account
- Creates sample student accounts
- Saves all this data in the database

### When Do You Use Seed.js?

You use seed.js when:
- **First setting up the project** - To get started with test data
- **Testing** - To have realistic data to test with
- **Development** - To quickly reset your database to a known state
- **Demos** - To show the system to others with sample data

### Important Note

Seed data is **not** real user data. It's just sample data for development and testing. In production (when real users use the system), you would never run seed.js because you don't want to overwrite real user data.

---

## Controllers - The Decision Makers

### What are Controllers?

Controllers are like the "managers" in your backend. They receive requests from users, make decisions about what to do, and send back responses.

**Real-world example:**
Think of a hotel receptionist:
- A guest asks: "Can I check in?" (This is a request)
- The receptionist checks if the room is available (This is the controller logic)
- The receptionist says: "Yes, here's your key" (This is the response)

Controllers do the same thing:
- Receive a request (like "get my profile")
- Process it (check if user is logged in, get their data)
- Send a response (here's your profile information)

### How Controllers Work

Controllers are located in `backend/src/controllers/`. Let's look at a simple example:

```javascript
// student.controller.js
const getProfile = async (req, res) => {
  try {
    // Get the user's ID from the request
    const userId = req.user.id

    // Ask the database for this user's information
    const student = await prisma.student.findUnique({
      where: { userId: userId }
    })

    // Send the student's information back
    res.json(student)
  } catch (error) {
    // If something goes wrong, send an error message
    res.status(500).json({ error: 'Failed to get profile' })
  }
}
```

**What this does step by step:**
1. Receives a request: "Get my profile"
2. Gets the user's ID (from the authentication middleware)
3. Asks the database: "Give me this student's information"
4. Sends the information back to the user
5. If something breaks, sends an error message instead

### Why Do We Need Controllers?

Without controllers, all your logic would be mixed together in one big file. Controllers help by:
- **Organizing logic** - Each controller handles one type of task
- **Reusing code** - You can call the same controller function from different places
- **Testing** - Easier to test individual pieces of logic
- **Maintaining** - Easier to fix bugs when logic is organized

### Types of Controllers in This System

- **auth.controller.js** - Handles login, logout, password changes
- **student.controller.js** - Handles student-specific operations
- **department.controller.js** - Handles department officer operations
- **registrar.controller.js** - Handles registrar operations
- **admin.controller.js** - Handles admin operations
- **clearance.controller.js** - Handles the clearance request workflow

---

## Middleware - The Security Guards

### What is Middleware?

Middleware are like security guards or checkpoints that requests must pass through before reaching the controllers.

**Real-world example:**
Think of airport security:
1. You arrive at the airport (request comes in)
2. You go through security (middleware checks you)
3. If you pass, you can board your flight (controller processes your request)
4. If you fail, you're sent back (error response)

In the same way, middleware checks requests before they reach the controllers.

### How Middleware Works

Middleware is located in `backend/src/middleware/`. Let's look at the authentication middleware:

```javascript
// auth.middleware.js
const authenticate = async (req, res, next) => {
  try {
    // Check if the user provided a token (like an ID card)
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify the token is valid
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get the user's information
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    // If user doesn't exist or is inactive, deny access
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Add user information to the request
    req.user = user

    // Let the request continue to the controller
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

**What this does step by step:**
1. Checks if the user provided an authentication token
2. Verifies the token is valid (not fake or expired)
3. Gets the user's information from the database
4. If everything is okay, lets the request continue to the controller
5. If something is wrong, stops the request and sends an error

### Why Do We Need Middleware?

Middleware provides security and control:
- **Authentication** - Makes sure users are who they say they are
- **Authorization** - Makes sure users have permission to do what they're asking
- **Logging** - Records what users are doing (for security and debugging)
- **Validation** - Checks if request data is correct before processing

### Types of Middleware in This System

- **authenticate** - Checks if a user is logged in (has a valid token)
- **authorize** - Checks if a user has the right role (student, admin, etc.)

---

## Routes - The Street Signs

### What are Routes?

Routes are like street signs that tell requests where to go. They map URLs (web addresses) to specific controller functions.

**Real-world example:**
Think of a hospital:
- You go to "Emergency Room" → You get emergency care
- You go to "X-Ray Department" → You get X-rays
- You go to "Pharmacy" → You get medicine

Routes do the same thing:
- You go to `/api/auth/login` → You get the login controller
- You go to `/api/students/profile` → You get the student profile controller

### How Routes Work

Routes are located in `backend/src/routes/`. Let's look at the student routes:

```javascript
// student.routes.js
const express = require('express')
const router = express.Router()

// Import the controller functions
const { getProfile, checkEligibility } = require('../controllers/student.controller')

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware')

// Apply middleware to all routes in this file
router.use(authenticate, authorize('STUDENT'))

// Map URLs to controller functions
router.get('/profile', getProfile)
router.get('/eligibility', checkEligibility)

module.exports = router
```

**What this does:**
- Creates a router (like a street map for student-related requests)
- Imports the controller functions (the destinations)
- Applies middleware (security checkpoints)
- Maps URLs to functions (the street signs)

### How This Works in Practice

When a student accesses `/api/students/profile`:
1. The route system receives the request
2. Middleware checks: Is this user logged in? Is this user a student?
3. If yes, the request goes to the `getProfile` controller
4. The controller processes the request and sends a response

### Why Do We Need Routes?

Routes organize your API:
- **Clear structure** - Easy to understand what each URL does
- **Security** - Apply different middleware to different routes
- **Organization** - Group related routes together
- **Documentation** - Routes serve as documentation of available endpoints

### Route Examples

- `POST /api/auth/login` → Login
- `GET /api/students/profile` → Get student profile
- `GET /api/students/eligibility` → Check clearance eligibility
- `POST /api/clearance/request` → Submit clearance request
- `GET /api/admin/students` → Get all students (admin only)

---

## Services - The Specialists

### What are Services?

Services are like specialized departments that handle complex or external tasks. They take care of things that are too complicated or specific for controllers.

**Real-world example:**
In a company:
- **HR department** handles hiring and employee issues
- **IT department** handles computers and software
- **Accounting department** handles money and taxes

Each department specializes in one thing. Services do the same for your backend.

### How Services Work

Services are located in `backend/src/services/`. Let's look at the email service:

```javascript
// email.service.js
const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, text) => {
  // Create a connection to an email server
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  })

  // Send the email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  })
}
```

**What this does:**
- Connects to an email server (like Gmail or SendGrid)
- Sends an email to a specified address
- Handles all the complex details of email delivery

### Why Do We Need Services?

Services help by:
- **Separating concerns** - Controllers focus on business logic, services handle complex tasks
- **Reusability** - Multiple controllers can use the same service
- **Testing** - Easier to test email sending separately from other logic
- **Maintenance** - If you change email providers, you only change the service

### Types of Services in This System

- **email.service.js** - Handles sending emails (notifications, confirmations, etc.)

---

## Utils - The Helper Tools

### What are Utils?

Utils (utilities) are like a toolbox with small, reusable helper functions. They do simple tasks that are needed in many places.

**Real-world example:**
Think of a Swiss Army knife:
- It has a blade (for cutting)
- It has a screwdriver (for screws)
- It has a bottle opener (for bottles)

Each tool does one simple thing, but you use them all the time. Utils are the same.

### How Utils Work

Utils are located in `backend/src/utils/`. Let's look at two examples:

**JWT Utils (jwt.js):**
```javascript
const jwt = require('jsonwebtoken')

const generateToken = (userId, role) => {
  // Create a special token that proves who the user is
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

const verifyToken = (token) => {
  // Check if a token is valid
  return jwt.verify(token, process.env.JWT_SECRET)
}
```

**Audit Utils (audit.js):**
```javascript
const logAudit = async ({ userId, action, entity, details }) => {
  // Record what a user did (for security and tracking)
  await prisma.auditLog.create({
    data: { userId, action, entity, details }
  })
}
```

**What these do:**
- `generateToken` - Creates a digital ID card for users
- `verifyToken` - Checks if a digital ID card is valid
- `logAudit` - Writes to a security log what users did

### Why Do We Need Utils?

Utils provide:
- **Reusability** - Use the same function in multiple places
- **Consistency** - Same logic everywhere, no copy-paste errors
- **Simplicity** - Keep complex logic in one place
- **Testing** - Easier to test small functions

### Types of Utils in This System

- **jwt.js** - Handles JWT (JSON Web Token) creation and verification
- **audit.js** - Handles logging user actions for security

---

## How Everything Works Together

Now let's see how all these pieces work together in a real example: **A student logging in**

### Step-by-Step Example: Student Login

1. **User Action:** A student enters their email and password in the frontend

2. **Request Sent:** The frontend sends a POST request to `/api/auth/login`

3. **Route Processing:**
   - The route system receives the request
   - Routes it to the `auth.routes.js` file
   - Finds the login route: `router.post('/login', login)`

4. **Middleware:** (No middleware for login - anyone can try to log in)

5. **Controller (auth.controller.js):**
   ```javascript
   const login = async (req, res) => {
     // Get email and password from request
     const { email, password } = req.body

     // Ask the database: Does this user exist?
     const user = await prisma.user.findUnique({
       where: { email }
     })

     // Check if password is correct
     const isValid = await bcrypt.compare(password, user.password)

     // If correct, create a token
     const token = generateToken(user.id, user.role)

     // Log this login for security
     await logAudit({
       userId: user.id,
       action: 'LOGIN',
       entity: 'User',
       details: 'User logged in'
     })

     // Send token back to user
     res.json({ token, user })
   }
   ```

6. **Utils (jwt.js):**
   - `generateToken()` creates a special token
   - This token proves the user is who they say they are
   - Token is sent back to the frontend

7. **Utils (audit.js):**
   - `logAudit()` records that this user logged in
   - This creates a security trail

8. **Config (prisma.js):**
   - Provides the database connection
   - Allows the controller to query the database

9. **Response:** The user receives their token and can now access protected routes

### Another Example: Student Getting Their Profile

1. **User Action:** Student clicks "My Profile" in the frontend

2. **Request Sent:** Frontend sends GET request to `/api/students/profile`
   - Includes the token in the header: `Authorization: Bearer <token>`

3. **Route Processing:**
   - Route system receives request
   - Routes to `student.routes.js`
   - Finds: `router.get('/profile', getProfile)`

4. **Middleware (auth.middleware.js):**
   - `authenticate()` checks if token is valid
   - `authorize('STUDENT')` checks if user is a student
   - If both pass, request continues to controller

5. **Controller (student.controller.js):**
   - Gets user ID from the request (added by middleware)
   - Asks database for student's profile
   - Sends profile back to user

6. **Response:** Student sees their profile information

---

## Summary: The Big Picture

Think of the backend as a well-organized company:

- **Config** = The company's phone system and utilities
- **Routes** = The reception desk that directs calls
- **Middleware** = Security guards at the entrance
- **Controllers** = Department managers who make decisions
- **Services** = Specialized departments (like IT or mail room)
- **Utils** = Common tools everyone uses (like staplers or calculators)
- **Prisma Schema** = The company's organizational chart
- **Migrations** = Construction teams that build the offices
- **Seed.js** = The team that stocks the office with supplies

When a request comes in:
1. **Routes** direct it to the right place
2. **Middleware** checks security
3. **Controllers** make decisions
4. **Services** handle specialized tasks
5. **Utils** provide helper functions
6. **Config** provides database connections
7. **Response** is sent back to the user

This organized structure makes the system:
- **Secure** - Multiple layers of protection
- **Maintainable** - Easy to find and fix problems
- **Scalable** - Easy to add new features
- **Testable** - Easy to test individual parts

---

## Common Questions

### Q: Why are there so many files? Can't we put everything in one file?

A: You could, but it would be a mess! Imagine if a hospital put the emergency room, pharmacy, and X-ray all in one room. It would be chaotic. Separating things makes them organized and easier to work with.

### Q: What happens if one part breaks?

A: Because everything is separated, if the email service breaks, the rest of the system still works. You just can't send emails until you fix the email service.

### Q: Do I need to understand all of this to use the system?

A: No! You can use the system without understanding how it works. But if you want to modify or fix it, understanding this structure helps a lot.

### Q: Can I add more controllers, services, or utils?

A: Absolutely! That's how you add new features. When you want to add something new, you create new files in the appropriate folders.

---

## Conclusion

The backend is like a well-organized machine with many parts working together. Each part has a specific job, and they all work in harmony to process requests and return responses. Understanding this structure helps you navigate the codebase and make changes confidently.

Remember:
- **Schema** = Blueprint for your data
- **Migrations** = Building your database
- **Seed.js** = Filling your database with sample data
- **Controllers** = Decision makers
- **Middleware** = Security guards
- **Routes** = Street signs
- **Services** = Specialists
- **Utils** = Helper tools

Each piece plays an important role in making the system work smoothly and securely!
