// ── State ─────────────────────────────────────────────────
let windowZIndex   = 100;
let activeWindows  = new Set();
let draggingWindow = null;
let dragOffsetX    = 0;
let dragOffsetY    = 0;

// ── Project Data ──────────────────────────────────────────
const PROJECTS = {
    sde: [
        {
            id: 'meal-prep',
            emoji: '🍽️',
            name: 'Meal Prep Maestro',
            url: 'https://github.com/Katherine-Deborah/meal-prep',
            liveUrl: 'https://meal-prep-steel.vercel.app',
            description: 'Full-stack meal planning app with recipe management, auto-generated grocery lists, and a weekly meal calendar.',
            tech_stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui', 'Vite'],
            detail: {
                overview: 'Meal Prep Maestro is a full-stack web app that helps you plan your week\'s meals, manage a recipe library, and auto-generate a grocery list from whatever\'s on the calendar. Real-time sync via Supabase means changes show up instantly across devices.',
                thought_process: 'I wanted something I\'d actually use. Meal planning was chaotic — tabs open everywhere, notes scattered, ingredients forgotten. I decided to build a clean tool that connects the three parts that always need to talk to each other: recipes, a weekly planner, and a shopping list. Supabase gave me real-time sync without writing a backend from scratch, and shadcn/ui gave me polished, unstyled components I could actually customize.',
                tech_decisions: 'React + TypeScript for type safety throughout. Supabase for real-time data and auth without backend overhead. shadcn/ui + Tailwind for a design system that\'s fast to build with but not opinionated. Vite for near-instant dev reloads.',
                results: [
                    'Deployed and live at meal-prep-steel.vercel.app',
                    'Recipe library with tagging, search, and detail sheets',
                    'Weekly calendar planner with recipe assignment',
                    'Auto-generated grocery list from planned meals',
                    'Supabase real-time sync across sessions'
                ]
            }
        },
        {
            id: 'iescp',
            emoji: '📢',
            name: 'Influencer Engagement & Sponsorship Platform',
            url: 'https://github.com/Katherine-Deborah/iescp',
            liveUrl: null,
            description: 'Multi-role platform connecting sponsors and influencers. Campaign management, ad request workflows, and performance dashboards.',
            tech_stack: ['Flask', 'Vue.js', 'SQLite', 'Celery', 'Redis'],
            detail: {
                overview: 'IESCP is a multi-role web platform with three distinct user types: admin, sponsor, and influencer. Sponsors create campaigns and send ad requests; influencers browse opportunities and manage their earnings. Background tasks (notifications, reminders, payment triggers) run asynchronously via Celery + Redis.',
                thought_process: 'The brief was a real-world influencer marketplace. The hardest part was designing clean role-based access — each user type sees a completely different interface and has different permissions. I chose Flask for its routing flexibility and Vue.js for reactive UI without a heavy SPA build step.',
                tech_decisions: 'Flask + Vue.js keeps backend and frontend loosely coupled. SQLite for simplicity in a single-server deployment. Celery + Redis handles async background jobs so the main request thread stays responsive. Role-based access enforced at both route and template level.',
                results: [
                    'Three-role authentication: admin, sponsor, influencer',
                    'Campaign creation and ad request negotiation workflow',
                    'Async background jobs with Celery + Redis',
                    'Performance dashboards per user role',
                    'Flagging and admin moderation system'
                ]
            }
        },
        {
            id: 'portfolio',
            emoji: '🖥️',
            name: 'Portfolio Website',
            url: 'https://github.com/Katherine-Deborah/katherine-deborah.github.io',
            liveUrl: 'https://katherine-deborah.github.io',
            description: 'The macOS-inspired interactive portfolio you\'re currently exploring — draggable windows, a dock, dark/light mode, and slide-in project case studies.',
            tech_stack: ['HTML', 'CSS', 'JavaScript'],
            detail: {
                overview: 'This portfolio is itself the project. Instead of a traditional page, it simulates a macOS desktop environment with draggable, stackable windows, a functional dock, dark/light mode, keyboard shortcuts, and a project detail panel that slides in on click.',
                thought_process: 'I wanted a portfolio that demonstrated frontend skills through the interface itself rather than just listing them. The macOS metaphor is immediately recognizable and gives a shared vocabulary for interactions — users already know what a window, a dock, and a close button do. The fun is making it feel real.',
                tech_decisions: 'No frameworks — vanilla HTML, CSS, and JS. CSS custom properties power the full theme system. A single global drag handler (not per-window) prevents the listener-accumulation bug that plagues most drag implementations. Z-index stacking mirrors real window management.',
                results: [
                    'Fully interactive macOS desktop simulation',
                    'Draggable windows with proper viewport clamping',
                    'Dark/light mode with localStorage persistence',
                    'Slide-in project detail panel with case study layout',
                    'Blog, Gallery, Games, and Finder all functional'
                ]
            }
        }
    ],
    ml: [
        {
            id: 'peppercloud',
            emoji: '🌶️',
            name: 'Business Health & Risk Engine (peppercloud)',
            url: null,
            liveUrl: null,
            description: 'End-to-end alternative data pipeline scoring 516K+ California businesses and predicting closure risk from 44 million Google Maps reviews.',
            tech_stack: ['Python', 'XGBoost', 'SHAP', 'VADER', 'Plotly Dash', 'Pandas', 'PyArrow'],
            detail: {
                overview: 'peppercloud is an alternative data risk engine built around a fintech use case: predicting business closure from public review signals. It processes 44 million Google Maps reviews for 516,000+ California businesses to assign a Health Score (0–100) and predict closure probability at three horizons — 3, 6, and 12 months. Everything surfaces in an interactive Dash dashboard with a California scatter map.',
                thought_process: 'Most businesses fail silently — the signals are buried in public review data, just unstructured. I wanted to know if declining sentiment, falling engagement, and rating instability could predict closure the way credit signals predict default. The fintech framing (one binary label mapped to multiple risk horizons via calibrated thresholds) came from reading how real credit risk models work. SHAP on every prediction was a design requirement from day one — no black boxes.',
                tech_decisions: 'Streamed 44M reviews line-by-line to avoid loading into RAM (~40 min, single pass). XGBoost histogram method for training speed at scale. VADER for sentiment — runs on CPU, no GPU needed, handles 44M reviews fine. PyArrow Parquet caching takes dashboard startup from minutes to seconds. SHAP TreeExplainer for fast, exact explanations on gradient boosted trees.',
                results: [
                    'ROC-AUC > 0.80 on held-out test set (XGBoost, 15:1 class imbalance)',
                    '307,000+ businesses scored (minimum 5 reviews threshold)',
                    '44.4 million reviews processed in ~40 min streaming pipeline',
                    '4-tab interactive dashboard: Map, Overview, Peer Benchmark, Risk Signals',
                    'Closure base rate: 6.22% (32,500 permanently closed businesses identified)',
                    'SHAP waterfall + beeswarm + dependence plots for explainability'
                ]
            }
        },
        {
            id: 'traffic-rl',
            emoji: '🚦',
            name: 'Adaptive Traffic Signal Control (RL)',
            url: null,
            liveUrl: null,
            description: 'Multi-agent reinforcement learning system for adaptive traffic signal optimization. DQN and PPO agents trained from scratch using SUMO simulator.',
            tech_stack: ['Python', 'PyTorch', 'SUMO', 'MLflow', 'TensorBoard', 'Gymnasium'],
            detail: {
                overview: 'A research-grade RL system that trains autonomous agents to control traffic signals in a SUMO-simulated urban intersection. Two algorithms — DQN and PPO — are implemented from scratch (no stable-baselines) and compared against a fixed-time baseline across four traffic scenarios: normal, NS-peak, EW-peak, and high-volume.',
                thought_process: 'Fixed traffic signals are fundamentally dumb — they cycle on a timer regardless of actual queue state. RL lets an agent observe real queue depths, waiting times, and signal phase, then decide when to switch. I wanted to implement both DQN and PPO from scratch to really understand the mechanics: the replay buffer and target network in DQN, the GAE and clipped surrogate in PPO. SUMO gives realistic traffic physics including vehicle acceleration, deceleration, and yellow-phase compliance.',
                tech_decisions: 'DQN with experience replay (50K buffer) and hard target updates every 200 steps. PPO with GAE (λ=0.95), clipped surrogate (ε=0.2), and entropy bonus. Both built from scratch in PyTorch. SUMO + TraCI for real-time simulation control. MLflow for experiment tracking and artifact management. Configurable reward functions to run ablation studies.',
                results: [
                    'DQN and PPO agents implemented from scratch in PyTorch',
                    '500 training episodes with checkpoints at ep100–ep500',
                    'Four traffic scenarios: normal, NS-peak, EW-peak, high-volume',
                    'Reward ablation: waiting time / queue length / combined / pressure',
                    'State ablation: queue, density, waiting time, phase components',
                    'MLflow experiment tracking + TensorBoard visualization',
                    '⚠️ Full benchmark vs fixed-time baseline in progress'
                ]
            }
        },
        {
            id: 'video-qa',
            emoji: '🎬',
            name: 'Video Analysis Q&A System',
            url: 'https://github.com/Katherine-Deborah/Video-Analysis-Q-A-Sytem',
            liveUrl: null,
            description: 'AI tool combining image captioning, audio transcription, and an LLM chatbot to answer natural language questions about any uploaded video.',
            tech_stack: ['Python', 'Streamlit', 'PyTorch', 'OpenCV', 'BLIP', 'Whisper', 'Qwen'],
            detail: {
                overview: 'Upload a video, ask questions about it in plain English. The system extracts frames at 0.2 FPS, captions each one using the BLIP vision-language model, transcribes the audio with Whisper, and routes your questions through a Qwen LLM loaded with all that context. SQLite caches captions so re-runs skip reprocessing.',
                thought_process: 'Video content is almost entirely unsearchable — you have to watch it. The insight was to treat video as a sequence of captioned frames plus a transcript, then hand that to an LLM as context. BLIP gives visual grounding (what\'s on screen), Whisper gives the audio layer, and Qwen reasons over both. The SQLite cache makes iterative querying fast once a video is processed.',
                tech_decisions: 'BLIP for vision-language — strong at dense scene captioning. Whisper for robust speech-to-text across accents and noise. Qwen for the QA reasoning layer. SQLite for lightweight storage and retrieval of captions. Streamlit for rapid UI deployment without frontend overhead.',
                results: [
                    'End-to-end pipeline: video upload → captions + transcript → natural language QA',
                    'Frame extraction at 0.2 FPS with BLIP visual captioning',
                    'Whisper speech-to-text transcription layer',
                    'Context-aware answers via Qwen LLM',
                    'SQLite caching for efficient re-queries on processed videos'
                ]
            }
        },
        {
            id: 'diabetic-retinopathy',
            emoji: '👁️',
            name: 'Diabetic Retinopathy Detection',
            url: 'https://github.com/Katherine-Deborah/diabetic-retinopathy-detection',
            liveUrl: null,
            description: 'Medical imaging pipeline using hybrid GoogLeNet + ResNet feature extraction with Adaptive PSO for retinal fundus classification — 94% accuracy.',
            tech_stack: ['PyTorch', 'scikit-learn', 'OpenCV', 'NumPy'],
            detail: {
                overview: 'A medical imaging system classifying diabetic retinopathy severity from retinal fundus images. Combines GoogLeNet and ResNet feature extractors with Adaptive Particle Swarm Optimization (APSO) for feature selection, then classifies using multiple ML heads — Random Forest, SVM, Decision Tree, and Linear Regression — compared across DR severity grades.',
                thought_process: 'DR is a leading cause of preventable blindness. Individual CNNs miss complementary features: GoogLeNet\'s Inception modules capture wide receptive fields while ResNet\'s residual connections allow deep feature learning. Combining them and then using APSO to select the most discriminative features — rather than using all of them — reduces dimensionality and actually improves accuracy.',
                tech_decisions: 'Hybrid feature extraction to get multi-scale representations. APSO for automated feature selection — adapts particle velocities based on convergence, finds better optima than standard PSO on high-dimensional feature spaces. Multiple classifier heads tested to find best fit for the combined feature space.',
                results: [
                    '94% classification accuracy across 5 DR severity grades',
                    'Outperformed single-model (GoogLeNet-only, ResNet-only) baselines',
                    'APSO reduced feature dimensionality while improving accuracy',
                    'Multiple ML classifiers evaluated: RF, SVM, DT, Linear Regression'
                ]
            }
        }
    ]
};

