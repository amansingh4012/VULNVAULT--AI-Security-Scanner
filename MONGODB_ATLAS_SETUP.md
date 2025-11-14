# 🌐 MongoDB Atlas Setup Guide (Free Cloud Database)

## Why MongoDB Atlas?

✅ **Free Forever** - M0 cluster (512MB storage)  
✅ **No Installation** - Cloud-hosted, access from anywhere  
✅ **Secure** - Built-in encryption and authentication  
✅ **Automatic Backups** - Daily snapshots  
✅ **Easy Setup** - 5-minute configuration  

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email & Password, OR
   - Google account, OR
   - GitHub account
3. Complete email verification

---

### Step 2: Create Free Cluster

1. Click **"Build a Database"** or **"Create"**
2. Choose **"M0 Free"** tier:
   - ✅ 512 MB Storage
   - ✅ Shared RAM
   - ✅ No credit card required
3. Select **Cloud Provider & Region**:
   - Provider: AWS (recommended)
   - Region: Choose closest to your location
4. **Cluster Name**: `vulnvault-cluster` (or any name)
5. Click **"Create Cluster"** (takes 1-3 minutes)

---

### Step 3: Create Database User

1. Click **"Security"** → **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `vulnvault_user`
5. **Password**: Click "Autogenerate Secure Password"
   - **⚠️ IMPORTANT:** Copy and save this password!
6. **Database User Privileges**: 
   - Select: `readWriteAnyDatabase`
7. Click **"Add User"**

---

### Step 4: Configure Network Access

1. Click **"Security"** → **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Choose ONE option:

   **Option A: Allow from Anywhere (Easiest)**
   - Click **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0` (auto-filled)
   - Click **"Confirm"**
   - ⚠️ Note: Use strong password with this option

   **Option B: Your Current IP (More Secure)**
   - Click **"Add Current IP Address"**
   - Your IP is auto-detected
   - Click **"Confirm"**
   - 💡 Add more IPs if you work from multiple locations

---

### Step 5: Get Connection String

1. Go to **"Database"** (left sidebar)
2. Find your cluster → Click **"Connect"**
3. Click **"Connect your application"**
4. **Driver**: Python
5. **Version**: 3.12 or later
6. **Copy the connection string:**

```
mongodb+srv://vulnvault_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **Replace `<password>`** with your actual password from Step 3

---

### Step 6: Configure VulnVault

1. **Create `.env` file** in `backend` directory:

```bash
cd backend
# Copy from example
cp .env.example .env
# Or on Windows:
copy .env.example .env
```

2. **Edit `.env`** file:

```env
# MongoDB Atlas Configuration
MONGODB_URL=mongodb+srv://vulnvault_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vulnvault

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Email (optional)
EMAIL_ENABLED=false
```

**⚠️ Important:**
- Replace `YOUR_PASSWORD_HERE` with your actual password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Keep this file secure - never commit to Git!

---

### Step 7: Test Connection

```bash
cd backend
python test_saved_projects.py
```

**Expected Output:**
```
✅ MongoDB connected: Version 7.0.x
✅ Database 'vulnvault' accessible: 0 projects
```

If you see errors, check:
- Password is correct (no `<` `>` brackets)
- IP address is whitelisted
- Connection string is complete

---

### Step 8: Start Application

```bash
# Backend
cd backend
python -m uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm run dev
```

**Open:** http://localhost:5173  
**Click:** 💾 Saved Projects tab  
**Scan code** → Projects save to MongoDB Atlas! ✅

---

## 🎯 Connection String Format Explained

```
mongodb+srv://username:password@cluster.mongodb.net/?options
           │        │          │                    │
           │        │          │                    └─ Connection options
           │        │          └────────────────────── Cluster hostname
           │        └───────────────────────────────── Your password
           └────────────────────────────────────────── Database username
```

**Common Options:**
- `retryWrites=true` - Retry failed writes
- `w=majority` - Wait for majority acknowledgment
- `appName=vulnvault` - Label your app (optional)

---

## 🔒 Security Best Practices

### 1. Strong Password
```
✅ Good: K9$mP#xL2qR8nT5vW
❌ Bad:  password123
```

### 2. IP Whitelist
- Production: Whitelist specific IPs only
- Development: 0.0.0.0/0 is okay with strong password

### 3. Environment Variables
```bash
# NEVER commit .env to Git
echo ".env" >> .gitignore
```

