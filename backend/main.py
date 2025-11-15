from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import tempfile
import os
import subprocess
import json
from dotenv import load_dotenv
import google.generativeai as genai
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from clerk_backend_api import Clerk
from pathlib import Path

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY")

# Initialize Clerk
clerk_client = Clerk(bearer_auth=CLERK_SECRET_KEY) if CLERK_SECRET_KEY and CLERK_SECRET_KEY != "your_clerk_secret_key_here" else None

# Initialize MongoDB using the database module
from app.database import init_database, get_projects_collection
init_database()

# Get projects collection reference
projects_collection = get_projects_collection()

# Email configuration
EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "false").lower() == "true"
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_RECIPIENT = os.getenv("EMAIL_RECIPIENT", "")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

# Configure Gemini AI
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Safety settings to allow security-related content
        safety_settings = [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
        ]
        
        # Using gemini-flash-lite-latest - fastest model (0.6s response time)
        generation_config = {
            "temperature": 0.5,
            "top_p": 0.9,
            "top_k": 20,
            "max_output_tokens": 800,
        }
        
        gemini_model = genai.GenerativeModel(
            'gemini-flash-lite-latest',
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        print("✅ Gemini AI configured (fast lite model with security content enabled)")
    except Exception as e:
        print(f"⚠️ Gemini AI configuration failed: {e}")
        gemini_model = None
else:
    print("⚠️ Gemini API key not configured")
    gemini_model = None

# Clerk authentication dependency
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Verify Clerk JWT token and return user info"""
    if not authorization:
        raise HTTPException(401, "Missing authorization header")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Invalid authorization header format")
    
    token = authorization.replace("Bearer ", "")
    
    if not clerk_client:
        raise HTTPException(503, "Authentication service not configured")
    
    try:
        # Decode JWT without verification to get user_id (for development)
        # In production, you should verify the JWT signature
        import jwt
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        # Debug: Print decoded token to see what fields are available
        print(f"🔍 Decoded JWT token fields: {decoded.keys()}")
        
        user_id = decoded.get("sub")
        
        if not user_id:
            raise HTTPException(401, "Invalid token - no user ID")
        
        # Get email from Clerk JWT token
        # Clerk stores email in different possible fields
        email = (
            decoded.get("email") or 
            decoded.get("email_address") or
            decoded.get("primary_email_address") or
            decoded.get("email_addresses", [{}])[0].get("email_address") if decoded.get("email_addresses") else None
        )
        
        # If still no email, try to get user from Clerk API
        if not email and clerk_client:
            try:
                user = clerk_client.users.get(user_id=user_id)
                if hasattr(user, 'email_addresses') and user.email_addresses:
                    email = user.email_addresses[0].email_address
            except Exception as e:
                print(f"⚠️ Could not fetch user from Clerk: {e}")
        
        print(f"✅ User authenticated - Email: {email or 'Not found'}")
        
        return {
            "user_id": user_id,
            "email": email,
            "first_name": decoded.get("first_name") or decoded.get("given_name"),
            "last_name": decoded.get("last_name") or decoded.get("family_name")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Auth error: {e}")
        raise HTTPException(401, "Invalid or expired token")

# Optional auth dependency - returns None if no token provided
async def get_current_user_optional(authorization: Optional[str] = Header(None)):
    """Get user if authenticated, otherwise return None"""
    if not authorization:
        return None
    try:
        return await get_current_user(authorization)
    except:
        return None

# Email notification function
def send_email_alert(project_name: str, critical_vulns: list, scan_summary: dict, user_email: Optional[str] = None):
    """Send email alert for critical vulnerabilities to user's email"""
    if not EMAIL_ENABLED:
        print("📧 Email alerts disabled")
        return False
    
    if not EMAIL_SENDER or not EMAIL_PASSWORD:
        print("⚠️ Email configuration incomplete")
        return False
    
    # Use user's email if authenticated, otherwise use default recipient
    recipient_email = user_email if user_email else EMAIL_RECIPIENT
    if not recipient_email:
        print("⚠️ No recipient email available")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'🚨 VulnVault Alert: {len(critical_vulns)} Critical Vulnerabilities Found in {project_name}'
        msg['From'] = EMAIL_SENDER
        msg['To'] = recipient_email
        
        # Create HTML email body
        html_body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <h2 style="color: #d32f2f; border-bottom: 3px solid #d32f2f; padding-bottom: 10px;">
                🚨 Security Alert: Critical Vulnerabilities Detected
              </h2>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Project: {project_name}</h3>
                <p><strong>Scan Date:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                <p><strong>Security Score:</strong> {scan_summary.get('security_score', 'N/A')}/100</p>
                
                <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #d32f2f; margin: 15px 0;">
                  <h4 style="margin-top: 0; color: #d32f2f;">⚠️ Critical Issues Found: {len(critical_vulns)}</h4>
                </div>
                
                <h4>Critical Vulnerabilities:</h4>
                <ul style="list-style-type: none; padding: 0;">
        """
        
        for vuln in critical_vulns[:5]:  # Show first 5 critical vulns
            html_body += f"""
                  <li style="background-color: #fff3e0; padding: 10px; margin: 10px 0; border-left: 3px solid #ff6f00;">
                    <strong>{vuln.get('type', 'Unknown')}</strong><br/>
                    <span style="color: #666;">{vuln.get('description', 'No description')}</span><br/>
                    <small style="color: #999;">Line {vuln.get('line_number', 'N/A')}</small>
                  </li>
            """
        
        if len(critical_vulns) > 5:
            html_body += f"<li style='padding: 10px;'><em>...and {len(critical_vulns) - 5} more critical issues</em></li>"
        
        html_body += """
                </ul>
                
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
                  <p style="margin: 0;"><strong>📊 Summary:</strong></p>
                  <ul style="margin: 10px 0;">
                    <li>HIGH: """ + str(scan_summary.get('high_issues', 0)) + """</li>
                    <li>MEDIUM: """ + str(scan_summary.get('medium_issues', 0)) + """</li>
                    <li>LOW: """ + str(scan_summary.get('low_issues', 0)) + """</li>
                  </ul>
                </div>
                
                <p style="margin-top: 20px;">
                  <a href="http://localhost:5174" style="display: inline-block; background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                    View Full Report in VulnVault
                  </a>
                </p>
              </div>
              
              <p style="color: #666; font-size: 12px; text-align: center;">
                This is an automated alert from VulnVault Security Scanner
              </p>
            </div>
          </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"📧 Email alert sent to {EMAIL_RECIPIENT}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

app = FastAPI(
    title="VulnVault API",
    description="AI-powered security vulnerability scanner",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (frontend) if they exist
static_dir = Path(__file__).parent / "static"
if static_dir.exists() and (static_dir / "index.html").exists():
    print(f"✅ Serving frontend from: {static_dir}")
    try:
        app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")
    except Exception as e:
        print(f"⚠️ Could not mount assets: {e}")
else:
    print(f"ℹ️ Static directory not found (this is OK for development - frontend runs separately on port 5173)")

# Include API routers
try:
    from app.api.projects import router as projects_router
    app.include_router(projects_router)
    print("✅ Projects API routes loaded")
except Exception as e:
    print(f"⚠️ Failed to load projects routes: {e}")

# Models
class Vulnerability(BaseModel):
    severity: str
    type: str
    line_number: int
    code: str
    description: str
    suggestion: Optional[str] = None

class ScanResult(BaseModel):
    security_score: int
    vulnerabilities: List[Vulnerability]
    total_issues: int
    summary: dict
    file_name: str

class ScanRequest(BaseModel):
    project_name: str

class ProjectScan(BaseModel):
    project_name: str
    scan_type: str  # "file_upload" or "github"
    security_score: int
    vulnerabilities: List[dict]
    total_issues: int
    summary: dict
    file_name: Optional[str] = None
    repo_url: Optional[str] = None
    files_scanned: Optional[int] = None
    created_at: str

# Helper function to run Bandit scanner
def run_bandit_scan(file_path: str) -> dict:
    """Run Bandit scanner and return parsed results"""
    try:
        result = subprocess.run(
            ['bandit', '-f', 'json', file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.stdout:
            return json.loads(result.stdout)
        return {"results": [], "metrics": {}}
    except Exception as e:
        print(f"Bandit scan error: {e}")
        return {"results": [], "metrics": {}}

# Helper function to run Semgrep scanner
def run_semgrep_scan(file_path: str, file_ext: str) -> dict:
    """Run Semgrep scanner for multi-language support"""
    try:
        # Auto-detect language or use specific config
        result = subprocess.run(
            ['semgrep', '--config=auto', '--json', file_path],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.stdout:
            data = json.loads(result.stdout)
            # Convert Semgrep format to Bandit-like format
            return convert_semgrep_to_bandit_format(data)
        return {"results": [], "metrics": {}}
    except FileNotFoundError:
        # Semgrep not installed, return empty results
        print(f"Semgrep not installed. Using basic pattern matching for {file_ext} files")
        return {"results": []}
    except Exception as e:
        print(f"Semgrep scan error: {e}")
        return {"results": []}

# Dependency scanning functions
def scan_npm_dependencies(package_json_path: str) -> list:
    """Scan npm dependencies for vulnerabilities using npm audit"""
    try:
        package_dir = os.path.dirname(package_json_path)
        
        # First, install dependencies (with force to handle version issues)
        print(f"📦 Installing npm dependencies...")
        install_result = subprocess.run(
            ['npm', 'install', '--package-lock-only', '--legacy-peer-deps', '--no-audit'],
            cwd=package_dir,
            capture_output=True,
            text=True,
            timeout=45,
            shell=True  # Use shell on Windows
        )
        
        if install_result.returncode != 0:
            print(f"⚠️ npm install failed: {install_result.stderr}")
            # Continue anyway - audit might still work with package.json alone
        
        # Run audit
        result = subprocess.run(
            ['npm', 'audit', '--json'],
            cwd=package_dir,
            capture_output=True,
            text=True,
            timeout=60,
            shell=True  # Use shell on Windows
        )
        
        if result.stdout:
            try:
                audit_data = json.loads(result.stdout)
                vulnerabilities = []
                
                # Parse npm audit v7+ format
                if 'vulnerabilities' in audit_data and isinstance(audit_data['vulnerabilities'], dict):
                    for pkg_name, vuln_info in audit_data['vulnerabilities'].items():
                        if not isinstance(vuln_info, dict):
                            continue
                            
                        severity = vuln_info.get('severity', 'unknown')
                        if isinstance(severity, str):
                            severity = severity.upper()
                        else:
                            severity = 'MEDIUM'
                        
                        # Map npm severity to our format
                        if severity == 'CRITICAL':
                            severity = 'HIGH'
                        
                        # Get description safely
                        description = 'Vulnerability in dependency'
                        via = vuln_info.get('via', [])
                        if isinstance(via, list) and len(via) > 0:
                            first_via = via[0]
                            if isinstance(first_via, dict):
                                description = first_via.get('title', description)
                        
                        # Get CVE safely
                        cve = ''
                        if isinstance(via, list) and len(via) > 0:
                            first_via = via[0]
                            if isinstance(first_via, dict):
                                cve = first_via.get('url', '')
                        
                        vulnerabilities.append({
                            'severity': severity,
                            'type': 'DEPENDENCY_VULNERABILITY',
                            'package': pkg_name,
                            'current_version': str(vuln_info.get('range', 'unknown')),
                            'description': description,
                            'suggestion': f"Update {pkg_name} to a patched version",
                            'cve': cve
                        })
                
                if vulnerabilities:
                    print(f"   Found {len(vulnerabilities)} npm vulnerabilities")
                return vulnerabilities
            except json.JSONDecodeError as e:
                print(f"⚠️ Failed to parse npm audit output: {e}")
                return []
            except Exception as e:
                print(f"⚠️ npm audit parsing error: {e}")
                return []
    except FileNotFoundError:
        print("npm not found. Skipping npm dependency scan")
    except Exception as e:
        print(f"⚠️ npm audit error: {e}")
    
    return []

def scan_python_dependencies(requirements_path: str) -> list:
    """Scan Python dependencies for vulnerabilities using pip-audit"""
    try:
        result = subprocess.run(
            ['pip-audit', '-r', requirements_path, '--format', 'json'],
            capture_output=True,
            text=True,
            timeout=120,
            shell=True  # Use shell on Windows
        )
        
        if result.stdout:
            audit_data = json.loads(result.stdout)
            vulnerabilities = []
            
            for vuln in audit_data.get('dependencies', []):
                for issue in vuln.get('vulns', []):
                    vulnerabilities.append({
                        'severity': 'HIGH',  # pip-audit doesn't provide severity
                        'type': 'DEPENDENCY_VULNERABILITY',
                        'package': vuln.get('name', 'unknown'),
                        'current_version': vuln.get('version', 'unknown'),
                        'description': issue.get('description', 'Vulnerability in Python dependency'),
                        'suggestion': f"Update to version {issue.get('fix_versions', ['latest'])[0] if issue.get('fix_versions') else 'latest'}",
                        'cve': issue.get('id', '')
                    })
            
            return vulnerabilities
    except FileNotFoundError:
        print("pip-audit not found. Install with: pip install pip-audit")
    except Exception as e:
        print(f"pip-audit error: {e}")
    
    return []

def scan_dependencies_in_directory(directory: str) -> list:
    """Scan all dependency files in a directory"""
    from pathlib import Path
    all_vulnerabilities = []
    
    # Check for package.json (Node.js)
    package_json = Path(directory) / 'package.json'
    if package_json.exists():
        print(f"📦 Scanning npm dependencies in {package_json}")
        npm_vulns = scan_npm_dependencies(str(package_json))
        all_vulnerabilities.extend(npm_vulns)
        print(f"   Found {len(npm_vulns)} npm vulnerabilities")
    
    # Check for requirements.txt (Python)
    requirements_txt = Path(directory) / 'requirements.txt'
    if requirements_txt.exists():
        print(f"📦 Scanning Python dependencies in {requirements_txt}")
        pip_vulns = scan_python_dependencies(str(requirements_txt))
        all_vulnerabilities.extend(pip_vulns)
        print(f"   Found {len(pip_vulns)} Python vulnerabilities")
    
    return all_vulnerabilities

# Secret detection patterns
SECRET_PATTERNS = {
    'AWS_ACCESS_KEY': {
        'pattern': r'AKIA[0-9A-Z]{16}',
        'description': 'AWS Access Key ID detected',
        'severity': 'HIGH'
    },
    'AWS_SECRET_KEY': {
        'pattern': r'aws_secret_access_key\s*=\s*["\']([A-Za-z0-9/+=]{40})["\']',
        'description': 'AWS Secret Access Key detected',
        'severity': 'HIGH'
    },
    'GITHUB_TOKEN': {
        'pattern': r'ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}',
        'description': 'GitHub Personal Access Token detected',
        'severity': 'HIGH'
    },
    'GOOGLE_API_KEY': {
        'pattern': r'AIza[0-9A-Za-z_-]{35}',
        'description': 'Google API Key detected',
        'severity': 'HIGH'
    },
    'SLACK_TOKEN': {
        'pattern': r'xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24,32}',
        'description': 'Slack Token detected',
        'severity': 'HIGH'
    },
    'PRIVATE_KEY': {
        'pattern': r'-----BEGIN (RSA|DSA|EC|OPENSSH|PGP) PRIVATE KEY-----',
        'description': 'Private Key detected',
        'severity': 'HIGH'
    },
    'STRIPE_KEY': {
        'pattern': r'sk_live_[0-9a-zA-Z]{24,}',
        'description': 'Stripe Secret Key detected',
        'severity': 'HIGH'
    },
    'AZURE_KEY': {
        'pattern': r'[0-9a-zA-Z]{88}==',
        'description': 'Possible Azure Storage Key detected',
        'severity': 'MEDIUM'
    },
    'JWT_TOKEN': {
        'pattern': r'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}',
        'description': 'JWT Token detected',
        'severity': 'MEDIUM'
    },
    'PASSWORD_IN_URL': {
        'pattern': r'[a-zA-Z]{3,10}://[^/\s:@]{3,20}:[^/\s:@]{3,20}@.{1,100}',
        'description': 'Password in URL detected',
        'severity': 'HIGH'
    },
    'GENERIC_API_KEY': {
        'pattern': r'["\']?[aA][pP][iI]_?[kK][eE][yY]["\']?\s*[:=]\s*["\']([A-Za-z0-9_-]{20,})["\']',
        'description': 'Generic API Key detected',
        'severity': 'MEDIUM'
    },
    'GENERIC_SECRET': {
        'pattern': r'["\']?[sS][eE][cC][rR][eE][tT]["\']?\s*[:=]\s*["\']([A-Za-z0-9_-]{10,})["\']',
        'description': 'Generic Secret detected',
        'severity': 'MEDIUM'
    },
    'DATABASE_URL': {
        'pattern': r'(postgres|mysql|mongodb)://[^\\s]+:[^\\s]+@[^\\s]+',
        'description': 'Database connection string with credentials detected',
        'severity': 'HIGH'
    }
}

def scan_secrets_in_file(file_path: str) -> list:
    """Scan a file for hardcoded secrets and sensitive data"""
    import re
    secrets_found = []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.split('\n')
            
            for secret_type, config in SECRET_PATTERNS.items():
                pattern = config['pattern']
                matches = re.finditer(pattern, content, re.MULTILINE)
                
                for match in matches:
                    # Find line number
                    line_number = content[:match.start()].count('\n') + 1
                    
                    # Get the line content
                    if line_number <= len(lines):
                        line_content = lines[line_number - 1].strip()
                    else:
                        line_content = match.group(0)
                    
                    # Mask the secret (show first 4 and last 4 chars)
                    secret_value = match.group(0)
                    if len(secret_value) > 8:
                        masked_value = secret_value[:4] + '*' * (len(secret_value) - 8) + secret_value[-4:]
                    else:
                        masked_value = '*' * len(secret_value)
                    
                    secrets_found.append({
                        'severity': config['severity'],
                        'type': secret_type,
                        'line_number': line_number,
                        'code': line_content[:200],  # Limit line length
                        'description': config['description'],
                        'suggestion': f'Move this secret to environment variables or a secure vault. Never commit secrets to version control.',
                        'secret_type': secret_type,
                        'masked_value': masked_value
                    })
    
    except Exception as e:
        print(f"Error scanning file for secrets: {e}")
    
    return secrets_found

def scan_secrets_in_directory(directory: str) -> list:
    """Scan all files in a directory for secrets"""
    from pathlib import Path
    all_secrets = []
    
    # File extensions to scan
    scannable_extensions = ('.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rb', '.php', 
                           '.env', '.config', '.yml', '.yaml', '.json', '.xml', '.properties',
                           '.sh', '.bash', '.ps1', '.txt', '.md')
    
    # Directories to skip
    skip_dirs = {'node_modules', '.git', 'venv', '__pycache__', 'dist', 'build', '.venv'}
    
    for file_path in Path(directory).rglob('*'):
        # Skip directories and files in skip list
        if any(skip_dir in file_path.parts for skip_dir in skip_dirs):
            continue
            
        if file_path.is_file() and file_path.suffix.lower() in scannable_extensions:
            secrets = scan_secrets_in_file(str(file_path))
            
            # Add relative file path to each secret
            for secret in secrets:
                secret['file'] = str(file_path.relative_to(directory))
            
            all_secrets.extend(secrets)
    
    return all_secrets


# Convert Semgrep results to Bandit format
def convert_semgrep_to_bandit_format(semgrep_data: dict) -> dict:
    """Convert Semgrep JSON to Bandit-compatible format"""
    results = []
    
    for finding in semgrep_data.get('results', []):
        # Map Semgrep severity to Bandit severity
        severity_map = {
            'ERROR': 'HIGH',
            'WARNING': 'MEDIUM',
            'INFO': 'LOW'
        }
        
        semgrep_severity = finding.get('extra', {}).get('severity', 'INFO')
        
        result = {
            'issue_severity': severity_map.get(semgrep_severity, 'MEDIUM'),
            'issue_confidence': 'HIGH',
            'test_id': finding.get('check_id', 'semgrep-finding'),
            'issue_text': finding.get('extra', {}).get('message', 'Security issue detected'),
            'line_number': finding.get('start', {}).get('line', 0),
            'code': finding.get('extra', {}).get('lines', ''),
            'more_info': finding.get('extra', {}).get('metadata', {}).get('references', [])
        }
        results.append(result)
    
    return {'results': results, 'metrics': {}}

# Helper function to calculate security score
def calculate_security_score(vulnerabilities: List[dict]) -> int:
    """Calculate security score (0-100) based on vulnerabilities"""
    if not vulnerabilities:
        return 100
    
    # Penalty points by severity
    penalty_map = {
        "HIGH": 15,
        "MEDIUM": 8,
        "LOW": 3
    }
    
    total_penalty = sum(penalty_map.get(v.get('severity', 'LOW'), 3) for v in vulnerabilities)
    score = max(0, 100 - total_penalty)
    return score

# Helper function to generate fix suggestions
def get_fix_suggestion(issue_type: str, description: str) -> str:
    """Generate fix suggestions based on vulnerability type"""
    suggestions = {
        "B105": "Use environment variables or secure vaults for sensitive data instead of hardcoding",
        "B608": "Use parameterized queries with placeholders (?) to prevent SQL injection",
        "B605": "Avoid os.system(). Use subprocess.run() with a list of arguments instead",
        "B301": "Avoid pickle for untrusted data. Use JSON or secure serialization formats",
        "B602": "Set shell=False in subprocess calls and pass arguments as a list",
        "B324": "Use SHA-256 or better: hashlib.sha256(data).hexdigest()",
        "B102": "Avoid exec(). Use safer alternatives or validate/sandbox the code",
        "B101": "Don't use assert for security checks. Use proper if/else validation",
        "B311": "Use secrets module for cryptographic randomness: secrets.randbelow()",
        "B403": "Avoid pickle with untrusted data. Consider JSON or other safe formats",
        "B404": "Use subprocess securely with shell=False and validate all inputs"
    }
    return suggestions.get(issue_type, "Review and fix this security issue according to OWASP guidelines")

# Routes
@app.get("/")
async def root():
    return {
        "message": "VulnVault API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Serve frontend index.html for all non-API routes (SPA support)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serve frontend files for non-API routes (only in production)"""
    # Skip API routes and health check
    if (full_path.startswith("scan/") or 
        full_path.startswith("ai/") or 
        full_path.startswith("projects/") or
        full_path == "health" or
        full_path.startswith("docs") or
        full_path.startswith("openapi.json")):
        raise HTTPException(404, "API endpoint not found")
    
    static_dir = Path(__file__).parent / "static"
    index_file = static_dir / "index.html"
    
    # In development, frontend runs separately on port 5173
    if index_file.exists():
        return FileResponse(index_file)
    else:
        # Development mode - return helpful message
        return {
            "message": "VulnVault API is running",
            "frontend": "Run 'npm run dev' in frontend directory for development",
            "frontend_url": "http://localhost:5173",
            "api_docs": f"{API_URL if 'API_URL' in dir() else 'http://localhost:8000'}/docs"
        }

@app.post("/scan/upload", response_model=ScanResult)
async def scan_uploaded_file(
    file: UploadFile = File(...), 
    project_name: str = Form(...),
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Scan uploaded source code file or ZIP archive for vulnerabilities
    Supports: .py, .js, .jsx, .ts, .tsx, .cpp, .c, .java, .go, .rb, .php, .zip
    Optional: Include Authorization header with Clerk JWT for personalized email alerts
    """
    import zipfile
    from pathlib import Path
    
    # Validate project name
    if not project_name or not project_name.strip():
        raise HTTPException(400, "Project name is required")
    
    # Supported file extensions
    SUPPORTED_EXTENSIONS = ('.py', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.hpp', 
                           '.java', '.go', '.rb', '.php', '.cs', '.swift', '.kt', '.rs')
    
    filename_lower = file.filename.lower()
    
    # Handle ZIP files
    if filename_lower.endswith('.zip'):
        return await scan_zip_file(file, project_name, user)
    
    # Check if file type is supported
    if not filename_lower.endswith(SUPPORTED_EXTENSIONS):
        raise HTTPException(400, f"Unsupported file type. Supported: {', '.join(SUPPORTED_EXTENSIONS)}, .zip")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.py', mode='wb') as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Determine scanner based on file type
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        # Run appropriate scanner
        if file_ext == '.py':
            scan_results = run_bandit_scan(tmp_path)
        else:
            # Use Semgrep for non-Python files
            scan_results = run_semgrep_scan(tmp_path, file_ext)
        
        bandit_results = scan_results
        
        # Parse vulnerabilities
        vulnerabilities = []
        summary = {"high": 0, "medium": 0, "low": 0}
        
        for result in bandit_results.get('results', []):
            severity = result.get('issue_severity', 'UNKNOWN').upper()
            issue_type = result.get('test_id', 'UNKNOWN')
            
            vuln = {
                "severity": severity,
                "type": issue_type,
                "line_number": result.get('line_number', 0),
                "code": result.get('code', '').strip(),
                "description": result.get('issue_text', ''),
                "suggestion": get_fix_suggestion(issue_type, result.get('issue_text', ''))
            }
            vulnerabilities.append(vuln)
            
            # Update summary
            severity_lower = severity.lower()
            if severity_lower in summary:
                summary[severity_lower] += 1
        
        # Scan for secrets
        print(f"🔍 Scanning for hardcoded secrets...")
        secrets = scan_secrets_in_file(tmp_path)
        for secret in secrets:
            vulnerabilities.append(secret)
            severity_lower = secret.get('severity', 'UNKNOWN').lower()
            if severity_lower in summary:
                summary[severity_lower] += 1
        
        if secrets:
            print(f"   Found {len(secrets)} hardcoded secrets")
        
        # Calculate security score
        security_score = calculate_security_score(vulnerabilities)
        
        result = {
            "security_score": security_score,
            "vulnerabilities": vulnerabilities,
            "total_issues": len(vulnerabilities),
            "summary": summary,
            "file_name": file.filename
        }
        
        # Save to MongoDB
        if projects_collection is not None:
            try:
                project_data = {
                    "project_name": project_name.strip(),
                    "scan_type": "file_upload",
                    "security_score": security_score,
                    "vulnerabilities": vulnerabilities,
                    "total_issues": len(vulnerabilities),
                    "summary": summary,
                    "file_name": file.filename,
                    "created_at": datetime.utcnow().isoformat()
                }
                projects_collection.insert_one(project_data)
                print(f"✅ Saved project: {project_name}")
            except Exception as e:
                print(f"⚠️ Failed to save to database: {e}")
        
        # Send email alert for critical vulnerabilities
        critical_vulns = [v for v in vulnerabilities if v.get('severity', '').upper() in ['HIGH', 'CRITICAL']]
        if critical_vulns:
            print(f"🚨 Found {len(critical_vulns)} critical vulnerabilities")
            user_email = user.get('email') if user else None
            print(f"📧 User object: {user}")
            print(f"📧 User email for alert: {user_email}")
            email_sent = send_email_alert(
                project_name=project_name.strip(),
                critical_vulns=critical_vulns,
                scan_summary={
                    'security_score': security_score,
                    'high_issues': summary.get('high', 0),
                    'medium_issues': summary.get('medium', 0),
                    'low_issues': summary.get('low', 0)
                },
                user_email=user_email
            )
            if email_sent:
                recipient = user_email if user_email else EMAIL_RECIPIENT
                print(f"✅ Email alert sent to {recipient} for {project_name}")
        
        return result
    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

# Helper function to scan ZIP files
async def scan_zip_file(file: UploadFile, project_name: str = "", user: Optional[dict] = None) -> dict:
    """Extract and scan all files in a ZIP archive"""
    import zipfile
    import shutil
    import stat
    from pathlib import Path
    
    # Create temp directory for extraction
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save uploaded ZIP
        with open(zip_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        
        # Extract ZIP
        extract_dir = os.path.join(temp_dir, 'extracted')
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        # Find all scannable files
        scannable_extensions = ('.py', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h',
                               '.java', '.go', '.rb', '.php', '.cs', '.swift', '.kt')
        
        all_files = []
        for ext in scannable_extensions:
            all_files.extend(Path(extract_dir).rglob(f"*{ext}"))
        
        if not all_files:
            raise HTTPException(404, "No scannable files found in ZIP archive")
        
        # Scan all files
        all_vulnerabilities = []
        summary = {"high": 0, "medium": 0, "low": 0}
        files_scanned = 0
        
        for file_path in all_files[:50]:  # Limit to 50 files
            file_ext = file_path.suffix.lower()
            
            # Choose scanner
            if file_ext == '.py':
                scan_results = run_bandit_scan(str(file_path))
            else:
                scan_results = run_semgrep_scan(str(file_path), file_ext)
            
            # Process results
            for result in scan_results.get('results', []):
                severity = result.get('issue_severity', 'UNKNOWN').upper()
                issue_type = result.get('test_id', 'UNKNOWN')
                
                rel_path = str(file_path.relative_to(extract_dir))
                
                vuln = {
                    "severity": severity,
                    "type": issue_type,
                    "line_number": result.get('line_number', 0),
                    "code": result.get('code', '').strip(),
                    "description": result.get('issue_text', ''),
                    "suggestion": get_fix_suggestion(issue_type, result.get('issue_text', '')),
                    "file": rel_path
                }
                all_vulnerabilities.append(vuln)
                
                severity_lower = severity.lower()
                if severity_lower in summary:
                    summary[severity_lower] += 1
            
            files_scanned += 1
        
        # Calculate security score
        security_score = calculate_security_score(all_vulnerabilities)
        
        return {
            "security_score": security_score,
            "vulnerabilities": all_vulnerabilities,
            "total_issues": len(all_vulnerabilities),
            "summary": summary,
            "file_name": file.filename,
            "files_scanned": files_scanned,
            "archive_type": "ZIP"
        }
        
    finally:
        # Cleanup with Windows file permission handling
        if os.path.exists(temp_dir):
            def handle_remove_readonly(func, path, exc):
                """Error handler for Windows readonly file removal"""
                os.chmod(path, stat.S_IWRITE)
                func(path)
            
            shutil.rmtree(temp_dir, onerror=handle_remove_readonly)

@app.post("/scan/github")
async def scan_github_repo(
    repo_url: str, 
    project_name: str = "",
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Scan a GitHub repository for vulnerabilities
    Optional: Include Authorization header with Clerk JWT for personalized email alerts
    """
    try:
        import git
        import shutil
        import stat
        from pathlib import Path
        
        # Validate project name
        if not project_name or not project_name.strip():
            raise HTTPException(400, "Project name is required")
        
        # Validate GitHub URL
        if not ("github.com" in repo_url):
            raise HTTPException(400, "Invalid GitHub URL")
        
        # Create temporary directory for cloning
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Clone repository
            print(f"Cloning {repo_url}...")
            git.Repo.clone_from(repo_url, temp_dir, depth=1)
            
            # Find all scannable files (multiple languages)
            scannable_extensions = ('.py', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h',
                                   '.java', '.go', '.rb', '.php', '.cs', '.swift', '.kt', '.rs')
            
            all_files = []
            for ext in scannable_extensions:
                all_files.extend(Path(temp_dir).rglob(f"*{ext}"))
            
            if not all_files:
                raise HTTPException(404, "No scannable code files found in repository")
            
            # Scan all files
            all_vulnerabilities = []
            summary = {"high": 0, "medium": 0, "low": 0}
            
            for code_file in all_files[:30]:  # Limit to 30 files for performance
                file_ext = code_file.suffix.lower()
                
                # Choose scanner based on file type
                if file_ext == '.py':
                    scan_results = run_bandit_scan(str(code_file))
                else:
                    scan_results = run_semgrep_scan(str(code_file), file_ext)
                
                for result in scan_results.get('results', []):
                    severity = result.get('issue_severity', 'UNKNOWN').upper()
                    issue_type = result.get('test_id', 'UNKNOWN')
                    
                    # Get relative path for better display
                    rel_path = str(code_file.relative_to(temp_dir))
                    
                    vuln = {
                        "severity": severity,
                        "type": issue_type,
                        "line_number": result.get('line_number', 0),
                        "code": result.get('code', '').strip(),
                        "description": result.get('issue_text', ''),
                        "suggestion": get_fix_suggestion(issue_type, result.get('issue_text', '')),
                        "file": rel_path
                    }
                    all_vulnerabilities.append(vuln)
                    
                    severity_lower = severity.lower()
                    if severity_lower in summary:
                        summary[severity_lower] += 1
            
            # Scan dependencies in the repository
            print(f"📦 Scanning dependencies in repository...")
            dependency_vulnerabilities = scan_dependencies_in_directory(temp_dir)
            
            # Add dependency vulnerabilities to results
            for dep_vuln in dependency_vulnerabilities:
                all_vulnerabilities.append(dep_vuln)
                severity_lower = dep_vuln.get('severity', 'UNKNOWN').lower()
                if severity_lower in summary:
                    summary[severity_lower] += 1
            
            # Scan for secrets in the repository
            print(f"🔐 Scanning for hardcoded secrets...")
            secret_vulnerabilities = scan_secrets_in_directory(temp_dir)
            
            for secret in secret_vulnerabilities:
                all_vulnerabilities.append(secret)
                severity_lower = secret.get('severity', 'UNKNOWN').lower()
                if severity_lower in summary:
                    summary[severity_lower] += 1
            
            if secret_vulnerabilities:
                print(f"   Found {len(secret_vulnerabilities)} hardcoded secrets")
            
            # Calculate security score
            security_score = calculate_security_score(all_vulnerabilities)
            
            result = {
                "security_score": security_score,
                "vulnerabilities": all_vulnerabilities,
                "total_issues": len(all_vulnerabilities),
                "summary": summary,
                "repo_url": repo_url,
                "files_scanned": len(all_files)
            }
            
            # Save to MongoDB
            if projects_collection is not None:
                try:
                    project_data = {
                        "project_name": project_name.strip(),
                        "scan_type": "github",
                        "security_score": security_score,
                        "vulnerabilities": all_vulnerabilities,
                        "total_issues": len(all_vulnerabilities),
                        "summary": summary,
                        "repo_url": repo_url,
                        "files_scanned": len(all_files),
                        "created_at": datetime.utcnow().isoformat()
                    }
                    projects_collection.insert_one(project_data)
                    print(f"✅ Saved GitHub scan: {project_name}")
                except Exception as e:
                    print(f"⚠️ Failed to save to database: {e}")
            
            # Send email alert for critical vulnerabilities
            critical_vulns = [v for v in all_vulnerabilities if v.get('severity', '').upper() in ['HIGH', 'CRITICAL']]
            if critical_vulns:
                print(f"🚨 Found {len(critical_vulns)} critical vulnerabilities in GitHub repo")
                user_email = user.get('email') if user else None
                email_sent = send_email_alert(
                    project_name=project_name.strip(),
                    critical_vulns=critical_vulns,
                    scan_summary={
                        'security_score': security_score,
                        'high_issues': summary.get('high', 0),
                        'medium_issues': summary.get('medium', 0),
                        'low_issues': summary.get('low', 0)
                    },
                    user_email=user_email
                )
                if email_sent:
                    recipient = user_email if user_email else EMAIL_RECIPIENT
                    print(f"✅ Email alert sent to {recipient} for {project_name}")
            
            return result
            
        finally:
            # Cleanup cloned repo with proper Windows file permission handling
            if os.path.exists(temp_dir):
                def handle_remove_readonly(func, path, exc):
                    """Error handler for Windows readonly file removal"""
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                
                shutil.rmtree(temp_dir, onerror=handle_remove_readonly)
                
    except git.GitCommandError as e:
        raise HTTPException(400, f"Failed to clone repository: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Scan failed: {str(e)}")

@app.post("/scan/dependencies")
async def scan_project_dependencies(
    file: UploadFile = File(...), 
    project_name: str = Form(...),
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Scan project dependencies for known vulnerabilities
    Supports: package.json (npm), requirements.txt (pip), or ZIP files with projects
    Optional: Include Authorization header with Clerk JWT for personalized email alerts
    """
    import zipfile
    from pathlib import Path
    
    # Validate project name
    if not project_name or not project_name.strip():
        raise HTTPException(400, "Project name is required")
    
    filename_lower = file.filename.lower()
    
    # Check if it's a supported file
    is_zip = filename_lower.endswith('.zip')
    is_package_json = filename_lower == 'package.json' or filename_lower.endswith('package.json')
    is_requirements = filename_lower == 'requirements.txt' or filename_lower.endswith('requirements.txt')
    
    if not (is_zip or is_package_json or is_requirements):
        raise HTTPException(400, "Please upload package.json, requirements.txt, or a ZIP file containing your project")
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    
    try:
        dependency_vulnerabilities = []
        
        if is_zip:
            # Handle ZIP file
            zip_path = os.path.join(temp_dir, 'project.zip')
            with open(zip_path, 'wb') as f:
                content = await file.read()
                f.write(content)
            
            # Extract ZIP
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            
            # Scan for dependencies
            print(f"🔍 Scanning dependencies in ZIP file")
            dependency_vulnerabilities = scan_dependencies_in_directory(temp_dir)
            
        elif is_package_json:
            # Handle package.json directly
            package_path = os.path.join(temp_dir, 'package.json')
            with open(package_path, 'wb') as f:
                content = await file.read()
                f.write(content)
            
            print(f"📦 Scanning npm dependencies in package.json")
            dependency_vulnerabilities = scan_npm_dependencies(package_path)
            
        elif is_requirements:
            # Handle requirements.txt directly
            requirements_path = os.path.join(temp_dir, 'requirements.txt')
            with open(requirements_path, 'wb') as f:
                content = await file.read()
                f.write(content)
            
            print(f"🐍 Scanning Python dependencies in requirements.txt")
            dependency_vulnerabilities = scan_python_dependencies(requirements_path)
        
        # Calculate summary
        summary = {"high": 0, "medium": 0, "low": 0}
        for vuln in dependency_vulnerabilities:
            severity = vuln.get('severity', 'UNKNOWN').lower()
            if severity in summary:
                summary[severity] += 1
        
        # Calculate security score
        security_score = max(0, 100 - (summary['high'] * 10 + summary['medium'] * 5 + summary['low'] * 2))
        
        result = {
            "security_score": security_score,
            "vulnerabilities": dependency_vulnerabilities,
            "total_issues": len(dependency_vulnerabilities),
            "summary": summary,
            "scan_type": "dependencies"
        }
        
        # Save to MongoDB
        if projects_collection is not None:
            try:
                project_data = {
                    "project_name": project_name.strip(),
                    "scan_type": "dependencies",
                    "security_score": security_score,
                    "vulnerabilities": dependency_vulnerabilities,
                    "total_issues": len(dependency_vulnerabilities),
                    "summary": summary,
                    "created_at": datetime.utcnow().isoformat()
                }
                projects_collection.insert_one(project_data)
                print(f"✅ Saved dependency scan: {project_name}")
            except Exception as e:
                print(f"⚠️ Failed to save to database: {e}")
        
        # Send email alert for critical vulnerabilities
        critical_vulns = [v for v in dependency_vulnerabilities if v.get('severity', '').upper() in ['HIGH', 'CRITICAL']]
        if critical_vulns:
            print(f"🚨 Found {len(critical_vulns)} critical dependency vulnerabilities")
            user_email = user.get('email') if user else None
            email_sent = send_email_alert(
                project_name=project_name.strip(),
                critical_vulns=critical_vulns,
                scan_summary={
                    'security_score': security_score,
                    'high_issues': summary.get('high', 0),
                    'medium_issues': summary.get('medium', 0),
                    'low_issues': summary.get('low', 0)
                },
                user_email=user_email
            )
            if email_sent:
                recipient = user_email if user_email else EMAIL_RECIPIENT
                print(f"✅ Email alert sent to {recipient} for {project_name}")
        
        return result
        
    finally:
        # Cleanup
        import shutil
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

@app.post("/ai/fix-suggestion")
async def get_ai_fix_suggestion(vulnerability: dict):
    """Get AI-powered fix suggestion for a vulnerability using Gemini"""
    if gemini_model is None:
        raise HTTPException(503, "Gemini AI not configured. Please add GEMINI_API_KEY to .env file")
    
    try:
        print(f"🔍 Received vulnerability data: {vulnerability}")
        
        # Simple, direct prompt for educational security fix
        prompt = f"""As a code security educator, explain how to fix this vulnerability:

Type: {vulnerability.get('type', 'Unknown')}
Issue: {vulnerability.get('description', 'No description')}
Vulnerable code: {vulnerability.get('code', 'N/A')[:150]}

Provide:
1. Why it's risky (2 sentences)
2. Fixed code example
3. Prevention tip

Be brief and educational."""

        # Generate response with timeout
        print(f"🤖 Sending prompt to Gemini (fast lite model)...")
        import asyncio
        
        # Run generate_content in a thread with timeout
        loop = asyncio.get_event_loop()
        response = await asyncio.wait_for(
            loop.run_in_executor(None, gemini_model.generate_content, prompt),
            timeout=15.0  # 15 second timeout for fast model
        )
        
        print(f"✅ Received AI response (finish_reason: {response.candidates[0].finish_reason})")
        
        # Check if response was blocked
        if not response.text:
            print(f"⚠️ Empty response - finish_reason: {response.candidates[0].finish_reason}")
            raise HTTPException(500, "AI response was blocked by safety filters. Please try a different vulnerability.")
        
        return {
            "fix_suggestion": response.text,
            "vulnerability_type": vulnerability.get('type'),
            "severity": vulnerability.get('severity'),
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except asyncio.TimeoutError:
        print(f"❌ AI timeout after 15 seconds")
        raise HTTPException(504, "Gemini AI took too long to respond. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ AI Error: {str(e)}")
        print(f"📋 Traceback: {traceback.format_exc()}")
        raise HTTPException(500, f"Failed to generate AI suggestion: {str(e)}")

@app.get("/projects/{project_name}/pdf")
async def generate_pdf_report(project_name: str):
    """Generate PDF report for a project"""
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from io import BytesIO
    from fastapi.responses import StreamingResponse
    
    if projects_collection is None:
        raise HTTPException(503, "Database not available")
    
    try:
        # Fetch project
        project = projects_collection.find_one({"project_name": project_name}, {"_id": 0})
        if not project:
            raise HTTPException(404, f"Project '{project_name}' not found")
        
        # Create PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12
        )
        
        # Title
        story.append(Paragraph(f"VulnVault Security Report", title_style))
        story.append(Paragraph(f"Project: {project['project_name']}", styles['Heading2']))
        story.append(Spacer(1, 0.3*inch))
        
        # Summary Section
        story.append(Paragraph("Executive Summary", heading_style))
        summary_data = [
            ['Metric', 'Value'],
            ['Security Score', f"{project['security_score']}/100"],
            ['Total Issues', str(project['total_issues'])],
            ['High Severity', str(project['summary'].get('high', 0))],
            ['Medium Severity', str(project['summary'].get('medium', 0))],
            ['Low Severity', str(project['summary'].get('low', 0))],
            ['Scan Type', project['scan_type'].replace('_', ' ').title()],
            ['Files Scanned', str(project.get('files_scanned', 1))],
            ['Scan Date', project['created_at'][:10]]
        ]
        
        if project.get('file_name'):
            summary_data.append(['File Name', project['file_name']])
        if project.get('repo_url'):
            summary_data.append(['Repository', project['repo_url']])
        
        summary_table = Table(summary_data, colWidths=[2.5*inch, 4*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Vulnerabilities Section
        if project['vulnerabilities']:
            story.append(Paragraph(f"Vulnerabilities Detected ({len(project['vulnerabilities'])})", heading_style))
            story.append(Spacer(1, 0.2*inch))
            
            for idx, vuln in enumerate(project['vulnerabilities'][:50], 1):  # Limit to 50 for PDF size
                # Severity color
                sev_color = colors.red if vuln['severity'] == 'HIGH' else \
                           colors.orange if vuln['severity'] == 'MEDIUM' else colors.blue
                
                vuln_data = [
                    ['#', str(idx)],
                    ['Severity', vuln['severity']],
                    ['Type', vuln['type']],
                    ['Line', str(vuln.get('line_number', 'N/A'))],
                    ['File', vuln.get('file', 'N/A')],
                    ['Description', vuln.get('description', 'No description')[:100]],
                ]
                
                vuln_table = Table(vuln_data, colWidths=[1*inch, 5.5*inch])
                vuln_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                    ('BACKGROUND', (0, 1), (0, 1), sev_color),
                    ('TEXTCOLOR', (0, 1), (0, 1), colors.whitesmoke),
                    ('FONTNAME', (0, 1), (0, 1), 'Helvetica-Bold'),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                story.append(vuln_table)
                story.append(Spacer(1, 0.15*inch))
        else:
            story.append(Paragraph("✅ No vulnerabilities detected!", styles['Normal']))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph(
            "Generated by VulnVault Security Scanner | " + datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
            ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
        ))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        # Return as downloadable file
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={project_name.replace(' ', '_')}_report.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to generate PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
