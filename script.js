// ==================== INITIALIZATION ====================
console.log('Script.js v2073 loaded successfully');

let isThreeJSLoaded = false;
let pageFullyLoaded = false;

// Hide loader and show content
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    console.log('✓ Page loader hidden');
}

// IMMEDIATE: Show chatbot button and hide loader
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader first
    hideLoader();
    
    // Make chatbot button visible
    const assistantToggle = document.getElementById('assistantToggle');
    if (assistantToggle) {
        assistantToggle.style.display = 'flex';
        assistantToggle.style.visibility = 'visible';
        assistantToggle.style.opacity = '1';
        assistantToggle.style.pointerEvents = 'all';
        console.log('✅ Chat button forced visible');
    }
    
    // Initialize portfolio
    initializePortfolio();
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    hideLoader();
    initializePortfolio();
}

function initializePortfolio() {
    console.log('Initializing portfolio...');
    
    // Critical path - load immediately with error handling
    try {
        initTypingEffect();
        console.log('✓ Typing effect initialized');
    } catch (error) {
        console.error('Typing effect failed:', error);
    }
    
    try {
        initNavigation();
        console.log('✓ Navigation initialized');
    } catch (error) {
        console.error('Navigation failed:', error);
    }
    
    // Mark page as loaded after a reasonable timeout to prevent infinite loading
    setTimeout(() => {
        pageFullyLoaded = true;
        console.log('✓ Page load timeout completed - forcing ready state');
    }, 3000); // 3 seconds max wait
    
    // Defer heavy features until page is fully loaded
    window.addEventListener('load', () => {
        pageFullyLoaded = true;
        console.log('Page fully loaded, initializing heavy features...');
        
        try {
            initParticles();
            console.log('✓ Particles initialized');
        } catch (error) {
            console.error('Particles failed:', error);
        }
        
        try {
            initScrollAnimations();
            console.log('✓ Scroll animations initialized');
        } catch (error) {
            console.error('Scroll animations failed:', error);
        }
        
        try {
            initAIAssistant();
            console.log('✓ AI Assistant initialized');
        } catch (error) {
            console.error('AI Assistant failed:', error);
        }
        
        try {
            initContactForm();
            console.log('✓ Contact form initialized');
        } catch (error) {
            console.error('Contact form failed:', error);
        }
        
        try {
            initPrototypeZoom();
            console.log('✓ Prototype zoom initialized');
        } catch (error) {
            console.error('Prototype zoom failed:', error);
        }
        
        try {
            initLazyFigmaLoad();
            console.log('✓ Lazy Figma load initialized');
        } catch (error) {
            console.error('Lazy Figma load failed:', error);
        }
        
        // Only initialize 3D if Three.js loaded AND user hasn't scrolled
        if (typeof THREE !== 'undefined') {
            try {
                init3DBackground();
                console.log('✓ 3D background initialized');
            } catch (error) {
                console.error('3D background failed:', error);
                console.log('Continuing without 3D background...');
            }
        } else {
            console.log('⚠ Three.js not loaded - skipping 3D background (site will work fine without it)');
        }
        
        console.log('✓ Portfolio initialization complete');
    });
}

// ==================== THREE.JS 3D BACKGROUND ====================
function init3DBackground() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.log('⚠ Three.js not available, skipping 3D background');
        return;
    }
    
    try {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            console.warn('Canvas element not found');
            return;
        }
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            alpha: true, 
            antialias: false,
            powerPreference: "low-power" // Optimize for battery
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit for performance
        
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
    
    } catch (error) {
        console.error('3D background initialization failed:', error);
    }
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

