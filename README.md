
# VulnVault: AI Security Scanner

>An open-source, AI-powered security vulnerability scanner for code and dependencies. VulnVault helps developers find, understand, and fix security issues automatically using static analysis, machine learning, and modern web technologies.

---

## 🛡️ What is VulnVault?
VulnVault combines static code analysis (Bandit, Semgrep) and AI/ML (CodeBERT, Gemini) to detect vulnerabilities like SQL injection, XSS, hardcoded secrets, and insecure dependencies. It supports multi-language scanning, GitHub repo analysis, and provides actionable, AI-generated fix suggestions.

---

## 🚀 Features
- **Code Upload**: Scan Python, JS, TS, C++, Java, Go, Ruby, PHP, and more
- **ZIP Archive Scanning**: Upload entire projects for bulk analysis
- **GitHub Integration**: Scan public repositories by URL
- **Dependency Scanning**: Detect vulnerable npm/pip packages
- **Secret Detection**: Finds hardcoded API keys, passwords, tokens
- **AI-Powered Fixes**: Gemini/CodeBERT generate remediation advice
- **Security Scoring**: 0-100 score based on severity
- **PDF Reports**: Export professional security reports
- **Email Alerts**: Get notified for critical vulnerabilities
- **Authentication**: Clerk for secure user management
- **Saved Projects**: Track scan history and improvements

---

## 🏗️ Architecture Overview

**Backend:** FastAPI (Python), Bandit, Semgrep, CodeBERT, MongoDB
**Frontend:** React 18, Vite, TailwindCSS, Clerk, Axios
**Deployment:** Docker, Render, Railway

```
User ──> React Frontend ──> FastAPI Backend ──> Scanners/AI ──> MongoDB
				 │                      │
				 │                      └─> Email Alerts, PDF Reports
				 └─> Clerk Auth ─────────┘
```

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.10+, FastAPI, Bandit, Semgrep, CodeBERT, MongoDB, Clerk API, Uvicorn

**Frontend:**
- React 18, Vite, TailwindCSS, Axios, Clerk, Zustand, Recharts

**ML/AI:**
- Hugging Face Transformers, Google Gemini (optional), LangChain

**DevOps:**
- Docker, docker-compose, Render, Railway, GitHub Actions

---

## 📦 Project Structure

```
vulnvault/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes (projects, scans)
│   │   ├── database.py   # MongoDB config
│   │   ├── models.py     # Pydantic models
│   │   ├── scanners/     # Bandit, Semgrep wrappers
│   │   └── ml/           # ML models (CodeBERT, Gemini)
│   ├── main.py           # FastAPI entrypoint
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/   # React UI (Home, Upload, Results)
│   │   ├── utils/        # API calls
│   ├── package.json      # npm dependencies
│   └── vite.config.js    # Vite config
├── docker-compose.yml    # Local dev orchestration
├── render.yaml           # Render deployment config
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Backend Setup
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

### 3. Access the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

## 🐳 Docker & Cloud Deployment

### Local Docker (Unified)
```powershell
# Build unified container
docker build -t vulnvault .

# Run with environment variables
docker run -p 8000:8000 `
  -e MONGODB_URL="your_mongodb_url" `
  -e GEMINI_API_KEY="your_api_key" `
  -e CLERK_SECRET_KEY="your_clerk_key" `
  vulnvault
```

### Local Docker Compose (Development)
```powershell
docker-compose up --build
```

### Render.com (Cloud - UNIFIED DEPLOYMENT)
**✅ Frontend + Backend in ONE container for better security scanning!**

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

Quick steps:
1. Delete old separate services (if any)
2. Push to GitHub
3. Render auto-detects `render.yaml` and `Dockerfile`
4. Set environment variables in Render dashboard
5. Deploy! Your app will be at: `https://vulnvault-app.onrender.com`

**Why unified?** All security scanners (bandit, semgrep, npm audit, pip-audit) are now installed in the Docker container, fixing the "100 score bug" on production!

---

## 🔑 Environment Variables

Backend (`.env`):
- `MONGODB_URL` - MongoDB connection string
- `DATABASE_NAME` - Database name (default: vulnvault)
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `CLERK_SECRET_KEY` - Clerk backend key
- `EMAIL_ENABLED` - "true" to enable alerts
- `EMAIL_SENDER`, `EMAIL_PASSWORD` - SMTP config

Frontend (`.env`):
- `VITE_API_URL` - Backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk frontend key

---

