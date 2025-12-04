# ⚡ Quick Start - Gradex Writers

## 🚀 Get Running in 30 Seconds

### Windows Users:
```bash
# Double-click this file:
start.bat
```

### Mac/Linux Users:
```bash
# Run this command:
chmod +x start.sh
./start.sh
```

### Or Manually:
```bash
npm install
npm start
```

---

## 🌐 Access Your Site

Once the server starts, open your browser:

| Page | URL | Purpose |
|------|-----|---------|
| **Main Site** | http://localhost:3000 | Landing page |
| **Blog** | http://localhost:3000/blog.html | Articles |
| **Admin** | http://localhost:3000/admin | Dashboard |

---

## 🔐 Authentication Setup

**Firebase Authentication is required!**

### Quick Setup (10 minutes):
📝 Follow **FIREBASE_QUICK_START.md**

**Steps:**
1. Create Firebase project
2. Enable Email/Password auth
3. Download config files
4. Create your admin user

Then login with your Firebase credentials!

---

## ✍️ Create Your First Article

1. Go to http://localhost:3000/admin
2. Login with credentials above
3. Click "+ New Article"
4. Fill in:
   - Title (required)
   - Content (required)
   - Category (select one)
   - Status: "Published"
5. Click "Save Article"
6. View at http://localhost:3000/blog.html

---

## 📁 Project Structure

```
gradex-writers-mvp/
├── index.html          ← Landing page
├── blog.html           ← Blog page
├── server.js           ← Backend API
├── admin/
│   ├── login.html      ← Admin login
│   └── dashboard.html  ← Admin panel
├── css/
│   └── style.css       ← All styles
└── js/
    ├── main.js         ← Homepage JS
    └── blog.js         ← Blog JS
```

---

## 🎯 Common Tasks

### Change Colors
Edit `css/style.css` lines 8-15

### Add Categories
Edit `admin/dashboard.html` line 286
Edit `blog.html` line 102

### Change Port
Edit `server.js` line 10

### Update Pricing
Edit `index.html` lines 122-178

---

## 📚 Need More Help?

| File | What It Contains |
|------|------------------|
| **SETUP.md** | Detailed setup guide |
| **FEATURES.md** | All features explained |
| **DEMO_INSTRUCTIONS.md** | Step-by-step demo |
| **PROJECT_OVERVIEW.md** | Complete overview |
| **README.md** | Full documentation |

---

## ✅ Quick Checklist

- [ ] Installed Node.js
- [ ] Ran `npm install`
- [ ] Started server with `npm start`
- [ ] Opened http://localhost:3000
- [ ] Logged into admin
- [ ] Created first article
- [ ] Viewed blog page
- [ ] Tested on mobile

---

## 🎉 You're Ready!

Your website is now running with:
- ✅ Professional landing page
- ✅ Blog system
- ✅ Admin dashboard
- ✅ Full CMS functionality

**Start creating content and customize to your needs!**

---

## 🆘 Troubleshooting

### Server won't start?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port already in use?
Change port in `server.js` line 10 to 3001 or 8080

### Can't login?
- Check username is lowercase: `admin`
- Password is: `admin123`
- Clear browser cache

### Articles not showing?
- Make sure status is "Published"
- Refresh the blog page
- Check browser console for errors

---

**Questions? Check the documentation files above!** 📚

*We Write. You Excel.* ✍️

