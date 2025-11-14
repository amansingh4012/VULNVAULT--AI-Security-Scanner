# 🧪 VulnVault Testing Checklist

Use this to verify everything works perfectly!

---

## ✅ Pre-Start Checklist

- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Virtual environment created (`venv` folder exists)
- [ ] Test file exists (`backend/test_code.py`)

---

## ✅ Backend Tests

### Test 1: Server Starts
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```
- [ ] Server starts without errors
- [ ] Shows: "Uvicorn running on http://127.0.0.1:8000"
- [ ] No error messages

### Test 2: Health Check
Open: http://localhost:8000
- [ ] Returns JSON: `{"status": "healthy"}`

### Test 3: API Documentation
Open: http://localhost:8000/docs
- [ ] Swagger UI loads
- [ ] Shows all endpoints
- [ ] Can expand/collapse sections

### Test 4: File Upload Endpoint
1. Go to http://localhost:8000/docs
2. Find `POST /scan/upload`
3. Click "Try it out"
4. Upload `backend/test_code.py`
5. Click "Execute"

**Expected Results:**
- [ ] Status code: 200
- [ ] Returns JSON with vulnerabilities
- [ ] `total_issues`: 11 (approximately)
- [ ] `security_score`: between 20-50
- [ ] Contains severity levels: HIGH, MEDIUM, LOW

### Test 5: Bandit Scanner
```powershell
cd backend
.\venv\Scripts\Activate.ps1
bandit test_code.py
```
- [ ] Finds 11 issues
- [ ] Shows severity levels
- [ ] No errors

---

## ✅ Frontend Tests

### Test 1: Development Server
```powershell
cd frontend
npm run dev
```
- [ ] Server starts without errors
- [ ] Shows: "Local: http://localhost:5173"
- [ ] No compilation errors

### Test 2: Homepage Loads
Open: http://localhost:5173
- [ ] Page loads successfully
- [ ] Header shows "VulnVault"
- [ ] Tabs visible: "Upload File" and "GitHub Repo"
- [ ] Footer shows credit to DeepMind

### Test 3: File Upload UI
- [ ] Upload area visible
- [ ] File icon displayed
- [ ] "Drop your Python file here" text shown
- [ ] Scan button present (disabled initially)

### Test 4: File Selection
1. Click upload area
2. Select `backend/test_code.py`

**Expected:**
- [ ] File name appears
- [ ] File size shown in KB
- [ ] Green check mark or success indicator
- [ ] Scan button becomes enabled

### Test 5: File Upload & Scan
1. Select file
2. Click "🔍 Scan for Vulnerabilities"

**Expected:**
- [ ] Button shows "Scanning..." with spinner
- [ ] Loading animation appears
- [ ] Results appear after 1-3 seconds
- [ ] No error messages

### Test 6: Results Display
After scanning:

**Dashboard:**
- [ ] Security score shown (0-100)
- [ ] Grade displayed (A-F)
- [ ] High severity count
- [ ] Medium severity count
- [ ] Low severity count
- [ ] Total issues count

**Vulnerabilities List:**
- [ ] Each vulnerability has:
  - [ ] Severity badge (colored)
  - [ ] Vulnerability type
  - [ ] Line number
  - [ ] Description
  - [ ] Code snippet
  - [ ] Fix suggestion (💡)

### Test 7: GitHub Scanner
1. Click "GitHub Repo" tab
2. Enter: `https://github.com/django/django`
3. Click "🔍 Scan Repository"

**Expected:**
- [ ] Shows "Cloning & Scanning Repository..."
- [ ] Takes 30-90 seconds
- [ ] Returns results
- [ ] Shows files scanned count
- [ ] Lists vulnerabilities from multiple files

### Test 8: Download Report
1. After scan completes
2. Click "📥 Download Report (JSON)"

**Expected:**
- [ ] JSON file downloads
- [ ] Filename includes timestamp
- [ ] File contains all vulnerability data
- [ ] Valid JSON format

