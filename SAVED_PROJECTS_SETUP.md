# 💾 Saved Projects Feature - Setup Guide

## Overview
The Saved Projects feature automatically stores all scan results in MongoDB, allowing you to:
- View all previously scanned projects
- Load and review past scan results
- Download PDF reports of saved scans
- Delete unwanted projects
- Track security trends over time

---

## 🚀 Quick Start

### 1. Install MongoDB

#### Option A: MongoDB Community Edition (Recommended)
**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer and select "Complete" installation
3. Install MongoDB as a Windows Service (recommended)
4. MongoDB will start automatically on port 27017

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Sign up at: https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Add your IP to the whitelist (Network Access)
4. Create a database user (Database Access)
5. Get your connection string (Connect → Drivers)

---

### 2. Configure Environment Variables

Create or update `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=vulnvault

# For MongoDB Atlas (cloud):
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
# DATABASE_NAME=vulnvault

# Gemini AI (existing)
GEMINI_API_KEY=your_gemini_api_key_here

# Email Alerts (existing)
EMAIL_ENABLED=false
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_RECIPIENT=recipient@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

### 3. Install Python Dependencies

```bash
cd backend
pip install pymongo==4.6.0 dnspython==2.4.2
```

Or install all dependencies:
```bash
pip install -r requirements.txt
```

---

### 4. Verify MongoDB Connection

**Check if MongoDB is running:**
```bash
# Windows (PowerShell)
Get-Service MongoDB