## 📚 API Endpoints (Backend)

- `GET /` - Health check
- `POST /scan/upload` - Scan uploaded code file/ZIP
- `POST /scan/github` - Scan GitHub repo by URL
- `POST /scan/dependencies` - Scan dependency files
- `GET /projects/{project_name}` - Get scan results
- `GET /projects/{project_name}/pdf` - Download PDF report
- `DELETE /projects/{project_name}` - Delete project

---

## 🧠 How VulnVault Works

1. **Sign In** (Clerk authentication)
2. **Upload code, dependencies, or GitHub URL**
3. **Backend scans for vulnerabilities:**
	 - Static analysis (Bandit, Semgrep)
	 - ML/AI fix suggestions (Gemini, CodeBERT)
	 - Secret detection (API keys, tokens, passwords)
	 - Dependency audit (npm, pip)
4. **Results:**
	 - Security score (0-100)
	 - Vulnerability list
	 - AI-powered fix advice
	 - PDF export
	 - Email alerts (if enabled)

---

## 📝 Contributing

1. Fork the repo & clone locally
2. Create a new branch (`feature/my-feature`)
3. Make changes, add tests if needed
4. Commit & push, then open a PR

---

## 🆘 Troubleshooting

- **MongoDB not connected?**
	- Check `MONGODB_URL` and that MongoDB is running
- **Clerk auth issues?**
	- Ensure both backend and frontend keys are set
- **Bandit/Semgrep not found?**
	- Install via `pip install bandit semgrep`
- **Email alerts not working?**
	- Set `EMAIL_ENABLED=true` and configure SMTP
- **Docker build fails?**
	- Check Dockerfile paths and permissions

---

## 📄 License
MIT License

## 🙏 Acknowledgments
Inspired by Google DeepMind's CodeMender, OWASP, and the open-source security community.

## 🎯 Features

- **Code Upload**: Upload source code files or provide GitHub repository URLs
- **Multi-Language Support**: Python, JavaScript, TypeScript, C++, Java, Go, Ruby, PHP, and more!
- **ZIP Archive Scanning**: Upload entire projects in a ZIP file
- **AI-Powered Scanning**: Uses ML models (CodeBERT) + static analyzers (Bandit, Semgrep)
- **Vulnerability Detection**: Identifies SQL injection, XSS, hardcoded secrets, and more
- **Smart Suggestions**: AI-generated fix recommendations
- **Security Scoring**: Overall security score and detailed report
- **GitHub Integration**: Direct repository analysis

## 🛠️ Tech Stack (100% Free Tier)

### Backend
- **Python 3.10+** with FastAPI
- **Bandit** - Python security linter
- **Semgrep** - Multi-language static analyzer
- **Hugging Face Transformers** - CodeBERT for ML analysis

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Axios** for API calls

### ML/AI
- **Hugging Face Models** (CodeBERT - free)
- **OpenAI API** (optional, has free tier)
- **LangChain** for orchestration

### Deployment
- **Docker** for containerization
- **Render/Railway** for hosting (free tier)
- **GitHub Actions** for CI/CD

## 📅 Development Timeline

### Week 1: Core Development (Days 1-7)
- ✅ Days 1-2: Backend setup + static analyzers
- ✅ Days 3-4: Frontend React app
- ✅ Days 5-7: AI/ML integration

### Week 2: Integration & Launch (Days 8-14)
- ✅ Days 8-9: GitHub integration
- ✅ Days 10-12: Testing & refinement
- ✅ Days 13-14: Deployment & documentation

## 🚀 Quick Start

### Prerequisites
```bash
- Python 3.10+
- Node.js 18+
- Git
```

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
vulnvault/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core logic
│   │   ├── models/       # Data models
│   │   ├── scanners/     # Security scanners
│   │   └── ml/           # ML models
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Pages
│   │   └── services/     # API services
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## 🎓 Learning Resources

- [Bandit Documentation](https://bandit.readthedocs.io/)
- [Semgrep Rules](https://semgrep.dev/docs/)
- [CodeBERT Paper](https://arxiv.org/abs/2002.08155)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🔮 Stretch Goals

- [ ] Real-time GitHub PR comments
- [ ] CI/CD pipeline plugin
- [ ] Multi-language support (Java, JavaScript, Go)
- [ ] Community security rules marketplace
- [ ] VS Code extension

## 📄 License

MIT License

## 🙏 Acknowledgments

Inspired by Google DeepMind's CodeMender for AI-driven security analysis.
