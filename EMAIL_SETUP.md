# Email Alert Setup Guide

VulnVault can send automated email alerts when HIGH severity vulnerabilities are detected during scans.

## 📧 Gmail Setup (Recommended)

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (you must enable this first)
3. Scroll down to **App passwords**: https://myaccount.google.com/apppasswords
4. Click **Select app** → Choose **Other (Custom name)**
5. Enter "VulnVault Scanner" and click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

⚠️ **Important**: Use the app password, NOT your regular Gmail password!

### Step 2: Configure .env File

Open `backend/.env` and update these variables:

```env
# Email Configuration
EMAIL_ENABLED=true
EMAIL_SENDER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # 16-char app password (no spaces)
EMAIL_RECIPIENT=security-team@example.com

# SMTP Settings (Gmail default)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Step 3: Restart Backend

```bash
cd backend
python main.py
```

You should see: `📧 Email alerts enabled` in the console.

## 🧪 Test Email Alerts

1. Upload or scan a file with HIGH severity vulnerabilities
2. Check the backend console for:
   ```
   🚨 Found X critical vulnerabilities
   📧 Email alert sent to security-team@example.com
   ✅ Email alert sent for ProjectName
   ```
3. Check your email inbox for the security alert

## 📨 Email Format

The email will include:
- **Subject**: 🚨 VulnVault Alert: X Critical Vulnerabilities Found in ProjectName
- **Body**:
  - Project name and scan date
  - Security score
  - List of critical vulnerabilities (up to 5 shown)
  - Severity summary (HIGH/MEDIUM/LOW counts)
  - Link to view full report in VulnVault

## 🔧 Troubleshooting

### "Failed to send email: Authentication failed"
- Verify you're using the **app password**, not your regular Gmail password
- Ensure 2-Step Verification is enabled on your Google Account
- Check that EMAIL_PASSWORD has no spaces

### "Failed to send email: SMTPServerDisconnected"
- Verify SMTP_HOST is `smtp.gmail.com`
- Verify SMTP_PORT is `587`
- Check your internet connection

### No email received
- Check spam/junk folder
- Verify EMAIL_RECIPIENT is correct
- Check backend console for error messages
- Ensure EMAIL_ENABLED=true

### "Less secure app access"
- Gmail no longer supports this. You MUST use an app password
- Follow Step 1 to generate an app password

## 🔒 Security Best Practices

1. **Never commit .env to Git**: Add `.env` to `.gitignore`
2. **Use app passwords**: Never use your main Gmail password
3. **Limit recipients**: Only send to authorized security team emails
4. **Rotate passwords**: Regenerate app passwords periodically
5. **Monitor usage**: Check Gmail's "Recent security activity" regularly

## 📬 Using Other Email Providers

### Outlook/Office 365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```
Note: Yahoo also requires app passwords.

### Custom SMTP Server
```env
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587  # or 465 for SSL
EMAIL_SENDER=scanner@yourcompany.com
EMAIL_PASSWORD=your-smtp-password
```

## 🚫 Disable Email Alerts

To disable email alerts without removing configuration:

```env
EMAIL_ENABLED=false
```

Scans will continue to work normally without sending emails.

## 🎯 Alert Triggers

Emails are sent automatically when:
- ✅ Scan completes successfully
- ✅ At least 1 HIGH or CRITICAL severity vulnerability is found
- ✅ EMAIL_ENABLED=true
- ✅ Email configuration is valid

Emails are NOT sent when:
- ❌ Only LOW/MEDIUM vulnerabilities found
- ❌ EMAIL_ENABLED=false
- ❌ No vulnerabilities found
- ❌ Email configuration is missing/invalid
