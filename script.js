// Global variables
let activeWindows = new Set();
let windowZIndex = 100;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen for 3 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        
        // Initialize time
        updateTime();
        setInterval(updateTime, 1000);
        
        // Set login time
        const now = new Date();
        document.getElementById('login-time').textContent = now.toLocaleString();
        
        // Open terminal by default
        openWindow('terminal-window');
    }, 3000);
});

// Update menu bar time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Window management functions
function openWindow(windowId, forceToTop = false) {
    const window = document.getElementById(windowId);
    if (!window) return;
    
    window.style.display = 'block';
    
    if (forceToTop) {
        // Force this window to be on top of everything
        windowZIndex = windowZIndex + 1;
        window.style.zIndex = windowZIndex;
    } else {
        // Get the highest z-index from all visible windows
        const allWindows = document.querySelectorAll('.window[style*="display: block"]');
        let maxZ = 100;
        allWindows.forEach(w => {
            const z = parseInt(w.style.zIndex) || 0;
            maxZ = Math.max(maxZ, z);
        });
        
        windowZIndex = maxZ + 1;
        window.style.zIndex = windowZIndex;
    }
    
    activeWindows.add(windowId);
    makeWindowDraggable(window);
    
    if (windowId === 'terminal-window') {
        startTerminalCursor();
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;
    
    window.style.display = 'none';
    activeWindows.delete(windowId);
}

function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.classList.contains('control')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current position
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        windowElement.style.zIndex = ++windowZIndex;
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        // Calculate new position
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        // Ensure window stays within bounds
        const menuBarHeight = 22;
        const dockHeight = 80;
        const windowWidth = windowElement.offsetWidth;
        const windowHeight = windowElement.offsetHeight;
        
        const maxX = window.innerWidth - windowWidth;
        const maxY = window.innerHeight - windowHeight - dockHeight;
        const minY = menuBarHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(minY, Math.min(newTop, maxY));

        windowElement.style.left = newLeft + 'px';
        windowElement.style.top = newTop + 'px';
    }

    function dragEnd() {
        isDragging = false;
    }
}

// Terminal cursor animation
function startTerminalCursor() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.animation = 'blink 1s infinite';
    }
}

// Finder content management - COMPLETELY REWRITTEN
function showContent(contentType) {
    // Force all windows opened from finder to appear on top
    switch(contentType) {
        case 'about':
            openWindow('terminal-window', true);
            break;
        case 'contact':
            openWindow('messages-window', true);
            break;
        case 'skills':
            openWindow('settings-window', true);
            break;
        case 'projects':
            showProjects();
            break;
        case 'resume':
            openWindow('resume-window', true);
            break;
        case 'blog':
            openWindow('blog-window', true);
            break;
        case 'games':
            openWindow('games-window', true);
            break;
        case 'gallery':
            openWindow('gallery-window', true);
            break;
    }
}

function showProjects() {
    openProjectCategory('all');
}

function openProjectCategory(category = 'all') {
    const projects = {
        sde: [
            {
                name: 'Influencer Engagement & Sponsorship Coordination Platform',
                url: 'https://github.com/Katherine-Deborah/iescp',
                description: 'A full-stack platform enabling sponsors and influencers to collaborate seamlessly. Includes campaign management, ad request coordination, and performance tracking features.',
                tech_stack: ['Flask', 'Vue.js', 'SQLite', 'Celery', 'Redis']
            },
            {
                name: 'EduBridge',
                url: 'https://github.com/Katherine-Deborah/edubridge/tree/master/student-dashboard',
                description: 'A modern web app for teachers to track and manage student learning progress, featuring dashboards, reflection analysis, session timelines, and tools for data export and reminders.',
                tech_stack: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Docker']
            },
            {
                name: 'Portfolio Website',
                url: '#',
                description: 'The interactive portfolio website you are currently viewing!',
                tech_stack: ['HTML', 'CSS', 'JavaScript']
            }
        ],
        ml: [
            {
                name: 'Video Analysis Q&A System',
                url: '#',
                description: 'An AI-powered tool combining image captioning, audio transcription, and a chatbot to answer questions about an uploaded video.',
                tech_stack: ['Python', 'Streamlit', 'PyTorch', 'OpenCV', 'Transformers', 'SQLite']
            },
            {
                name: 'Diabetic Retinopathy Detection',
                url: '#',
                description: 'A medical imaging pipeline that preprocesses retinal scans, extracts features using GoogLeNet and ResNet, and classifies using a Radial SVM.',
                tech_stack: ['scikit-learn', 'PyTorch', 'OpenCV', 'NumPy']
            },
            {
                name: '3D Traveling Salesman Problem',
                url: '#',
                description: 'An implementation of a Genetic Algorithm to solve the 3D Traveling Salesman Problem in Python.',
                tech_stack: ['Python', 'SciPy']
            }
        ]
    };

    // Close the projects folder window since we're opening the actual project list
    closeWindow('projects-folder');

    // FIXED: Ensure project window appears above finder
    const finderWindow = document.getElementById('finder-window');
    if (finderWindow) {
        const currentFinderZ = parseInt(finderWindow.style.zIndex) || 0;
        // Make sure the next window will be above finder
        windowZIndex = Math.max(windowZIndex, currentFinderZ + 1);
    }

    // Get all projects or filter by category
    let displayProjects = [];
    if (category === 'all') {
        displayProjects = [...projects.sde, ...projects.ml].map(project => ({
            ...project,
            category: projects.sde.includes(project) ? 'SDE' : 'ML'
        }));
    } else {
        displayProjects = projects[category].map(project => ({
            ...project,
            category: category.toUpperCase()
        }));
    }
    
    showProjectList('My Projects', displayProjects, category);
}

