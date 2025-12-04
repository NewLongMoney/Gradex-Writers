# Quick Setup Guide

Follow these simple steps to get your Gradex Writers website up and running!

## Step 1: Install Node.js

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

To check if you have Node.js installed, run:
```bash
node --version
```

## Step 2: Install Dependencies

Open a terminal in the project folder and run:
```bash
npm install
```

This will install all required packages:
- Express (web server)
- SQLite (database)
- JWT (authentication)
- And other dependencies

## Step 3: Start the Server

Run the following command:
```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
Admin login: http://localhost:3000/admin
Default credentials - Username: admin, Password: admin123
```

## Step 4: Access the Website

Open your web browser and navigate to:

- **Main Website:** http://localhost:3000
- **Blog Page:** http://localhost:3000/blog.html
- **Admin Dashboard:** http://localhost:3000/admin

## Step 5: Login to Admin Dashboard

1. Go to http://localhost:3000/admin
2. Enter the default credentials:
   - **Username:** admin
   - **Password:** admin123
3. Click "Login"

## Step 6: Create Your First Article

1. Click the "+ New Article" button
2. Fill in the details:
   - Title: e.g., "10 Tips for Academic Writing"
   - Excerpt: Short description
   - Content: Your article content
   - Category: Choose from dropdown
   - Status: Choose "Published" to make it visible
3. Click "Save Article"

## Step 7: View Your Blog

1. Go to http://localhost:3000/blog.html
2. Your published article should appear!
3. Click on it to read the full content

## Troubleshooting

### "Port 3000 is already in use"

Another application is using port 3000. Either:
- Stop that application, or
- Change the port in `server.js` (line 10):
  ```javascript
  const PORT = process.env.PORT || 3001; // Changed to 3001
  ```

### "Cannot find module"

Run `npm install` again to ensure all dependencies are installed.

### Database Issues

Delete the `database.db` file and restart the server. The database will be recreated automatically.

### Can't Login

Make sure:
1. The server is running (check terminal)
2. You're using the correct credentials (admin/admin123)
3. There are no console errors (check browser developer tools)

## Next Steps

### Change Admin Password

For security, you should change the default password:

1. Open `server.js`
2. Find line 64 where the default admin is created
3. Change 'admin123' to your secure password
4. Delete `database.db`
5. Restart the server

### Customize Design

Edit `css/style.css` to change colors, fonts, and styling to match your brand.

### Add Images to Articles

You can add image URLs to articles:
1. Upload your image to an image hosting service (Imgur, Cloudinary, etc.)
2. Copy the image URL
3. Paste it in the "Image URL" field when creating/editing articles

## Production Deployment

Before deploying to production:

1. **Change JWT Secret** in `server.js`:
   ```javascript
   const JWT_SECRET = 'use-a-long-random-string-here';
   ```

2. **Change Default Password** (see above)

3. **Enable HTTPS** on your web server

4. **Set Environment Variables:**
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

5. **Use a Production Database** (PostgreSQL, MySQL, etc.) instead of SQLite

6. **Set up a Process Manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name gradex-writers
   pm2 startup
   pm2 save
   ```

## Need Help?

Check the main README.md file for detailed documentation, API endpoints, and more information.

---

**Happy Writing! ✍️**

