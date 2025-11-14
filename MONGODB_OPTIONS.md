# 🗄️ MongoDB Configuration Options

## Two Ways to Use MongoDB with VulnVault

### Option 1: MongoDB Atlas (Cloud) ☁️ - **RECOMMENDED**

**✅ Pros:**
- No installation needed
- Access from anywhere
- Free forever (512MB)
- Automatic backups
- Built-in security
- 5-minute setup

**📝 Configuration:**
```env
# In backend/.env
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vulnvault
```

**🚀 Setup Guide:** See `MONGODB_ATLAS_SETUP.md`

**Perfect for:**
- Quick start
- No local setup wanted
- Multiple devices
- Team collaboration
- Production deployment

---

### Option 2: Local MongoDB 💻

**✅ Pros:**
- Full control
- No internet needed
- Faster (local connection)
- No account required

**❌ Cons:**
- Requires installation
- Manual backups
- Only accessible locally
- Setup per machine

**📝 Configuration:**
```env
# In backend/.env
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=vulnvault
```

**🚀 Setup Guide:** See `SAVED_PROJECTS_SETUP.md`

**Perfect for:**
- Offline development
- Full local control
- Privacy concerns
- Learning MongoDB

---

## 🆚 Quick Comparison

| Feature | MongoDB Atlas ☁️ | Local MongoDB 💻 |
|---------|------------------|------------------|
| **Setup Time** | 5 minutes | 15-30 minutes |
| **Installation** | None | Required |
| **Storage (Free)** | 512 MB | Unlimited |
| **Internet** | Required | Not required |
| **Access** | Anywhere | Local only |
| **Backups** | Automatic | Manual |
| **Cost** | FREE | FREE |
| **Security** | Built-in | Configure yourself |
| **Speed** | ~50-200ms | ~1-5ms |
| **Best for** | Beginners, Teams | Advanced, Offline |

---

## 🎯 Which One Should I Choose?

### Choose **MongoDB Atlas** if:
- ✅ You want the easiest setup
- ✅ You're new to MongoDB
- ✅ You want cloud access
- ✅ You don't want to install anything
- ✅ You're deploying to production

### Choose **Local MongoDB** if:
- ✅ You need offline access
- ✅ You want full control
- ✅ You have privacy requirements
- ✅ You already have MongoDB installed
- ✅ You need very low latency

---

## 🚀 Quick Start for Atlas (Recommended)

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 tier)
3. **Create database user** with password
4. **Allow IP access** (0.0.0.0/0 for easiest setup)
5. **Get connection string** (Connect → Connect your application)
6. **Update `.env`:**
   ```env
   MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/
   DATABASE_NAME=vulnvault
   ```
7. **Test:**
   ```bash
   cd backend
   python test_saved_projects.py
   ```
8. **Start app:**
   ```bash
   python -m uvicorn main:app --reload
   ```

**✅ Done!** Saved Projects working with cloud database!

---

## 📚 Detailed Guides

- **MongoDB Atlas (Cloud):** `MONGODB_ATLAS_SETUP.md` ⭐ **START HERE**
- **Local MongoDB:** `SAVED_PROJECTS_SETUP.md`
- **Feature Documentation:** `SAVED_PROJECTS_IMPLEMENTATION.md`
- **Quick Reference:** `QUICKSTART_SAVED_PROJECTS.md`

---

## 💡 Pro Tips

### For Atlas:
- Use strong password
- Keep connection string in `.env` (never commit to Git)
- Monitor usage in Atlas dashboard
- Free tier is enough for 5,000-10,000 scans

### For Local:
- Start MongoDB service before running app
- Back up your data regularly
- Consider replication for safety
- Enable authentication in production

---

## 🔄 Can I Switch Later?

**Yes!** Easy to migrate:

**Atlas → Local:**
```bash
mongoexport --uri "mongodb+srv://..." --db vulnvault --collection projects --out backup.json
mongoimport --db vulnvault --collection projects --file backup.json
```

**Local → Atlas:**
```bash
mongoexport --db vulnvault --collection projects --out backup.json
mongoimport --uri "mongodb+srv://..." --db vulnvault --collection projects --file backup.json
```

Just update `.env` with new connection string and restart!

---

## ❓ Common Questions

**Q: Is Atlas really free forever?**  
A: Yes! M0 tier (512MB) is free forever, no credit card needed.

**Q: What happens if I exceed 512MB on Atlas?**  
A: You'll get notified. Can upgrade or delete old scans.

**Q: Can I use both Atlas and Local?**  
A: Yes! Different `.env` configurations per environment.

**Q: Which is more secure?**  
A: Both secure if configured properly. Atlas has built-in encryption and monitoring.

**Q: Do I need to know MongoDB?**  
A: No! VulnVault handles everything automatically.

---

## 🎊 Recommendation

**For most users: Use MongoDB Atlas ☁️**

Why?
- ✅ Easier setup (5 minutes)
- ✅ No installation
- ✅ Works immediately
- ✅ Professional features
- ✅ Free forever

**Get started:** `MONGODB_ATLAS_SETUP.md`

---

**Happy scanning! 🛡️**
