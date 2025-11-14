# VulnVault Tech Stack - All Free!

## 🎯 Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│  ML Models  │
│   (React)   │      │  (FastAPI)   │      │  (HuggingF) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Scanners   │
                     │ Bandit+Semgrep│
                     └──────────────┘
```

---

## 🔧 Backend Stack

### Core Framework
**FastAPI** (Free, Open Source)
- Modern Python web framework
- Automatic API documentation
- Built-in validation
- Async support
```bash
pip install fastapi uvicorn
```

### Static Analyzers
**1. Bandit** (Free, Open Source)
- Python-specific security scanner
- Finds common security issues
- JSON output for easy parsing
```bash
pip install bandit
bandit -r ./code -f json -o report.json
```

**2. Semgrep** (Free Tier Available)
- Multi-language support
- Custom rule writing
- Fast pattern matching
```bash
pip install semgrep
semgrep --config=auto --json ./code
```

### ML/AI Libraries
**Hugging Face Transformers** (Free)
```python
from transformers import AutoTokenizer, AutoModel

# CodeBERT - Microsoft's code understanding model
model_name = "microsoft/codebert-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)
```

**Optional: OpenAI API**
- $5 free credits for new users
- GPT-3.5-turbo is cheap ($0.002/1K tokens)
```python
import openai
openai.api_key = "your-key"
```

### Additional Libraries
```txt
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
bandit==1.7.5
semgrep==1.45.0
transformers==4.35.0
torch==2.1.0
PyGithub==2.1.1
GitPython==3.1.40
python-dotenv==1.0.0
aiofiles==23.2.1
pandas==2.1.3
numpy==1.26.2
```

---

## 🎨 Frontend Stack

### Core Framework
**React 18 + Vite** (Free)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### UI & Styling
**TailwindCSS** (Free)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Shadcn/ui** (Free Component Library)
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card
```

### Additional Libraries
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "react-icons": "^4.12.0",
    "react-syntax-highlighter": "^15.5.0",
    "recharts": "^2.10.3",
    "zustand": "^4.4.7"
  }
}
```

---

## 🤖 ML/AI Stack (Free Options)

### Option 1: Hugging Face (Recommended for MVP)
**CodeBERT** - Pre-trained on code
```python
from transformers import pipeline

# Zero-shot classification
classifier = pipeline("zero-shot-classification", 
                     model="facebook/bart-large-mnli")

result = classifier(
    code_snippet,
    candidate_labels=["safe", "sql_injection", "xss", "command_injection"]
)
```

### Option 2: OpenAI (Optional, Free Trial)
**GPT-3.5-turbo** - For code analysis
```python
import openai

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{
        "role": "system",
        "content": "You are a security expert. Analyze this code for vulnerabilities."
    }, {
        "role": "user",
        "content": code_snippet
    }]
)
```

### Option 3: Local LLM (100% Free)
**Ollama + CodeLlama**
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Download CodeLlama (free, runs locally)
ollama pull codellama:7b

# Use in Python
import requests
requests.post('http://localhost:11434/api/generate', json={
    "model": "codellama",
    "prompt": f"Find security issues in: {code}"
})
```

---

## 🗄️ Database (Optional, All Free Tiers)

### Option 1: SQLite (Recommended for MVP)
```python
import sqlite3
# Built into Python, no setup needed
conn = sqlite3.connect('vulnvault.db')
```

### Option 2: PostgreSQL (Free on Render)
- 90 days free
- 256MB RAM
- 1GB storage
```python
pip install psycopg2-binary
```

### Option 3: MongoDB Atlas (Free Tier)
- 512MB storage
- Shared cluster
```python
pip install pymongo
```

---

## 🐳 DevOps & Deployment (All Free)

### Containerization
**Docker** (Free)
```dockerfile
# Backend Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### Hosting Options

**1. Render** (Recommended)
- 750 hours/month free
- Auto-deploy from GitHub
- Free SSL
- PostgreSQL included
```yaml
# render.yaml
services:
  - type: web
    name: vulnvault-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0"
    plan: free
```

**2. Railway** (Alternative)
- $5 free credits monthly
- Simple deployment
- Built-in databases
```yaml
# railway.toml
[build]
builder = "NIXPACKS"
```

**3. Vercel** (Frontend Only)
- Unlimited bandwidth
- Auto HTTPS
- CDN included
```bash
npm install -g vercel
vercel --prod
```

### CI/CD
**GitHub Actions** (Free)
- 2000 minutes/month
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/...
```

---

## 📊 Monitoring & Analytics (Free Tiers)

**1. Sentry** (Free)
- Error tracking
- 5K events/month
```python
import sentry_sdk
sentry_sdk.init(dsn="your-dsn")
```

**2. LogRocket** (Free)
- Session replay
- 1000 sessions/month

**3. Google Analytics** (Free)
- User tracking
- Unlimited events

---

## 🔐 Security Tools

**1. OWASP Dependency-Check** (Free)
```bash
pip install safety
safety check
```

**2. Trivy** (Free)
- Container scanning
```bash
trivy image vulnvault:latest
```

**3. GitHub Dependabot** (Free)
- Auto PR for vulnerabilities

---

## 📝 Development Tools (All Free)

### Code Editor
- **VS Code** - Free, best for web dev

### API Testing
- **Thunder Client** (VS Code extension)
- **Postman** (Free tier)

### Version Control
- **Git** + **GitHub** (Free)

### Design
- **Figma** (Free tier)
- **Excalidraw** (Free)

---

## 💡 Cost Breakdown (Monthly)

```
Development: $0
Hosting (Render): $0 (750 hrs free)
Database: $0 (SQLite or free tier)
ML Models: $0 (Hugging Face)
Domain: $0 (use .render.com subdomain)
SSL: $0 (included)
CI/CD: $0 (GitHub Actions)
Monitoring: $0 (free tiers)

TOTAL: $0/month 🎉
```

### Optional Upgrades (Later)
- Custom domain: $12/year
- OpenAI API: ~$5-10/month (if heavy use)
- Render Pro: $7/month (better performance)
- **Still under $30/month total!**

---

## 🚀 Getting Started

### Day 1: Backend Setup
```bash
# 1. Create project
mkdir vulnvault && cd vulnvault
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install fastapi uvicorn bandit semgrep transformers

# 3. Create main.py
# (See backend code structure)

# 4. Run
uvicorn main:app --reload
```

### Day 3: Frontend Setup
```bash
# 1. Create React app
npm create vite@latest frontend -- --template react
cd frontend

# 2. Install dependencies
npm install
npm install -D tailwindcss
npm install axios react-router-dom react-icons

# 3. Run
npm run dev
```

---

## 📚 Learning Resources

### Free Courses
- **FastAPI**: https://fastapi.tiangolo.com/tutorial/
- **React**: https://react.dev/learn
- **Docker**: https://docs.docker.com/get-started/
- **ML**: https://huggingface.co/course/chapter1

### Documentation
- **Bandit**: https://bandit.readthedocs.io/
- **Semgrep**: https://semgrep.dev/docs/
- **CodeBERT**: https://arxiv.org/abs/2002.08155

---

**Everything you need is free! No excuses, let's build! 🚀**
