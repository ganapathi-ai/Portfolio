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

    // ── Extended color palette ──
    const COLORS = [
      '124,58,237',   // violet
      '6,182,212',    // cyan
      '245,158,11',   // amber
      '236,72,153',   // pink
      '16,185,129',   // emerald
      '239,68,68',    // red-fire
      '251,191,36',   // gold
      '99,102,241',   // indigo
    ];
    const randColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    // ── Fire / spark bursts (enhanced) ──
    const sparks = [];
    class Spark {
      constructor(x, y, fromCursor = false) {
        this.x = x;
        this.y = y;
        this.fromCursor = fromCursor;
        const spread = fromCursor ? 5.5 : 3.5;
        this.vx = (Math.random() - 0.5) * spread;
        this.vy = -(Math.random() * (fromCursor ? 6 : 4) + 1.5);
        this.life = 1;
        this.decay = Math.random() * 0.022 + (fromCursor ? 0.008 : 0.012);
        this.size = Math.random() * (fromCursor ? 3.5 : 2.5) + 0.8;
        this.colorIdx = Math.floor(Math.random() * 4); // fire tones
        this.tail = [];
      }
      update() {
        this.tail.push({ x: this.x, y: this.y, life: this.life });
        if (this.tail.length > 6) this.tail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.055;
        this.vx *= 0.97;
        this.life -= this.decay;
      }
      draw() {
        if (this.life <= 0) return;
        // tail trail
        this.tail.forEach((t, i) => {
          const a = (i / this.tail.length) * this.life * 0.4;
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.size * (i / this.tail.length) * this.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${Math.floor(80 + i * 20)},20,${a})`;
          ctx.fill();
        });
        // core
        const fireColors = ['255,60,10', '255,140,20', '245,158,11', '251,191,36'];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fireColors[this.colorIdx]},${this.life * 0.9})`;
        ctx.fill();
        // inner white-hot core
        if (this.life > 0.6) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * this.life * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,200,${(this.life - 0.6) * 1.5})`;
          ctx.fill();
        }
      }
    }

    // ── Cursor fire trail ──
    let mouseX = -999, mouseY = -999;
    let cursorFireTimer = 0;
    if (hasFinePointer) {
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });
    }

    // ── True Archimedean spiral rings on cursor ──
    const spiralRings = [];
    class SpiralRing {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.life = 1;
        this.decay = 0.014;
        this.color = randColor();
        this.color2 = randColor();
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.04 + 0.02);
        this.turns = Math.random() * 1.5 + 1.5;   // how many full turns
        this.maxR = Math.random() * 55 + 25;
        this.progress = 0;   // 0→1 expand animation
        this.expandSpeed = 0.045;
      }
      update() {
        this.rot += this.rotSpeed;
        this.life -= this.decay;
        if (this.progress < 1) this.progress = Math.min(1, this.progress + this.expandSpeed);
      }
      draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.life * 0.6;
        // draw Archimedean spiral: r = maxR * (angle / (turns*2π))
        const totalAngle = this.turns * Math.PI * 2 * this.progress;
        const steps = Math.max(4, Math.floor(totalAngle / 0.08));
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * totalAngle;
          const r = this.maxR * (angle / (this.turns * Math.PI * 2));
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        // gradient stroke
        const grad = ctx.createLinearGradient(-this.maxR, 0, this.maxR, 0);
        grad.addColorStop(0, `rgba(${this.color},0)`);
        grad.addColorStop(0.5, `rgba(${this.color},${this.life})`);
        grad.addColorStop(1, `rgba(${this.color2},${this.life * 0.6})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        // outer glow dot at tip
        const tipAngle = totalAngle;
        const tipR = this.maxR * (tipAngle / (this.turns * Math.PI * 2));
        ctx.beginPath();
        ctx.arc(Math.cos(tipAngle) * tipR, Math.sin(tipAngle) * tipR, 2.5 * this.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color2},${this.life})`;
        ctx.fill();
        ctx.restore();
      }
    }
    let spiralTimer = 0;

    // ── Scroll-driven spine spiral (full-height left edge) ──
    let scrollRatioSpine = 0;
    window.addEventListener('scroll', () => {
      const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatioSpine = window.scrollY / maxS;
    }, { passive: true });

    const drawSpineSpiral = () => {
      const cx = isMobile ? 18 : 32;
      const totalH = height;
      const turns = 6;
      const maxR = isMobile ? 10 : 18;
      const phase = scrollRatioSpine * Math.PI * 12;
      ctx.save();
      ctx.globalAlpha = 0.15;
      // spine line
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, totalH);
      ctx.strokeStyle = 'rgba(99,102,241,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // spiral coil around spine
      const steps = Math.floor(totalH / 2);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = t * totalH;
        const angle = t * turns * Math.PI * 2 + phase;
        const x = cx + Math.cos(angle) * maxR;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const spineGrad = ctx.createLinearGradient(0, 0, 0, totalH);
      spineGrad.addColorStop(0, 'rgba(124,58,237,0.8)');
      spineGrad.addColorStop(0.33, 'rgba(6,182,212,0.8)');
      spineGrad.addColorStop(0.66, 'rgba(236,72,153,0.8)');
      spineGrad.addColorStop(1, 'rgba(16,185,129,0.8)');
      ctx.strokeStyle = spineGrad;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      // second strand offset by π
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = t * totalH;
        const angle = t * turns * Math.PI * 2 + phase + Math.PI;
        const x = cx + Math.cos(angle) * maxR;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(251,191,36,0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // rung dots
      ctx.globalAlpha = 0.18;
      for (let i = 0; i <= steps; i += 12) {
        const t = i / steps;
        const y = t * totalH;
        const angle = t * turns * Math.PI * 2 + phase;
        const xA = cx + Math.cos(angle) * maxR;
        const xB = cx + Math.cos(angle + Math.PI) * maxR;
        ctx.beginPath();
        ctx.moveTo(xA, y); ctx.lineTo(xB, y);
        ctx.strokeStyle = `rgba(${COLORS[Math.floor(t * COLORS.length)]},1)`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();
    };

    // ── Floating geometric shapes (diamonds, hexagons, triangles) ──
    class GeoShape {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 60;
        this.size = Math.random() * 18 + 8;
        this.speedY = -(Math.random() * 0.15 + 0.04);
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.012;
        this.opacity = Math.random() * 0.14 + 0.04;
        this.color = randColor();
        this.type = Math.floor(Math.random() * 3); // 0=diamond, 1=hex, 2=triangle
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rot += this.rotSpeed;
        if (this.y < -80) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = `rgba(${this.color},1)`;
        ctx.lineWidth = 0.8;
        ctx.fillStyle = `rgba(${this.color},0.08)`;
        ctx.beginPath();
        if (this.type === 0) { // diamond
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size * 0.6, 0);
          ctx.lineTo(0, this.size);
          ctx.lineTo(-this.size * 0.6, 0);
        } else if (this.type === 1) { // hexagon
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            i === 0 ? ctx.moveTo(Math.cos(a) * this.size, Math.sin(a) * this.size)
                     : ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
          }
        } else { // triangle
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size * 0.87, this.size * 0.5);
          ctx.lineTo(-this.size * 0.87, this.size * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // ── Ambient color orbs ──
    class ColorOrb {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 40;
        this.r = Math.random() * 40 + 20;
        this.speedY = -(Math.random() * 0.1 + 0.02);
        this.speedX = (Math.random() - 0.5) * 0.06;
        this.opacity = Math.random() * 0.06 + 0.02;
        this.color = randColor();
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.y < -80) this.reset();
      }
      draw() {
        const pr = this.r + Math.sin(this.pulse) * 6;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pr);
        grad.addColorStop(0, `rgba(${this.color},${this.opacity * 2})`);
        grad.addColorStop(1, `rgba(${this.color},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
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
    const geoShapes = Array.from({ length: isMobile ? 8 : 16 }, () => new GeoShape());
    const colorOrbs = Array.from({ length: isMobile ? 4 : 8 }, () => new ColorOrb());
    for (let i = 0; i < 6; i++) glitches.push(new GlitchLine());

    // ── Spark burst spawner ──
    let sparkTimer = 0;
    const spawnBurst = (bx, by, fromCursor = false) => {
      const count = Math.floor(Math.random() * (fromCursor ? 14 : 22) + (fromCursor ? 6 : 12));
      for (let i = 0; i < count; i++) sparks.push(new Spark(bx, by, fromCursor));
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

      // geo shapes
      geoShapes.forEach((g) => { g.update(); g.draw(); });

      // color orbs
      colorOrbs.forEach((o) => { o.update(); o.draw(); });

      // spine spiral (scroll-driven, left edge)
      drawSpineSpiral();

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();
        if (sparks[i].life <= 0) sparks.splice(i, 1);
      }

      // spiral rings
      for (let i = spiralRings.length - 1; i >= 0; i--) {
        spiralRings[i].update();
        spiralRings[i].draw();
        if (spiralRings[i].life <= 0) spiralRings.splice(i, 1);
      }

      // cursor fire trail
      if (hasFinePointer && mouseX > 0) {
        cursorFireTimer++;
        if (cursorFireTimer % 2 === 0) {
          spawnBurst(mouseX, mouseY, true);
        }
        // spiral ring on cursor periodically
        spiralTimer++;
        if (spiralTimer % 28 === 0) {
          spiralRings.push(new SpiralRing(mouseX, mouseY));
        }
      }

      // random ambient burst every ~4-8s
      sparkTimer++;
      if (sparkTimer > 200 && Math.random() < 0.012) {
        spawnBurst(Math.random() * width, Math.random() * height * 0.85 + height * 0.05);
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
