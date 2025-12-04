# 🔥 Firebase Setup - Quick Start

## ⚡ Get Firebase Running in 10 Minutes

### Step 1: Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it: `gradex-writers`
4. Click through the wizard

### Step 2: Enable Authentication (1 min)

1. Click **"Authentication"** → **"Get started"**
2. Click **"Sign-in method"** tab
3. Enable **"Email/Password"** (toggle ON, save)
4. Enable **"Google"** (toggle ON, add email, save)

### Step 3: Get Your Config (2 min)

1. Click ⚙️ gear icon → **"Project settings"**
2. Scroll to **"Your apps"**
3. Click **"</>** (Web icon)
4. Register app: name it "Gradex Admin"
5. **Copy the firebaseConfig object**

### Step 4: Update Your Code (2 min)

Open `public/firebase-init.js` and paste your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",           // ← paste here
    authDomain: "your-project.firebaseapp.com",  // ← paste here
    projectId: "your-project-id",              // ← paste here
    storageBucket: "your-project.appspot.com", // ← paste here
    messagingSenderId: "123456789",            // ← paste here
    appId: "1:123:web:abc123"                  // ← paste here
};
```

### Step 5: Download Service Account (2 min)

1. Still in Project Settings → **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads JSON)
4. Rename file to `firebase-config.json`
5. Move to project root folder

### Step 6: Create Admin User (1 min)

1. Go to **Authentication** → **"Users"** tab
2. Click **"Add user"**
3. Email: `admin@yourdomain.com`
4. Password: (your secure password)
5. Click "Add user"

### Step 7: Test! (< 1 min)

```bash
npm install
npm start
```

Should see: `🔥 Firebase Authentication: ENABLED`

Go to: http://localhost:3000/admin
Login with your email/password!

---

## ✅ That's It!

You now have:
- ✅ Secure authentication
- ✅ Email/password login
- ✅ Google Sign-In
- ✅ Password reset

---

## 🆘 Issues?

### "Firebase not configured"
→ Check `firebase-config.json` is in project root

### "Invalid API key"  
→ Double-check `public/firebase-init.js` values

### Can't login?
→ Make sure you created a user in Firebase Console

---

**Need detailed instructions? See `FIREBASE_SETUP.md`**

*We Write. You Excel.* ✍️

