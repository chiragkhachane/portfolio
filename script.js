// ==================== INITIALIZATION ====================
let isThreeJSLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    // Critical path - load immediately
    initTypingEffect();
    initNavigation();
    
    // Defer heavy animations until page is loaded
    window.addEventListener('load', () => {
        initParticles();
        initScrollAnimations();
        initAIAssistant();
        initContactForm();
        initAOS();
        initProjectMeter();
        
        // Initialize Three.js only after everything else is loaded
        if (typeof THREE !== 'undefined') {
            isThreeJSLoaded = true;
            setTimeout(() => initThreeJS(), 100);
        }
    });
});

// ==================== THREE.JS 3D BACKGROUND ====================
function initThreeJS() {
    if (!isThreeJSLoaded) return;
    
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); // Disabled antialiasing for performance
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    camera.position.z = 30;
    
    // Reduced number of shapes from 15 to 8 for performance
    const geometries = [
        new THREE.TetrahedronGeometry(1),
        new THREE.OctahedronGeometry(1),
        new THREE.IcosahedronGeometry(1)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x6366f1, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xec4899, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        })
    ];
    
    const meshes = [];
    
    // Reduced from 15 to 8 objects
    for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 50;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.005, // Reduced rotation speed
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            }
        };
        
        scene.add(mesh);
        meshes.push(mesh);
    }
    
    // Simplified lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop with performance optimization
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate all meshes
        meshes.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
        });
        
        // Smoother camera movement
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==================== FLOATING PARTICLES ====================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30; // Reduced from 50 to 30 for performance
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ==================== TYPING EFFECT ====================
function initTypingEffect() {
    const titleElement = document.querySelector('.hero-main-title');
    if (!titleElement) return;
    
    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '3px solid #0f172a';
    
    let charIndex = 0;
    
    function type() {
        if (charIndex < originalText.length) {
            titleElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50); // Typing speed
        } else {
            // Keep blinking cursor after typing is complete
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
                titleElement.style.position = 'relative';
                // Add blinking cursor with ::after in CSS
            }, 500);
        }
    }
    
    // Start typing after a brief delay
    setTimeout(type, 500);
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') return;
    
    // GSAP ScrollTrigger animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotation: 5,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.15,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Parallax effect for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        gsap.to(heroVisual, {
            y: 100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// ==================== AOS (Animate on Scroll) ====================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ==================== READING PROGRESS BAR ====================
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);

