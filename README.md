# VulnVault - AI-Powered Security Scanner 🛡️

<div align="center">

![VulnVault Banner](https://img.shields.io/badge/VulnVault-AI%20Security%20Scanner-blue?style=for-the-badge&logo=security&logoColor=white)

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**An advanced security vulnerability scanner combining multi-language static analysis, dependency auditing, secret detection, and AI-powered fix suggestions to help developers build secure applications.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-api-documentation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🌟 Highlights

- **🔍 Multi-Language Support**: Scan Python, JavaScript, TypeScript, C++, Java, Go, Ruby, PHP, and 10+ more languages
- **🤖 AI-Powered Fixes**: Get intelligent remediation suggestions from Google Gemini AI
- **📦 Dependency Auditing**: Automatically detect vulnerabilities in npm and pip packages with CVE lookups
- **🔐 Secret Detection**: Find hardcoded API keys, passwords, tokens, and 15+ secret types
- **🐙 GitHub Integration**: Clone and analyze entire repositories with one URL
- **📊 Security Scoring**: Get actionable 0-100 security scores with detailed breakdowns
- **📧 Smart Alerts**: Receive instant email notifications for critical vulnerabilities
- **💾 Project History**: Track security improvements over time with saved scans
- **📄 Professional Reports**: Export detailed PDF reports for compliance and auditing

---

## 🏗️ Architecture

VulnVault follows a modern full-stack architecture with React frontend, FastAPI backend, and MongoDB database:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         VulnVault Frontend                           │
│              React 18 + Vite + TailwindCSS + Clerk Auth              │
│         (File Upload, GitHub Scanner, Dependency Scanner)            │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ REST API (HTTP/JSON)
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         VulnVault Backend                            │
│                    FastAPI + Python 3.10+ + Uvicorn                  │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │    Bandit    │  │   Semgrep    │  │    Secret Scanner        │  │
│  │  (Python)    │  │ (Multi-Lang) │  │ (13 regex patterns)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  npm audit   │  │  pip-audit   │  │  Google Gemini AI        │  │
│  │ (Node deps)  │  │ (Python deps)│  │ (Fix suggestions)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  GitPython   │  │  ReportLab   │  │  Email Alerts (SMTP)     │  │
│  │ (Git clone)  │  │ (PDF export) │  │ (Critical vulns)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ MongoDB Driver (PyMongo)
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         MongoDB Atlas                                │
│              (Projects Collection - Scan History & Metadata)         │
│         Indexes: project_name (unique), created_at, scan_type        │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Components

- **Frontend**: Single-page application with protected routes, state management via Zustand, and real-time scan progress
- **Backend**: RESTful API with automatic OpenAPI documentation, Clerk JWT authentication, and parallel file scanning
- **Security Scanners**: 
  - **Bandit**: Python-specific SAST tool (50+ vulnerability types)
  - **Semgrep**: Language-agnostic pattern matching
  - **Custom Secret Scanner**: Regex-based detection for 13 secret types
  - **Dependency Auditors**: npm audit + pip-audit for CVE lookups
- **AI Engine**: Google Gemini AI with safety settings configured for security content
- **Database**: MongoDB with indexed collections for fast project retrieval

---

## 🚀 Features

### 🔍 Code Scanning
- **Multi-Language Support**: Python, JavaScript, TypeScript, C/C++, Java, Go, Ruby, PHP, C#, Swift, Kotlin, Rust
- **50+ Vulnerability Types**: SQL injection, XSS, command injection, path traversal, insecure deserialization, weak crypto, and more
- **ZIP Archive Support**: Extract and scan multiple files at once
- **Line-Level Detection**: Pinpoint exact locations of vulnerabilities in source code

### 🔐 Secret Detection
Automatically finds hardcoded secrets and sensitive data:
- AWS Access Keys & Secret Keys
- GitHub Personal Access Tokens
- Google API Keys
- Slack Tokens
- Private Keys (RSA, DSA, EC, OpenSSH, PGP)
- Stripe Secret Keys
- Azure Storage Keys
- JWT Tokens
- Passwords in URLs
- Database Connection Strings
- Generic API keys and secrets

### 📦 Dependency Vulnerability Detection
- **Node.js**: Scans `package.json` using npm audit with CVE database
- **Python**: Scans `requirements.txt` using pip-audit
- **Version Tracking**: Shows current vulnerable version and suggested fix version
- **Severity Mapping**: Critical → HIGH, High → MEDIUM, Medium/Low → LOW

### 🤖 AI-Powered Fix Suggestions
- Powered by **Google Gemini AI** (gemini-flash-lite-latest model)
- Educational security explanations (why it's risky, how to fix, prevention tips)
- Fast response time (<15 seconds)
- Safety filters configured to allow security-related content

### 📊 Security Scoring System
VulnVault calculates a security score (0-100) based on vulnerability severity:

| Severity | Penalty | Examples |
|----------|---------|----------|
| HIGH     | -15 pts | SQL injection, hardcoded credentials, command injection |
| MEDIUM   | -8 pts  | Weak hashing, insecure deserialization, XSS |
| LOW      | -3 pts  | Missing input validation, insecure randomness |

**Grading Scale:**
- **90-100** → A+ (Excellent)
- **80-89** → A (Very Good)
- **70-79** → B (Good)
- **60-69** → C (Fair)
- **50-59** → D (Poor)
- **0-49** → F (Critical - Immediate action required)

### 🐙 GitHub Repository Scanning
- Clone public/private repositories (with auth)
- Scan up to 30 files per repository
- Analyze code + dependencies + secrets in one scan
- Show results grouped by file path

### 📧 Email Alerts
- Automatic email notifications for critical vulnerabilities (HIGH severity)
- HTML-formatted emails with vulnerability details
- Sent to authenticated user's email (via Clerk)
- Configurable SMTP settings (Gmail, custom SMTP server)

### 💾 Project Management
- **Save Scan Results**: Automatic MongoDB storage with metadata
- **View History**: List all scans sorted by date
- **Detailed Reports**: View complete vulnerability breakdown
- **Delete Projects**: Remove old scans from database
- **PDF Export**: Generate professional security reports with ReportLab

### 🔐 Authentication & Authorization
- **Clerk Integration**: Secure JWT-based authentication
- **Protected Routes**: Email alerts sent to authenticated users
- **Optional Auth**: Guest users can scan but won't receive email alerts
- **User Context**: Track scans by user ID for future multi-tenancy

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks & context |
| **Vite** | Fast build tool & dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **Clerk** | Authentication & user management |
| **React Router v6** | Client-side routing & protected routes |
| **Zustand** | Lightweight state management |
| **Recharts** | Data visualization for security metrics |
| **Axios** | HTTP client for API requests |
| **React Icons** | Icon library |
| **React Syntax Highlighter** | Code snippet highlighting |

</td>
<td width="50%">

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern async Python web framework |
| **Python 3.10+** | Core language with type hints |
| **Uvicorn** | ASGI server for FastAPI |
| **MongoDB** | NoSQL database for scan storage |
| **PyMongo** | MongoDB driver with connection pooling |
| **Google Gemini AI** | AI-powered fix suggestions |
| **Bandit** | Python SAST scanner |
| **Semgrep** | Multi-language static analysis |
| **npm audit** | Node.js dependency scanner |
| **pip-audit** | Python dependency scanner |
| **GitPython** | GitHub repository cloning |
| **ReportLab** | PDF report generation |
| **Clerk Backend API** | Server-side JWT verification |
| **python-dotenv** | Environment variable management |
| **Pydantic** | Data validation & settings |

</td>
</tr>
</table>

### DevOps & Deployment

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization (unified frontend + backend) |
| **docker-compose** | Multi-container orchestration (dev & production profiles) |
| **Render** | Cloud deployment platform (Web Services) |
| **GitHub Actions** | CI/CD pipeline (build, test, deploy) |

---

## 📋 Prerequisites

Before installing VulnVault, ensure you have:

- **Python 3.10+** (with pip)
- **Node.js 18+** (with npm)
- **MongoDB** (local instance or MongoDB Atlas cluster)
- **Git** (for cloning repositories)
- **Security Scanners** (installed globally):
  - `bandit` - Python code scanner
  - `semgrep` - Multi-language scanner
  - `pip-audit` - Python dependency scanner

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/amansingh4012/VULNVAULT--AI-Security-Scanner.git
cd vulnvault
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure your API keys:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vulnvault

# ============================================
# AI & ML CONFIGURATION
# ============================================
# Get your Gemini API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# AUTHENTICATION (Clerk)
# ============================================
# Get keys from: https://dashboard.clerk.com
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# EMAIL ALERTS (Optional)
# ============================================
EMAIL_ENABLED=false
EMAIL_SENDER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_RECIPIENT=alerts@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# ============================================
# FRONTEND CONFIGURATION
# ============================================
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Get API Keys:**
- **MongoDB Atlas**: [Sign up](https://www.mongodb.com/cloud/atlas) → Create Cluster → Get Connection String
- **Google Gemini AI**: [Get API Key](https://makersuite.google.com/app/apikey) (Free tier available)
- **Clerk Auth**: [Create Account](https://dashboard.clerk.com) → Create Application → Copy Keys

### 3. Install Security Scanners

```bash
# Install Python scanners
pip install bandit semgrep pip-audit

# Verify installations
bandit --version    # Should show: bandit 1.7.5
semgrep --version   # Should show: 1.45.0+
pip-audit --version # Should show: 2.6.1+
```

### 4. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: **http://localhost:8000**

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 5. Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at: **http://localhost:5173**

### 6. Open Application

Open your browser and navigate to:
```
http://localhost:5173
```

You'll see the VulnVault landing page. Click **"Sign In to Get Started"** to authenticate with Clerk.

---

## 🐳 Docker Deployment

VulnVault supports Docker for easy deployment with two modes:

### Development Mode (Separate Containers)

Runs frontend and backend in separate containers with hot-reload:

```bash
docker-compose --profile dev up
```

### Production Mode (Unified Container)

Builds frontend as static files and serves via FastAPI:

```bash
docker-compose --profile unified up
```

### Manual Docker Build

```bash
# Build image
docker build -t vulnvault .

# Run container
docker run -p 8000:8000 --env-file .env vulnvault

# Access application
# http://localhost:8000
```

---

## 📊 API Documentation

VulnVault provides auto-generated API documentation via FastAPI:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) - Interactive API explorer
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) - Clean documentation

### Key Endpoints

#### Scan Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/scan/upload` | Upload code file or ZIP archive for scanning | Optional |
| POST | `/scan/github` | Scan GitHub repository by URL | Optional |
| POST | `/scan/dependencies` | Scan package.json or requirements.txt | Optional |

**Request Body (File Upload):**
```json
{
  "file": "multipart/form-data",
  "project_name": "MyApp Security Scan"
}
```

**Response:**
```json
{
  "security_score": 85,
  "vulnerabilities": [
    {
      "severity": "HIGH",
      "type": "B608",
      "line_number": 42,
      "code": "cursor.execute(f'SELECT * FROM users WHERE id = {user_id}')",
      "description": "Possible SQL injection vulnerability",
      "suggestion": "Use parameterized queries with placeholders (?)"
    }
  ],
  "total_issues": 5,
  "summary": {"high": 1, "medium": 2, "low": 2},
  "file_name": "app.py"
}
```

#### AI Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/fix-suggestion` | Get AI-powered fix for a vulnerability | No |

**Request Body:**
```json
{
  "severity": "HIGH",
  "type": "B608",
  "line_number": 42,
  "code": "cursor.execute(f'SELECT * FROM users WHERE id = {user_id}')",
  "description": "Possible SQL injection vulnerability"
}
```

#### Project Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | List all saved scan results | No |
| GET | `/api/projects/{name}` | Get specific project details | No |
| DELETE | `/api/projects/{name}` | Delete saved project | No |
| GET | `/projects/{name}/pdf` | Generate PDF report | No |

#### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check endpoint |

---

## 🔍 Supported File Types

### Code Files

VulnVault can analyze the following programming languages:

| Language | Extensions |
|----------|-----------|
| **Python** | `.py` |
| **JavaScript** | `.js`, `.jsx` |
| **TypeScript** | `.ts`, `.tsx` |
| **C/C++** | `.c`, `.cpp`, `.h`, `.hpp` |
| **Java** | `.java` |
| **Go** | `.go` |
| **Ruby** | `.rb` |
| **PHP** | `.php` |
| **C#** | `.cs` |
| **Swift** | `.swift` |
| **Kotlin** | `.kt` |
| **Rust** | `.rs` |
| **Archives** | `.zip` (extracts and scans contents) |

### Dependency Files

| Package Manager | File |
|----------------|------|
| **npm** (Node.js) | `package.json` |
| **pip** (Python) | `requirements.txt` |

---

## 🛡️ Vulnerability Detection

VulnVault detects 50+ vulnerability types across multiple categories:

### Code Vulnerabilities

<details>
<summary><strong>Injection Vulnerabilities</strong> (Click to expand)</summary>

- **SQL Injection (B608)**: Detects string concatenation in SQL queries
- **Command Injection (B605, B602)**: Finds os.system(), subprocess with shell=True
- **LDAP Injection**: Unvalidated LDAP queries
- **XML Injection**: Unsafe XML parsing
- **Code Injection (B102)**: exec(), eval() usage

</details>

<details>
<summary><strong>Authentication & Session Management</strong> (Click to expand)</summary>

- **Hardcoded Passwords (B105)**: Passwords in source code
- **Weak Password Hashing (B324)**: MD5, SHA1 usage
- **Session Fixation**: Insecure session handling
- **Broken Authentication**: Weak credential storage

</details>

<details>
<summary><strong>Cryptographic Issues</strong> (Click to expand)</summary>

- **Weak Cryptography (B324)**: MD5, SHA1, DES usage
- **Insecure Randomness (B311)**: random instead of secrets module
- **Hardcoded Encryption Keys**: Keys in source code
- **Weak SSL/TLS**: Insecure protocol versions

</details>

<details>
<summary><strong>Deserialization & Data Handling</strong> (Click to expand)</summary>

- **Insecure Deserialization (B301, B403, B404)**: pickle with untrusted data
- **XXE (XML External Entities)**: Unsafe XML parsing
- **YAML Deserialization**: Unsafe YAML loading

</details>

<details>
<summary><strong>File & Path Operations</strong> (Click to expand)</summary>

- **Path Traversal**: Directory traversal vulnerabilities
- **Arbitrary File Upload**: Unrestricted file uploads
- **File Inclusion**: Local/Remote file inclusion

</details>

<details>
<summary><strong>Other Vulnerabilities</strong> (Click to expand)</summary>

- **Cross-Site Scripting (XSS)**: Unescaped user input
- **Server-Side Request Forgery (SSRF)**: Unvalidated URL fetching
- **Assert Usage (B101)**: assert for security checks
- **Unsafe Imports**: Dangerous library usage
- **And 30+ more...**

</details>

### Secret Detection

VulnVault's custom secret scanner uses regex patterns to detect:

| Secret Type | Pattern Example |
|-------------|-----------------|
| **AWS Access Key** | `AKIA[0-9A-Z]{16}` |
| **AWS Secret Key** | `aws_secret_access_key = "..."` |
| **GitHub Token** | `ghp_[A-Za-z0-9]{36}` |
| **Google API Key** | `AIza[0-9A-Za-z_-]{35}` |
| **Slack Token** | `xox[baprs]-...` |
| **Private Keys** | `-----BEGIN RSA PRIVATE KEY-----` |
| **Stripe Secret Key** | `sk_live_[0-9a-zA-Z]{24,}` |
| **JWT Token** | `eyJ[A-Za-z0-9_-]{10,}\.eyJ...` |
| **Database URLs** | `postgres://user:pass@host` |
| **Generic API Keys** | `api_key = "..."` |
| **Generic Secrets** | `secret = "..."` |
| **Password in URL** | `https://user:pass@example.com` |
| **Azure Keys** | `[0-9a-zA-Z]{88}==` |

### Dependency Vulnerabilities

- **npm audit**: Scans Node.js packages for known CVEs
- **pip-audit**: Scans Python packages for known CVEs
- Shows current vulnerable version and suggested fix version
- Maps npm severity (CRITICAL, HIGH, MODERATE, LOW) to VulnVault severity

---

## 🧪 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```bash
⚠️ MongoDB not available: ServerSelectionTimeoutError
   Projects will not be saved. To enable, start MongoDB and configure MONGODB_URL
```

**Solution:**
1. Verify `MONGODB_URL` in `.env` is correct
2. Check MongoDB Atlas IP whitelist:
   - Go to **Network Access** in Atlas dashboard
   - Add `0.0.0.0/0` for development (allow all IPs)
   - For production, add specific IPs
3. Test connection:
   ```bash
   python backend/test_atlas_connection.py
   ```

#### Gemini AI Not Working
```bash
⚠️ Gemini API key not configured
```

**Solution:**
1. Get API key from: https://makersuite.google.com/app/apikey
2. Add to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Restart backend server

#### Scanner Not Found
```bash
FileNotFoundError: Semgrep not installed
```

**Solution:**
```bash
# Install missing scanner
pip install semgrep

# Or install all scanners
pip install bandit semgrep pip-audit

# Verify
semgrep --version
```

#### Email Alerts Not Sending
```bash
⚠️ Email configuration incomplete
```

**Solution:**
1. Enable in `.env`:
   ```env
   EMAIL_ENABLED=true
   EMAIL_SENDER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password  # Not your Gmail password!
   ```
2. For Gmail, generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
3. Restart backend

### Frontend Issues

#### API Connection Failed
```
Network Error: Failed to fetch
```

**Solution:**
1. Ensure backend is running:
   ```bash
   curl http://localhost:8000/health
   ```
2. Check `VITE_API_URL` in `.env` matches backend URL
3. Clear browser cache and reload

#### Clerk Authentication Error
```
Clerk: Invalid publishable key
```

**Solution:**
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
2. Check Clerk dashboard for correct keys
3. Ensure key starts with `pk_test_` or `pk_live_`

#### Build Errors
```
Module not found: 'react-router-dom'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Docker Issues

#### Port Already in Use
```bash
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### 1. Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/VULNVAULT--AI-Security-Scanner.git
cd vulnvault
```

### 2. Create Feature Branch

```bash
git checkout -b feature/AmazingFeature
```

### 3. Make Changes

Follow these guidelines:
- **Code Style**: Use Black (Python), Prettier (JavaScript)
- **Type Hints**: Add type annotations to Python functions
- **Comments**: Document complex logic
- **Tests**: Add tests for new features (pytest for backend)

### 4. Commit Changes

```bash
git add .
git commit -m "Add AmazingFeature: description"
```

### 5. Push & Create PR

```bash
git push origin feature/AmazingFeature
```

Then open a Pull Request on GitHub with:
- **Title**: Brief description of changes
- **Description**: Detailed explanation, screenshots (if UI changes)
- **Testing**: How you tested the changes

### Development Tips

**Backend Development:**
```bash
cd backend
# Run with auto-reload
uvicorn main:app --reload --port 8000

# Run tests
pytest

# Format code
black .
```

**Frontend Development:**
```bash
cd frontend
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Summary:**
- ✅ Free to use, modify, and distribute
- ✅ Commercial use allowed
- ✅ No warranty provided
- ⚠️ Must include copyright notice

---

## 👨‍💻 Author

**Aman Kumar Singh**

- 🔗 GitHub: [@amansingh4012](https://github.com/amansingh4012)
- 📧 Email: [Contact via GitHub](https://github.com/amansingh4012)
- 🌐 Project: [VulnVault](https://github.com/amansingh4012/VULNVAULT--AI-Security-Scanner)

---

## 🙏 Acknowledgments

VulnVault is built on the shoulders of giants:

- **Inspiration**: Google DeepMind's [CodeMender](https://github.com/google-deepmind/code_mender) research
- **Security Tools**: 
  - [Bandit](https://github.com/PyCQA/bandit) - Python security linter
  - [Semgrep](https://semgrep.dev/) - Multi-language static analysis
  - [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Node.js dependency scanner
  - [pip-audit](https://github.com/pypa/pip-audit) - Python dependency scanner
- **AI Platform**: [Google Gemini AI](https://deepmind.google/technologies/gemini/) for intelligent fix suggestions
- **Frontend Frameworks**: React, Vite, TailwindCSS
- **Backend Framework**: FastAPI by Sebastián Ramírez
- **Authentication**: [Clerk](https://clerk.com/) for secure user management
- **Database**: MongoDB Atlas
- **Community**: Open-source contributors and security researchers

---

## 📞 Support

Need help? Here's how to get support:

### Bug Reports & Feature Requests

Open an issue on GitHub:
1. Go to [Issues](https://github.com/amansingh4012/VULNVAULT--AI-Security-Scanner/issues)
2. Click **New Issue**
3. Choose **Bug Report** or **Feature Request**
4. Fill in the template

### Questions

For general questions:
- Create a **Discussion** on GitHub
- Contact via GitHub profile

### Security Vulnerabilities

If you discover a security vulnerability in VulnVault:
1. **DO NOT** open a public issue
2. Email the author privately via GitHub
3. Include: Description, steps to reproduce, potential impact

---

## ⚠️ Disclaimer

**VulnVault is a security analysis tool designed for educational purposes and development use.**

- ✅ **Use for**: Security testing your own code, learning about vulnerabilities, improving code quality
- ❌ **Do NOT use for**: Malicious hacking, unauthorized security testing, attacking systems you don't own

**Important Notes:**
- Always perform thorough security audits before deploying to production
- VulnVault may produce false positives or miss certain vulnerabilities
- Use professional security tools and experts for critical applications
- The author is not responsible for misuse of this tool

**Data Privacy:**
- VulnVault stores scan results in MongoDB (metadata only)
- Source code is NOT stored in the database
- Email alerts contain vulnerability summaries, not full code
- Clerk handles authentication securely

---

<div align="center">

**Built with ❤️ by developers, for developers**

**Secure Code. Secure Future.**

[⬆ Back to Top](#vulnvault---ai-powered-security-scanner-️)

</div>
