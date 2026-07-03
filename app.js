/* ============================================================
   ASIF MANSURI – PORTFOLIO JAVASCRIPT v2.0
   ============================================================ */

'use strict';

/* ---- 1. Custom Cursor ---- */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');

let mouseX = -500, mouseY = -500;
let glowX  = -500, glowY  = -500;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = e.clientX + 'px';
  cursorDot.style.top   = e.clientY + 'px';
});

// Smooth glow follow
function animateCursor() {
  glowX += (mouseX - glowX) * 0.07;
  glowY += (mouseY - glowY) * 0.07;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state
document.querySelectorAll('a, button, .tilt-card, .bubble, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot && cursorDot.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorDot && cursorDot.classList.remove('hover'));
});

/* ---- 2. Particle Canvas ---- */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size  = Math.random() * 1.5 + 0.4;
    this.speed = Math.random() * 0.4 + 0.1;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.hue   = Math.random() * 60 + 220; // 220-280 (blue/purple range)
    this.drift = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

// Init particles
for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---- 3. Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  setActiveNavLink();
  checkScrollCue();
}, { passive: true });

function setActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let active     = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) active = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.dataset.section === active);
  });
}

function checkScrollCue() {
  const cue = document.getElementById('scrollCue');
  if (cue) cue.style.opacity = window.scrollY > 80 ? '0' : '1';
}

/* ---- 4. Hamburger Menu ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

/* ---- 5. Typing Animation ---- */
const roles = [
  'Solutions Architect – AV & UC 🏢',
  'Senior Pre-Sales Engineer ⚡',
  'Smart Workplace & Automation Specialist 🏠',
  'B2B Solutions Designer 📐',
  'Lightware Taurus UCX Expert 🏅',
  'Technical Sales Consultant 🤝',
];
let rIdx = 0, cIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedRole');

function typeEffect() {
  if (!typedEl) return;
  const current = roles[rIdx];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      setTimeout(() => { isDeleting = true; }, 2400);
      setTimeout(typeEffect, 2600);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      isDeleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 55 : 80);
}
typeEffect();

/* ---- 6. Reveal on Scroll ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // Animate skill bars
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        if (w) bar.style.width = w + '%';
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- 7. Stagger Delays ---- */
document.querySelectorAll('.tl-item').forEach((item, i) => {
  item.style.setProperty('--delay', `${i * 0.07}s`);
});

/* ---- 8. Counter Animation (Stats) ---- */
function animateCount(el, target, suffix) {
  const duration = 2000;
  const start    = performance.now();
  function run(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.round(easeOutCubic(t) * target);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(run);
  }
  requestAnimationFrame(run);
}
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const statsObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.stat-value').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      animateCount(el, target, suffix);
    });
    statsObs.disconnect();
  }
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

/* ---- 9. 3D Tilt Cards ---- */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rx   = ((y - cy) / cy) * -6;
    const ry   = ((x - cx) / cx) *  6;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- 10. Sparkle on Click ---- */
document.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    createSparkle(e.clientX, e.clientY);
  }
});

function createSparkle(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle-particle';
  const size = Math.random() * 6 + 3;
  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * 60 + 20;
  const hue   = Math.random() * 80 + 220;
  s.style.cssText = `
    left: ${x}px; top: ${y}px;
    width: ${size}px; height: ${size}px;
    background: hsl(${hue}, 100%, 70%);
    box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 70%);
    animation: sparkleOut 0.7s ease forwards;
    --tx: ${Math.cos(angle) * dist}px;
    --ty: ${Math.sin(angle) * dist}px;
  `;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

// Inject sparkle keyframes
const sStyle = document.createElement('style');
sStyle.textContent = `
  @keyframes sparkleOut {
    0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(sStyle);

/* ---- 11. Contact Form Handler ---- */
function handleContactForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('form-submit-btn');
  const btnText = document.getElementById('btn-text');
  const success = document.getElementById('formSuccessMsg');

  btnText.textContent = '⏳ Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btnText.textContent = '✅ Message Sent!';
    success.style.display = 'block';
    document.getElementById('contactForm').reset();

    setTimeout(() => {
      btnText.textContent = 'Send Message ✈️';
      btn.disabled = false;
      success.style.display = 'none';
    }, 5000);
  }, 1500);
}

/* ---- 12. Parallax Mouse Effect on Hero ---- */
let lastMX = 0, lastMY = 0;
document.addEventListener('mousemove', (e) => {
  lastMX = e.clientX;
  lastMY = e.clientY;
});

function applyParallax() {
  const cx = lastMX / window.innerWidth  - 0.5;
  const cy = lastMY / window.innerHeight - 0.5;
  const orbit = document.querySelector('.avatar-orbit');
  if (orbit) {
    orbit.style.transform = `rotate(${cx * 15}deg) scale(${1 + cy * 0.05})`;
  }
  requestAnimationFrame(applyParallax);
}
applyParallax();

/* ---- 13. Scroll Progress Indicator ---- */
function createScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, hsl(248,100%,69%), hsl(191,100%,50%));
    z-index: 9999; width: 0%; transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 8px hsla(248,100%,69%,0.6);
  `;
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}
createScrollProgress();



console.log('%c✨ Asif Mansuri Portfolio v2.0 Loaded!', 'color: #6c63ff; font-size: 14px; font-weight: bold;');
