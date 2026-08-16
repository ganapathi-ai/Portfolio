/* ============================================================
   PORTFOLIO PREMIUM EFFECTS v3 — audio8d.js
   Fixes: cursor lag, slow site, card spiral, audio silent
   ============================================================ */
(function () {
  'use strict';

  var pm  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ptr = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var COLS = ['124,58,237','6,182,212','245,158,11','236,72,153',
              '16,185,129','239,68,68','251,191,36','99,102,241'];
  function rc() { return COLS[Math.floor(Math.random() * COLS.length)]; }

  /* ================================================================
     1. CURSOR — dedicated overlay canvas, zero lag
        Particles drawn directly in their own RAF loop.
        Spawns 6-10 shapes per move (not 20-30) to stay smooth.
  ================================================================ */
  if (!pm && ptr) {
    var cc = document.createElement('canvas');
    cc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;will-change:transform;';
    document.body.appendChild(cc);
    var cx2 = cc.getContext('2d');
    var cw = window.innerWidth, ch = window.innerHeight;
    var pr2 = Math.min(devicePixelRatio || 1, 2);

    function resizeCC() {
      cw = window.innerWidth; ch = window.innerHeight;
      cc.width  = Math.floor(cw * pr2);
      cc.height = Math.floor(ch * pr2);
      cc.style.width  = cw + 'px';
      cc.style.height = ch + 'px';
      cx2.setTransform(pr2, 0, 0, pr2, 0, 0);
    }
    resizeCC();
    window.addEventListener('resize', resizeCC, {passive:true});

    var SHAPES = ['circle','triangle','diamond','square','star','hex','ring','dot','cross','arc'];
    var cParticles = [];
    var mx = -999, my = -999;

    function CP(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4 - 0.8;
      this.life = 1;
      this.decay = Math.random() * 0.04 + 0.02;
      this.size  = Math.random() * 7 + 2;
      this.rot   = Math.random() * Math.PI * 2;
      this.rs    = (Math.random() - 0.5) * 0.2;
      this.col   = rc();
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      // 6-10 particles per event — smooth but rich
      var n = Math.floor(Math.random() * 5) + 6;
      for (var i = 0; i < n; i++) cParticles.push(new CP(mx, my));
    }, {passive:true});

    function drawCP() {
      cx2.clearRect(0, 0, cw, ch);
      for (var i = cParticles.length - 1; i >= 0; i--) {
        var p = cParticles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.05; p.vx *= 0.96;
        p.rot += p.rs; p.life -= p.decay;
        if (p.life <= 0) { cParticles.splice(i, 1); continue; }
        var s = p.size * p.life;
        cx2.save();
        cx2.translate(p.x, p.y);
        cx2.rotate(p.rot);
        cx2.globalAlpha = p.life * 0.9;
        cx2.strokeStyle = 'rgba(' + p.col + ',1)';
        cx2.fillStyle   = 'rgba(' + p.col + ',' + (p.life * 0.25) + ')';
        cx2.lineWidth   = 1;
        cx2.beginPath();
        switch (p.shape) {
          case 'circle':  cx2.arc(0,0,s,0,Math.PI*2); cx2.fill(); cx2.stroke(); break;
          case 'ring':    cx2.arc(0,0,s,0,Math.PI*2); cx2.stroke(); break;
          case 'dot':     cx2.arc(0,0,s*0.4,0,Math.PI*2); cx2.fill(); break;
          case 'arc':     cx2.arc(0,0,s,0,Math.PI*1.4); cx2.stroke(); break;
          case 'cross':
            cx2.moveTo(-s,0); cx2.lineTo(s,0);
            cx2.moveTo(0,-s); cx2.lineTo(0,s); cx2.stroke(); break;
          case 'triangle':
            cx2.moveTo(0,-s); cx2.lineTo(s*.87,s*.5); cx2.lineTo(-s*.87,s*.5);
            cx2.closePath(); cx2.fill(); cx2.stroke(); break;
          case 'diamond':
            cx2.moveTo(0,-s); cx2.lineTo(s*.6,0); cx2.lineTo(0,s); cx2.lineTo(-s*.6,0);
            cx2.closePath(); cx2.fill(); cx2.stroke(); break;
          case 'square':
            cx2.rect(-s/2,-s/2,s,s); cx2.fill(); cx2.stroke(); break;
          case 'hex':
            for (var h=0;h<6;h++){var a=(h/6)*Math.PI*2; h===0?cx2.moveTo(Math.cos(a)*s,Math.sin(a)*s):cx2.lineTo(Math.cos(a)*s,Math.sin(a)*s);}
            cx2.closePath(); cx2.fill(); cx2.stroke(); break;
          case 'star':
            for (var k=0;k<5;k++){
              var ao=(k/5)*Math.PI*2-Math.PI/2, ai=ao+Math.PI/5;
              k===0?cx2.moveTo(Math.cos(ao)*s,Math.sin(ao)*s):cx2.lineTo(Math.cos(ao)*s,Math.sin(ao)*s);
              cx2.lineTo(Math.cos(ai)*s*.4,Math.sin(ai)*s*.4);
            }
            cx2.closePath(); cx2.fill(); cx2.stroke(); break;
        }
        cx2.restore();
      }
      requestAnimationFrame(drawCP);
    }
    requestAnimationFrame(drawCP);
  }

  /* ================================================================
     2. CINEMATIC TUNNEL + REVOLVING S-SPINE HELIX
        Separate canvas, z-index:1 (above bg, below content)
        Scroll drives: depth rush + full rotation + velocity tilt
        S-spine: two helix strands revolve around tunnel axis
  ================================================================ */
  if (!pm) {
    var tc = document.createElement('canvas');
    tc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    document.body.insertBefore(tc, document.body.firstChild);
    var tx = tc.getContext('2d');
    var tw = window.innerWidth, th = window.innerHeight;
    var tScroll = 0, tTime = 0, tVel = 0, tPrevScroll = 0;
    var pr3 = Math.min(devicePixelRatio || 1, 1.5);

    function resizeTC() {
      tw = window.innerWidth; th = window.innerHeight;
      tc.width  = Math.floor(tw * pr3);
      tc.height = Math.floor(th * pr3);
      tc.style.width  = tw + 'px';
      tc.style.height = th + 'px';
      tx.setTransform(pr3, 0, 0, pr3, 0, 0);
    }
    resizeTC();
    window.addEventListener('resize', resizeTC, {passive:true});
    window.addEventListener('scroll', function () {
      var ms = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var nr = window.scrollY / ms;
      tVel = (nr - tScroll) * 60; // velocity amplified
      tScroll = nr;
    }, {passive:true});

    function drawTunnel() {
      tx.clearRect(0, 0, tw, th);
      tTime += 0.005;
      tVel  *= 0.9; // smooth decay

      var vcx = tw / 2, vcy = th / 2;
      var RINGS = 20;
      var FOV   = Math.min(tw, th) * 0.06;
      var spin  = tScroll * Math.PI * 12; // full rotations with scroll
      var depth = tScroll * RINGS * 1.6;  // rings rush forward
      var tilt  = tVel * 14;              // lean on fast scroll

      /* — TUNNEL RINGS — */
      for (var i = RINGS; i >= 1; i--) {
        var d = ((i - (depth % RINGS) + RINGS) % RINGS) / RINGS;
        if (d < 0.02) continue;
        var R = FOV / d;
        if (R > Math.max(tw, th) * 1.4) continue;

        var rAng  = spin + tTime * 0.4 + i * 0.3;
        var sides = 6 + (i % 4);
        var ci    = (i + Math.floor(tScroll * 16)) % COLS.length;
        var alph  = Math.min(d * 0.2 + Math.abs(tVel) * 0.02, 0.25);

        // S-curve drift of ring centers
        var ox = Math.sin(d * Math.PI * 2.5 + spin * 0.25) * tw * 0.035 * d;
        var oy = Math.cos(d * Math.PI * 1.8 + spin * 0.18) * th * 0.025 * d;

        tx.save();
        tx.translate(vcx + ox + tilt * d, vcy + oy);
        tx.rotate(rAng);
        tx.globalAlpha = alph;
        tx.beginPath();
        for (var s = 0; s <= sides; s++) {
          var a = (s / sides) * Math.PI * 2;
          s === 0 ? tx.moveTo(Math.cos(a)*R, Math.sin(a)*R)
                  : tx.lineTo(Math.cos(a)*R, Math.sin(a)*R);
        }
        tx.strokeStyle = 'rgba(' + COLS[ci] + ',1)';
        tx.lineWidth   = 0.5 + d * 2;
        tx.stroke();
        if (d > 0.6) {
          tx.globalAlpha = (d - 0.6) * 0.04;
          tx.fillStyle   = 'rgba(' + COLS[ci] + ',1)';
          tx.fill();
        }
        tx.restore();

        /* spine lattice connectors between rings */
        if (i < RINGS) {
          var d2 = ((i+1-(depth%RINGS)+RINGS)%RINGS)/RINGS;
          if (d2 < 0.02) continue;
          var R2 = FOV / d2;
          if (R2 > Math.max(tw,th)*1.4) continue;
          var rAng2 = spin + tTime*0.4 + (i+1)*0.3;
          var ox2 = Math.sin(d2*Math.PI*2.5+spin*0.25)*tw*0.035*d2;
          var oy2 = Math.cos(d2*Math.PI*1.8+spin*0.18)*th*0.025*d2;
          tx.save();
          tx.globalAlpha = Math.min(d * 0.08, 0.08);
          tx.strokeStyle = 'rgba(' + COLS[(ci+3)%COLS.length] + ',1)';
          tx.lineWidth   = 0.4;
          for (var sv = 0; sv < sides; sv += 2) {
            var av = (sv/sides)*Math.PI*2;
            tx.beginPath();
            tx.moveTo(vcx+ox  + Math.cos(av+rAng )*R,  vcy+oy  + Math.sin(av+rAng )*R);
            tx.lineTo(vcx+ox2 + Math.cos(av+rAng2)*R2, vcy+oy2 + Math.sin(av+rAng2)*R2);
            tx.stroke();
          }
          tx.restore();
        }
      }

      /* — S-SPINE HELIX: two strands revolving around tunnel axis — */
      var STEPS = 100;
      for (var strand = 0; strand < 2; strand++) {
        var phase = strand * Math.PI; // strands 180° apart
        tx.beginPath();
        var first = true;
        for (var si = 0; si <= STEPS; si++) {
          var t  = si / STEPS;
          // perspective depth: t=0 is far (small), t=1 is near (large)
          var sz = 0.04 + t * 0.82;
          var sc = FOV / (1 - sz + 0.04);
          if (sc > Math.max(tw, th)) continue;

          // helix revolves: scroll spin + time + position along spine
          var hAng = spin * 1.8 + tTime * 1.2 + t * Math.PI * 8 + phase;

          // S-curve: spine center snakes left-right as it recedes
          var scx = Math.sin(t * Math.PI * 3 + spin * 0.5) * tw * 0.07 * t;
          var scy = Math.cos(t * Math.PI * 2 + spin * 0.35) * th * 0.05 * t;

          // helix radius: large near viewer, tiny at vanishing point
          var hR = sc * 0.3 * (1 - t * 0.55);

          var spx = vcx + scx + Math.cos(hAng) * hR;
          var spy = vcy + scy + Math.sin(hAng) * hR;
          if (first) { tx.moveTo(spx, spy); first = false; }
          else        { tx.lineTo(spx, spy); }
        }
        var sg = tx.createLinearGradient(vcx - tw*0.4, vcy, vcx + tw*0.4, vcy);
        var vel_a = Math.min(0.08 + Math.abs(tVel) * 0.3, 0.55);
        sg.addColorStop(0,   'rgba(124,58,237,' + vel_a + ')');
        sg.addColorStop(0.3, 'rgba(6,182,212,'  + vel_a + ')');
        sg.addColorStop(0.6, 'rgba(236,72,153,' + vel_a + ')');
        sg.addColorStop(1,   'rgba(16,185,129,' + vel_a + ')');
        tx.strokeStyle = sg;
        tx.lineWidth   = 1.4 + Math.abs(tVel) * 6;
        tx.globalAlpha = 1;
        tx.stroke();

        /* rung crossbars connecting the two strands */
        for (var ri = 0; ri <= STEPS; ri += 6) {
          var rt  = ri / STEPS;
          var rsz = 0.04 + rt * 0.82;
          var rsc = FOV / (1 - rsz + 0.04);
          if (rsc > Math.max(tw, th)) continue;
          var rA  = spin*1.8 + tTime*1.2 + rt*Math.PI*8;
          var rA2 = rA + Math.PI;
          var rHR = rsc * 0.3 * (1 - rt * 0.55);
          var rcx2 = vcx + Math.sin(rt*Math.PI*3+spin*0.5)*tw*0.07*rt;
          var rcy2 = vcy + Math.cos(rt*Math.PI*2+spin*0.35)*th*0.05*rt;
          tx.save();
          tx.globalAlpha = Math.min(0.1 + Math.abs(tVel)*0.2, 0.35);
          tx.strokeStyle = 'rgba(' + COLS[ri % COLS.length] + ',1)';
          tx.lineWidth   = 0.6;
          tx.beginPath();
          tx.moveTo(rcx2 + Math.cos(rA )*rHR, rcy2 + Math.sin(rA )*rHR);
          tx.lineTo(rcx2 + Math.cos(rA2)*rHR, rcy2 + Math.sin(rA2)*rHR);
          tx.stroke();
          // glowing dot at rung ends
          tx.fillStyle   = 'rgba(' + COLS[(ri+2)%COLS.length] + ',1)';
          tx.globalAlpha = 0.3;
          tx.beginPath();
          tx.arc(rcx2 + Math.cos(rA)*rHR, rcy2 + Math.sin(rA)*rHR, 1.8, 0, Math.PI*2);
          tx.fill();
          tx.restore();
        }
      }

      /* vanishing point glow */
      var vg = tx.createRadialGradient(vcx, vcy, 0, vcx, vcy, FOV * 4);
      vg.addColorStop(0,   'rgba(124,58,237,0.12)');
      vg.addColorStop(0.5, 'rgba(6,182,212,0.05)');
      vg.addColorStop(1,   'rgba(0,0,0,0)');
      tx.globalAlpha = 1;
      tx.fillStyle   = vg;
      tx.fillRect(0, 0, tw, th);

      requestAnimationFrame(drawTunnel);
    }
    requestAnimationFrame(drawTunnel);
  }

  /* ================================================================
     3. SPIRAL CARD ENTRANCE
        Cards start off-screen rotated diagonally, spiral in on scroll.
        Uses a separate class from .reveal to avoid conflicts.
  ================================================================ */
  if (!pm && 'IntersectionObserver' in window) {
    var cards = Array.from(document.querySelectorAll(
      '.project-card,.exp-card,.timeline-card,.cert-card,.about-card,.pub-card,.skill-group,.contact-card'
    ));
    // Force initial hidden state via inline style (overrides any CSS)
    cards.forEach(function (el, idx) {
      var sign = idx % 2 === 0 ? 1 : -1;
      el.style.opacity   = '0';
      el.style.transform = 'perspective(1000px) translateX(' + (sign*90) + 'px) translateY(50px) rotateZ(' + (sign*-14) + 'deg) rotateY(' + (sign*-18) + 'deg) scale(0.88)';
      el.style.transition = 'none';
    });

    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el  = entry.target;
        var idx = cards.indexOf(el);
        var delay = (idx % 5) * 60;
        setTimeout(function () {
          el.style.transition = 'opacity 0.7s cubic-bezier(0.2,0.8,0.2,1), transform 0.7s cubic-bezier(0.2,0.8,0.2,1)';
          el.style.opacity    = '1';
          el.style.transform  = 'perspective(1000px) translateX(0) translateY(0) rotateZ(0deg) rotateY(0deg) scale(1)';
        }, delay);
        sObs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10px 0px' });

    cards.forEach(function (c) { sObs.observe(c); });
  }

  /* ================================================================
     4. 8D SPATIAL AUDIO
        Simplified graph: osc → gain → compressor → destination
        Pan rotation via StereoPannerNode (guaranteed to work)
        Auto-starts on first interaction
  ================================================================ */
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || pm) return;

  var a8 = null, aMaster = null, aComp = null, aPan = null;
  var aNodes = [], aIvs = [], aPlaying = false, aStarted = false;
  var aPanAngle = 0;

  function aOsc(freq, type, vol, det) {
    var o = a8.createOscillator(), g = a8.createGain();
    o.type = type; o.frequency.value = freq; o.detune.value = det || 0;
    g.gain.value = vol;
    o.connect(g); g.connect(aMaster); o.start();
    aNodes.push(o, g);
  }

  function aTone(freq, dur, vol) {
    if (!a8 || !aPlaying) return;
    var o = a8.createOscillator(), g = a8.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, a8.currentTime);
    g.gain.linearRampToValueAtTime(vol || 0.04, a8.currentTime + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, a8.currentTime + (dur || 0.8));
    o.connect(g); g.connect(aMaster);
    o.start(); o.stop(a8.currentTime + (dur || 0.8) + 0.1);
  }

  function startAudio() {
    if (aStarted) return; aStarted = true;
    a8 = new AC();

    // Simple reliable graph: master gain → compressor → destination
    aMaster = a8.createGain(); aMaster.gain.value = 0;
    aComp   = a8.createDynamicsCompressor();
    aPan    = a8.createStereoPanner(); aPan.pan.value = 0;
    aMaster.connect(aPan); aPan.connect(aComp); aComp.connect(a8.destination);

    // Fade in over 3s
    aMaster.gain.linearRampToValueAtTime(0.28, a8.currentTime + 3);
    aPlaying = true;

    // Sub bass C2 — felt more than heard
    aOsc(65.41,  'sine', 0.055, 0);
    aOsc(65.41,  'sine', 0.025, 6);

    // Warm Cm9 chord pads
    [130.81, 155.56, 196.00, 233.08, 293.66, 311.13].forEach(function (f, i) {
      aOsc(f,   'sine', 0.028, i % 2 ? 7 : -7);
      aOsc(f*2, 'sine', 0.012, i % 2 ? -4 : 4);
    });

    // High shimmer
    [523.25, 659.25, 783.99].forEach(function (f, i) {
      aOsc(f, 'triangle', 0.008, i * 4);
    });

    // Breath LFO — slow volume swell
    var bL = a8.createOscillator(), bG = a8.createGain();
    bL.frequency.value = 0.08; bG.gain.value = 0.05;
    bL.connect(bG); bG.connect(aMaster.gain); bL.start();
    aNodes.push(bL, bG);

    // 8D pan rotation — StereoPannerNode sweeps L→R→L
    aIvs.push(setInterval(function () {
      if (!aPlaying || !a8) return;
      aPanAngle += 0.014;
      aPan.pan.setTargetAtTime(Math.sin(aPanAngle) * 0.9, a8.currentTime, 0.08);
    }, 50));

    // Data pulse rhythm
    var pn = [261.63, 196.00, 293.66, 349.23, 440.00, 246.94];
    aIvs.push(setInterval(function () {
      aTone(pn[Math.floor(Math.random() * pn.length)], 0.9, 0.035);
    }, 2500));

    // Signature motif every 14s
    aIvs.push(setInterval(function () {
      [[261.63,0],[329.63,0.65],[392.00,1.3],[246.94,2.1],[523.25,3.0]].forEach(function (fd) {
        setTimeout(function () { aTone(fd[0], 1.3, 0.05); }, fd[1] * 1000);
      });
    }, 14000));

    updateABtn(true);
  }

  function stopAudio() {
    if (!a8) return;
    aPlaying = false;
    aMaster.gain.linearRampToValueAtTime(0, a8.currentTime + 1.5);
    aIvs.forEach(clearInterval); aIvs = [];
    setTimeout(function () {
      aNodes.forEach(function (n) { try { n.disconnect(); } catch (e) {} });
      aNodes = []; a8.close(); a8 = null; aStarted = false;
    }, 2000);
    updateABtn(false);
  }

  function updateABtn(on) {
    var b = document.getElementById('audio-toggle');
    if (!b) return;
    b.classList.toggle('audio-on', on);
    b.setAttribute('aria-label', on ? 'Mute audio' : 'Enable audio');
    b.querySelector('.audio-label').textContent = on ? 'Sound ON' : 'Sound OFF';
  }

  // Auto-start on first interaction
  function onFirst() {
    ['click','keydown','scroll','touchstart'].forEach(function (ev) {
      document.removeEventListener(ev, onFirst);
    });
    startAudio();
  }
  document.addEventListener('click',      onFirst);
  document.addEventListener('keydown',    onFirst);
  document.addEventListener('scroll',     onFirst, {passive:true});
  document.addEventListener('touchstart', onFirst, {passive:true});

  // Toggle button
  var _ab = document.getElementById('audio-toggle');
  if (_ab) {
    _ab.addEventListener('click', function (e) {
      e.stopPropagation();
      aPlaying ? stopAudio() : startAudio();
    });
  }

  // Section tones
  var ST = {hero:261.63,about:329.63,experience:196,projects:293.66,skills:440,contact:246.94};
  if ('IntersectionObserver' in window) {
    var sIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && aPlaying) aTone(ST[e.target.id] || 261.63, 1.5, 0.025);
      });
    }, {threshold: 0.35});
    document.querySelectorAll('section[id]').forEach(function (s) { sIO.observe(s); });
  }

  // Nav click micro-sound
  document.querySelectorAll('.nav-links a,.btn-primary,.btn-outline,.filter-btn').forEach(function (el) {
    el.addEventListener('click', function () { aTone(392, 0.12, 0.022); });
  });

}());
