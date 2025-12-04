# 📦 Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `gradex-writers-mvp`
3. Description: `Professional writing services website with Firebase auth`
4. **Privacy:** Choose Private or Public
5. **DO NOT** initialize with README (you already have one)
6. Click **"Create repository"**

---

## Step 2: Push Your Code

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gradex-writers-mvp.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files
3. Check that `firebase-config.json` is **NOT** there (it's in .gitignore - good!)

---

## 🔒 Security Check

Make sure these files are **NOT** on GitHub:
- ❌ `firebase-config.json` (sensitive!)
- ❌ `.env` files
- ❌ `database.db` (if you have one)
- ❌ `node_modules/`

These should be in `.gitignore` already. ✅

---

## 📝 What's on GitHub

✅ All your code
✅ Documentation
✅ Configuration templates
✅ Public Firebase config (safe)
❌ Secret credentials (protected)

---

## Next: Deploy Online

After pushing to GitHub, follow **DEPLOYMENT_GUIDE.md** to deploy on:
- Render (recommended)
- Railway
- Heroku

---

## 🆘 Common Issues

### "Authentication failed"
→ Use GitHub personal access token instead of password
→ Generate at: https://github.com/settings/tokens

### "Repository already exists"
→ Choose a different name or delete the existing repo

### "Permission denied"
→ Make sure you own the repository or have write access

---

Ready to deploy? Check **DEPLOYMENT_GUIDE.md** next!

