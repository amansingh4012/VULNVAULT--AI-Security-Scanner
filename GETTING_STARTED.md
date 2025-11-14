# Quick Start Guide

## Prerequisites

### Required Software
- **Python 3.10 or higher** - [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Local Development Setup

### Step 1: Clone the Repository
```bash
cd c:\Users\AMAN KUMAR SINGH\OneDrive\Desktop
cd vulnvault
```

### Step 2: Backend Setup (5 minutes)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

Backend will run at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 3: Frontend Setup (5 minutes)

Open a NEW terminal:

```powershell
# Navigate to frontend
cd c:\Users\AMAN KUMAR SINGH\OneDrive\Desktop\vulnvault\frontend

# Install dependencies (takes 2-3 minutes)
npm install

# Run development server
npm run dev
```

Frontend will run at: http://localhost:5173

---

## 🐳 Docker Setup (Alternative)

If you prefer Docker:

```powershell
# From project root
docker-compose up --build
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## ✅ Verify Installation

### Test Backend
Open browser: http://localhost:8000

You should see:
```json
{
  "message": "VulnVault API",
  "version": "1.0.0",
  "status": "operational"
}
```

### Test API Docs
Open: http://localhost:8000/docs

You'll see interactive API documentation (Swagger UI)

---

## 📝 Next Steps

### Day 1 Tasks (4-6 hours)
1. ✅ Setup complete!
2. Test Bandit scanner:
   ```bash
   cd backend
   python app/scanners/bandit_scanner.py
   ```
3. Explore API endpoints at http://localhost:8000/docs
4. Read `DEVELOPMENT_PLAN.md` for detailed roadmap

### Day 2 Tasks
- Implement Semgrep scanner
- Create unified vulnerability model
- Build file upload endpoint

---

## 🔧 Common Issues

### Issue: "Python not found"
**Solution**: Install Python 3.10+ and add to PATH

### Issue: "pip install fails"
**Solution**: 
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "npm command not found"
**Solution**: Install Node.js from nodejs.org

### Issue: Port 8000 already in use
**Solution**: 
```bash
# Find process
netstat -ano | findstr :8000
# Kill it or change port in main.py
```

---

## 📚 Resources

- **FastAPI Tutorial**: https://fastapi.tiangolo.com/tutorial/
- **React Docs**: https://react.dev/learn
- **Bandit**: https://bandit.readthedocs.io/
- **Project Roadmap**: See `DEVELOPMENT_PLAN.md`

---

## 🎯 Quick Test

Upload this vulnerable Python code to test the scanner:

```python
# test_vuln.py
import pickle
import os

PASSWORD = "admin123"  # Hardcoded password

def load_data(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)  # Unsafe deserialization

def run_cmd(user_input):
    os.system(user_input)  # Command injection
```

Expected: Scanner should detect 3 vulnerabilities!

---

**Ready to code? Start with Day 1 tasks! 🚀**