function showProjectList(title, projects, activeFilter = 'all') {
    // Remove existing project window if it exists
    const existingWindow = document.getElementById('project-list-window');
    if (existingWindow) {
        existingWindow.remove();
    }

    // Create a new window to show projects with guaranteed high z-index
    const projectWindow = document.createElement('div');
    projectWindow.className = 'window finder-window';
    projectWindow.id = 'project-list-window';
    projectWindow.style.width = '700px';
    projectWindow.style.height = '600px';
    projectWindow.style.top = '80px';
    projectWindow.style.left = '50%';
    projectWindow.style.transform = 'translateX(-50%)';
    projectWindow.style.display = 'block';
    
    // Force this window to have the highest z-index
    windowZIndex = windowZIndex + 10; // Add extra buffer
    projectWindow.style.zIndex = windowZIndex;

    projectWindow.innerHTML = `
        <div class="window-header">
            <div class="window-controls">
                <span class="control close" onclick="closeProjectList()"></span>
                <span class="control minimize"></span>
                <span class="control maximize"></span>
            </div>
            <div class="window-title">${title}</div>
        </div>
        <div class="window-content">
            <div class="filter-tabs">
                <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" 
                        onclick="filterProjects('all')">All</button>
                <button class="filter-btn ${activeFilter === 'sde' ? 'active' : ''}" 
                        onclick="filterProjects('sde')">SDE</button>
                <button class="filter-btn ${activeFilter === 'ml' ? 'active' : ''}" 
                        onclick="filterProjects('ml')">ML</button>
            </div>
            <div class="project-list">
                ${projects.map(project => `
                    <div class="project-item" onclick="openProject('${project.url}')">
                        <div class="project-info">
                            <h4>${project.name}</h4>
                            <p>${project.description}</p>
                            <div class="tech-stack">
                                ${project.tech_stack.map(tech => 
                                    `<span class="tech-tag">${tech}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelector('.windows-container').appendChild(projectWindow);
    makeWindowDraggable(projectWindow);
}

const minimalStyles = `
.filter-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    padding: 0 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
}

.filter-btn {
    padding: 8px 16px;
    border: 1px solid #ccc;
    background: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    background: #e0e0e0;
}

.filter-btn.active {
    background: #007acc;
    color: white;
    border-color: #005999;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
}

.tech-tag {
    background: #f0f8ff;
    border: 1px solid #007acc;
    color: #005999;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
}
`;

// Inject minimal styles
if (!document.getElementById('minimal-project-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'minimal-project-styles';
    styleElement.textContent = minimalStyles;
    document.head.appendChild(styleElement);
}

function filterProjects(category) {
    openProjectCategory(category);
}

function closeProjectList() {
    const projectWindow = document.getElementById('project-list-window');
    if (projectWindow) {
        projectWindow.remove();
    }
}

function openProject(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    }
}

function closeProjectList() {
    const projectWindow = document.getElementById('project-list-window');
    if (projectWindow) {
        projectWindow.remove();
    }
}

function openProject(url) {
    if (url === '#') {
        alert('This project demo is coming soon!');
        return;
    }
    window.open(url, '_blank');
}

// Contact form submission
function submitContactForm() {
    const name = document.querySelector('.contact-input[placeholder="Your Name"]').value;
    const email = document.querySelector('.contact-input[placeholder="Your Email"]').value;
    const message = document.querySelector('.contact-textarea').value;
    
    if (name && email && message) {
        alert('Thank you for your message! I\'ll get back to you soon.');
        // Clear form
        document.querySelector('.contact-input[placeholder="Your Name"]').value = '';
        document.querySelector('.contact-input[placeholder="Your Email"]').value = '';
        document.querySelector('.contact-textarea').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Add click handler for contact form submit button
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const contactButton = document.querySelector('.contact-button');
        if (contactButton) {
            contactButton.addEventListener('click', submitContactForm);
        }
    }, 3100);
});

// Dock hover effects
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Add tooltip functionality if needed
                const title = this.getAttribute('title');
                if (title) {
                    // Could implement tooltip here
                }
            });
        });
    }, 3100);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Cmd/Ctrl + W to close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWindow = Array.from(activeWindows).pop();
        if (activeWindow) {
            closeWindow(activeWindow);
        }
    }
    
    // Cmd/Ctrl + T to open terminal
    if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        openWindow('terminal-window');
    }
    
    // Cmd/Ctrl + Shift + F to open finder
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        openWindow('finder-window');
    }
});

// Handle window focus - IMPROVED VERSION
document.addEventListener('click', function(e) {
    const window = e.target.closest('.window');
    if (window && window.style.display !== 'none') {
        // Only update z-index if this window is not already on top
        const currentZ = parseInt(window.style.zIndex) || 0;
        if (currentZ < windowZIndex) {
            window.style.zIndex = ++windowZIndex;
        }
    }
});

// CSS for project list styling
const projectListStyles = `
    .project-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .project-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .project-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    .project-icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(74, 158, 255, 0.2);
        border-radius: 8px;
    }
    
    .project-info h4 {
        color: #4a9eff;
        margin-bottom: 5px;
        font-size: 16px;
    }
    
    .project-info p {
        color: #ccc;
        font-size: 13px;
        line-height: 1.4;
    }
`;

// Inject project list styles
const styleSheet = document.createElement('style');
styleSheet.textContent = projectListStyles;
document.head.appendChild(styleSheet);

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme on startup
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
});

// Help functionality
function showHelp() {
    openWindow('help-window');
}

// Resume functionality
function downloadResume() {
    // Create a fake PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,'; // You would put actual PDF data here
    link.download = 'Katherine_Resume.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    alert('Resume download started! (In a real implementation, this would download your actual resume PDF)');
}

function printResume() {
    const resumeContent = document.querySelector('.resume-viewer').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Katherine's Resume</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #007aff; }
                    h2 { color: #007aff; border-bottom: 1px solid #007aff; padding-bottom: 5px; }
                    .contact-line { margin-bottom: 20px; }
                    .job-header { display: flex; justify-content: space-between; }
                    .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-tag { background: #007aff; color: white; padding: 4px 12px; border-radius: 12px; }
                </style>
            </head>
            <body>${resumeContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Blog functionality
function openBlogPost(postId) {
    const posts = {
        'ai-trends': {
            title: 'The Future of AI in Software Development',
            content: 'Artificial Intelligence is revolutionizing how we approach software development...',
            url: '#'
        },
        'ml-deployment': {
            title: 'ML Model Deployment Best Practices',
            content: 'Deploying machine learning models to production requires careful consideration...',
            url: '#'
        },
        'react-performance': {
            title: 'React Performance Optimization',
            content: 'Building fast, responsive React applications requires understanding...',
            url: '#'
        }
    };
    
    const post = posts[postId];
    if (post) {
        if (post.url === '#') {
            alert(`Blog post "${post.title}" coming soon! This would normally open the full article.`);
        } else {
            window.open(post.url, '_blank');
        }
    }
}

// Games functionality
function playGame(gameId) {
    const gameLinks = {
        'space': 'https://space-defender-game.vercel.app/',
        'jump': 'https://gesture-jump-game.vercel.app/',
        'cube': 'games/pong/index.html'
    };

    const gameUrl = gameLinks[gameId];
    if (gameUrl) {
        window.open(gameUrl, '_blank'); // Opens the game in a new tab
    } else {
        alert("Game not found!");
    }
}

// Gallery functionality
function viewArtwork(artworkId) {
    const artworks = {
        'image-1': {
            image: 'images/image-1.jpg'
        },
        'image-2': {
            image: 'images/image-2.jpg'
        },
        'image-3': {
            image: 'images/image-3.jpg'
        },
        'image-4': {
            image: 'images/image-4.jpg'
        },
        'image-5': {
            image: 'images/image-5.jpg'
        },
        'image-6': {
            image: 'images/image-6.jpg'
        },
        'image-7': {
            image: 'images/image-7.jpg'
        },
        'image-8': {
            image: 'images/image-8.jpg'
        }
    };

    const artwork = artworks[artworkId];
    if (artwork) {
        // Create a modal-like view for the artwork
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="text-align: center; color: white; max-width: 600px; padding: 20px;">
                <div style="width: 400px; height: 400px; background: #f0f0f0; border-radius: 8px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="${artwork.image}"  style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="background: #4a9eff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Close</button>
            </div>
        `;

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }
}