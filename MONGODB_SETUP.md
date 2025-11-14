# MongoDB Setup Guide for VulnVault

## ✅ Features Added

1. **Project Name Requirement**: Users must enter a project name before scanning
2. **MongoDB Integration**: All scan results are saved to MongoDB
3. **Saved Projects Tab**: View, load, and delete previous scans
4. **Project History**: Track security scores over time

## 📋 MongoDB Installation

### Option 1: MongoDB Community Server (Recommended for Local Development)

1. **Download MongoDB**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, Latest Version
   - Download the MSI installer

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Default port: 27017

3. **Verify Installation**:
   ```powershell
   mongod --version
   ```

### Option 2: MongoDB Atlas (Free Cloud Database)

1. **Create Account**: Visit https://www.mongodb.com/cloud/atlas
2. **Create Free Cluster** (M0 tier)
3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=vulnvault
   ```

## 🚀 Quick Start

### 1. Start MongoDB (if using local installation)

**Windows**:
MongoDB should auto-start as a service. If not:
```powershell
net start MongoDB
```

**Check if running**:
```powershell
Get-Service MongoDB
```

### 2. Backend is Already Configured

The `.env` file is already created with local MongoDB settings:
```env
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=vulnvault
```

### 3. Test the Application

1. **Start Backend** (already running):
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   python main.py
   ```
   You should see: `✅ Connected to MongoDB`

2. **Start Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Test Project Saving**:
   - Upload a file with project name "Test Project"
   - Check "💾 Saved Projects" tab
   - View saved scan results

## 📊 Database Structure

### Projects Collection

```javascript
{
  "project_name": "MyApp Security Scan",
  "scan_type": "file_upload" | "github",
  "security_score": 85,
  "vulnerabilities": [...],
  "total_issues": 5,
  "summary": {
    "high": 1,
    "medium": 2,
    "low": 2
  },
  "file_name": "app.py",
  "repo_url": "https://github.com/user/repo", // for GitHub scans
  "files_scanned": 10,
  "created_at": "2025-11-13T10:30:00.000Z"
}
```

## 🔧 API Endpoints

### Scan Endpoints (Updated)
- `POST /scan/upload?project_name=MyProject` - Scan file with project name
- `POST /scan/github?repo_url=...&project_name=MyProject` - Scan GitHub repo

### Project Management (New)
- `GET /projects` - Get all saved projects
- `GET /projects/{project_name}` - Get specific project
- `DELETE /projects/{project_name}` - Delete project

## 🎯 Usage Flow

1. **User enters project name** (required field)
2. **User uploads file or GitHub URL**
3. **Click "Scan for Vulnerabilities"**
4. **Results displayed + automatically saved to MongoDB**
5. **View saved projects in "💾 Saved Projects" tab**
6. **Click "View" to load previous scan results**
7. **Click "Delete" to remove projects**

## 🔍 MongoDB Troubleshooting

### Connection Errors

If you see: `⚠️ MongoDB connection failed`

**Check if MongoDB is running**:
```powershell
Get-Service MongoDB
```

**Start MongoDB**:
```powershell
net start MongoDB
```

**Verify connection**:
```powershell
mongosh
# Should connect to MongoDB shell
```

### App Still Works Without MongoDB

The app will run even if MongoDB is not available:
- Backend shows: `⚠️ MongoDB connection failed: Running without database support`
- Scans work normally
- Projects won't be saved
- "Saved Projects" tab shows database error

## 💡 Tips

1. **Unique Project Names**: Use descriptive names like "Frontend v1.2 Scan"
2. **Regular Scans**: Save multiple scans of same project to track improvements
3. **Export Data**: Use MongoDB Compass to export/backup scan data
4. **Cloud Option**: Use MongoDB Atlas (free tier) for cloud storage

## 🎨 UI Changes

### FileUpload Component
- Added "Project Name" input field (required)
- Validation: Must enter project name before scanning

### GitHubScanner Component
- Added "Project Name" input field (required)
- Validation: Must enter project name before scanning

### SavedProjects Component (New)
- List all saved projects
- View project details
- Delete projects
- Shows security score, issues, scan date
- Color-coded severity indicators

## 📱 Screenshots

### Saved Projects View
```
┌─────────────────────────────────────────┐
│ 📁 Saved Projects          🔄 Refresh   │
├─────────────────────────────────────────┤
│ MyApp Security Scan        🐙 GitHub    │
│ Security Score: 75         Issues: 12   │
│ High/Med/Low: 2 / 5 / 5    Files: 15   │
│ 🔗 github.com/user/repo                 │
│ 🕒 Nov 13, 2025 10:30 AM               │
│                        [👁️ View] [🗑️ Del] │
└─────────────────────────────────────────┘
```

## 🔐 Security Notes

- MongoDB runs locally (no external access by default)
- No authentication configured (fine for local dev)
- For production: Enable MongoDB authentication
- Never expose MongoDB port 27017 to internet

## ✨ Next Steps

1. Install MongoDB locally or use Atlas
2. Scan your first project
3. Check "Saved Projects" tab
4. View scan history
5. Track security improvements over time!
