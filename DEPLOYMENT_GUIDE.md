# 🚀 Deploy Gradex Writers Online

## Quick Deployment Options

Choose one of these platforms (all have free tiers):

1. **Render** - Easiest, recommended ⭐
2. **Railway** - Fast and modern
3. **Heroku** - Classic platform

---

## 🎯 Option 1: Render (Recommended) ⭐

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub: https://github.com/new
# Name it: gradex-writers-mvp
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/gradex-writers-mvp.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to https://render.com and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `gradex-writers-mvp`
5. Configure:
   - **Name:** `gradex-writers`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 3: Add Environment Variables

In Render dashboard, go to **"Environment"** tab and add:

```
NODE_ENV=production
PORT=3000
```

### Step 4: Add Firebase Service Account

1. In Render, go to **"Environment"** tab
2. Click **"Add Secret File"**
3. **Filename:** `firebase-config.json`
4. **Contents:** Copy your entire `firebase-config.json` file
5. Click "Save"

### Step 5: Update Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com/project/gradex-66de5
2. **Authentication** → **Settings** → **Authorized domains**
3. Click **"Add domain"**
4. Add your Render URL: `gradex-writers.onrender.com` (or your custom domain)
5. Click "Add"

### Step 6: Deploy!

- Render will automatically deploy
- Wait 2-3 minutes
- Your site will be live at: `https://gradex-writers.onrender.com`

---

## 🚀 Option 2: Railway

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Railway

1. Go to https://railway.app and sign up (free)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js

### Step 3: Add Environment Variables

1. Go to your project → **"Variables"** tab
2. Add:

```
NODE_ENV=production
PORT=${PORT}
```

### Step 4: Add Firebase Config

1. Click **"Variables"** tab
2. Add each field from your `firebase-config.json`:

```
FIREBASE_PROJECT_ID=gradex-66de5
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...(your key)...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@gradex-66de5.iam.gserviceaccount.com
```

### Step 5: Update server.js for Railway

Railway provides environment variables instead of file. Update is optional for now.

### Step 6: Update Firebase Authorized Domains

Add your Railway domain: `*.up.railway.app`

---

## 🚀 Option 3: Heroku

### Step 1: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Create Heroku App

```bash
heroku login
heroku create gradex-writers
```

### Step 3: Add Buildpack

```bash
heroku buildpacks:set heroku/nodejs
```

### Step 4: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
```

### Step 5: Add Firebase Config

```bash
# Create a base64 encoded version of your firebase-config.json
# On Windows PowerShell:
$content = Get-Content firebase-config.json -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$encoded = [Convert]::ToBase64String($bytes)
echo $encoded

# Set it as environment variable
heroku config:set FIREBASE_CONFIG=$encoded
```

Then update `server.js` to decode it (I'll create this file).

### Step 6: Deploy

```bash
git push heroku main
```

### Step 7: Update Firebase Authorized Domains

Add: `gradex-writers.herokuapp.com`

---

## 🌐 Custom Domain Setup

### For Render:
1. Render Dashboard → **"Settings"** → **"Custom Domain"**
2. Add your domain (e.g., `admin.gradexwriters.com`)
3. Update DNS with provided CNAME records

### For Railway:
1. Project Settings → **"Domains"**
2. Add custom domain
3. Update DNS records

---

## 🔒 Production Security Checklist

Before going live:

- [ ] Add your production domain to Firebase Authorized Domains
- [ ] Set `NODE_ENV=production`
- [ ] Firebase config is secure (environment variables or secret files)
- [ ] HTTPS is enabled (automatic on Render/Railway/Heroku)
- [ ] Create your admin users in Firebase Console
- [ ] Test login on production URL
- [ ] Test article creation and publishing
- [ ] Set up database backups (download `database.db` periodically)

---

## 📊 Free Tier Limits

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **Render** | 750 hours/month | Production use ⭐ |
| **Railway** | $5 credit/month | Modern apps |
| **Heroku** | Limited hours | Classic apps |

---

## 🆘 Troubleshooting

### "Firebase not configured" on production

**Solution:**
1. Check secret file/environment variables are set
2. Verify filename is exactly `firebase-config.json`
3. Check server logs for errors

### "auth/unauthorized-domain"

**Solution:**
1. Firebase Console → Authentication → Settings
2. Add your production domain to Authorized Domains
3. Include both `www` and non-`www` versions

### Database not persisting

**Solution:**
- Free tiers may have ephemeral storage
- Use Render's persistent disks (paid)
- Or migrate to PostgreSQL/MongoDB

---

## 📝 Next Steps After Deployment

1. **Test Everything:**
   - Visit your production URL
   - Login to admin
   - Create test article
   - View on blog

2. **Update Documentation:**
   - Update README with production URL
   - Share admin login with team

3. **Monitor:**
   - Check Render/Railway logs
   - Monitor Firebase usage
   - Test regularly

---

## 🎉 You're Live!

Your admin dashboard will be accessible at:
- Render: `https://gradex-writers.onrender.com/admin`
- Railway: `https://your-app.up.railway.app/admin`
- Heroku: `https://gradex-writers.herokuapp.com/admin`

**Admin users can login from anywhere in the world!** 🌍

---

Need help? Check the platform-specific documentation or let me know!

