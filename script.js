/* ── Footer year ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Terminal typing animation ───────────────────────────────── */
const LINES = [
    { id: 'term1', text: 'INITIALIZING PORTFOLIO LOADER...' },
    { id: 'term2', text: 'AUTHENTICATION SUCCESSFUL.' },
];

const cursor = document.getElementById('cursor');
let lineIdx = 0;
let charIdx = 0;

function typeChar() {
    if (lineIdx >= LINES.length) return;
    const { id, text } = LINES[lineIdx];
    const el = document.getElementById(id);
    if (charIdx < text.length) {
        el.textContent += text[charIdx++];
        el.parentElement.appendChild(cursor);
        setTimeout(typeChar, 28 + Math.random() * 22);
    } else {
        lineIdx++;
        charIdx = 0;
        if (lineIdx < LINES.length) setTimeout(typeChar, 200);
    }
}
setTimeout(typeChar, 500);

/* ── Nav active state on scroll ──────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('section[id], div[id]').forEach(s => observer.observe(s));

/* ── Scroll-to-top button ────────────────────────────────────── */
document.querySelector('.scroll-top-btn')
    .addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── LED blink on Archive 02 server rack ─────────────────────── */
function blinkLED() {
    const card = document.querySelector('.archive-card:nth-child(2) .card-image');
    if (!card) return;
    const circles = card.querySelectorAll('circle');
    if (!circles.length) return;
    const led = circles[Math.floor(Math.random() * circles.length)];
    const orig = led.getAttribute('fill');
    led.setAttribute('fill', '#ffffff');
    setTimeout(() => led.setAttribute('fill', orig), 80);
}
setInterval(blinkLED, 1200);