function findProject(id) {
    return [...PROJECTS.sde, ...PROJECTS.ml].find(p => p.id === id);
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme immediately
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        updateTime();
        setInterval(updateTime, 1000);
        document.getElementById('login-time').textContent = new Date().toLocaleString();
        openWindow('terminal-window');
    }, 2200);
});

// ── Time ──────────────────────────────────────────────────
function updateTime() {
    const t = new Date().toLocaleTimeString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('current-time').textContent = t;
}

// ── Window Management ─────────────────────────────────────
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.style.display = 'block';
    win.style.zIndex  = ++windowZIndex;
    activeWindows.add(windowId);
    makeWindowDraggable(win);

    if (windowId === 'terminal-window') startTerminalCursor();
    if (windowId === 'projects-window') renderProjectCards('all');
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.style.display = 'none';
    activeWindows.delete(windowId);
}

// Bring clicked window to front
document.addEventListener('click', e => {
    const win = e.target.closest('.window');
    if (win && win.style.display !== 'none') {
        if ((parseInt(win.style.zIndex) || 0) < windowZIndex) {
            win.style.zIndex = ++windowZIndex;
        }
    }
});

// ── Dragging (single global handler, no listener buildup) ─
document.addEventListener('mousemove', e => {
    if (!draggingWindow) return;
    const menuH = 24, dockH = 90;
    const winW = draggingWindow.offsetWidth;
    const winH = draggingWindow.offsetHeight;
    let left = e.clientX - dragOffsetX;
    let top  = e.clientY - dragOffsetY;
    left = Math.max(0,    Math.min(left, window.innerWidth  - winW));
    top  = Math.max(menuH, Math.min(top,  window.innerHeight - winH - dockH));
    draggingWindow.style.left   = left + 'px';
    draggingWindow.style.top    = top  + 'px';
    draggingWindow.style.right  = 'auto';
    draggingWindow.style.bottom = 'auto';
});

