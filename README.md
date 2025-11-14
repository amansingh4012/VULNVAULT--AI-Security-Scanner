# VulnVault: AI Security Scanner

An AI-powered security vulnerability scanner that helps developers find and fix security issues in their code automatically.

## 🎯 Project Overview

VulnVault democratizes security analysis by combining static code analysis with AI/ML to detect vulnerabilities like SQL injection, XSS, and other common security issues - inspired by Google DeepMind's CodeMender.

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