// ==================== AI ASSISTANT (SMART CHATBOT) ====================
function initAIAssistant() {
    console.log('🤖 Initializing AI Assistant...');
    
    const assistantToggle = document.getElementById('assistantToggle');
    const assistantChat = document.getElementById('assistantChat');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // Debug logging
    console.log('Toggle button:', assistantToggle);
    console.log('Chat window:', assistantChat);
    
    if (!assistantToggle) {
        console.error('❌ Assistant toggle button not found!');
        return;
    }
    
    if (!assistantChat) {
        console.error('❌ Assistant chat window not found!');
        return;
    }
    
    console.log('✅ Setting up event listeners...');
    
    // Toggle chat window - IMPROVED
    assistantToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Toggle clicked!');
        console.log('Before toggle - classList:', assistantChat.classList.toString());
        console.log('Before toggle - display:', window.getComputedStyle(assistantChat).display);
        
        const isActive = assistantChat.classList.contains('active');
        assistantChat.classList.toggle('active');
        
        console.log('After toggle - classList:', assistantChat.classList.toString());
        console.log('After toggle - should be:', assistantChat.classList.contains('active') ? 'OPEN (display: flex)' : 'CLOSED (display: none)');
        console.log('After toggle - actual display:', window.getComputedStyle(assistantChat).display);
        
        // Force display to ensure it shows
        if (assistantChat.classList.contains('active')) {
            assistantChat.style.display = 'flex';
            console.log('✅ Forced display: flex');
        }
        
        // Add welcome message on first open
        if (!isActive && chatMessages.children.length === 0) {
            addBotMessage("👋 Hey there! I'm Chirag's AI assistant. I can tell you about his experience, projects, skills, and availability. What would you like to know?");
        }
    });
    
    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Closing chat...');
            assistantChat.classList.remove('active');
        });
    }
    
    // Send message
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        chatInput.value = '';
        
        // Hide prompts after first message
        const quickPrompts = document.getElementById('quickPrompts');
        if (quickPrompts) {
            quickPrompts.style.display = 'none';
        }
        
        // Process message with intelligent responses
        setTimeout(() => {
            const response = getIntelligentResponse(message);
            addBotMessage(response);
        }, 600);
    }
    
    if (sendMessage) {
        sendMessage.addEventListener('click', (e) => {
            e.preventDefault();
            sendUserMessage();
        });
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendUserMessage();
            }
        });
    }
    
    // Handle quick prompt clicks
    document.querySelectorAll('.prompt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prompt = btn.getAttribute('data-prompt');
            if (chatInput) {
                chatInput.value = prompt;
                sendUserMessage();
            }
        });
    });
    
    console.log('✅ AI Assistant fully initialized!');
    
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
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Intelligent response system
    function getIntelligentResponse(message) {
        const msg = message.toLowerCase();
        
        // AI Experience (matches quick prompt)
        if (msg.includes('ai experience') || msg.includes("chirag's ai")) {
            return "🤖 **AI Leadership Experience:**\n\n**Current Roles:**\n• AI & Business Solutions Architect at Highland Primary Care - Building HIPAA-compliant GenAI patient solutions\n• AI Product Manager at MyTreks.ai - Leading career guidance AI platform\n\n**Key Achievements:**\n✅ Deployed GenAI screening agents serving 55,000+ patients\n✅ Built LLM-powered analytics platforms\n✅ 100% HIPAA compliance track record\n✅ Expertise in GPT-4, Claude, Gemini, Vector DBs\n\nI transform AI concepts into production systems with measurable ROI!";
        }
        
        // Projects (matches quick prompt)
        if (msg.includes('projects has') || msg.includes('worked on')) {
            return "� **Featured Projects:**\n\n1. **DataViz AI** - NLP-powered automated data visualization\n2. **Teaching Assistant AI** - Educational chatbot for personalized learning\n3. **Insight Bridge** - GPT-4 data analysis platform\n4. **Healthcare Analytics** - Patient outcome prediction (55K+ patients)\n5. **Real Estate Analytics** - Predictive pricing models\n\nAll projects focus on solving real business problems with measurable impact. Want to see demos or learn more about any specific project?";
        }
        
        // Skills (matches quick prompt)
        if (msg.includes('key skills') || (msg.includes('skills') && msg.includes('chirag'))) {
            return "🛠️ **Technical Skills:**\n\n**AI/ML:** Python, TensorFlow, PyTorch, LLMs (GPT-4, Claude, Gemini), Vector DBs, NLP, Computer Vision\n\n**Analytics:** Tableau, Power BI, SQL, Pandas, Advanced Statistics\n\n**Cloud & Tools:** AWS, Docker, Git, Agile, Jira\n\n**Product:** Strategy, User Research, Design Thinking, Rapid Prototyping\n\n**Special Strength:** Bridging technical execution with business strategy - I speak both languages fluently!";
        }
        
        // Healthcare (matches quick prompt)
        if (msg.includes('healthcare experience') || (msg.includes('healthcare') && msg.includes('chirag'))) {
            return "🏥 **Healthcare AI Expertise:**\n\n**At Highland Primary Care:**\n✅ Architecting HIPAA-compliant patient-facing AI solutions\n✅ Deployed GenAI agents for patient screening & scheduling\n✅ Integrated EMR/CRM systems (100% compliance)\n✅ Improved 55,000+ patient outcomes\n\n**Impact:**\n• Streamlined care coordination\n• Reduced operational costs\n• Enhanced patient experience\n• Zero compliance violations\n\nI understand both the technical challenges and regulatory requirements in healthcare AI!";
        }
        
        // Education (matches quick prompt)
        if (msg.includes('educational background') || (msg.includes('education') && msg.includes('chirag'))) {
            return "🎓 **Education:**\n\n**MS in Industrial & Systems Engineering**\nUniversity at Buffalo (2021-2023)\n• GPA: 3.8/4.0\n• Focus: Data Analytics, Operations Research, AI Applications\n\n**BE in Mechanical Engineering**\nUniversity of Mumbai (2016-2020)\n• GPA: 3.7/4.0\n• Focus: Systems Design, Engineering Analysis\n\n**Certifications:**\n• Advanced AI & ML specializations\n• Product Management certifications\n\nI combine engineering fundamentals with cutting-edge AI expertise!";
        }
        
        // Contact (matches quick prompt)
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('phone') || msg.includes('connect')) {
            return "📧 **Let's Connect!**\n\n✉️ Email: chiragkhachane.ck71@gmail.com\n📱 Phone: +1 (716) 617-1669\n💼 LinkedIn: linkedin.com/in/chiragkhachane\n💻 GitHub: github.com/chiragkhachane\n📅 Schedule a call: [Book time via Calendly]\n\n🎯 **Currently Available** for AI/Product leadership roles!\n\nI typically respond within 24 hours. Looking forward to connecting!";
        }
        
        // Hiring & Availability
        if (msg.includes('hire') || msg.includes('available') || msg.includes('work') || msg.includes('looking')) {
            return "� **Yes! I'm actively seeking opportunities!**\n\nI specialize in:\n• AI Product Leadership\n• Building 0→1 AI products\n• Cross-functional team management\n• Rapid MVP development (weeks, not months)\n\n**Proven Track Record:**\n✅ $5M+ in cost savings delivered\n✅ 55K+ users impacted\n✅ Multiple AI products shipped to production\n\nLet's discuss how I can drive AI innovation for your organization!\n\n📧 chiragkhachane.ck71@gmail.com";
        }
        
        // General Experience
        if (msg.includes('experience') || msg.includes('background') || msg.includes('career')) {
            return "💼 **5+ Years of AI/Product Leadership:**\n\n**Current (2024-Present):**\n• AI Architect at Highland Primary Care\n• AI Product Manager at MyTreks.ai\n\n**Previous:**\n• Lead Business Analyst at Third Estate Ventures\n• Business Analyst at Accenture (Fortune 500)\n• Product roles at Persistent Systems & Atreya\n\n**Impact Delivered:**\n💰 $5M+ cost savings\n👥 55,000+ users impacted\n🎯 100% project delivery rate\n\nI turn AI concepts into shipped products!";
        }
        
        // General Skills
        if (msg.includes('skill') || msg.includes('technical') || msg.includes('stack') || msg.includes('tools')) {
            return "�️ **Tech Stack:**\n\n**AI/ML:** Python, TensorFlow, PyTorch, LLMs, GenAI, Vector DBs\n**Analytics:** Tableau, Power BI, SQL, Pandas\n**Cloud:** AWS, Docker, Git\n**Product:** Strategy, User Research, Agile, Design Thinking\n\n**Unique Strength:** I bridge technical execution with business strategy seamlessly - translating between engineers and executives!";
        }
        
        // Product Management
        if (msg.includes('product') || msg.includes('pm') || msg.includes('roadmap') || msg.includes('strategy')) {
            return "📊 **AI Product Management:**\n\n**Expertise:**\n• Product strategy & roadmapping\n• User research & market validation\n• Cross-functional team leadership\n• Agile development & rapid iteration\n• Data-driven decision making\n\n**Philosophy:** Ship fast, iterate faster. I turn ideas into MVPs in weeks, not months!\n\n**Results:** 100% on-time delivery, $5M+ value created";
        }
        
        // Greetings
        if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg === 'hi' || msg === 'hey') {
            return "👋 **Hey there!**\n\nI'm Chirag's AI assistant. I can help you learn about:\n\n🤖 AI Experience & Projects\n💼 Work History & Impact\n🛠️ Technical Skills\n🏥 Healthcare AI Expertise\n🎓 Education\n📧 Contact Info\n\nTry the quick prompts below or ask me anything!";
        }
        
        // Thanks
        if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
            return "🙏 **You're very welcome!**\n\nFeel free to reach out to Chirag directly:\n📧 chiragkhachane.ck71@gmail.com\n\nHe'd love to discuss opportunities or answer any questions!";
        }
        
        // Default response
        return "💡 **I can help you learn about:**\n\n🤖 AI Experience & Expertise\n� Work History & Achievements\n🚀 Projects & Portfolio\n🛠️ Technical Skills\n🏥 Healthcare AI\n🎓 Education\n📧 Contact Information\n🎯 Availability\n\n**Try the quick prompts below or ask your question!**";
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