### 4. Rotate Credentials
- Change password every 3-6 months
- Delete unused database users

---

## 📊 Monitor Your Database

### Atlas Dashboard Features:

1. **Metrics** - View database activity
   - Operations per second
   - Network traffic
   - Storage usage

2. **Collections** - Browse your data
   - Click "Browse Collections"
   - See `vulnvault.projects` data
   - View/edit documents manually

3. **Charts** - Visualize data (optional)

4. **Backups** - Restore snapshots (free tier: daily)

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Solution:**
```env
# Check password has NO < > brackets:
✅ MONGODB_URL=mongodb+srv://user:MyP@ss123@cluster.net/
❌ MONGODB_URL=mongodb+srv://user:<password>@cluster.net/
```

### Error: "Connection timed out"
**Solution:**
1. Check IP whitelist (Network Access)
2. Verify internet connection
3. Try "Allow from Anywhere" temporarily

### Error: "Server selection timeout"
**Solution:**
```env
# Add timeout parameter:
MONGODB_URL=mongodb+srv://user:pass@cluster.net/?serverSelectionTimeoutMS=5000
```

### Error: "dnspython module not found"
**Solution:**
```bash
pip install dnspython
```

### Can't find connection string?
1. Atlas Dashboard → Database (sidebar)
2. Your cluster → "Connect" button
3. "Connect your application"
4. Copy the string

---

## 💰 Free Tier Limits

| Feature | M0 Free Tier |
|---------|-------------|
| Storage | 512 MB |
| RAM | Shared |
| Databases | Unlimited |
| Collections | Unlimited |
| Price | **FREE Forever** |
| Projects | ~5,000-10,000 scans |

**Plenty for:**
- Development
- Small teams
- Personal projects
- Learning

**Upgrade if:**
- Need > 512 MB storage
- High traffic (> 100 concurrent users)
- Need dedicated RAM

---

## 🔄 Switching from Local to Atlas

Already using local MongoDB? Easy switch:

1. **Export existing data:**
```bash
mongoexport --db vulnvault --collection projects --out projects.json
```

2. **Update `.env`:**
```env
MONGODB_URL=mongodb+srv://user:pass@cluster.net/
```

3. **Import to Atlas:**
```bash
mongoimport --uri "mongodb+srv://user:pass@cluster.net/" --db vulnvault --collection projects --file projects.json
```

4. **Restart backend** - Done! ✅

---

## 📱 Access from Multiple Locations

**Scenario:** Work from home, office, and coffee shop

**Solution 1:** Allow from Anywhere (0.0.0.0/0)
- Easiest
- Use strong password

**Solution 2:** Add Multiple IPs
- Network Access → Add IP Address
- Add each location's IP
- More secure

**Solution 3:** VPN
- Use company/personal VPN
- Whitelist VPN IP only

---

## 🌍 Choose Best Region

**Factors to consider:**
1. **Latency** - Choose closest region
2. **Compliance** - Data residency laws
3. **Free tier availability** - All major regions

**Regions available (Free tier):**
- 🇺🇸 US East (Virginia) - `us-east-1`
- 🇺🇸 US West (Oregon) - `us-west-2`
- 🇪🇺 EU (Ireland) - `eu-west-1`
- 🇸🇬 Asia Pacific (Singapore) - `ap-southeast-1`
- Many more...

---

## ✅ Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created M0 free cluster
- [ ] Created database user with password
- [ ] Configured network access (IP whitelist)
- [ ] Got connection string
- [ ] Updated `.env` file with connection string
- [ ] Installed `dnspython` package
- [ ] Tested connection with `test_saved_projects.py`
- [ ] Started backend successfully
- [ ] Saved Projects feature working

---

## 🆘 Need Help?

**MongoDB Atlas Docs:**  
https://docs.atlas.mongodb.com/

**VulnVault Setup Issues:**  
Check `SAVED_PROJECTS_SETUP.md`

**Test Connection:**
```bash
python -c "from pymongo import MongoClient; client = MongoClient('YOUR_CONNECTION_STRING'); print('✅ Connected:', client.server_info()['version'])"
```

---

## 🎉 You're All Set!

Your VulnVault now saves to the cloud! ☁️

**Benefits:**
- ✅ Access from anywhere
- ✅ No local setup needed
- ✅ Automatic backups
- ✅ Professional cloud database
- ✅ Forever free

**Happy scanning! 🛡️**