// ==================== AI ASSISTANT (GEMINI) ====================
function initAIAssistant() {
    const assistantToggle = document.getElementById('assistantToggle');
    const assistantChat = document.getElementById('assistantChat');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKey = document.getElementById('saveApiKey');
    const apiKeySetup = document.getElementById('apiKeySetup');
    
    let geminiApiKey = 'GOOGLE_API_KEY_REMOVED'; // Pre-configured API key
    
    // Also check localStorage for user override
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        geminiApiKey = storedKey;
    }
    
    // Hide API key setup since we have a default key
    if (geminiApiKey && !storedKey) {
        apiKeySetup.style.display = 'none';
    }
    
    // Toggle chat window
    assistantToggle.addEventListener('click', () => {
        assistantChat.classList.toggle('active');
    });
    
    closeChat.addEventListener('click', () => {
        assistantChat.classList.remove('active');
    });
    
    // Save API key
    saveApiKey.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            geminiApiKey = apiKey;
            localStorage.setItem('gemini_api_key', apiKey);
            apiKeySetup.classList.remove('active');
            addBotMessage('API key saved! I\'m ready to help you. Ask me anything about Chirag\'s experience, projects, or skills!');
        }
    });
    
    // Send message
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        chatInput.value = '';
        
        // If no API key, show message
        if (!geminiApiKey) {
            apiKeySetup.classList.add('active');
            addBotMessage('Please add your Google Gemini API key first to enable the AI assistant.');
            return;
        }
        
        // Process message with Gemini
        processWithGemini(message);
    }
    
    sendMessage.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    // Add user message to chat
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Process message with Gemini API
    async function processWithGemini(userMessage) {
        // Show thinking indicator
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message bot-message thinking';
        thinkingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-astronaut"></i>
            </div>
            <div class="message-content">
                <p class="thinking-dots">Thinking<span>.</span><span>.</span><span>.</span></p>
            </div>
        `;
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            // Try Gemini API first if available
            if (geminiApiKey && geminiApiKey !== 'GOOGLE_API_KEY_REMOVED') {
                await callGeminiAPI(userMessage, thinkingDiv);
            } else {
                // Use intelligent fallback responses
                setTimeout(() => {
                    chatMessages.removeChild(thinkingDiv);
                    const response = getIntelligentResponse(userMessage);
                    addBotMessage(response);
                }, 800);
            }
        } catch (error) {
            console.error('Error:', error);
            chatMessages.removeChild(thinkingDiv);
            const response = getIntelligentResponse(userMessage);
            addBotMessage(response);
        }
    }
    
    // Intelligent fallback responses
    function getIntelligentResponse(message) {
        const msg = message.toLowerCase();
        
        // Hiring & Availability
        if (msg.includes('hire') || msg.includes('available') || msg.includes('work') || msg.includes('looking')) {
            return "🎯 Chirag is actively looking for exciting AI/Product leadership opportunities! He specializes in transforming AI concepts into shipped products. You can reach him at chiragkhachane.ck71@gmail.com or +1 (716) 617-1669 to discuss how he can help your team.";
        }
        
        // Experience
        if (msg.includes('experience') || msg.includes('background') || msg.includes('career')) {
            return "💼 Chirag brings 5+ years of AI/Product leadership experience. Currently AI Product Manager at MyTreks.ai, previously Senior Business Analyst at Third Estate Ventures and Business Analyst at Accenture. He's led cross-functional teams, shipped AI products, and driven measurable business impact across healthcare, fintech, and SaaS.";
        }
        
        // Skills
        if (msg.includes('skill') || msg.includes('technical') || msg.includes('stack') || msg.includes('tools')) {
            return "🛠️ Chirag's tech stack includes Python, TensorFlow, PyTorch, Scikit-learn for ML; Tableau & Power BI for analytics; AWS & Docker for cloud; plus strong product management skills in market research, user research, and design thinking. He bridges technical and business seamlessly!";
        }
        
        // Projects
        if (msg.includes('project') || msg.includes('portfolio') || msg.includes('built') || msg.includes('created')) {
            return "🚀 Check out Chirag's impressive projects: DataViz AI (automated data visualization), Teaching Assistant AI (NLP-powered education tool), Insight Bridge (GPT-4 data analysis), Real Estate Analytics (predictive pricing), and Healthcare Analytics (patient outcome prediction). All solving real business problems with AI!";
        }
        
        // AI/ML specific
        if (msg.includes('ai') || msg.includes('machine learning') || msg.includes('ml') || msg.includes('nlp') || msg.includes('deep learning')) {
            return "🤖 Chirag specializes in practical AI applications! He's built NLP systems, computer vision solutions, and predictive models that actually ship and drive business value. His approach: understand the business problem first, then apply the right AI/ML techniques—not the other way around.";
        }
        
        // Product Management
        if (msg.includes('product') || msg.includes('pm') || msg.includes('roadmap') || msg.includes('strategy')) {
            return "📊 As an AI Product Manager, Chirag excels at product strategy, user research, market analysis, and cross-functional leadership. He's known for rapid execution—turning ideas into MVPs in weeks, not months. He speaks both engineer and executive fluently!";
        }
        
        // Education
        if (msg.includes('education') || msg.includes('degree') || msg.includes('study') || msg.includes('university')) {
            return "🎓 Chirag studied at SUNY Buffalo, where he built a strong foundation in data science and business analytics. But his real education comes from shipping products, leading teams, and solving complex problems in fast-paced startup environments!";
        }
        
        // Contact
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('phone') || msg.includes('connect')) {
            return "📧 Ready to connect? Email Chirag at chiragkhachane.ck71@gmail.com or call +1 (716) 617-1669. You can also connect on LinkedIn at linkedin.com/in/chiragkhachane or check his GitHub at github.com/chiragkhachane. He responds fast!";
        }
        
        // Location
        if (msg.includes('location') || msg.includes('where') || msg.includes('based') || msg.includes('remote')) {
            return "📍 Chirag is based in Buffalo, NY and open to remote opportunities worldwide. He's worked successfully with distributed teams across time zones and brings strong async communication skills!";
        }
        
        // Why hire
        if (msg.includes('why') || msg.includes('different') || msg.includes('unique') || msg.includes('stand out')) {
            return "⭐ What makes Chirag different? (1) Business-first AI thinking—no solutions looking for problems (2) Rapid execution—ships MVPs in weeks (3) Bridge tech & business—translates between both worlds (4) Full-stack product thinking—from strategy to analytics to launch. He gets stuff done!";
        }
        
        // Greetings
        if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg === 'hi' || msg === 'hey') {
            return "👋 Hey there! I'm Chirag's AI assistant. I can tell you about his experience, projects, skills, and availability. What would you like to know? (Or just ask: 'Is Chirag available for hire?')";
        }
        
        // Thanks
        if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
            return "🙏 You're welcome! Feel free to reach out to Chirag directly at chiragkhachane.ck71@gmail.com if you'd like to discuss opportunities or collaboration!";
        }
        
        // Default response
        return `I can help you learn about Chirag's:\n
• 💼 Experience & Background\n
• 🛠️ Skills & Tech Stack\n
• 🚀 Projects & Portfolio\n
• 🤖 AI/ML Expertise\n
• 📊 Product Management\n
• 📧 Contact Information\n
• 🎯 Availability for Hire\n\nWhat would you like to know more about?`;
    }
    
    // Call Gemini API (for users who add their own key)
    async function callGeminiAPI(userMessage, thinkingDiv) {
        try {
            // Context about Chirag
            const context = `You are an AI assistant for Chirag Khachane's portfolio. 
            
            About Chirag:
            - AI Product Leader with 5+ years of experience
            - Current: AI Product Manager at MyTreks.ai
            - Previous: Senior Business Analyst at Third Estate Ventures, Business Analyst at Accenture, Primary Care IPA
            - Product Strategy & Operations Consultant at Compass Crew
            - Data Scientist at Atreya Innovations
            - Design Thinking Analyst at Thinkschool
            - Education: SUNY Buffalo
            - Location: Buffalo, NY
            - Email: chiragkhachane.ck71@gmail.com
            - Phone: +1 (716) 617-1669
            
            Skills:
            - AI/ML: Python, TensorFlow, PyTorch, Scikit-learn, NLP, Computer Vision
            - Analytics: Tableau, Power BI, Pandas, NumPy, Plotly
            - Cloud: AWS, Docker, Git
            - Languages: Python, JavaScript, SQL, R, Java
            - Product: Product Strategy, Market Research, User Research, Design Thinking
            
            Key Projects:
            1. DataViz AI - AI-powered data visualization platform
            2. Teaching Assistant AI - NLP-powered educational assistant
            3. Insight Bridge - Personal data analysis AI assistant with GPT-4
            4. Real Estate Analytics - Predictive pricing and market analysis
            5. Healthcare Analytics - Patient outcome prediction
            6. TRAVELLERA - AI travel assistant with NLP
            7. Play Store Price Predictor - ML model for app pricing
            8. Diabetes Prediction - Deep learning MLP model
            9. NeuroQuest - Brain imaging data analysis
            
            Answer questions about Chirag's experience, skills, projects, and how to contact him. Be helpful, professional, and concise.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${context}\n\nUser question: ${userMessage}\n\nProvide a helpful, concise response:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;
            
            // Remove thinking message
            chatMessages.removeChild(thinkingDiv);
            addBotMessage(botResponse);
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            chatMessages.removeChild(thinkingDiv);
            const fallbackResponse = getIntelligentResponse(userMessage);
            addBotMessage(fallbackResponse);
        }
    }
}