---

## ✅ Integration Tests

### Test 1: Full Upload Flow
1. Start backend (`python main.py`)
2. Start frontend (`npm run dev`)
3. Open http://localhost:5173
4. Upload `test_code.py`
5. Click scan

**Expected:**
- [ ] No CORS errors
- [ ] Results appear
- [ ] All 11 vulnerabilities shown
- [ ] Each has fix suggestion

### Test 2: Error Handling
1. Try uploading non-Python file (e.g., .txt)

**Expected:**
- [ ] Error message: "Only Python files supported"
- [ ] Red error banner

2. Stop backend server
3. Try to scan file

**Expected:**
- [ ] Error message about backend
- [ ] Helpful error text

### Test 3: Multiple Scans
1. Scan test_code.py
2. Scan again without refresh

**Expected:**
- [ ] Old results cleared
- [ ] New scan starts
- [ ] Results appear correctly

---

## ✅ UI/UX Tests

### Visual Tests
- [ ] Colors are consistent
- [ ] Buttons have hover effects
- [ ] Animations are smooth
- [ ] No layout shifts
- [ ] Text is readable

### Responsiveness
1. Resize browser window

**Expected:**
- [ ] Layout adapts to smaller screens
- [ ] No horizontal scrolling
- [ ] Buttons remain accessible
- [ ] Dashboard cards stack on mobile

### Accessibility
- [ ] Tab navigation works
- [ ] Buttons have descriptive text
- [ ] Colors have good contrast
- [ ] Loading states announced

---

## ✅ Performance Tests

### Backend Performance
1. Upload test_code.py
2. Note response time

**Expected:**
- [ ] Response < 5 seconds
- [ ] Usually 1-3 seconds

### Frontend Performance
1. Check page load time

**Expected:**
- [ ] Initial load < 2 seconds
- [ ] Smooth animations
- [ ] No lag when clicking

---

## ✅ Security Tests

### Input Validation
1. Try invalid GitHub URLs

**Expected:**
- [ ] Error message shown
- [ ] No crash

2. Try very large files (>10MB)

**Expected:**
- [ ] Handled gracefully
- [ ] May show size warning

### CORS
1. Backend and frontend on different ports

**Expected:**
- [ ] Requests work
- [ ] No CORS errors in console

---

## ✅ Browser Compatibility

Test in different browsers:

### Chrome
- [ ] Works perfectly

### Firefox
- [ ] Works perfectly

### Edge
- [ ] Works perfectly

### Safari (if available)
- [ ] Works perfectly

---

## ✅ Known Issues / Limitations

Expected behaviors (not bugs):

- [ ] Only Python files supported (by design)
- [ ] GitHub scanning takes time (30-90s)
- [ ] Limited to 20 files per repo (for performance)
- [ ] Bandit may have false positives (review needed)

---

## ✅ Final Verification

Before deploying:

- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] Integration works end-to-end
- [ ] No console errors
- [ ] Documentation is accurate
- [ ] Git repo is clean

---

## 🎯 Test Results Summary

After completing all tests:

```
Total Tests:     50+
Passed:          ___
Failed:          ___
Skipped:         ___

Overall Status:  ✅ READY / ⚠️ NEEDS WORK
```

---

## 🐛 Found Issues?

Document them:

### Issue Template
```
Issue: [Brief description]
Steps to Reproduce:
1. 
2. 
3. 

Expected: [What should happen]
Actual: [What actually happens]
Error Messages: [Any errors]
```

---

## ✅ Success Criteria

Your app is production-ready when:

- ✅ All critical tests pass
- ✅ No errors in console
- ✅ File upload works
- ✅ GitHub scanning works
- ✅ Results display correctly
- ✅ UI is polished
- ✅ Performance is acceptable

---

**Test thoroughly, then deploy with confidence!** 🚀
