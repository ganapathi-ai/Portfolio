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
    const particleCount = window.innerWidth < 768 ? 36 : 72;
    const particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;
    let isPageVisible = !document.hidden;

    class Particle {
      constructor() {
        this.reset(true);
      }

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

        if (this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

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

    for (let i = 0; i < particleCount; i += 1) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!isPageVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
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
