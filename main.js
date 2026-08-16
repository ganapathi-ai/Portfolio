const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const documentRoot = document.documentElement;
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menu-btn');
const navLinksEl = document.getElementById('site-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const morphSphere = document.querySelector('.morph-sphere');

// ===== MOBILE NAV =====
if (menuBtn && navLinksEl) {
  const closeMenu = () => {
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    navLinksEl.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('active');
    navLinksEl.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && !prefersReducedMotion.matches && hasFinePointer) {
  document.addEventListener('mousemove', (event) => {
    requestAnimationFrame(() => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }, { passive: true });
}

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  if (ctx && !prefersReducedMotion.matches) {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 36 : 72;
    const particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;
    let isPageVisible = !document.hidden;
    let time = 0;

    // ── Floating particles (original) ──
    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedY = -(Math.random() * 0.35 + 0.08);
        this.speedX = (Math.random() - 0.5) * 0.18;
        this.opacity = Math.random() * 0.45 + 0.1;
        this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    // ── AI text symbols drifting up ──
    const AI_SYMBOLS = ['01','∑','∇','λ','∂','AI','ML','∞','⊕','⊗','GPU','LLM','RAG','CNN','RNN','∫','σ','μ','θ','α','β'];
    class AiSymbol {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.text = AI_SYMBOLS[Math.floor(Math.random() * AI_SYMBOLS.length)];
        this.size = Math.random() * 9 + 7;
        this.speedY = -(Math.random() * 0.22 + 0.06);
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.opacity = Math.random() * 0.18 + 0.04;
        this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.font = `${this.size}px 'Space Grotesk', monospace`;
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    // ── Glassmorphic 3D floating cubes ──
    class GlassCube {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 80;
        this.size = Math.random() * 28 + 14;
        this.speedY = -(Math.random() * 0.18 + 0.04);
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.008;
        this.opacity = Math.random() * 0.13 + 0.04;
        this.hue = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
        this.distort = 0;
        this.distortTimer = Math.random() * 300;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rot += this.rotSpeed;
        this.distortTimer--;
        if (this.distortTimer <= 0) {
          this.distort = (Math.random() - 0.5) * 0.35;
          this.distortTimer = Math.random() * 200 + 80;
        } else {
          this.distort *= 0.92;
        }
        if (this.y < -100) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot + this.distort);
        const s = this.size;
        // face
        ctx.beginPath();
        ctx.rect(-s / 2, -s / 2, s, s);
        ctx.fillStyle = `rgba(${this.hue},${this.opacity * 0.5})`;
        ctx.fill();
        // border glow
        ctx.strokeStyle = `rgba(${this.hue},${this.opacity * 2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // top face (3D illusion)
        const d = s * 0.28;
        ctx.beginPath();
        ctx.moveTo(-s / 2, -s / 2);
        ctx.lineTo(-s / 2 + d, -s / 2 - d);
        ctx.lineTo(s / 2 + d, -s / 2 - d);
        ctx.lineTo(s / 2, -s / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${this.hue},${this.opacity * 0.7})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${this.hue},${this.opacity * 2})`;
        ctx.stroke();
        // right face
        ctx.beginPath();
        ctx.moveTo(s / 2, -s / 2);
        ctx.lineTo(s / 2 + d, -s / 2 - d);
        ctx.lineTo(s / 2 + d, s / 2 - d);
        ctx.lineTo(s / 2, s / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${this.hue},${this.opacity * 0.3})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${this.hue},${this.opacity * 2})`;
        ctx.stroke();
        ctx.restore();
      }
    }

    // ── Neural network nodes ──
    class NeuralNode {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 30;
        this.r = Math.random() * 5 + 3;
        this.speedY = -(Math.random() * 0.14 + 0.03);
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.opacity = Math.random() * 0.22 + 0.06;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.connections = [];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.y < -30) this.reset();
      }
      draw(nodes) {
        const pr = this.r + Math.sin(this.pulse) * 1.5;
        // draw connections to nearby nodes
        nodes.forEach((n) => {
          if (n === this) return;
          const dx = n.x - this.x, dy = n.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 120) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        // node circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${this.opacity})`;
        ctx.fill();
        // glow ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, pr + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6,182,212,${this.opacity * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // ── Fire / spark bursts ──
    const sparks = [];
    class Spark {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3.5;
        this.vy = -(Math.random() * 4 + 1.5);
        this.life = 1;
        this.decay = Math.random() * 0.025 + 0.012;
        this.size = Math.random() * 2.5 + 0.8;
        this.hot = Math.random() > 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.06; // gravity
        this.vx *= 0.97;
        this.life -= this.decay;
      }
      draw() {
        if (this.life <= 0) return;
        const r = this.hot ? `255,${Math.floor(100 + this.life * 100)},20` : `245,158,11`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${this.life * 0.85})`;
        ctx.fill();
      }
    }

    // ── Glitch / split lines ──
    const glitches = [];
    class GlitchLine {
      constructor() { this.reset(); }
      reset() {
        this.y = Math.random() * height;
        this.w = Math.random() * width * 0.4 + 60;
        this.x = Math.random() * (width - this.w);
        this.h = Math.random() * 2 + 0.5;
        this.life = 1;
        this.decay = Math.random() * 0.06 + 0.03;
        this.color = Math.random() > 0.5 ? '6,182,212' : '245,158,11';
        this.offset = (Math.random() - 0.5) * 18;
      }
      update() { this.life -= this.decay; }
      draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.35;
        ctx.fillStyle = `rgba(${this.color},1)`;
        ctx.fillRect(this.x + this.offset, this.y, this.w, this.h);
        // split duplicate
        ctx.globalAlpha = this.life * 0.15;
        ctx.fillRect(this.x - this.offset * 0.5, this.y + 2, this.w * 0.6, this.h * 0.5);
        ctx.restore();
      }
    }

    // ── Populate objects ──
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    const aiSymbols = Array.from({ length: isMobile ? 12 : 24 }, () => new AiSymbol());
    const cubes = Array.from({ length: isMobile ? 5 : 10 }, () => new GlassCube());
    const nodes = Array.from({ length: isMobile ? 8 : 16 }, () => new NeuralNode());
    for (let i = 0; i < 6; i++) glitches.push(new GlitchLine());

    // ── Spark burst spawner ──
    let sparkTimer = 0;
    const spawnBurst = () => {
      const bx = Math.random() * width;
      const by = Math.random() * height * 0.8 + height * 0.1;
      const count = Math.floor(Math.random() * 18 + 8);
      for (let i = 0; i < count; i++) sparks.push(new Spark(bx, by));
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();

    const animate = () => {
      if (!isPageVisible) { animationFrameId = 0; return; }

      ctx.clearRect(0, 0, width, height);
      time++;

      // particles
      particles.forEach((p) => { p.update(); p.draw(); });

      // ai symbols
      aiSymbols.forEach((s) => { s.update(); s.draw(); });

      // cubes
      cubes.forEach((c) => { c.update(); c.draw(); });

      // neural nodes
      nodes.forEach((n) => { n.update(); n.draw(nodes); });

      // glitch lines — randomly reset dead ones
      glitches.forEach((g) => {
        g.update();
        g.draw();
        if (g.life <= 0 && Math.random() < 0.004) g.reset();
      });

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();
        if (sparks[i].life <= 0) sparks.splice(i, 1);
      }

      // spawn burst every ~4-8 seconds randomly
      sparkTimer++;
      if (sparkTimer > 240 && Math.random() < 0.008) {
        spawnBurst();
        sparkTimer = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
      if (!isPageVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      if (isPageVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });
  }
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 70);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  reveals.forEach((element) => observer.observe(element));
}

// ===== PROJECT CARD TILT =====
if (!prefersReducedMotion.matches && hasFinePointer) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'none';
        card.style.transform =
          `perspective(1000px) translateY(-6px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.02) skewY(var(--scroll-skew, 0deg))`;
      });
    });

    card.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = '';
      });
    });
  });
}

// ===== PROJECT CARD LINKS =====
document.querySelectorAll('.project-card[data-url]').forEach((card) => {
  const openProjectLink = () => {
    const url = card.getAttribute('data-url');
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  card.addEventListener('click', openProjectLink);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectLink();
    }
  });
});

// ===== PROJECT FILTERING =====
const filterContainer = document.querySelector('.project-filters');
if (filterContainer) {
  const filterButtons = Array.from(filterContainer.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));

  filterContainer.addEventListener('click', (event) => {
    const targetButton = event.target.closest('.filter-btn');
    if (!targetButton) {
      return;
    }

    const selectedFilter = (targetButton.dataset.filter || 'all').toLowerCase();

    filterButtons.forEach((button) => {
      const isActive = button === targetButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || '').toLowerCase();
      const shouldShow = selectedFilter === 'all' || tags.includes(selectedFilter);
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
}

// ===== SCROLL EFFECTS =====
const scrollMorph = document.createElement('div');
scrollMorph.classList.add('scroll-morph');

const scrollProgress = document.createElement('div');
scrollProgress.id = 'scroll-progress';

if (!prefersReducedMotion.matches) {
  document.body.appendChild(scrollMorph);
  document.body.appendChild(scrollProgress);
}

let lastScrollY = window.scrollY;
let scrollResetTimer = 0;
let ticking = false;

const updateActiveNav = (scrollY) => {
  let currentSection = sections[0] ? sections[0].id : '';

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 140) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active-nav-link', link.getAttribute('href') === `#${currentSection}`);
  });
};

const handleScrollEffects = () => {
  const scrollY = window.scrollY;

  if (navbar) {
    navbar.style.background = scrollY > 50 ? 'rgba(5,5,16,0.95)' : 'rgba(5,5,16,0.7)';
  }

  updateActiveNav(scrollY);

  if (!prefersReducedMotion.matches) {
    scrollMorph.style.transform = `translateY(${scrollY * 0.35}px) rotate(${scrollY * 0.04}deg)`;

    if (morphSphere) {
      morphSphere.style.transform = `translateY(${scrollY * 0.16}px) translateZ(-50px)`;
    }

    const maxScroll = Math.max(1, documentRoot.scrollHeight - window.innerHeight);
    scrollProgress.style.width = `${Math.min(100, (scrollY / maxScroll) * 100)}%`;

    const delta = scrollY - lastScrollY;
    lastScrollY = scrollY;
    documentRoot.style.setProperty('--scroll-skew', `${Math.max(-2, Math.min(2, delta * 0.02))}deg`);

    window.clearTimeout(scrollResetTimer);
    scrollResetTimer = window.setTimeout(() => {
      documentRoot.style.setProperty('--scroll-skew', '0deg');
    }, 100);
  }
};

handleScrollEffects();

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScrollEffects();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