// ==================== FIGMA PROTOTYPE ZOOM CONTROLS ====================
function initPrototypeZoom() {
    console.log('🔍 Initializing Figma zoom controls...');
    
    const figmaPrototype = document.getElementById('figmaPrototype');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    const zoomLevelDisplay = document.getElementById('zoomLevel');
    
    console.log('Figma prototype:', figmaPrototype);
    console.log('Zoom buttons:', { zoomInBtn, zoomOutBtn, resetZoomBtn, zoomLevelDisplay });
    
    if (!figmaPrototype || !zoomInBtn || !zoomOutBtn || !resetZoomBtn || !zoomLevelDisplay) {
        console.error('❌ Zoom controls not found!');
        return;
    }
    
    let currentZoom = 100;
    const zoomStep = 25;
    const minZoom = 50;
    const maxZoom = 200;
    
    function updateZoom(newZoom) {
        currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        figmaPrototype.style.transform = `scale(${currentZoom / 100})`;
        figmaPrototype.style.transformOrigin = 'top center';
        
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${currentZoom}%`;
        }
        
        // Disable buttons at limits
        zoomOutBtn.disabled = currentZoom <= minZoom;
        zoomInBtn.disabled = currentZoom >= maxZoom;
        
        // Visual feedback for disabled state
        zoomOutBtn.style.opacity = currentZoom <= minZoom ? '0.5' : '1';
        zoomInBtn.style.opacity = currentZoom >= maxZoom ? '0.5' : '1';
        
        console.log(`Zoom updated to ${currentZoom}%`);
    }
    
    zoomInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateZoom(currentZoom + zoomStep);
    });
    
    zoomOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateZoom(currentZoom - zoomStep);
    });
    
    resetZoomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateZoom(100);
    });
    
    // Initialize
    updateZoom(100);
    console.log('✅ Zoom controls initialized successfully!');
}

// ==================== LAZY LOAD FIGMA PROTOTYPE ====================
function initLazyFigmaLoad() {
    console.log('🎨 Initializing lazy Figma loading...');
    
    const loadBtn = document.getElementById('loadFigmaBtn');
    const figmaPlaceholder = document.getElementById('figmaPlaceholder');
    const figmaIframe = document.getElementById('figmaPrototype');
    
    if (!loadBtn || !figmaPlaceholder || !figmaIframe) {
        console.warn('Figma lazy load elements not found');
        return;
    }
    
    loadBtn.addEventListener('click', function() {
        console.log('Loading Figma prototype...');
        
        // Show loading state
        loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadBtn.disabled = true;
        
        // Load the iframe
        const dataSrc = figmaIframe.getAttribute('data-src');
        if (dataSrc) {
            figmaIframe.src = dataSrc;
            figmaIframe.style.display = 'block';
            
            // Hide placeholder after iframe loads
            figmaIframe.onload = function() {
                figmaPlaceholder.style.display = 'none';
                console.log('✓ Figma prototype loaded successfully');
            };
            
            // Timeout fallback - hide placeholder even if iframe doesn't fully load
            setTimeout(() => {
                figmaPlaceholder.style.display = 'none';
            }, 3000);
        }
    });
    
    console.log('✓ Lazy Figma load ready');
}

// Console message
console.log('%c👋 Hey there!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cLooking at the code? I like your style! 🚀', 'color: #ec4899; font-size: 16px;');
console.log('%cFeel free to reach out: chiragkhachane.ck71@gmail.com', 'color: #8b5cf6; font-size: 14px;');

// ==================== CONTACT FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.</div>';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again or email me directly.</div>';
            formStatus.style.display = 'block';
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    });
}

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

