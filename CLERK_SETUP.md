# Clerk Authentication Setup Guide

## Overview
VulnVault now uses Clerk for user authentication. This enables:
- ✅ Real email verification for users
- ✅ Personalized email alerts sent to authenticated user's email
- ✅ Professional login/signup UI
- ✅ Social login options (Google, GitHub, etc.)
- ✅ Secure JWT-based authentication

## Step 1: Create Clerk Account

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up for a free Clerk account
3. Create a new application named "VulnVault"

## Step 2: Get API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Configure Backend

1. Open `backend/.env`
2. Replace the placeholder values:
   ```env
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

## Step 4: Configure Frontend

1. Open `frontend/.env`
2. Replace the placeholder value:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

## Step 5: Configure Email Settings

Since users will have verified emails from Clerk, update email settings in `backend/.env`:

```env
EMAIL_ENABLED=true
EMAIL_SENDER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
# EMAIL_RECIPIENT is now optional - will use authenticated user's email
```

### Gmail App Password Setup:
1. Go to Google Account Settings → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this password in EMAIL_PASSWORD (format: `xxxx xxxx xxxx xxxx`)

## Step 6: Restart Services

```bash
# Backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frontend
npm run dev
```

## How It Works

### For Users:
1. **Sign Up/Login**: Users create accounts via Clerk's UI
2. **Verified Email**: Clerk handles email verification
3. **Run Scans**: Users can scan code (with or without login)
4. **Get Alerts**: If logged in and scan finds HIGH/CRITICAL vulns → email sent to user's verified email

### For Developers:
- **Optional Auth**: Endpoints accept optional `Authorization: Bearer <token>` header
- **No Auth Required**: Users can still scan without login (alerts go to default EMAIL_RECIPIENT)
- **With Auth**: When authenticated, alerts go to user's email from Clerk

## API Usage with Authentication

### With Clerk Token (from frontend):
```javascript
const token = await clerk.session.getToken()

await axios.post('http://localhost:8000/scan/upload', formData, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Without Authentication:
```javascript
// Still works! Alerts go to default EMAIL_RECIPIENT
await axios.post('http://localhost:8000/scan/upload', formData)
```

## Testing

1. Start both backend and frontend
2. Visit http://localhost:5174
3. Click "Sign In" (Clerk UI will appear)
4. Create a test account with your real email
5. Upload a file with vulnerabilities
6. Check your email for alerts!

## Clerk Dashboard Features

In your Clerk dashboard you can:
- View all registered users
- Customize login/signup UI
- Add social login providers (Google, GitHub, etc.)
- Set up webhooks for user events
- View authentication logs
- Manage user sessions

## Security Notes

- ✅ Clerk handles password hashing and storage
- ✅ JWT tokens are verified on backend
- ✅ Emails are verified by Clerk
- ✅ Session management handled by Clerk
- ✅ No user passwords stored in your database

## Troubleshooting

### "Authentication service not configured"
- Make sure CLERK_SECRET_KEY is set in backend/.env
- Restart backend after updating .env

### "Invalid token"
- Check that frontend VITE_CLERK_PUBLISHABLE_KEY matches your Clerk app
- Ensure token is passed as `Authorization: Bearer <token>`
- Check Clerk dashboard for active sessions

### Email not sending
- Verify EMAIL_ENABLED=true
- Check Gmail app password is correct
- Make sure user is authenticated (check backend logs)

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Backend API](https://clerk.com/docs/references/backend/overview)
