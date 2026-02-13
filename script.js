// ==================== INITIALIZATION ====================

let isThreeJSLoaded = false;
let pageFullyLoaded = false;
let portfolioInitialized = false; // Prevent double initialization

// Disable 3D background for better performance
const ENABLE_3D_BACKGROUND = false;

// Hide loader and show content
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
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
    // Prevent double initialization
    if (portfolioInitialized) {
        return;
    }
    portfolioInitialized = true;
    
    
    // Critical path - load immediately with error handling
    try {
        initTypingEffect();
    } catch (error) {
        console.error('Typing effect failed:', error);
    }
    
    try {
        initNavigation();
    } catch (error) {
        console.error('Navigation failed:', error);
    }
    
    try {
        initProjectMeter();
    } catch (error) {
        console.error('Project category selector failed:', error);
    }
    
    // Mark page as loaded after a reasonable timeout to prevent infinite loading
    setTimeout(() => {
        pageFullyLoaded = true;
    }, 3000); // 3 seconds max wait
    
    // Defer heavy features until page is fully loaded
    window.addEventListener('load', () => {
        pageFullyLoaded = true;
        
        try {
            initParticles();
        } catch (error) {
            console.error('Particles failed:', error);
        }
        
        try {
            initScrollAnimations();
        } catch (error) {
            console.error('Scroll animations failed:', error);
        }
        
        // Fallback AOS for data-aos elements
        try {
            initAOS();
        } catch (error) {
            console.error('AOS fallback failed:', error);
        }
        
        try {
            initAIAssistant();
        } catch (error) {
            console.error('AI Assistant failed:', error);
        }
        
        try {
            initContactForm();
        } catch (error) {
            console.error('Contact form failed:', error);
        }
        
        try {
            initPrototypeZoom();
        } catch (error) {
            console.error('Prototype zoom failed:', error);
        }
        
        try {
            initLazyFigmaLoad();
        } catch (error) {
            console.error('Lazy Figma load failed:', error);
        }
        
        // 3D Background disabled for better performance
        if (ENABLE_3D_BACKGROUND && typeof THREE !== 'undefined') {
            try {
                init3DBackground();
            } catch (error) {
                console.error('3D background failed:', error);
            }
        } else {
        }
        
    });
}

