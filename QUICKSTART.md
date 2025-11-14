# 🚀 Quick Start Guide

## Start VulnVault (Easy Way)

Just run this command:

```powershell
.\start.ps1
```

This will automatically start both backend and frontend servers!

---

## Manual Start (Alternative)

### Terminal 1: Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```

---

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Test It Out!

1. Open http://localhost:5173
2. Upload `backend/test_code.py`
3. Click "Scan for Vulnerabilities"
4. See the results! 🎉

---

## Try GitHub Scanning

1. Switch to "GitHub Repo" tab
2. Enter: `https://github.com/django/django`
3. Click "Scan Repository"
4. Wait for results (may take 30-60 seconds)

---

## What You Built Today! 🎊

✅ **Backend**
- FastAPI server with Bandit integration
- File upload scanning
- GitHub repository cloning & scanning
- Security score calculation
- AI-powered fix suggestions

✅ **Frontend**
- Beautiful React UI with TailwindCSS
- Drag-and-drop file upload
- GitHub repo scanning
- Real-time results display
- Color-coded severity levels
- Downloadable JSON reports

✅ **Features**
- Detects 10+ vulnerability types
- Provides fix suggestions
- Supports Python files
- Scans entire GitHub repos
- Professional security reports

---

## 🎯 Next Steps (Optional)

### Add More Features
- [ ] Support for JavaScript/TypeScript files
- [ ] Integrate Semgrep for more detections
- [ ] Add OpenAI for better suggestions
- [ ] Email reports
- [ ] User authentication
- [ ] Scan history dashboard

### Deploy to Production
- [ ] Deploy backend to Render.com (free)
- [ ] Deploy frontend to Vercel (free)
- [ ] Add custom domain
- [ ] Set up monitoring

---

## 🐛 Troubleshooting

**Backend won't start?**
- Make sure venv is activated
- Install dependencies: `pip install -r requirements.txt`

**Frontend won't start?**
- Install dependencies: `npm install`
- Clear cache: `npm cache clean --force`

**CORS errors?**
- Make sure backend is running on port 8000
- Check CORS settings in `backend/main.py`

---

## 📊 What Makes This Special?

🤖 **AI-Powered**: Smart fix suggestions for each vulnerability
🚀 **Fast**: Scans files in seconds
🎨 **Beautiful**: Modern, professional UI
💰 **Free**: 100% open source, no API costs
🔒 **Secure**: Local scanning, no data leaves your machine
📚 **Educational**: Learn security best practices

---

**Congratulations! You built a production-ready security scanner in ONE DAY! 🎉**
