# FAQ Builder - GitHub Pages Hosting Guide

This folder contains all the files needed to host the FAQ Builder on GitHub Pages or any other web hosting service.

## Files Included

- `index.html` - Main HTML file
- `style.css` - All CSS styles
- `script.js` - JavaScript functionality
- `README.md` - This guide

## Quick Start

### Option 1: GitHub Pages (Recommended)
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" and choose "main"
5. Your FAQ Builder will be available at `https://yourusername.github.io/your-repo-name`

### Option 2: Single File Hosting
If you prefer a single file, use `faq-builder-standalone.html` from the parent directory. It contains everything inline and can be hosted anywhere.

## Features

✅ **Drag & Drop Interface** - Intuitive question management  
✅ **Multiple FAQ Tabs** - Organize questions by category  
✅ **Live Preview** - See changes in real-time  
✅ **Custom Colors** - Match your brand (default: #DF1783)  
✅ **Responsive Design** - Works on all devices  
✅ **Code Generation** - Get clean, embeddable HTML/CSS/JS  
✅ **No Dependencies** - Self-contained widget code  

## How to Use

1. **Add Tabs**: Click "Add Tab" to create FAQ categories
2. **Add Questions**: Click "Add Question" to create FAQ items
3. **Customize**: Use the "Customize" button to change colors and styling
4. **Preview**: See live updates in the preview panel
5. **Generate Code**: Click "Get Code" to export embeddable widget code
6. **Embed**: Copy the generated code and paste it into your website

## Customization

### Changing Default Colors
Edit `style.css` and modify the CSS custom properties:
```css
:root {
    --primary-color: #DF1783; /* Change this to your brand color */
}
```

### Styling the Generated Widget
The generated code is self-contained and can be further customized by modifying the inline styles in the generated HTML.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Structure

```
faq-builder-files/
├── index.html          # Main application
├── style.css           # Styles
├── script.js           # JavaScript functionality
└── README.md           # This guide
```

## Development

To modify the FAQ Builder:

1. Edit `index.html` for structure changes
2. Edit `style.css` for styling modifications
3. Edit `script.js` for functionality updates

The application uses vanilla JavaScript with no external dependencies, making it easy to customize and maintain.

## License

This FAQ Builder is free to use and modify for any purpose.

---

**Created with ❤️ by MiniMax Agent**