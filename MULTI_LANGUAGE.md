# Multi-Language Support Guide

## 🌍 Supported Languages

VulnVault now supports multiple programming languages!

### ✅ Fully Supported Languages

| Language | Extensions | Scanner | Detection Level |
|----------|-----------|---------|-----------------|
| **Python** | `.py` | Bandit | Excellent (10+ checks) |
| **JavaScript** | `.js`, `.jsx` | Semgrep | Very Good |
| **TypeScript** | `.ts`, `.tsx` | Semgrep | Very Good |
| **C/C++** | `.c`, `.cpp`, `.h`, `.hpp` | Semgrep | Good |
| **Java** | `.java` | Semgrep | Good |
| **Go** | `.go` | Semgrep | Good |
| **Ruby** | `.rb` | Semgrep | Good |
| **PHP** | `.php` | Semgrep | Good |
| **C#** | `.cs` | Semgrep | Good |
| **Swift** | `.swift` | Semgrep | Moderate |
| **Kotlin** | `.kt` | Semgrep | Moderate |
| **Rust** | `.rs` | Semgrep | Moderate |

---

## 📦 ZIP Archive Support

You can now upload **ZIP files** containing entire projects!

### How It Works:
1. Upload a `.zip` file
2. VulnVault extracts all files
3. Scans up to 50 files automatically
4. Returns aggregated results

### What Gets Scanned:
- All supported file types (see above)
- Recursive directory scanning
- Ignores non-code files automatically

---

## 🔍 Scanner Details

### Bandit (Python Only)
- **Best for**: Python security issues
- **Checks**: 40+ security tests
- **Speed**: Very fast (1-3 seconds)
- **Accuracy**: High (few false positives)

### Semgrep (Multi-Language)
- **Best for**: All other languages
- **Checks**: 1000+ security rules
- **Speed**: Moderate (5-30 seconds)
- **Accuracy**: High

---

## 🚀 Installation

### Install Semgrep (Optional but Recommended)

For non-Python file scanning:

```bash
# Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# Install Semgrep
pip install semgrep

# Verify installation
semgrep --version
```

**Note**: If Semgrep is not installed, non-Python files will show limited results.

---

## 🧪 Testing Multi-Language Support

### Test 1: JavaScript File

Create `test.js`:
```javascript
// Hardcoded credentials
const API_KEY = "sk-1234567890";
const password = "admin123";

// SQL Injection vulnerability
function getUser(userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    db.query(query);
}

// XSS vulnerability
function renderHTML(userInput) {
    document.body.innerHTML = userInput;
}

// Command injection
const exec = require('child_process').exec;
exec('ping ' + userIP);
```

Upload to VulnVault and scan!

### Test 2: C++ File

Create `test.cpp`:
```cpp
#include <cstring>
#include <iostream>

// Buffer overflow vulnerability
void copyData(char* input) {
    char buffer[10];
    strcpy(buffer, input);  // Unsafe!
}

// SQL injection
void getUser(std::string userId) {
    std::string query = "SELECT * FROM users WHERE id = " + userId;
}

int main() {
    char input[100];
    gets(input);  // Unsafe function
    copyData(input);
}
```

### Test 3: ZIP Archive

Create a folder with multiple files:
```
project/
├── app.py
├── utils.js
├── main.cpp
└── config.php
```

Zip it and upload to VulnVault!

---

## 📊 Detection Capabilities

### Security Issues Detected:

✅ **Injection Attacks**
- SQL Injection
- Command Injection
- XSS (Cross-Site Scripting)
- Path Traversal

✅ **Authentication & Secrets**
- Hardcoded passwords
- API keys in code
- Weak cryptography
- Insecure random numbers

✅ **Memory Safety** (C/C++)
- Buffer overflows
- Use after free
- Null pointer dereference

✅ **Common Vulnerabilities**
- Unsafe deserialization
- Weak hashing algorithms
- Insecure file operations
- Race conditions

---

## 🎯 Language-Specific Features

### Python
- **Best coverage** (40+ Bandit checks)
- Detects: pickle vulnerabilities, assert misuse, weak crypto
- Example: `exec()`, `eval()`, SQL injection

### JavaScript/TypeScript
- **NPM package vulnerabilities**
- Detects: XSS, prototype pollution, regex DoS
- Example: `eval()`, `innerHTML`, `document.write()`

### C/C++
- **Memory safety checks**
- Detects: buffer overflows, format string bugs
- Example: `strcpy()`, `gets()`, `sprintf()`

### Java
- **OWASP Top 10 coverage**
- Detects: SQL injection, XXE, deserialization
- Example: JDBC injection, XML parsing

### Go
- **Concurrency issues**
- Detects: race conditions, unsafe pointer usage
- Example: goroutine misuse, nil dereference

---

## 🔧 Configuration

### Custom Semgrep Rules (Advanced)

Create `backend/.semgrep.yml`:
```yaml
rules:
  - id: custom-api-key
    pattern: |
      API_KEY = "..."
    message: Hardcoded API key detected
    severity: ERROR
    languages: [javascript, python, go]
```

Run with custom config:
```bash
semgrep --config=.semgrep.yml yourfile.js
```

---

## 📈 Performance Expectations

| File Type | Average Scan Time | Files Scanned (ZIP) |
|-----------|-------------------|---------------------|
| Python | 1-3 seconds | Up to 50 |
| JavaScript | 3-10 seconds | Up to 50 |
| C/C++ | 5-15 seconds | Up to 50 |
| ZIP Archive | 30-120 seconds | 50 max |

---

## 🐛 Troubleshooting

### "Semgrep not installed" error

**Solution**:
```bash
pip install semgrep
```

### ZIP extraction fails

**Possible causes**:
- Corrupted ZIP file
- Password-protected archive (not supported)
- File too large (>100MB)

**Solution**: Extract manually and upload individual files

### No vulnerabilities found

**Reasons**:
- Code is actually secure! ✅
- Semgrep not installed (install it)
- File type not fully supported
- Scanner doesn't recognize pattern

---

## 🌟 Future Enhancements

Coming soon:
- [ ] Docker container scanning
- [ ] YAML/JSON configuration file checks
- [ ] SQL file scanning
- [ ] Shell script security
- [ ] Requirements.txt / package.json vulnerability checks
- [ ] SBOM (Software Bill of Materials) generation

---

## 💡 Best Practices

### For Best Results:
1. ✅ Install Semgrep for multi-language support
2. ✅ Upload entire projects as ZIP files
3. ✅ Review all findings (some may be false positives)
4. ✅ Focus on HIGH severity issues first
5. ✅ Use fix suggestions as guidance

### What NOT to Do:
- ❌ Upload sensitive production code to public instances
- ❌ Ignore LOW severity issues (they add up!)
- ❌ Blindly apply fixes without understanding them
- ❌ Upload files >100MB (performance issues)

---

## 📚 Learn More

- **Bandit**: https://bandit.readthedocs.io/
- **Semgrep**: https://semgrep.dev/docs/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE**: https://cwe.mitre.org/

---

**Now supporting 12+ programming languages! 🎉**
