# VulnVault Production Deployment Guide

## 🚀 Deploy to Production (Free!)

### Prerequisites
- GitHub account
- Git repository with your code

---

## Part 1: Deploy Backend (Render.com - Free)

### Step 1: Push to GitHub
```bash
cd C:\Users\AMAN KUMAR SINGH\OneDrive\Desktop\vulnvault
git init
git add .
git commit -m "Initial commit - VulnVault"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vulnvault.git
git push -u origin main
```

### Step 2: Deploy to Render
1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `vulnvault-backend`
   - **Region**: Oregon (free)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Copy your backend URL: `https://vulnvault-backend.onrender.com`

---

## Part 2: Deploy Frontend (Vercel - Free)

### Step 1: Update API URL

Edit `frontend/src/components/FileUpload.jsx` and `frontend/src/components/GitHubScanner.jsx`:

Change:
```javascript
const API_URL = 'http://localhost:8000'
```

To:
```javascript
const API_URL = 'https://vulnvault-backend.onrender.com'
```

Commit changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com and sign up (free)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"
6. Wait 2-3 minutes
7. Your app is live! 🎉

Example URL: `https://vulnvault.vercel.app`

---

## Alternative: Deploy Everything with Docker

### Using Render.com

1. Add `Dockerfile` to backend (already exists)
2. Deploy as Docker container
3. Use the same process as above

### Using Railway.app

1. Go to https://railway.app
2. Click "Start a New Project"
3. Deploy from GitHub
4. Railway auto-detects Docker
5. Free $5 credit per month

---

## Part 3: Configure CORS for Production

Edit `backend/main.py`:

```python
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://vulnvault.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy!

---

## Part 4: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `vulnvault.com`)
3. Update DNS records as shown
4. SSL certificate auto-configured!

### For Render (Backend)
1. Upgrade to paid plan ($7/month)
2. Add custom domain in settings
3. Or use free `.onrender.com` subdomain

---

## Part 5: Environment Variables

### Render.com
1. Go to your service → Environment
2. Add variables:
   ```
   PYTHONUNBUFFERED=1
   PORT=8000
   ```

### Vercel
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://vulnvault-backend.onrender.com
   ```

3. Update frontend code to use env var:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
   ```

---

## Part 6: Continuous Deployment

### Auto-Deploy on Push
Both Render and Vercel support auto-deployment:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "New feature"
   git push
   ```

2. **Automatic Deployment**:
   - Render redeploys backend
   - Vercel redeploys frontend
   - Takes 2-5 minutes

---

## Part 7: Monitoring & Analytics

### Render.com (Free)
- View logs in dashboard
- Monitor CPU/Memory usage
- Track deploy history

### Vercel (Free)
- Analytics dashboard
- Performance insights
- Error tracking

### Add Sentry (Free)
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## Part 8: Testing Production

### Test Backend
```bash
curl https://vulnvault-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test Frontend
1. Visit your Vercel URL
2. Upload `test_code.py`
3. Verify scanning works
4. Check results display

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Paid (Optional) |
|---------|-----------|-----------------|
| Render.com | 750 hours | $7/month |
| Vercel | Unlimited | $20/month (Pro) |
| GitHub | Unlimited | $4/month (Pro) |
| Domain | - | $12/year |
| **TOTAL** | **$0** | $27/month + $12/year |

**Recommended**: Start with free tier!

---

## Performance Optimization

### Backend (Render)
- Use gunicorn for production:
  ```bash
  pip install gunicorn
  ```
  
  Start command:
  ```bash
  gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
  ```

### Frontend (Vercel)
- Already optimized by Vite
- Automatic code splitting
- CDN caching
- Gzip compression

---

## Security Checklist

### Production Security
- [x] HTTPS enabled (automatic)
- [x] CORS configured properly
- [x] Environment variables for secrets
- [ ] Rate limiting (add later)
- [ ] API authentication (add later)
- [ ] Input validation
- [ ] Error handling

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check `requirements.txt` paths
- Verify Python version (3.10+)
- Check Render logs

**App crashes:**
- Check for missing dependencies
- Verify `$PORT` environment variable
- Review error logs

### Frontend Issues

**Build fails:**
- Run `npm install` locally first
- Check for syntax errors
- Verify all imports

**API errors:**
- Verify backend URL
- Check CORS settings
- Test backend health endpoint

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] CORS configured
- [ ] API URLs updated
- [ ] Environment variables set
- [ ] Production tested
- [ ] Custom domain (optional)
- [ ] Monitoring enabled
- [ ] Documentation updated

---

## Success Metrics

After deployment, you should have:

✅ Live backend API
✅ Live frontend application
✅ Working file upload
✅ Working GitHub scanning
✅ Auto-deployment on push
✅ Free hosting!

---

## Next Steps

1. Test thoroughly in production
2. Share with friends/colleagues
3. Add to your portfolio
4. Write a blog post
5. Submit to Product Hunt
6. Get feedback
7. Iterate and improve!

---

## Support

If you encounter issues:
1. Check Render/Vercel logs
2. Review documentation
3. Test locally first
4. Check GitHub Issues
5. Debug with browser console

---

**Congratulations! Your app is LIVE! 🎉**

Share it: `https://vulnvault.vercel.app`
