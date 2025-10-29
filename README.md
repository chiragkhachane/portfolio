# 🚀 Chirag Khachane - AI Portfolio Website

A stunning, modern 3D portfolio website showcasing AI, Product Management, and Data Analytics expertise. Features an interactive floating robot powered by Google Gemini AI.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)

## ✨ Features

### 🎨 Visual Excellence
- **3D Animated Background** - Interactive Three.js scene with floating geometric shapes
- **Glassmorphism Design** - Modern, premium UI with backdrop blur effects
- **Smooth Animations** - GSAP-powered scroll animations and transitions
- **Responsive Design** - Perfect on all devices from mobile to 4K displays
- **Particle Effects** - Floating particles creating depth and movement

### 🤖 AI Integration
- **Google Gemini Assistant** - Floating robot chatbot that answers questions about your experience
- **Contextual Responses** - Pre-trained with your portfolio information
- **Interactive Chat** - Real-time conversations about projects, skills, and experience

### 📱 Sections
1. **Hero Section** - Eye-catching introduction with typing effect
2. **About** - Expertise areas and technical skills
3. **Experience** - Interactive timeline of professional journey
4. **Projects** - AI/ML projects with beautiful cards and images
5. **Contact** - Multiple ways to connect

### 🎯 Highlights
- 15+ AI/ML/Analytics projects showcased
- 7 professional experiences detailed
- Interactive skill tags and tech stack
- Social media integration
- Email contact form
- Smooth scroll navigation

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **Animations**: GSAP (GreenSock Animation Platform)
- **AI**: Google Gemini API
- **Fonts**: Orbitron, Space Grotesk, Inter
- **Icons**: Font Awesome 6

## 🚀 Quick Start

### 1. Clone or Download
```bash
cd New_AI_Portfolio
```

### 2. Open in Browser
Simply open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or use a local server (recommended):
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

### 3. Add Google Gemini API Key

To enable the AI assistant:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on the floating robot icon in the bottom-right
3. Enter your API key when prompted
4. Start chatting with your AI assistant!

## 📝 Customization Guide

### Update Personal Information

#### Contact Details (index.html)
```html
<!-- Search for these and update -->
<a href="mailto:YOUR_EMAIL@gmail.com">YOUR_EMAIL@gmail.com</a>
<a href="tel:+1XXXXXXXXXX">+1 (XXX) XXX-XXXX</a>
<p>Your Location</p>
```

#### Social Links (index.html)
```html
<a href="https://github.com/YOUR_USERNAME" target="_blank">
<a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank">
<a href="https://instagram.com/YOUR_USERNAME" target="_blank">
```

### Add/Modify Projects

Add new project cards in the projects section:

```html
<div class="project-card" data-aos="fade-up" data-category="ai">
    <div class="project-image">
        <img src="YOUR_IMAGE_URL" alt="Project Name">
        <div class="project-overlay">
            <div class="project-links">
                <a href="YOUR_GITHUB_LINK" target="_blank" class="project-link">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="project-content">
        <div class="project-tags">
            <span class="tag ai-tag">AI</span>
        </div>
        <h3>Your Project Name</h3>
        <p>Your project description...</p>
        <div class="project-tech">
            <span>Python</span>
            <span>TensorFlow</span>
        </div>
    </div>
</div>
```

### Update Experience

Modify the timeline items in the experience section to reflect your journey.

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #8b5cf6;
    /* Modify these to change the color scheme */
}
```

### Update AI Assistant Context

In `script.js`, find the `processWithGemini` function and update the context:

```javascript
const context = `You are an AI assistant for YOUR NAME's portfolio. 
    
About YOU:
- Update with your information
- Your skills
- Your experience
...`;
```

## 🎨 Project Images

The portfolio uses AI-generated images from Unsplash. You can replace them with:
- Your own project screenshots
- Custom AI-generated images
- Relevant stock photos

Recommended image sources:
- [Unsplash](https://unsplash.com/) - High-quality free images
- [Pexels](https://www.pexels.com/) - Free stock photos
- [DALL-E](https://openai.com/dall-e-2) - AI-generated images
- [Midjourney](https://www.midjourney.com/) - AI art generation

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🌟 Features Breakdown

### Three.js 3D Background
- 15 animated geometric shapes
- Mouse-reactive camera movement
- Smooth rotation animations
- Multiple colored wireframe materials

### GSAP Animations
- Scroll-triggered animations
- Parallax effects
- Smooth transitions
- Timeline animations

### Gemini AI Assistant
- Real-time chat interface
- Context-aware responses
- API key storage in localStorage
- Professional conversation about your portfolio

## 🔧 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (limited support)

## 📈 Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **CDN Resources**: All external libraries loaded from CDN
3. **Lazy Loading**: Images load as you scroll
4. **Debounced Scroll**: Optimized scroll event handling

## 🚀 Deployment

### GitHub Pages
1. Create a new repository on GitHub
2. Push your code
3. Go to Settings → Pages
4. Select main branch
5. Your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME`

### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository
3. Instant deployment with custom domain support

### Vercel
```bash
npm i -g vercel
vercel
```

## 📄 License

This portfolio is free to use and modify for personal use. Please give credit if you use this template.

## 💬 Support

For questions or issues:
- Email: chiragkhachane.ck71@gmail.com
- LinkedIn: [linkedin.com/in/chiragkhachane](https://linkedin.com/in/chiragkhachane)
- GitHub: [@chiragkhachane](https://github.com/chiragkhachane)

## 🎉 Acknowledgments

- **Three.js** - 3D graphics library
- **GSAP** - Animation platform
- **Google Gemini** - AI assistant
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **Unsplash** - Images

---

**Built with ❤️ and AI by Chirag Khachane**

🌟 **Star this repo if you found it helpful!**
