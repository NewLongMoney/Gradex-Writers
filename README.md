# Gradex Writers - Professional Writing Services

A modern, full-featured website for professional writing services with an admin dashboard for content management.

## Features

### Public Website
- ✨ Modern, responsive design with beautiful UI
- 📊 Interactive pricing calculator
- 🎨 Service showcase with detailed information
- 📝 Blog/Portfolio section with article filtering
- 🌐 Professional landing page

### Admin Dashboard
- 🔐 Secure authentication system
- ✍️ Create, edit, and delete articles
- 📰 Manage blog posts with categories
- 🎯 Draft and publish workflow
- 📱 Responsive admin interface

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd gradex-writers-mvp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. **Access the website:**
- Main website: http://localhost:3000
- Blog: http://localhost:3000/blog.html
- Admin login: http://localhost:3000/admin

## Authentication

This project uses **Firebase Authentication** for secure admin access.

### Setup Required:
Follow the quick setup guide in **FIREBASE_QUICK_START.md** to:
1. Create a Firebase project (free)
2. Enable Email/Password and Google Sign-In
3. Get your configuration keys
4. Create your first admin user

**Setup time:** ~10 minutes

📝 **Quick Start:** See `FIREBASE_QUICK_START.md`  
📚 **Detailed Guide:** See `FIREBASE_SETUP.md`

## Project Structure

```
gradex-writers-mvp/
├── admin/                  # Admin dashboard files
│   ├── login.html         # Admin login page
│   ├── dashboard.html     # Admin dashboard
│   └── dashboard.js       # Dashboard functionality
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Homepage scripts
│   └── blog.js            # Blog functionality
├── uploads/               # Uploaded images directory
├── index.html             # Main landing page
├── blog.html              # Blog/portfolio page
├── server.js              # Express server & API
├── database.db            # SQLite database (auto-created)
└── package.json           # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Articles (Public)
- `GET /api/articles` - Get all published articles
- `GET /api/articles/:slug` - Get single article by slug

### Articles (Admin - requires authentication)
- `GET /api/admin/articles` - Get all articles (including drafts)
- `POST /api/admin/articles` - Create new article
- `PUT /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article

### File Upload (Admin)
- `POST /api/admin/upload` - Upload images

## Usage

### Creating Articles

1. Log in to the admin dashboard at `/admin`
2. Click "New Article" button
3. Fill in the article details:
   - **Title:** Article title (required)
   - **Excerpt:** Short description
   - **Content:** Main article content (required)
   - **Category:** Select from predefined categories
   - **Author:** Author name
   - **Image URL:** Optional image URL
   - **Status:** Draft or Published
4. Click "Save Article"

### Managing Articles

- **Edit:** Click the "Edit" button on any article card
- **Delete:** Click the "Delete" button (confirmation required)
- **View:** Published articles appear on the blog page

### Blog Features

- Filter articles by category
- Click on any article to read full content
- Responsive design for all devices
- Direct article links (shareable URLs)

## Security Notes

⚠️ **Before deploying to production:**

1. Change the JWT secret in `server.js`:
```javascript
const JWT_SECRET = 'your-secure-random-secret-here';
```

2. Update admin password:
   - Use a strong password
   - Consider using environment variables

3. Enable HTTPS in production

4. Add rate limiting for API endpoints

5. Implement proper error logging

## Customization

### Changing Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --deep-blue: #0A1F44;
    --gold: #D4AF37;
    --white: #FFFFFF;
    --dark-blue: #08182F;
    --light-blue: #1a3357;
    --gold-dark: #B8941F;
}
```

### Adding New Categories

Update the category dropdown in:
- `admin/dashboard.html` (line ~286)
- `blog.html` (line ~102)

## Troubleshooting

### Database Issues
If you encounter database errors, delete `database.db` and restart the server to recreate it.

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### File Upload Issues
Ensure the `uploads/` directory exists and has write permissions.

## Future Enhancements

- [ ] Rich text editor for articles (TinyMCE/Quill)
- [ ] Image upload directly from dashboard
- [ ] Article search functionality
- [ ] User comments system
- [ ] SEO metadata management
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multiple admin roles
- [ ] Article scheduling

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue in the repository.

---

**We Write. You Excel.** ✍️
