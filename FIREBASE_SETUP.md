# 🔥 Firebase Authentication Setup Guide

This guide will walk you through setting up Firebase Authentication for Gradex Writers admin dashboard.

---

## 📋 Overview

Firebase Authentication provides:
- ✅ Secure email/password authentication
- ✅ Google Sign-In integration
- ✅ Password reset functionality
- ✅ Session management
- ✅ Multi-factor authentication (optional)
- ✅ Enterprise-grade security

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `gradex-writers` (or your preferred name)
4. Disable Google Analytics (optional, or enable if you want)
5. Click "Create project"

---

### Step 2: Enable Authentication Methods

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable these providers:

#### Enable Email/Password:
   - Click on "Email/Password"
   - Toggle "Enable" ON
   - Click "Save"

#### Enable Google Sign-In:
   - Click on "Google"
   - Toggle "Enable" ON
   - Enter project support email
   - Click "Save"

---

### Step 3: Register Web App & Get Config

1. In Firebase Console, click the ⚙️ gear icon > **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **"Web" icon** (`</>`)
4. Enter app nickname: `Gradex Writers Admin`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **Copy the configuration code** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

---

### Step 4: Configure Your App

#### A. Update Frontend Configuration

1. Open `public/firebase-init.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### B. Download Service Account Key (for Backend)

1. In Firebase Console, go to ⚙️ > **"Project settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (a JSON file will download)
5. Rename the downloaded file to `firebase-config.json`
6. Move it to your project root folder (same location as `server.js`)

⚠️ **IMPORTANT:** Never commit `firebase-config.json` to git! It's already in `.gitignore`

---

### Step 5: Create Your First Admin User

#### Option A: Firebase Console (Recommended for first user)

1. Go to **Authentication** > **Users** tab
2. Click **"Add user"**
3. Enter email: `admin@yourdomain.com`
4. Enter a strong password
5. Click "Add user"

#### Option B: During First Login

Just use the login page and Firebase will create the account automatically (if enabled).

---

## 🎯 Testing Your Setup

### 1. Start the Server

```bash
npm install
npm start
```

You should see:
```
🔥 Firebase Authentication: ENABLED
```

If you see "NOT CONFIGURED", check your `firebase-config.json` file.

### 2. Test Login

1. Go to http://localhost:3000/admin
2. Try logging in with:
   - Email: The email you created in Firebase
   - Password: The password you set

### 3. Test Google Sign-In

1. Click "Sign in with Google"
2. Choose your Google account
3. Should redirect to dashboard

---

## 📁 File Structure

```
gradex-writers-mvp/
├── firebase-config.json          ← Backend service account (DO NOT COMMIT!)
├── firebase-config.example.json  ← Example template
├── public/
│   └── firebase-init.js          ← Frontend configuration
├── server.js                     ← Uses firebase-admin
└── admin/
    ├── login.html                ← Uses Firebase Auth
    └── dashboard.js              ← Verifies tokens
```

---

## 🔒 Security Best Practices

### 1. Authorized Domains

Add your production domain to Firebase:

1. Go to **Authentication** > **Settings**
2. Scroll to **"Authorized domains"**
3. Click "Add domain"
4. Add your production domain (e.g., `yourdomain.com`)

### 2. Password Policy

Configure password requirements:

1. Go to **Authentication** > **Settings**
2. Click "Password policy" tab
3. Set minimum password length (recommend 8+)
4. Enable other requirements as needed

### 3. Email Verification (Optional but Recommended)

Enable email verification:

1. In `admin/login.html`, after successful login, add:
```javascript
if (!user.emailVerified) {
    await user.sendEmailVerification();
    alert('Please verify your email. Check your inbox.');
}
```

### 4. Restrict to Specific Emails (Recommended)

Add this to `server.js` in the `authenticateFirebaseToken` function:

```javascript
const allowedEmails = [
    'admin@yourdomain.com',
    'manager@yourdomain.com'
];

if (!allowedEmails.includes(decodedToken.email)) {
    return res.status(403).json({ error: 'Unauthorized email' });
}
```

---

## 🌐 Production Deployment

### Environment Variables

Instead of hardcoding, use environment variables:

#### Backend (.env file):
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
```

