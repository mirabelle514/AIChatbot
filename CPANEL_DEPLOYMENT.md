# cPanel Deployment Guide

## 🚀 Quick Deploy to cPanel

### Step 1: Build Your Project
```bash
npm run build
```

### Step 2: Upload to cPanel

#### Option A: File Manager Upload
1. Log into cPanel
2. Open **File Manager**
3. Navigate to **public_html** (or your subdomain folder)
4. **Upload** all contents from the `build` folder
5. **Extract** if uploaded as ZIP

#### Option B: FTP Upload
1. Use FTP client (FileZilla, Cyberduck)
2. Connect to your hosting server
3. Navigate to **public_html**
4. Upload `build` folder contents

### Step 3: Test Your Site
Visit your domain to see the chatbot in action!

## 📁 Required Files
- `index.html` - Main HTML file
- `asset-manifest.json` - Asset mapping
- `static/js/` - JavaScript bundles
- `static/css/` - CSS files (if any)
- `static/media/` - Images/icons (if any)

## ⚠️ Important Notes

### Claude API Won't Work on Live Site
- **No .env file support** on cPanel
- **Rule-based mode** will work perfectly
- **Auto mode** automatically uses rule-based responses
- **All enhanced insurance responses** will work

### Security
- Never commit API keys to production
- The fallback system ensures reliability
- Users can still test all chatbot features

## 🔧 Troubleshooting

### If the site doesn't load:
1. Check that all files are in the correct directory
2. Ensure `index.html` is in the root of public_html
3. Check file permissions (usually 644 for files, 755 for folders)
4. Clear browser cache

### If you get 404 errors:
1. Verify the file paths in `asset-manifest.json`
2. Check that all static files uploaded correctly
3. Ensure your hosting supports the file types

## 🌐 Domain Setup

### Root Domain
Upload to: `public_html/`

### Subdomain
Upload to: `public_html/subdomain_name/`

### Subdirectory
Upload to: `public_html/folder_name/`

## 📱 Mobile Responsiveness
The chatbot is fully responsive and will work perfectly on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

## 🎯 What Users Will See
- **Professional insurance chatbot interface**
- **Comprehensive insurance responses**
- **Easy-to-use suggestion buttons**
- **Responsive design for all devices**
- **Demo mode selector (sidebar on desktop, below header on mobile)**

## 🚀 Performance
- **Optimized production build**
- **Minified JavaScript and CSS**
- **Fast loading times**
- **SEO-friendly structure**