document.addEventListener('mouseup', () => { draggingWindow = null; });

function makeWindowDraggable(win) {
    if (win.dataset.draggable === 'true') return;
    win.dataset.draggable = 'true';
    win.querySelector('.window-header').addEventListener('mousedown', e => {
        if (e.target.classList.contains('control')) return;
        // Snapshot position (clears any CSS transform / right / bottom)
        const rect = win.getBoundingClientRect();
        win.style.transform = 'none';
        win.style.right     = 'auto';
        win.style.bottom    = 'auto';
        win.style.left      = rect.left + 'px';
        win.style.top       = rect.top  + 'px';
        dragOffsetX    = e.clientX - rect.left;
        dragOffsetY    = e.clientY - rect.top;
        draggingWindow = win;
        win.style.zIndex = ++windowZIndex;
        e.preventDefault();
    });
}

// ── Terminal ──────────────────────────────────────────────
function startTerminalCursor() {
    const c = document.querySelector('.cursor');
    if (c) c.style.animation = 'blink 1s infinite';
}

// ── Finder dispatcher ─────────────────────────────────────
function showContent(type) {
    const map = {
        about:    'terminal-window',
        contact:  'messages-window',
        skills:   'settings-window',
        projects: 'projects-window',
        resume:   'resume-window',
        blog:     'blog-window',
        games:    'games-window',
        gallery:  'gallery-window',
    };
    if (map[type]) openWindow(map[type]);
}