// ==================== THREE.JS 3D BACKGROUND ====================
function init3DBackground() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
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
    const particleCount = 15; // Reduced for better performance
    
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
    
    // Keyboard support for hamburger menu
    hamburger?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
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
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 95%', // Start earlier
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.05, // Reduced delay
            scrollTrigger: {
                trigger: card,
                start: 'top 95%', // Start earlier
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: index * 0.08, // Reduced delay
            scrollTrigger: {
                trigger: item,
                start: 'top 95%', // Start earlier
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
        threshold: 0.05,
        rootMargin: '0px 0px 100px 0px' // Trigger animations earlier (100px before element enters viewport)
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply delay if specified in data-aos-delay
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, parseInt(delay));
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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

// ==================== ANIMATED COUNTERS ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const start = 0;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Easing function for smooth animation
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(start + (target - start) * easeOut);
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', initCounters);

// ==================== AI ASSISTANT V2 (MODERN CHATBOT) ====================
function initAIAssistant() {
    const assistantToggle = document.getElementById('assistantToggle');
    const assistantChat = document.getElementById('assistantChat');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!assistantToggle || !assistantChat) return;
    
    // Toggle chat window
    function toggleChat() {
        const isActive = assistantChat.classList.contains('active');
        if (isActive) {
            assistantChat.classList.remove('active');
        } else {
            assistantChat.classList.add('active');
            chatInput?.focus();
        }
    }
    
    assistantToggle.addEventListener('click', toggleChat);
    
    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            assistantChat.classList.remove('active');
        });
    }
    
    // Send message
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Hide welcome and quick actions
        const welcome = chatMessages.querySelector('.ai-welcome');
        const quickPrompts = document.getElementById('quickPrompts');
        if (welcome) welcome.style.display = 'none';
        if (quickPrompts) quickPrompts.style.display = 'none';
        
        addUserMessage(message);
        chatInput.value = '';
        
        // Show typing indicator
        const typingDiv = showTypingIndicator();
        
        // Respond after short delay
        setTimeout(() => {
            typingDiv.remove();
            const response = getIntelligentResponse(message);
            addBotMessage(response);
        }, 800 + Math.random() * 400);
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
    
    // Handle quick action clicks
    document.querySelectorAll('.ai-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prompt = btn.getAttribute('data-prompt');
            if (chatInput) {
                chatInput.value = prompt;
                sendUserMessage();
            }
        });
    });
    
    // Add user message
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message user';
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="ai-message-content">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message';
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    // Quick response suggestions based on context
    function getQuickResponses(message) {
        const msg = message.toLowerCase();
        
        // After background/experience info
        if (msg.includes('experience') || msg.includes('career') || msg.includes('background')) {
            return [
                { label: 'View Projects', prompt: 'What projects has he built?' },
                { label: 'Technical Skills', prompt: 'What are his AI skills?' },
                { label: 'Contact', prompt: 'How can I reach him?' }
            ];
        }
        
        // After projects info
        if (msg.includes('project') || msg.includes('built') || msg.includes('portfolio')) {
            return [
                { label: 'AI Skills', prompt: 'What are his AI skills?' },
                { label: 'Experience', prompt: 'What is his background?' },
                { label: 'Hire Him', prompt: 'Is he available for hire?' }
            ];
        }
        
        // After skills info
        if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack')) {
            return [
                { label: 'See Projects', prompt: 'What projects has he built?' },
                { label: 'Experience', prompt: 'What is his background?' },
                { label: 'Contact', prompt: 'How can I reach him?' }
            ];
        }
        
        // After availability info
        if (msg.includes('hire') || msg.includes('available') || msg.includes('opportunity')) {
            return [
                { label: 'View Projects', prompt: 'What projects has he built?' },
                { label: 'Background', prompt: 'What is his experience?' },
                { label: 'Contact Now', prompt: 'How can I contact him?' }
            ];
        }
        
        // After contact info
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('email')) {
            return [
                { label: 'See Projects', prompt: 'What projects has he built?' },
                { label: 'His Skills', prompt: 'What are his technical skills?' },
                { label: 'Background', prompt: 'What is his experience?' }
            ];
        }
        
        // After healthcare info
        if (msg.includes('healthcare') || msg.includes('hipaa') || msg.includes('patient')) {
            return [
                { label: 'Other Projects', prompt: 'What other projects has he built?' },
                { label: 'AI Skills', prompt: 'What are his AI skills?' },
                { label: 'Hire Him', prompt: 'Is he available for hire?' }
            ];
        }
        
        // After education info
        if (msg.includes('education') || msg.includes('degree') || msg.includes('university')) {
            return [
                { label: 'Experience', prompt: 'What is his work experience?' },
                { label: 'Projects', prompt: 'What projects has he built?' },
                { label: 'Skills', prompt: 'What are his skills?' }
            ];
        }
        
        // Default suggestions
        return [
            { label: 'Experience', prompt: 'What is his background?' },
            { label: 'Projects', prompt: 'What projects has he built?' },
            { label: 'Contact', prompt: 'How can I reach him?' }
        ];
    }
    
    // Add bot message with quick responses
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        // Get contextual quick responses
        const quickResponses = getQuickResponses(message);
        const quickResponsesHtml = quickResponses.map(r => 
            `<button class="quick-response-btn" data-prompt="${escapeHtml(r.prompt)}">${escapeHtml(r.label)}</button>`
        ).join('');
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div class="ai-message-content">
                <p>${formatResponse(message)}</p>
                <div class="quick-responses">${quickResponsesHtml}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add event listeners to quick response buttons
        messageDiv.querySelectorAll('.quick-response-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prompt = btn.getAttribute('data-prompt');
                if (chatInput) {
                    chatInput.value = prompt;
                    sendUserMessage();
                }
            });
        });
    }
    
    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Format response with basic markdown
    function formatResponse(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }
    
    // Intelligent response system - conversational tone
    function getIntelligentResponse(message) {
        const msg = message.toLowerCase();
        
        // Background & Experience
        if (msg.includes('background') || msg.includes('experience') || msg.includes('career') || msg.includes('work')) {
            return "Chirag has over 5 years of experience in AI product leadership and business analytics.\n\n**Current roles:**\n• AI & Business Solutions Architect at Highland Primary Care\n• AI Product Manager at MyTreks.ai\n\n**Previously:** Business Analyst at Accenture (Fortune 500), Lead BA at Third Estate Ventures, and roles at Persistent Systems.\n\nHe's delivered $5M+ in cost savings and impacted 55,000+ users across healthcare and enterprise AI projects.";
        }
        
        // Projects
        if (msg.includes('project') || msg.includes('built') || msg.includes('portfolio') || msg.includes('worked on')) {
            return "Here are some of Chirag's notable projects:\n\n**DataViz AI** — NLP-powered tool that automatically generates data visualizations from natural language queries.\n\n**Teaching Assistant AI** — Educational chatbot providing personalized learning support.\n\n**Insight Bridge** — GPT-4 powered data analysis platform.\n\n**Healthcare Analytics** — Patient outcome prediction system serving 55K+ patients.\n\nEach project focused on solving real problems with measurable impact. Check the Projects section for demos and details.";
        }
        
        // AI Skills
        if (msg.includes('skill') || msg.includes('ai') || msg.includes('tech') || msg.includes('stack') || msg.includes('tools')) {
            return "Chirag's core technical skills:\n\n**AI/ML:** Python, TensorFlow, PyTorch, LLMs (GPT-4, Claude, Gemini), Vector Databases, NLP\n\n**Analytics:** Tableau, Power BI, SQL, Pandas, Statistical Analysis\n\n**Cloud & DevOps:** AWS, Docker, Git\n\n**Product:** Strategy, User Research, Agile, Rapid Prototyping\n\nHis strength is bridging technical execution with business strategy — he speaks both languages fluently.";
        }
        
        // Availability & Hiring
        if (msg.includes('hire') || msg.includes('available') || msg.includes('availab') || msg.includes('looking') || msg.includes('open')) {
            return "Yes, Chirag is actively exploring new opportunities in AI product leadership.\n\nHe specializes in:\n• Building AI products from 0→1\n• Cross-functional team leadership\n• Rapid MVP development (weeks, not months)\n• HIPAA-compliant healthcare AI\n\n**Track record:** $5M+ in value delivered, 55K+ users impacted, 100% project delivery rate.\n\nInterested? Reach out at **chiragkhachane.ck71@gmail.com** or book a call through the Contact section.";
        }
        
        // Healthcare
        if (msg.includes('healthcare') || msg.includes('medical') || msg.includes('hipaa') || msg.includes('patient')) {
            return "At Highland Primary Care, Chirag architects HIPAA-compliant patient-facing AI solutions.\n\n**Key work:**\n• Deployed GenAI screening agents for patient intake\n• Integrated EMR/CRM systems with 100% compliance\n• Improved outcomes for 55,000+ patients\n• Zero compliance violations\n\nHe understands both the technical challenges and regulatory requirements of healthcare AI.";
        }
        
        // Education
        if (msg.includes('education') || msg.includes('degree') || msg.includes('study') || msg.includes('university') || msg.includes('school')) {
            return "**MS in Industrial & Systems Engineering**\nUniversity at Buffalo (2021-2023) — GPA: 3.8/4.0\nFocus: Data Analytics, Operations Research, AI Applications\n\n**BE in Mechanical Engineering**\nUniversity of Mumbai (2016-2020) — GPA: 3.7/4.0\n\nHe combines strong engineering fundamentals with cutting-edge AI expertise.";
        }
        
        // Contact
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('phone') || msg.includes('connect') || msg.includes('talk')) {
            return "You can reach Chirag at:\n\n**Email:** chiragkhachane.ck71@gmail.com\n**Phone:** +1 (716) 617-1669\n**LinkedIn:** linkedin.com/in/chiragkhachane\n**GitHub:** github.com/chiragkhachane\n\nOr use the contact form below to send a message directly. He typically responds within 24 hours.";
        }
        
        // Greetings
        if (msg === 'hi' || msg === 'hey' || msg === 'hello' || msg.includes('hi ') || msg.includes('hey ') || msg.includes('hello ')) {
            return "Hey! I can help you learn about Chirag's background, projects, skills, and availability.\n\nFeel free to ask anything, or try one of these:\n• \"What's his experience?\"\n• \"What projects has he built?\"\n• \"Is he available for hire?\"";
        }
        
        // Thanks
        if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
            return "You're welcome! If you'd like to connect with Chirag directly, reach out at **chiragkhachane.ck71@gmail.com** — he'd be happy to chat.";
        }
        
        // Default
        return "I can tell you about Chirag's experience, projects, technical skills, or availability.\n\nTry asking:\n• \"What's his background?\"\n• \"What projects has he built?\"\n• \"What are his AI skills?\"\n• \"Is he available for hire?\"";
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
// Contact form is handled by the Formspree handler at the bottom of the file
function initContactForm() {
    // This function is intentionally empty - the actual form handling
    // uses Formspree and is implemented in the CONTACT FORM HANDLING section below
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
    
    const figmaPrototype = document.getElementById('figmaPrototype');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    const zoomLevelDisplay = document.getElementById('zoomLevel');
    
    
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
}

