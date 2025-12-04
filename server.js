const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
let firebaseInitialized = false;

// Try environment variables first (for Vercel/Production)
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            })
        });
        firebaseInitialized = true;
        console.log('✅ Firebase Admin SDK initialized with environment variables');
    } catch (error) {
        console.error('❌ Error initializing Firebase with env vars:', error.message);
    }
}
// Fallback to firebase-config.json for local development
else {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-config.json';
    if (fs.existsSync(serviceAccountPath)) {
        try {
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            firebaseInitialized = true;
            console.log('✅ Firebase Admin SDK initialized with service account');
        } catch (error) {
            console.error('❌ Error initializing Firebase Admin SDK:', error.message);
        }
    }
}

if (!firebaseInitialized) {
    console.log('⚠️  Firebase not configured. Set environment variables or add firebase-config.json');
    console.log('📝 For Vercel: Add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
    console.log('📝 For local: Add firebase-config.json file');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create admin users table (now stores Firebase UIDs)
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebase_uid TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create articles table
    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category TEXT,
        author TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ Database tables initialized');
}

// Middleware to verify Firebase token
async function authenticateFirebaseToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Development mode: allow bypass with special token
    if (!firebaseInitialized && token === 'dev-token-bypass') {
        req.user = { uid: 'dev-user', email: 'admin@dev.local' };
        return next();
    }

    if (!firebaseInitialized) {
        return res.status(503).json({ 
            error: 'Firebase authentication not configured',
            devMode: true,
            message: 'Please configure Firebase to enable authentication'
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        
        // Store user in database if not exists
        db.run(
            'INSERT OR IGNORE INTO admins (firebase_uid, email, display_name) VALUES (?, ?, ?)',
            [decodedToken.uid, decodedToken.email, decodedToken.name || decodedToken.email],
            (err) => {
                if (err) console.error('Error storing user:', err);
            }
        );
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// ========== AUTH ROUTES ==========

// Verify Firebase token endpoint
app.post('/api/auth/verify', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token required' });
    }

    // Development mode bypass
    if (!firebaseInitialized && token === 'dev-token-bypass') {
        return res.json({
            success: true,
            user: { uid: 'dev-user', email: 'admin@dev.local', displayName: 'Dev Admin' },
            devMode: true
        });
    }

    if (!firebaseInitialized) {
        return res.status(503).json({ 
            error: 'Firebase authentication not configured',
            devMode: true 
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.json({
            success: true,
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name || decodedToken.email
            }
        });
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
});

// Get Firebase config (public endpoint for frontend)
app.get('/api/firebase-config', (req, res) => {
    // Return public Firebase configuration for frontend
    // These values are safe to expose (Firebase API keys are meant to be public)
    res.json({
        config: {
            apiKey: "AIzaSyASXa4BOuw846s_lRIs9VdUcafEJppU2uY",
            authDomain: "gradex-66de5.firebaseapp.com",
            projectId: "gradex-66de5",
            storageBucket: "gradex-66de5.firebasestorage.app",
            messagingSenderId: "74888109242",
            appId: "1:74888109242:web:d1f044cf3b94dd824ef683",
            measurementId: "G-E540GTTVVB"
        }
    });
});

// ========== ARTICLE ROUTES ==========

// Get all articles (public - only published)
app.get('/api/articles', (req, res) => {
    const query = `SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC`;
    
    db.all(query, [], (err, articles) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, articles });
    });
});

// Get single article by slug (public)
app.get('/api/articles/:slug', (req, res) => {
    db.get('SELECT * FROM articles WHERE slug = ? AND status = "published"', [req.params.slug], (err, article) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ success: true, article });
    });
});

// Get all articles (admin - including drafts)
app.get('/api/admin/articles', authenticateFirebaseToken, (req, res) => {
    db.all('SELECT * FROM articles ORDER BY created_at DESC', [], (err, articles) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, articles });
    });
});

// Create article (admin only)
app.post('/api/admin/articles', authenticateFirebaseToken, (req, res) => {
    const { title, content, excerpt, category, author, image_url, status } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
    }

    // Generate slug from title
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const query = `INSERT INTO articles (title, slug, content, excerpt, category, author, image_url, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [title, slug, content, excerpt || '', category || 'General', author || 'Gradex Writers', image_url || '', status || 'draft'], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Article with this title already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, articleId: this.lastID, message: 'Article created successfully' });
    });
});

// Update article (admin only)
app.put('/api/admin/articles/:id', authenticateFirebaseToken, (req, res) => {
    const { title, content, excerpt, category, author, image_url, status } = req.body;
    const articleId = req.params.id;

    // Generate new slug if title changed
    let slug = null;
    if (title) {
        slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    const query = `UPDATE articles 
                   SET title = COALESCE(?, title),
                       slug = COALESCE(?, slug),
                       content = COALESCE(?, content),
                       excerpt = COALESCE(?, excerpt),
                       category = COALESCE(?, category),
                       author = COALESCE(?, author),
                       image_url = COALESCE(?, image_url),
                       status = COALESCE(?, status),
                       updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [title, slug, content, excerpt, category, author, image_url, status, articleId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ success: true, message: 'Article updated successfully' });
    });
});

// Delete article (admin only)
app.delete('/api/admin/articles/:id', authenticateFirebaseToken, (req, res) => {
    db.run('DELETE FROM articles WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ success: true, message: 'Article deleted successfully' });
    });
});

// Upload image endpoint
app.post('/api/admin/upload', authenticateFirebaseToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve admin pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Export for Vercel
module.exports = app;

// Start server locally only if not in Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(60));
        console.log('  ✍️  GRADEX WRITERS - Server Started Successfully!');
        console.log('='.repeat(60));
        console.log('\n📍 URLs:');
        console.log(`   Main Website:    http://localhost:${PORT}`);
        console.log(`   Blog:            http://localhost:${PORT}/blog.html`);
        console.log(`   Admin Dashboard: http://localhost:${PORT}/admin`);
        
        if (firebaseInitialized) {
            console.log('\n🔥 Firebase Authentication: ENABLED');
            console.log('   Use Firebase Auth to login');
        } else {
            console.log('\n⚠️  Firebase Authentication: NOT CONFIGURED');
            console.log('   Running in development mode');
            console.log('\n📝 To enable Firebase:');
            console.log('   1. Create Firebase project at https://console.firebase.google.com');
            console.log('   2. Download service account JSON as firebase-config.json');
            console.log('   3. Create public/firebase-init.js with your config');
            console.log('   4. Restart the server');
        }
        
        console.log('\n📚 Documentation:');
        console.log('   Quick Start: QUICK_START.md');
        console.log('   Firebase Setup: FIREBASE_SETUP.md');
        console.log('   Vercel Setup: VERCEL_SETUP.md');
        console.log('\n' + '='.repeat(60));
        console.log('  Press Ctrl+C to stop the server');
        console.log('='.repeat(60) + '\n');
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});