// ==================== PROJECT CATEGORY SELECTOR ====================
function initProjectMeter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const projectCategories = document.querySelectorAll('.project-category');
    
    // Function to switch category
    function switchCategory(targetCategory) {
        // Update tab states
        categoryTabs.forEach(tab => {
            if (tab.getAttribute('data-category') === targetCategory) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update project visibility
        projectCategories.forEach(category => {
            const categoryIcon = category.querySelector('.category-title i');
            let isMatch = false;
            
            // Match by icon class
            if (targetCategory === 'ai' && categoryIcon.classList.contains('fa-brain')) {
                isMatch = true;
            } else if (targetCategory === 'product' && categoryIcon.classList.contains('fa-rocket')) {
                isMatch = true;
            } else if (targetCategory === 'analytics' && categoryIcon.classList.contains('fa-chart-line')) {
                isMatch = true;
            }
            
            if (isMatch) {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        });
    }
    
    // Add click handlers to tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            switchCategory(category);
        });
    });
    
    // Initialize with AI category
    switchCategory('ai');
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Create mailto link
        const mailtoLink = `mailto:chiragkhachane.ck71@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Show success message
        alert('Thank you for your message! Your email client will open to send the message.');
        contactForm.reset();
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add floating animation to elements
function addFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animation = `float-card ${3 + index * 0.5}s ease-in-out infinite`;
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add hover tilt effect
document.querySelectorAll('.project-card, .floating-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== EASTER EGGS ====================

// Konami code easter egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Console message
console.log('%c👋 Hey there!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cLooking at the code? I like your style! 🚀', 'color: #ec4899; font-size: 16px;');
console.log('%cFeel free to reach out: chiragkhachane.ck71@gmail.com', 'color: #8b5cf6; font-size: 14px;');

// ==================== FINAL TOUCHES ====================

// Add loading screen fade out
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Log page view analytics (placeholder for future implementation)
function logPageView() {
    console.log('Portfolio viewed at:', new Date().toISOString());
}

logPageView();
