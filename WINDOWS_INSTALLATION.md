# Windows Installation Guide for CBE Clearance System

This guide shows you how to install all prerequisites on Windows to run the CBE Clearance System.

---

## 📋 Prerequisites Installation for Windows

### 1. Node.js (v20.20.2 or higher)

**Option A: Using Installer (Recommended for Beginners)**

1. Go to: https://nodejs.org/
2. Click the green "LTS" (Long Term Support) button
3. Download the `.msi` installer for Windows
4. Double-click the downloaded file
5. Click "Next" through the installation wizard
6. Click "Finish" when done

**Option B: Using Command Line (PowerShell as Administrator)**

```powershell
# Install Node.js using winget (Windows Package Manager)
winget install OpenJS.NodeJS

# Or using Chocolatey (if you have it installed)
choco install nodejs
```

**Verify Installation:**

```powershell
node --version    # Should show v20.20.2 or higher
npm --version     # Should show 9.x or higher
```

---

### 2. PostgreSQL (v13 or higher)

**Option A: Using Installer (Recommended)**

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download version 15 or 16 (latest stable versions)
4. Run the installer (.exe file)
5. **Important:** During installation:
   - Remember the password you set for the 'postgres' user!
   - Keep the default port: 5432
   - Install all components (Server, pgAdmin, Command Line Tools)
6. Complete the installation

**Option B: Using Command Line**

```powershell
# Using Chocolatey
choco install postgresql

# Or download and install manually
```

**Verify Installation:**

```powershell
# Open Command Prompt or PowerShell and type:
psql --version

# If it says "psql is not recognized", you need to add PostgreSQL to your PATH:
# Go to: C:\Program Files\PostgreSQL\15\bin (or your version)
# Copy this path and add it to your System Environment Variables PATH
```

---

### 3. Git (v2.x or higher)

**Option A: Using Installer (Recommended)**

1. Go to: https://git-scm.com/download/win
2. Download the 64-bit Git for Windows Setup
3. Run the installer
4. Use these recommended settings:
   - **Select Components:** Check "Git Bash Here", "Git GUI Here", "Git LFS"
   - **Default Editor:** Select "Use Vim" or "Use Notepad++" (if installed)
   - **PATH Environment:** Select "Git from the command line and also from 3rd-party software"
   - **HTTPS Transport:** Select "Use the native Windows Secure Channel library"
   - **Line Endings:** Select "Checkout Windows-style, commit Unix-style line endings"
5. Complete the installation

**Option B: Using Command Line**

```powershell
# Using winget
winget install Git.Git

# Or using Chocolatey
choco install git
```

**Verify Installation:**

```powershell
git --version    # Should show 2.x or higher
```

---

### 4. Visual Studio Code (Recommended IDE)

**Option A: Using Installer**

1. Go to: https://code.visualstudio.com/
2. Click "Download for Windows"
3. Run the installer
4. Recommended: Check all these options during installation:
   - [x] Add "Open with Code" action to Windows Explorer file context menu
   - [x] Add "Open with Code" action to Windows Explorer directory context menu
   - [x] Register Code as an editor for supported file types
   - [x] Add to PATH

**Option B: Using Command Line**

```powershell
winget install Microsoft.VisualStudioCode
```

---

## 🚀 Setting Up the Project on Windows

### Step 1: Get the Project Code

```powershell
# Open Command Prompt or PowerShell
# Navigate to where you want the project (Documents folder recommended)
cd C:\Users\YourUsername\Documents

# Clone the repository from GitHub
git clone https://github.com/salminsimba41-coder/cbe-clearance-system.git

# Enter the project folder
cd cbe-clearance-system
```

### Step 2: Set Up PostgreSQL Database

```powershell
# Open a new Command Prompt as Administrator
# Navigate to PostgreSQL bin folder (adjust version number if needed)
cd "C:\Program Files\PostgreSQL\15\bin"

# Login to PostgreSQL (enter the password you set during installation)
psql -U postgres

# Once inside PostgreSQL, create the database:
CREATE DATABASE cbe_clearance;

# Create a user for the database (optional, you can use 'postgres' user)
CREATE USER cbe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cbe_clearance TO cbe_user;

# Exit PostgreSQL
\q
```

### Step 3: Backend Setup

```powershell
# Navigate to backend folder
cd C:\Users\YourUsername\Documents\cbe-clearance-system\backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
```

**Edit the .env file:**