# macOS/Linux
sudo systemctl status mongod
```

**Test connection:**
```bash
cd backend
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/'); print('✅ MongoDB connected:', client.server_info()['version'])"
```

---

## 📊 Feature Usage

### Backend API Endpoints

#### 1. **List All Projects**
```http
GET /api/projects?limit=100&offset=0
```
Response:
```json
{
  "total": 10,
  "projects": [
    {
      "project_name": "MyApp v1.0",
      "scan_type": "file_upload",
      "security_score": 75,
      "total_issues": 5,
      "summary": {"high": 1, "medium": 2, "low": 2},
      "file_name": "app.py",
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

#### 2. **Get Project Details**
```http
GET /api/projects/{project_name}
```
Returns complete project data including all vulnerabilities.

#### 3. **Delete Project**
```http
DELETE /api/projects/{project_name}
```

#### 4. **Download PDF Report**
```http
GET /projects/{project_name}/pdf
```

---

## 🎨 Frontend Features

### Saved Projects Tab
Access via the **💾 Saved Projects** tab in the main navigation.

**Features:**
- **Project Cards** - Visual cards showing:
  - Project name and scan date
  - Security score with color coding
  - Vulnerability breakdown by severity
  - Scan type (file/GitHub/dependencies)
  - Source information (file name or repo URL)

- **Actions:**
  - **📊 View** - Load full scan results
  - **📥 Download** - Generate and download PDF report
  - **🗑️ Delete** - Remove project from database
  - **🔄 Refresh** - Reload projects list

- **Auto-Save** - All scans are automatically saved when you provide a project name

---

## 🗄️ Database Structure

### Collection: `projects`

**Document Schema:**
```javascript
{
  project_name: "MyApp v1.0",          // Unique identifier
  scan_type: "file_upload",            // "file_upload" | "github" | "dependencies"
  security_score: 75,                  // 0-100
  total_issues: 5,
  summary: {
    high: 1,
    medium: 2,
    low: 2
  },
  vulnerabilities: [                   // Array of vulnerability objects
    {
      severity: "HIGH",
      type: "B608",
      line_number: 42,
      code: "cursor.execute(query)",
      description: "SQL injection possible",
      suggestion: "Use parameterized queries",
      file: "app.py"                   // Optional: for multi-file scans
    }
  ],
  file_name: "app.py",                 // Optional: for file uploads
  repo_url: "https://github.com/...",  // Optional: for GitHub scans
  files_scanned: 15,                   // Optional: number of files
  created_at: "2024-01-15T10:30:00"   // ISO 8601 timestamp
}
```

**Indexes:**
- `project_name` (unique, descending) - Fast lookups
- `created_at` (descending) - Sorted by date
- `scan_type` (descending) - Filter by type

---

## 🔧 Troubleshooting

### Problem: "Database not available"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   Get-Service MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. Verify connection string in `.env`:
   ```env
   MONGODB_URL=mongodb://localhost:27017/
   ```

3. Test connection manually:
   ```bash
   mongo  # Opens MongoDB shell
   show dbs  # List databases
   ```

### Problem: "Project name already exists"

**Solution:**
- Use a unique project name for each scan
- Or delete the existing project first
- Or append version/date to make it unique

### Problem: Projects not saving

**Solution:**
1. Check backend logs for MongoDB errors
2. Ensure `pymongo` is installed:
   ```bash
   pip install pymongo dnspython
   ```
3. Verify `.env` configuration
4. Restart the backend server

### Problem: PDF download fails

**Solution:**
1. Ensure `reportlab` is installed:
   ```bash
   pip install reportlab
   ```
2. Check if project exists in database
3. Verify backend PDF endpoint is working

---

## 📈 Usage Examples

### Example 1: Scan and Save a File
1. Go to **📁 Upload File** tab
2. Enter project name: "MyApp v1.0"
3. Upload your code file
4. Scan completes and auto-saves to MongoDB
5. View in **💾 Saved Projects** tab

### Example 2: Scan GitHub Repository
1. Go to **🐙 GitHub Repo** tab
2. Enter project name: "MyProject - Sprint 5"
3. Enter GitHub URL
4. Scan completes and auto-saves
5. View/download report from Saved Projects

### Example 3: Review Past Scans
1. Go to **💾 Saved Projects** tab
2. See all your scans sorted by date
3. Click **📊 View** to see full results
4. Click **📥** to download PDF report
5. Click **🗑️** to delete if needed

---

## 🎯 Best Practices

1. **Naming Convention:**
   - Use descriptive project names
   - Include version numbers: "MyApp v1.0", "MyApp v1.1"
   - Add dates for tracking: "MyApp - 2024-01-15"
   - Use sprint numbers: "Project X - Sprint 5"

2. **Regular Cleanup:**
   - Delete old/test scans periodically
   - Keep only relevant versions
   - Download PDFs before deleting

3. **Security:**
   - Protect MongoDB with authentication in production
   - Use MongoDB Atlas for secure cloud storage
   - Don't expose MongoDB port publicly
   - Backup database regularly

4. **Performance:**
   - MongoDB automatically indexes key fields
   - Large scans (>1000 files) may be slow
   - Consider pagination for large project lists

---

## 🌐 Production Deployment

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster** on MongoDB Atlas
2. **Configure Network Access:**
   - Add your server IP
   - Or allow from anywhere (0.0.0.0/0) with auth

3. **Create Database User:**
   - Username: vulnvault_user
   - Password: [strong password]
   - Role: readWrite on vulnvault database

4. **Update `.env`:**
   ```env
   MONGODB_URL=mongodb+srv://vulnvault_user:PASSWORD@cluster.mongodb.net/
   DATABASE_NAME=vulnvault
   ```

5. **Enable Authentication:**
   - Use environment variables
   - Never commit credentials to git

---

## 📋 Feature Checklist

✅ MongoDB models created  
✅ Database configuration module  
✅ API endpoints (GET, DELETE)  
✅ Auto-save on all scan types  
✅ SavedProjects component  
✅ Tab navigation integration  
✅ PDF report generation  
✅ Error handling  
✅ Loading states  
✅ Responsive UI  

---

## 🆘 Support

If you encounter issues:

1. Check backend logs for errors
2. Verify MongoDB is running
3. Test connection with Python client
4. Review `.env` configuration
5. Ensure all dependencies installed

For MongoDB help: https://docs.mongodb.com/manual/

---

**Enjoy tracking your security scans! 🛡️**