// ==================== LAZY LOAD FIGMA PROTOTYPE ====================
function initLazyFigmaLoad() {
    
    const loadBtn = document.getElementById('loadFigmaBtn');
    const figmaPlaceholder = document.getElementById('figmaPlaceholder');
    const figmaIframe = document.getElementById('figmaPrototype');
    
    if (!loadBtn || !figmaPlaceholder || !figmaIframe) {
        console.warn('Figma lazy load elements not found');
        return;
    }
    
    loadBtn.addEventListener('click', function() {
        
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
            };
            
            // Timeout fallback - hide placeholder even if iframe doesn't fully load
            setTimeout(() => {
                figmaPlaceholder.style.display = 'none';
            }, 3000);
        }
    });
    
}

// Console message

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

// ==================== EASTER EGG - KONAMI CODE ====================
(function() {
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
        // Create confetti effect
        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        // Show secret message
        const message = document.createElement('div');
        message.innerHTML = '🎮 You found the secret! Thanks for exploring! 🚀';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #6366f1, #ec4899);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 99999;
            animation: popIn 0.5s ease;
            box-shadow: 0 20px 60px rgba(99, 102, 241, 0.5);
        `;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 4000);
        
    }
    
    function createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 99998;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
    
    // Add confetti keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        @keyframes popIn {
            from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
})();

// ==================== FINAL TOUCHES ====================

// Add loading screen fade out
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Log page view analytics (placeholder for future implementation)
function logPageView() {
}

logPageView();