// ── Projects ──────────────────────────────────────────────
function renderProjectCards(filter = 'all') {
    const container = document.getElementById('project-cards-view');
    if (!container) return;

    let list = [];
    if (filter === 'all') {
        list = [
            ...PROJECTS.sde.map(p => ({ ...p, cat: 'sde' })),
            ...PROJECTS.ml.map(p  => ({ ...p, cat: 'ml'  }))
        ];
    } else {
        list = PROJECTS[filter].map(p => ({ ...p, cat: filter }));
    }

    container.innerHTML = list.map(p => `
        <div class="project-card" onclick="showProjectDetail('${p.id}')">
            <div class="project-card-left">
                <span class="project-emoji">${p.emoji}</span>
                <div class="project-card-info">
                    <h4>${p.name}</h4>
                    <p>${p.description}</p>
                    <div class="tech-tags">
                        ${p.tech_stack.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                        ${p.tech_stack.length > 4 ? `<span class="tech-tag">+${p.tech_stack.length - 4}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-card-right">
                <span class="project-cat-badge ${p.cat}">${p.cat.toUpperCase()}</span>
                <span class="project-arrow">›</span>
            </div>
        </div>
    `).join('');
}

function showProjectDetail(projectId) {
    const p = findProject(projectId);
    if (!p) return;
    const d = p.detail;

    const githubLink = p.url
        ? `<a href="${p.url}" target="_blank" class="detail-link github">GitHub ↗</a>`
        : '';
    const liveLink = p.liveUrl
        ? `<a href="${p.liveUrl}" target="_blank" class="detail-link live">Live ↗</a>`
        : '';

    document.getElementById('project-detail-view').innerHTML = `
        <div class="detail-back" onclick="hideProjectDetail()">‹ Back to Projects</div>
        <div class="detail-header">
            <span class="detail-emoji">${p.emoji}</span>
            <div>
                <h3>${p.name}</h3>
                <div class="detail-links">${githubLink}${liveLink}</div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Overview</h4>
            <p>${d.overview}</p>
        </div>
        <div class="detail-section">
            <h4>Thought Process</h4>
            <p>${d.thought_process}</p>
        </div>
        <div class="detail-section">
            <h4>Tech Decisions</h4>
            <p>${d.tech_decisions}</p>
        </div>
        <div class="detail-section">
            <h4>Results</h4>
            <ul>${d.results.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="detail-section">
            <h4>Screenshots</h4>
            <div class="screenshot-placeholder">
                <span>📷</span>
                <p>Screenshots coming soon</p>
            </div>
        </div>
        <div class="detail-tech">
            ${p.tech_stack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
    `;

    document.getElementById('project-detail-view').scrollTop = 0;
    document.getElementById('projects-inner-wrapper').classList.add('show-detail');
}

function hideProjectDetail() {
    document.getElementById('projects-inner-wrapper').classList.remove('show-detail');
}

function filterProjects(filter, btnEl) {
    document.querySelectorAll('#projects-window .filter-btn')
        .forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    hideProjectDetail();
    renderProjectCards(filter);
}

// ── Theme ─────────────────────────────────────────────────
function toggleTheme() {
    const cur = document.body.getAttribute('data-theme') || 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// ── Help ──────────────────────────────────────────────────
function showHelp() { openWindow('help-window'); }

// ── Resume ────────────────────────────────────────────────
function downloadResume() {
    const a = document.createElement('a');
    a.href = 'Katherine_Deborah.pdf';
    a.download = 'Katherine_Deborah.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ── Games ─────────────────────────────────────────────────
function playGame(id) {
    const links = {
        space: 'https://space-defender-game.vercel.app/',
        jump:  'https://gesture-jump-game.vercel.app/',
        cube:  null
    };
    if (links[id]) window.open(links[id], '_blank');
}

// ── Gallery ───────────────────────────────────────────────
function viewArtwork(id) {
    const modal = document.createElement('div');
    modal.className = 'artwork-modal';
    modal.innerHTML = `
        <button class="artwork-modal-close" onclick="this.parentElement.remove()">✕</button>
        <img src="images/${id}.jpg" alt="Artwork">
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

// ── Keyboard shortcuts ────────────────────────────────────
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const last = [...activeWindows].pop();
        if (last) closeWindow(last);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        openWindow('terminal-window');
    }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        openWindow('finder-window');
    }
});
