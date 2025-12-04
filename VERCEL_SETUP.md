# 🚀 Deploy to Vercel - Complete Guide

Your code is already on GitHub and Vercel is linked! Let's configure it for Firebase authentication.

---

## ✅ Step 1: Configure Firebase Environment Variables

Since your repository is already linked to Vercel, you need to add Firebase credentials as environment variables.

### Go to Vercel Dashboard:

1. Open: **https://vercel.com/dashboard**
2. Find your project: **Gradex-Writers**
3. Click on it
4. Go to **Settings** tab
5. Click **Environment Variables** in left sidebar

### Add These Variables:

Copy from your `firebase-config.json` file:

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `FIREBASE_PROJECT_ID` | `gradex-66de5` | From firebase-config.json |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@gradex-66de5.iam.gserviceaccount.com` | From firebase-config.json |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | From firebase-config.json (entire key!) |
| `NODE_ENV` | `production` | Just type this |

**Important for FIREBASE_PRIVATE_KEY:**
- Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters in the key - they're important!
- It should look like: `-----BEGIN PRIVATE KEY-----\nMIIEvAI...\n-----END PRIVATE KEY-----\n`

### How to Add:

1. Click **"Add New"** button
2. **Name:** Enter variable name (e.g., `FIREBASE_PROJECT_ID`)
3. **Value:** Paste the value
4. **Environments:** Select all (Production, Preview, Development)
5. Click **"Save"**
6. Repeat for all variables

---

## ✅ Step 2: Update Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com/project/gradex-66de5/authentication/settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel domain: `gradex-writers.vercel.app`
5. Click **"Add"**

**Note:** Your Vercel URL is: **https://gradex-writers.vercel.app**

---

## ✅ Step 3: Update server.js

The server.js needs to support environment variables for Vercel. I'll update it now.

---

## ✅ Step 4: Push Changes

After I update server.js, we'll push:

```bash
git add .
git commit -m "Add Vercel configuration and Firebase env support"
git push origin main
```

Vercel will automatically deploy!

---

## 🎉 Step 5: Test Your Live Site

1. **Admin Login:** https://gradex-writers.vercel.app/admin
2. **Main Site:** https://gradex-writers.vercel.app
3. **Blog:** https://gradex-writers.vercel.app/blog.html

---

## ⚠️ Important Notes

### Database on Vercel:
- SQLite doesn't persist on Vercel (serverless environment)
- For production, migrate to:
  - **Vercel Postgres** (recommended)
  - **MongoDB Atlas** (free tier)
  - **PlanetScale** (MySQL)

### For Now (Testing):
- Database will reset on each deployment
- You'll need to recreate articles after deployments
- This is fine for testing the admin interface

---

## 🔧 Troubleshooting

### "Firebase not configured" on Vercel

**Check:**
1. Environment variables are set correctly
2. FIREBASE_PRIVATE_KEY includes `\n` characters
3. All three Firebase variables are present
4. Redeploy after setting variables

### "auth/unauthorized-domain"

**Fix:**
1. Firebase Console → Authentication → Settings
2. Add `gradex-writers.vercel.app` to Authorized Domains
3. Add both `www.gradex-writers.vercel.app` and `gradex-writers.vercel.app`

### Deploy Failed

**Check Vercel logs:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. Check build logs for errors

---

## 📊 Next Steps After Deploy

1. **Test Login:**
   - Go to your Vercel URL + /admin
   - Login with Firebase credentials
   - Create a test article

2. **Migrate Database (Optional):**
   - Set up Vercel Postgres
   - Update server.js to use PostgreSQL
   - Redeploy

3. **Custom Domain (Optional):**
   - Add your own domain in Vercel settings
   - Update DNS records
   - Add domain to Firebase Authorized Domains

---

## 🎯 Quick Reference

| What | URL |
|------|-----|
| **Your Live Site** | https://gradex-writers.vercel.app |
| **Admin Panel** | https://gradex-writers.vercel.app/admin |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Firebase Console** | https://console.firebase.google.com/project/gradex-66de5 |
| **GitHub Repo** | https://github.com/NewLongMoney/Gradex-Writers |

---

## ✅ Deployment Checklist

- [ ] Added FIREBASE_PROJECT_ID to Vercel
- [ ] Added FIREBASE_CLIENT_EMAIL to Vercel
- [ ] Added FIREBASE_PRIVATE_KEY to Vercel (with \n)
- [ ] Added NODE_ENV=production to Vercel
- [ ] Added gradex-writers.vercel.app to Firebase Authorized Domains
- [ ] Updated server.js for environment variables
- [ ] Pushed changes to GitHub
- [ ] Vercel deployed successfully
- [ ] Tested admin login on live site
- [ ] Created test article

---

**Once Vercel has the environment variables, your site will work perfectly!** 🎉
