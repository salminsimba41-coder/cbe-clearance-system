# CBE Clearance System

A comprehensive clearance management system for the College of Business Education (CBE) Tanzania. This system manages student clearance requests across multiple departments and campuses with role-based access control.

## 🏗️ Project Structure

```
cbe-clearance-system/
├── backend/                 # Node.js/Express API server
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Database schema definition
│   │   ├── migrations/     # SQL migration files
│   │   └── seed.js         # Database seeding script
│   ├── src/                # Source code
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   └── config/         # Configuration files
│   └── package.json        # Backend dependencies
└── frontend/               # Next.js 16 frontend application
    ├── app/                # Next.js app directory
    │   ├── (auth)/        # Authentication pages
    │   ├── dashboard/     # Dashboard pages
    │   └── globals.css    # Global styles
    ├── components/         # React components
    ├── lib/               # Utility functions
    └── package.json       # Frontend dependencies
```

## 📋 Prerequisites

Before installing this project, ensure you have the following installed:

- **Node.js** (v20.20.2 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v13 or higher)
- **Git** (for cloning the repository)

### Check Prerequisites

```bash
node --version    # Should be v20.20.2 or higher
npm --version     # Should be 9.x or higher
psql --version    # Should be v13 or higher
git --version     # Should be 2.x or higher
```

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd cbe-clearance-system
```

### Step 2: Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cbe_clearance;

# Create user (optional, you can use postgres)
CREATE USER cbe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cbe_clearance TO cbe_user;

# Exit PostgreSQL
\q
```

### Step 3: Backend Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Backend Environment Variables

Edit the `.env` file in the backend directory:

```env
# Database Connection
DATABASE_URL="postgresql://cbe_user:your_password@localhost:5432/cbe_clearance"

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3000"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Configuration (optional, for notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

#### Run Database Migrations

```bash
# Generate Prisma Client
npm run generate

# Run database migrations
npm run migrate

# Seed database with initial data
npm run seed
```

The seed script will create:
- 1 Admin account
- 27 Department Officers (9 per campus)
- 3 Registrar accounts (1 per campus)
- 50 Student accounts across all campuses

**Default Login Credentials:**
- Admin: `admin@cbe.ac.tz` / `CBE@2024`
- Students: `firstname.lastname@cbe.ac.tz` / `CBE@2024`

### Step 4: Frontend Installation

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

#### Configure Frontend Environment Variables

Edit the `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_APP_NAME="CBE Clearance System"
```

### Step 5: Start the Application

#### Start Backend Server

```bash
cd ../backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start Frontend Server (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

### Admin Account
- **Email:** `admin@cbe.ac.tz`
- **Password:** `CBE@2024`

### Student Accounts
- **Email:** `amina.juma@cbe.ac.tz`
- **Password:** `CBE@2024`

Other student accounts follow the pattern: `firstname.lastname@cbe.ac.tz`

### Department Officers
- **Library (Dar):** `library.dar@cbe.ac.tz`
- **Finance (Dar):** `finance.dar@cbe.ac.tz`
- **IT (Dar):** `it.dar@cbe.ac.tz`

All accounts use the default password: `CBE@2024`

## 🛠️ Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma Client
npm run seed         # Seed database with initial data
npm run studio       # Open Prisma Studio (database GUI)
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🗄️ Database Management

### Using Prisma Studio

```bash
cd backend
npm run studio
```

This opens a web-based database GUI at `http://localhost:5555`

### Reset Database

```bash
cd backend
# Delete all data
npx prisma migrate reset

# Re-seed with initial data
npm run seed
```

### Create New Migration

```bash
cd backend
# Modify schema.prisma first
npx prisma migrate dev --name your_migration_name
```

## 🌐 Accessing the Application

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000 (root endpoint)
- **Health Check:** http://localhost:5000/api/health

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Database connection failed
```bash
# Solution: Check DATABASE_URL in .env file
# Ensure PostgreSQL is running
sudo service postgresql start
```

**Problem:** Prisma Client not found
```bash
# Solution: Regenerate Prisma Client
cd backend
npm run generate
```

**Problem:** Migration errors
```bash
# Solution: Reset database and re-migrate
npx prisma migrate reset
npm run seed
```

### Frontend Issues

**Problem:** CORS errors
```bash
# Solution: Ensure FRONTEND_URL in backend/.env matches your frontend URL
# Also check the CORS configuration in backend/src/index.js
```

**Problem:** Build errors
```bash
# Solution: Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

**Problem:** TypeScript errors
```bash
# Solution: Restart TypeScript server in your IDE
# VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Port Conflicts

**Problem:** Port 3000 or 5000 already in use
```bash
# Solution: Kill processes using those ports
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Or use different ports in your .env files
```

## 🔒 Security Considerations

### For Production Deployment

1. **Change Default Passwords:** All accounts use `CBE@2024` - force password changes on first login
2. **Environment Variables:** Never commit `.env` files to version control
3. **JWT Secret:** Use a strong, randomly generated JWT secret
4. **Database Security:** Use strong database passwords and restrict access
5. **HTTPS:** Use SSL/TLS certificates in production
6. **Rate Limiting:** The backend includes rate limiting - adjust as needed
7. **Input Validation:** All inputs are validated using Zod schemas

### Environment Variables Checklist

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Update database credentials
- [ ] Configure email settings for notifications
- [ ] Set `NODE_ENV=production` in production
- [ ] Update `FRONTEND_URL` to production domain

## 📚 Technology Stack

### Backend
- **Framework:** Express.js 5.2.1
- **Database ORM:** Prisma 5.22.0
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, express-rate-limit
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** Next.js 16.2.6 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Charts:** Recharts

## 📝 Development Notes

### File Structure Key Points

- **Backend Schema:** `backend/prisma/schema.prisma` - Single source of truth for database structure
- **Migrations:** `backend/prisma/migrations/` - SQL files for database changes
- **Seeding:** `backend/prisma/seed.js` - Initial data population
- **Frontend Styles:** `frontend/app/globals.css` - Global theme and color variables
- **API Routes:** `backend/src/routes/` - API endpoint definitions
- **Controllers:** `backend/src/controllers/` - Business logic

### Customizing Colors

To change the color scheme, edit `frontend/app/globals.css`:

```css
@theme inline {
  --color-cbe-primary:        #1E3A5F;  /* Main brand color */
  --color-cbe-gold:           #F59E0B;  /* Accent color */
  /* ... other color variables */
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section above
- Review the Prisma documentation: https://www.prisma.io/docs
- Next.js documentation: https://nextjs.org/docs

---

**Last Updated:** May 2026
**Version:** 1.0.0