Open `.env` in Visual Studio Code or Notepad and update:

```env
# Database Connection (use the password you created)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cbe_clearance"

# Or if you created cbe_user:
# DATABASE_URL="postgresql://cbe_user:your_password@localhost:5432/cbe_clearance"

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-key-change-this"

# Email Configuration (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

**Run Database Setup:**

```powershell
# Generate Prisma Client
npm run generate

# Run migrations (create database tables)
npm run migrate

# Seed database with sample data
npm run seed
```

### Step 4: Frontend Setup

```powershell
# Open a new Command Prompt
# Navigate to frontend folder
cd C:\Users\YourUsername\Documents\cbe-clearance-system\frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local
```

**Edit the .env.local file:**

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_APP_NAME="CBE Clearance System"
```

### Step 5: Start the Application

**Start Backend (Command Prompt 1):**

```powershell
cd C:\Users\YourUsername\Documents\cbe-clearance-system\backend
npm run dev
```

**Start Frontend (Command Prompt 2):**

```powershell
cd C:\Users\YourUsername\Documents\cbe-clearance-system\frontend
npm run dev
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔧 Windows-Specific Troubleshooting

### PostgreSQL "psql is not recognized"

**Problem:** Command Prompt can't find PostgreSQL commands.

**Solution:**
1. Find your PostgreSQL installation folder (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add it to your System PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Advanced" tab
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\PostgreSQL\15\bin` (adjust version number)
   - Click OK on all windows
   - Restart Command Prompt

### Port Already in Use

**Problem:** Port 3000 or 5000 is already being used.

**Solution:**

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Or use different ports in .env files
```

### Windows Defender / Firewall Blocking

**Problem:** Windows Firewall blocks the application.

**Solution:**
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change Settings"
4. Click "Allow another app"
5. Browse and select `node.exe` from your Node.js installation
6. Click "Add"
7. Check both "Private" and "Public" boxes

### Node.js Installation Issues

**Problem:** Node.js commands not recognized.

**Solution:**
1. Reinstall Node.js
2. Make sure to check "Add to PATH" during installation
3. Restart Command Prompt
4. Verify with: `node --version`

### Permission Denied Errors

**Problem:** Getting permission errors when running commands.

**Solution:**
1. Run Command Prompt as Administrator:
   - Right-click on Command Prompt
   - Select "Run as administrator"
2. Or use PowerShell as Administrator

---

## 📦 Package Managers for Windows

### Using Winget (Built-in Windows Package Manager)

Windows 10/11 comes with winget pre-installed on newer versions:

```powershell
# Check if winget is installed
winget --version

# Install software with winget
winget install OpenJS.NodeJS
winget install Git.Git
winget install Microsoft.VisualStudioCode
```

### Using Chocolatey (Popular Package Manager)

1. Open PowerShell as Administrator
2. Run this command to install Chocolatey:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

3. Close and reopen PowerShell as Administrator
4. Install software:

```powershell
choco install nodejs
choco install postgresql
choco install git
choco install vscode
```

---

## 📝 Quick Reference Commands

### Check Versions
```powershell
node --version
npm --version
psql --version
git --version
```

### Database Commands
```powershell
# Start PostgreSQL service
net start postgresql-x64-15

# Stop PostgreSQL service
net stop postgresql-x64-15

# Login to PostgreSQL
psql -U postgres -d cbe_clearance
```

### Project Commands
```powershell
# Backend
cd backend
npm install
npm run dev
npm run migrate
npm run seed

# Frontend
cd frontend
npm install
npm run dev
```

---

## ✅ Installation Checklist

Before starting the application, verify you have:

- [ ] Node.js installed (v20.20.2 or higher)
- [ ] npm working (comes with Node.js)
- [ ] PostgreSQL installed (v13 or higher)
- [ ] PostgreSQL service running
- [ ] Database created (`cbe_clearance`)
- [ ] Git installed
- [ ] Project cloned from GitHub
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Environment files configured
- [ ] Database migrations run
- [ ] Database seeded

---

## 🆘 Getting Help

If you encounter issues on Windows:

1. **Check Windows Event Viewer** for system errors
2. **Check Node.js and npm versions** match requirements
3. **Verify PostgreSQL service is running** in Services app
4. **Check Windows Firewall** isn't blocking ports 3000 or 5000
5. **Run commands as Administrator** if you get permission errors

---

**You're now ready to run the CBE Clearance System on Windows!**