#### Frontend (in your build process):
```javascript
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // ... other config
};
```

### Update server.js for Environment Variables

Replace the service account loading with:

```javascript
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
});
```

---

## 🔧 Troubleshooting

### Error: "Firebase not configured"

**Problem:** `firebase-config.json` not found or invalid

**Solution:**
1. Check file exists in project root
2. Verify JSON is valid (no syntax errors)
3. Ensure file name is exactly `firebase-config.json`

### Error: "Invalid API key"

**Problem:** Wrong API key in `public/firebase-init.js`

**Solution:**
1. Go to Firebase Console > Project Settings
2. Copy the exact configuration
3. Update `public/firebase-init.js`

### Error: "auth/unauthorized-domain"

**Problem:** Your domain not authorized in Firebase

**Solution:**
1. Firebase Console > Authentication > Settings
2. Add your domain to "Authorized domains"
3. For local development, `localhost` should already be there

### Error: "auth/operation-not-allowed"

**Problem:** Authentication method not enabled

**Solution:**
1. Firebase Console > Authentication > Sign-in method
2. Enable Email/Password or Google
3. Save changes

### Google Sign-In Popup Blocked

**Problem:** Browser blocking popup

**Solution:**
1. Allow popups for your domain
2. Or use redirect instead:
```javascript
await auth.signInWithRedirect(provider);
```

---

## 🎓 Advanced Features

### 1. Password Reset

Already implemented in `admin/login.html`:
- Click "Forgot Password?"
- Enter email
- Check inbox for reset link

### 2. Multi-Factor Authentication

Enable 2FA for extra security:

```javascript
// In login.html after successful login
const multiFactorUser = multiFactor(user);
// Enroll phone number or TOTP
```

### 3. Custom Email Templates

Customize password reset and verification emails:

1. Firebase Console > Authentication > Templates
2. Customize templates for your brand
3. Add your logo and colors

### 4. Session Management

Configure session length:

```javascript
// Set session persistence
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
// or
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
```

---

## 📊 Monitoring & Analytics

### View Authentication Activity

1. Firebase Console > Authentication > Users
2. See all registered users
3. View last sign-in times
4. Disable users if needed

### Enable Firebase Analytics

1. Firebase Console > Analytics
2. Follow setup wizard
3. Track user behavior and errors

---

## 💡 Tips

### For Development

- Use `localhost` is already authorized
- You can use real email or test accounts
- Firebase emulator suite available for offline testing

### For Production

- ✅ Use environment variables
- ✅ Enable email verification
- ✅ Set up custom domains
- ✅ Configure security rules
- ✅ Monitor authentication logs
- ✅ Set up billing alerts

---

## 📞 Need Help?

### Firebase Documentation
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Admin SDK Setup](https://firebase.google.com/docs/admin/setup)

### Common Issues
- Check Firebase Console for error messages
- Verify all credentials are correct
- Ensure billing is enabled (required for some features)
- Check browser console for errors

---

## ✅ Setup Checklist

- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Google Sign-In
- [ ] Registered web app in Firebase
- [ ] Downloaded service account JSON
- [ ] Renamed to `firebase-config.json`
- [ ] Updated `public/firebase-init.js` with config
- [ ] Created first admin user
- [ ] Tested email/password login
- [ ] Tested Google Sign-In
- [ ] Added authorized domains
- [ ] Set password policy
- [ ] Reviewed security rules

---

## 🎉 You're All Set!

Once you complete these steps, you'll have:

- ✅ Secure authentication with Firebase
- ✅ Email/password login
- ✅ Google Sign-In
- ✅ Password reset
- ✅ Session management
- ✅ Enterprise-grade security

Your admin dashboard is now protected by Firebase Authentication!

---

## 📝 Quick Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Test Firebase connection
# Check server logs for "Firebase Authentication: ENABLED"

# Create admin user
# Go to Firebase Console > Authentication > Users > Add user
```

---

**Need more help? Check the Firebase documentation or open an issue!**

*We Write. You Excel.* ✍️

