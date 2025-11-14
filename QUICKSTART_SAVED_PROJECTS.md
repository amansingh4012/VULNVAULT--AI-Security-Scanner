# 💾 Saved Projects - Quick Start Guide

## 🚀 30-Second Setup

### 1. Install MongoDB (Windows)
```powershell
# Download and install from:
https://www.mongodb.com/try/download/community

# Or use Chocolatey:
choco install mongodb

# Start MongoDB service:
Start-Service MongoDB
```

### 2. Install Python Packages
```bash
cd backend
pip install pymongo dnspython reportlab
```

### 3. Configure Environment
Create `backend/.env`:
```env
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=vulnvault
```

### 4. Start Application
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Use the Feature
1. Open http://localhost:5173
2. Click **💾 Saved Projects** tab
3. Scan code (any tab) with a project name
4. View saved scans in Saved Projects!

---

## 📋 What You Get

### Automatic Features
✅ **Auto-save** - Every scan saves to MongoDB  
✅ **View history** - See all past scans  
✅ **Load results** - Click to view full details  
✅ **PDF reports** - Download scan reports  
✅ **Delete projects** - Remove unwanted scans  

### UI Features
- 🎨 Beautiful card layout
- 🎯 Color-coded security scores
- 📊 Vulnerability summaries
- 🔍 Scan type indicators
- 📅 Date/time stamps

---

## 🎯 Usage Flow

```
Scan Code → Enter Project Name → Scan Completes
                    ↓
              Auto-Saved to MongoDB
                    ↓
    View in Saved Projects Tab Anytime
                    ↓
    Load/Download/Delete as Needed
```

---

## 🐛 Troubleshooting

**MongoDB not running?**
```bash
Start-Service MongoDB
```

**Packages missing?**
```bash
pip install pymongo dnspython reportlab
```

**Connection refused?**
- Check MongoDB is running on port 27017
- Verify MONGODB_URL in .env

---

## 📖 Full Documentation
- **Setup Guide:** `SAVED_PROJECTS_SETUP.md`
- **Implementation Details:** `SAVED_PROJECTS_IMPLEMENTATION.md`
- **Test Script:** `backend/test_saved_projects.py`

---

**That's it! Start scanning and saving! 🛡️**
