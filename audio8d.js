/* ============================================================
   PORTFOLIO PREMIUM EFFECTS — audio8d.js
   - 8D Spatial Audio (auto-starts on first interaction)
   - Tunnel scroll effect on canvas overlay
   - 20-30 random cursor particle shapes
   - Diagonal spiral card entrance
   ============================================================ */
(function () {
  'use strict';

  var pm = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── COLORS ── */
  var COLS = ['124,58,237','6,182,212','245,158,11','236,72,153',
              '16,185,129','239,68,68','251,191,36','99,102,241'];
  function rc() { return COLS[Math.floor(Math.random() * COLS.length)]; }

  /* ================================================================
     1. CINEMATIC TUNNEL + S-SPINE SPIRAL
     - Perspective tunnel rings that rush toward you as you scroll
     - An S-shaped / helix spine coils around the tunnel center
     - Everything rotates and reveals with scroll depth
     - Scroll drives both tunnel depth AND spine revolution angle
  ================================================================ */
  if (!pm.matches) {
    var tc = document.createElement('canvas');
    tc.id = 'tunnel-canvas';
    tc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(tc, document.body.firstChild);

    var tx = tc.getContext('2d');
    var tw = window.innerWidth, th = window.innerHeight;
    var tunnelScroll = 0, tunnelTime = 0;
    var scrollVel = 0, lastScrollY = window.scrollY;

    function resizeTunnel() {
      tw = window.innerWidth; th = window.innerHeight;
      var pr = Math.min(devicePixelRatio, 1.5);
      tc.width = Math.floor(tw * pr); tc.height = Math.floor(th * pr);
      tc.style.width = tw + 'px'; tc.style.height = th + 'px';
      tx.setTransform(pr, 0, 0, pr, 0, 0);
    }
    resizeTunnel();
    window.addEventListener('resize', resizeTunnel, {passive:true});
    window.addEventListener('scroll', function () {
      var ms = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var newRatio = window.scrollY / ms;
      scrollVel = newRatio - tunnelScroll;
      tunnelScroll = newRatio;
      lastScrollY = window.scrollY;
    }, {passive:true});

    function drawTunnel() {
      tx.clearRect(0, 0, tw, th);
      tunnelTime += 0.006;
      scrollVel *= 0.88; // dampen velocity

      var cx = tw / 2, cy = th / 2;
      var RINGS = 22;
      var FOV = Math.min(tw, th) * 0.055; // base ring size at depth=1

      // scroll drives: depth offset (rings rush forward) + rotation
      var depthOffset = tunnelScroll * RINGS * 1.4;  // how far into tunnel
      var spinAngle   = tunnelScroll * Math.PI * 10; // total spin with scroll
      var velTilt     = scrollVel * 18;              // tilt on fast scroll

      /* ── TUNNEL RINGS ── */
      for (var i = RINGS; i >= 1; i--) {
        // depth: rings closer to viewer are larger
        var d = ((i - (depthOffset % RINGS) + RINGS) % RINGS) / RINGS;
        if (d < 0.01) continue;
        var r = FOV / d;                             // perspective scale
        if (r > Math.max(tw, th) * 1.2) continue;   // clip huge rings

        var ringAngle = spinAngle + tunnelTime * 0.5 + i * 0.28;
        var sides = 6 + (i % 4);                    // 6-9 sided polygons
        var colIdx = (i + Math.floor(tunnelScroll * COLS.length * 2)) % COLS.length;
        var alpha = d * 0.18 * (1 + Math.abs(scrollVel) * 4);

        // slight S-curve offset: rings drift on a sine path
        var sOx = Math.sin(d * Math.PI * 2 + spinAngle * 0.3) * tw * 0.04 * d;
        var sOy = Math.cos(d * Math.PI * 1.5 + spinAngle * 0.2) * th * 0.03 * d;

        tx.save();
        tx.translate(cx + sOx + velTilt * d, cy + sOy);
        tx.rotate(ringAngle);
        tx.globalAlpha = Math.min(alpha, 0.22);

        // ring polygon
        tx.beginPath();
        for (var s = 0; s <= sides; s++) {
          var a = (s / sides) * Math.PI * 2;
          s === 0
            ? tx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            : tx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        tx.strokeStyle = 'rgba(' + COLS[colIdx] + ',1)';
        tx.lineWidth = 0.6 + d * 1.8;
        tx.stroke();

        // subtle fill on near rings
        if (d > 0.55) {
          tx.globalAlpha = (d - 0.55) * 0.05;
          tx.fillStyle = 'rgba(' + COLS[colIdx] + ',1)';
          tx.fill();
        }
        tx.restore();

        /* ── SPINE CONNECTORS: lines from ring vertex to next ring vertex ── */
        if (i < RINGS) {
          var d2 = ((i + 1 - (depthOffset % RINGS) + RINGS) % RINGS) / RINGS;
          if (d2 < 0.01) continue;
          var r2 = FOV / d2;
          if (r2 > Math.max(tw, th) * 1.2) continue;
          var ringAngle2 = spinAngle + tunnelTime * 0.5 + (i + 1) * 0.28;
          var sOx2 = Math.sin(d2 * Math.PI * 2 + spinAngle * 0.3) * tw * 0.04 * d2;
          var sOy2 = Math.cos(d2 * Math.PI * 1.5 + spinAngle * 0.2) * th * 0.03 * d2;

          tx.save();
          tx.globalAlpha = Math.min(d * 0.1, 0.1);
          tx.strokeStyle = 'rgba(' + COLS[(colIdx + 2) % COLS.length] + ',1)';
          tx.lineWidth = 0.5;
          // connect every other vertex — creates the spine lattice
          for (var sv = 0; sv < sides; sv += 2) {
            var av = (sv / sides) * Math.PI * 2;
            var av2 = (sv / sides) * Math.PI * 2;
            var x1 = cx + sOx  + Math.cos(av  + ringAngle)  * r;
            var y1 = cy + sOy  + Math.sin(av  + ringAngle)  * r;
            var x2 = cx + sOx2 + Math.cos(av2 + ringAngle2) * r2;
            var y2 = cy + sOy2 + Math.sin(av2 + ringAngle2) * r2;
            tx.beginPath(); tx.moveTo(x1, y1); tx.lineTo(x2, y2); tx.stroke();
          }
          tx.restore();
        }
      }

      /* ── S-SHAPED HELIX SPINE ── */
      // Two strands of a helix coiling around the tunnel center axis
      // The helix revolves with scroll — like a DNA spine inside the tunnel
      var SPINE_STEPS = 120;
      var spineDepth = 0.8; // how deep the spine goes into screen

      for (var strand = 0; strand < 2; strand++) {
        tx.beginPath();
        var phaseOffset = strand * Math.PI; // 180° apart
        var firstPt = true;

        for (var si = 0; si <= SPINE_STEPS; si++) {
          var st = si / SPINE_STEPS;           // 0..1 along spine
          // perspective: far end is small, near end is large
          var sz = 0.05 + st * spineDepth;
          var scale = FOV / (1 - sz + 0.05);
          if (scale > Math.max(tw, th)) continue;

          // helix angle: revolves with scroll + time + position along spine
          var helixAngle = spinAngle * 1.5 + tunnelTime * 0.8 + st * Math.PI * 6 + phaseOffset;

          // S-curve: the spine center itself follows a sine wave
          var sCurveX = Math.sin(st * Math.PI * 2 + spinAngle * 0.4) * tw * 0.06 * st;
          var sCurveY = Math.cos(st * Math.PI * 1.5 + spinAngle * 0.3) * th * 0.05 * st;

          // helix radius shrinks toward vanishing point
          var helixR = scale * 0.35 * (1 - st * 0.5);

          var spx = cx + sCurveX + Math.cos(helixAngle) * helixR;
          var spy = cy + sCurveY + Math.sin(helixAngle) * helixR;

          if (firstPt) { tx.moveTo(spx, spy); firstPt = false; }
          else { tx.lineTo(spx, spy); }
        }

        // gradient along spine: violet → cyan → pink
        var spGrad = tx.createLinearGradient(cx - tw*0.3, cy, cx + tw*0.3, cy);
        spGrad.addColorStop(0,   'rgba(124,58,237,' + (0.12 + Math.abs(scrollVel)*2) + ')');
        spGrad.addColorStop(0.4, 'rgba(6,182,212,'  + (0.14 + Math.abs(scrollVel)*2) + ')');
        spGrad.addColorStop(0.7, 'rgba(236,72,153,' + (0.1  + Math.abs(scrollVel)*2) + ')');
        spGrad.addColorStop(1,   'rgba(16,185,129,' + (0.08 + Math.abs(scrollVel)*2) + ')');
        tx.strokeStyle = spGrad;
        tx.lineWidth = 1.2 + Math.abs(scrollVel) * 8;
        tx.globalAlpha = 1;
        tx.stroke();

        /* ── RUNG DOTS along spine ── */
        for (var ri = 0; ri <= SPINE_STEPS; ri += 8) {
          var rt = ri / SPINE_STEPS;
          var rsz = 0.05 + rt * spineDepth;
          var rscale = FOV / (1 - rsz + 0.05);
          if (rscale > Math.max(tw, th)) continue;
          var rAngle = spinAngle * 1.5 + tunnelTime * 0.8 + rt * Math.PI * 6 + phaseOffset;
          var rAngle2 = rAngle + Math.PI;
          var rHelixR = rscale * 0.35 * (1 - rt * 0.5);
          var rCX = cx + Math.sin(rt * Math.PI * 2 + spinAngle * 0.4) * tw * 0.06 * rt;
          var rCY = cy + Math.cos(rt * Math.PI * 1.5 + spinAngle * 0.3) * th * 0.05 * rt;
          var rx1 = rCX + Math.cos(rAngle)  * rHelixR;
          var ry1 = rCY + Math.sin(rAngle)  * rHelixR;
          var rx2 = rCX + Math.cos(rAngle2) * rHelixR;
          var ry2 = rCY + Math.sin(rAngle2) * rHelixR;
          tx.save();
          tx.globalAlpha = 0.12 + Math.abs(scrollVel) * 1.5;
          tx.strokeStyle = 'rgba(' + COLS[ri % COLS.length] + ',1)';
          tx.lineWidth = 0.7;
          tx.beginPath(); tx.moveTo(rx1, ry1); tx.lineTo(rx2, ry2); tx.stroke();
          // dot at each rung end
          tx.fillStyle = 'rgba(' + COLS[(ri+2) % COLS.length] + ',1)';
          tx.globalAlpha = 0.25;
          tx.beginPath(); tx.arc(rx1, ry1, 1.5, 0, Math.PI*2); tx.fill();
          tx.restore();
        }
      }

      /* ── VANISHING POINT GLOW ── */
      var vg = tx.createRadialGradient(cx, cy, 0, cx, cy, FOV * 3);
      vg.addColorStop(0,   'rgba(124,58,237,0.1)');
      vg.addColorStop(0.4, 'rgba(6,182,212,0.05)');
      vg.addColorStop(1,   'rgba(0,0,0,0)');
      tx.globalAlpha = 1;
      tx.fillStyle = vg;
      tx.fillRect(0, 0, tw, th);

      requestAnimationFrame(drawTunnel);
    }
    requestAnimationFrame(drawTunnel);
  }

  /* ================================================================
     2. CURSOR — 20-30 RANDOM SHAPES per move
  ================================================================ */
  if (!pm.matches) {
    var cursorCanvas = document.getElementById('bg-canvas');
    // We'll inject cursor particles into the existing bg-canvas loop
    // by attaching them to a global array the main canvas loop can pick up
    window._cursorParticles = window._cursorParticles || [];

    var SHAPES = ['circle','triangle','diamond','square','star','cross','ring','arc','dot','hex'];

    function CursorParticle(x, y) {
      this.x = x + (Math.random() - 0.5) * 20;
      this.y = y + (Math.random() - 0.5) * 20;
      this.vx = (Math.random() - 0.5) * 3.5;
      this.vy = (Math.random() - 0.5) * 3.5 - 1.2;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.015;
      this.size = Math.random() * 8 + 3;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.18;
      this.color = rc();
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.gravity = Math.random() * 0.04;
    }

    var _lastMX = -999, _lastMY = -999, _cursorMoved = false;

    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.addEventListener('mousemove', function (e) {
        _lastMX = e.clientX; _lastMY = e.clientY; _cursorMoved = true;
        // spawn 20-30 particles per move
        var count = Math.floor(Math.random() * 11) + 20;
        for (var i = 0; i < count; i++) {
          window._cursorParticles.push(new CursorParticle(_lastMX, _lastMY));
        }
      }, {passive:true});
    }

    // Patch into the existing bg-canvas animate loop via a secondary RAF
    var _ctx2 = cursorCanvas ? cursorCanvas.getContext('2d') : null;
    if (_ctx2) {
      function drawCursorParticles() {
        var pr = Math.min(devicePixelRatio || 1, 1.5);
        var w = window.innerWidth, h = window.innerHeight;
        var arr = window._cursorParticles;
        for (var i = arr.length - 1; i >= 0; i--) {
          var p = arr[i];
          p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
          p.vx *= 0.97; p.rot += p.rotSpeed; p.life -= p.decay;
          if (p.life <= 0) { arr.splice(i, 1); continue; }

          _ctx2.save();
          _ctx2.translate(p.x, p.y);
          _ctx2.rotate(p.rot);
          _ctx2.globalAlpha = p.life * 0.85;
          _ctx2.strokeStyle = 'rgba(' + p.color + ',1)';
          _ctx2.fillStyle = 'rgba(' + p.color + ',' + (p.life * 0.3) + ')';
          _ctx2.lineWidth = 1;
          var s = p.size * p.life;

          _ctx2.beginPath();
          switch (p.shape) {
            case 'circle':
              _ctx2.arc(0, 0, s, 0, Math.PI * 2); break;
            case 'ring':
              _ctx2.arc(0, 0, s, 0, Math.PI * 2);
              _ctx2.stroke(); _ctx2.restore(); continue;
            case 'triangle':
              _ctx2.moveTo(0, -s);
              _ctx2.lineTo(s * 0.87, s * 0.5);
              _ctx2.lineTo(-s * 0.87, s * 0.5);
              _ctx2.closePath(); break;
            case 'diamond':
              _ctx2.moveTo(0, -s); _ctx2.lineTo(s * 0.6, 0);
              _ctx2.lineTo(0, s); _ctx2.lineTo(-s * 0.6, 0);
              _ctx2.closePath(); break;
            case 'square':
              _ctx2.rect(-s / 2, -s / 2, s, s); break;
            case 'star':
              for (var k = 0; k < 5; k++) {
                var ao = (k / 5) * Math.PI * 2 - Math.PI / 2;
                var ai = ao + Math.PI / 5;
                k === 0 ? _ctx2.moveTo(Math.cos(ao)*s, Math.sin(ao)*s) : _ctx2.lineTo(Math.cos(ao)*s, Math.sin(ao)*s);
                _ctx2.lineTo(Math.cos(ai)*s*0.4, Math.sin(ai)*s*0.4);
              }
              _ctx2.closePath(); break;
            case 'cross':
              _ctx2.moveTo(-s, 0); _ctx2.lineTo(s, 0);
              _ctx2.moveTo(0, -s); _ctx2.lineTo(0, s);
              _ctx2.stroke(); _ctx2.restore(); continue;
            case 'arc':
              _ctx2.arc(0, 0, s, 0, Math.PI * 1.3);
              _ctx2.stroke(); _ctx2.restore(); continue;
            case 'dot':
              _ctx2.arc(0, 0, s * 0.4, 0, Math.PI * 2); break;
            case 'hex':
              for (var h2 = 0; h2 < 6; h2++) {
                var ha = (h2 / 6) * Math.PI * 2;
                h2 === 0 ? _ctx2.moveTo(Math.cos(ha)*s, Math.sin(ha)*s) : _ctx2.lineTo(Math.cos(ha)*s, Math.sin(ha)*s);
              }
              _ctx2.closePath(); break;
          }
          _ctx2.fill();
          _ctx2.stroke();
          _ctx2.restore();
        }
        requestAnimationFrame(drawCursorParticles);
      }
      requestAnimationFrame(drawCursorParticles);
    }
  }

  /* ================================================================
     3. SPIRAL CARD ENTRANCE — diagonal roll from corner
  ================================================================ */
  if (!pm.matches && 'IntersectionObserver' in window) {
    var _sc = Array.from(document.querySelectorAll(
      '.project-card,.exp-card,.timeline-card,.cert-card,.about-card,.pub-card'
    ));
    var _sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var idx = _sc.indexOf(el);
        el.style.setProperty('--sp-sign', idx % 2 === 0 ? '1' : '-1');
        setTimeout(function () { el.classList.add('spiral-entered'); }, (idx % 6) * 65);
        _sObs.unobserve(el);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });
    _sc.forEach(function (c) { _sObs.observe(c); });
  }

  /* ================================================================
     4. 8D SPATIAL AUDIO — auto-starts on first user interaction
  ================================================================ */
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || pm.matches) return;

  var ctx8 = null, master = null, reverbNode = null;
  var panL = null, panR = null;
  var bgNodes = [], bgIvs = [], playing = false, started = false;
  var panAngle = 0;

  function makeIR(actx, dur, decay) {
    var rate = actx.sampleRate, len = Math.floor(rate * dur);
    var buf = actx.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, decay);
    }
    var c = actx.createConvolver(); c.buffer = buf; return c;
  }

  function osc(freq, type, vol, det) {
    var o = ctx8.createOscillator(), g = ctx8.createGain();
    o.type = type; o.frequency.value = freq; o.detune.value = det||0; g.gain.value = vol;
    o.connect(g); g.connect(reverbNode); o.start();
    bgNodes.push(o, g);
  }

  function tone(freq, dur, vol) {
    if (!ctx8 || !playing) return;
    var o = ctx8.createOscillator(), g = ctx8.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx8.currentTime);
    g.gain.linearRampToValueAtTime(vol||0.04, ctx8.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx8.currentTime + (dur||0.7));
    o.connect(g); g.connect(reverbNode);
    o.start(); o.stop(ctx8.currentTime + (dur||0.7) + 0.1);
  }

  function startAudio() {
    if (started) return; started = true;
    ctx8 = new AC();
    master = ctx8.createGain(); master.gain.value = 0;
    master.connect(ctx8.destination);

    reverbNode = makeIR(ctx8, 4, 2.5);

    // 8D stereo split
    var split = ctx8.createChannelSplitter(2);
    var merge = ctx8.createChannelMerger(2);
    panL = ctx8.createGain(); panL.gain.value = 0.5;
    panR = ctx8.createGain(); panR.gain.value = 0.5;
    reverbNode.connect(split);
    split.connect(panL, 0); split.connect(panR, 1);
    panL.connect(merge, 0, 0); panR.connect(merge, 0, 1);
    merge.connect(master);

    // Chorus width
    var cd = ctx8.createDelay(0.05); cd.delayTime.value = 0.022;
    var cg = ctx8.createGain(); cg.gain.value = 0.18;
    var cl = ctx8.createOscillator(), clg = ctx8.createGain();
    cl.frequency.value = 0.4; clg.gain.value = 0.006;
    cl.connect(clg); clg.connect(cd.delayTime); cl.start();
    reverbNode.connect(cd); cd.connect(cg); cg.connect(master);
    bgNodes.push(cd, cg, cl, clg);

    // Fade in 5s
    master.gain.linearRampToValueAtTime(0.22, ctx8.currentTime + 5);
    playing = true;

    // Sub bass C2
    osc(65.41,'sine',0.06,0); osc(65.41,'sine',0.03,5); osc(65.41,'sine',0.015,-5);
    // Cm9 pads
    [130.81,155.56,196,233.08,293.66,311.13,392].forEach(function(f,i){
      osc(f,'sine',0.022,i%2?6:-6); osc(f*2,'sine',0.01,i%2?-3:3);
    });
    // Shimmer
    [523.25,659.25,783.99,987.77].forEach(function(f,i){ osc(f,'triangle',0.007,i*3); });

    // Breath LFO
    var bl=ctx8.createOscillator(), bg=ctx8.createGain();
    bl.frequency.value=0.07; bg.gain.value=0.04;
    bl.connect(bg); bg.connect(master.gain); bl.start();
    bgNodes.push(bl,bg);

    // Binaural theta 6Hz
    var btL=ctx8.createOscillator(), btR=ctx8.createOscillator();
    var btGL=ctx8.createGain(), btGR=ctx8.createGain();
    var btM=ctx8.createChannelMerger(2);
    btL.frequency.value=110; btR.frequency.value=116;
    btGL.gain.value=0.018; btGR.gain.value=0.018;
    btL.connect(btGL); btR.connect(btGR);
    btGL.connect(btM,0,0); btGR.connect(btM,0,1);
    btM.connect(master); btL.start(); btR.start();
    bgNodes.push(btL,btR,btGL,btGR,btM);

    // Binaural alpha 10Hz
    var baL=ctx8.createOscillator(), baR=ctx8.createOscillator();
    var baGL=ctx8.createGain(), baGR=ctx8.createGain();
    var baM=ctx8.createChannelMerger(2);
    baL.frequency.value=146.83; baR.frequency.value=156.83;
    baGL.gain.value=0.013; baGR.gain.value=0.013;
    baL.connect(baGL); baR.connect(baGR);
    baGL.connect(baM,0,0); baGR.connect(baM,0,1);
    baM.connect(master); baL.start(); baR.start();
    bgNodes.push(baL,baR,baGL,baGR,baM);

    // 8D pan rotation ~8s cycle
    bgIvs.push(setInterval(function(){
      if(!playing||!ctx8){return;}
      panAngle+=0.013;
      var p=Math.sin(panAngle), e=Math.cos(panAngle*0.4)*0.1;
      panL.gain.setTargetAtTime(0.5+p*0.46+e, ctx8.currentTime, 0.1);
      panR.gain.setTargetAtTime(0.5-p*0.46-e, ctx8.currentTime, 0.1);
    }, 55));

    // Data pulse
    var pn=[261.63,196,293.66,349.23,440,246.94,329.63];
    bgIvs.push(setInterval(function(){
      tone(pn[Math.floor(Math.random()*pn.length)], 0.8, 0.032);
    }, 2400));

    // Signature motif every 16s
    bgIvs.push(setInterval(function(){
      [[261.63,0],[329.63,0.6],[392,1.2],[246.94,2],[523.25,2.9]].forEach(function(fd){
        setTimeout(function(){ tone(fd[0],1.2,0.045); }, fd[1]*1000);
      });
    }, 16000));

    updateBtn(true);
  }

  function stopAudio() {
    if (!ctx8) return;
    playing = false;
    master.gain.linearRampToValueAtTime(0, ctx8.currentTime + 2);
    bgIvs.forEach(clearInterval); bgIvs = [];
    setTimeout(function(){
      bgNodes.forEach(function(n){ try{n.disconnect();}catch(e){} });
      bgNodes=[]; ctx8.close(); ctx8=null; started=false;
    }, 2500);
    updateBtn(false);
  }

  function updateBtn(on) {
    var btn = document.getElementById('audio-toggle');
    if (!btn) return;
    if (on) {
      btn.classList.add('audio-on');
      btn.setAttribute('aria-label','Mute audio');
      btn.querySelector('.audio-label').textContent = 'Sound ON';
    } else {
      btn.classList.remove('audio-on');
      btn.setAttribute('aria-label','Enable audio');
      btn.querySelector('.audio-label').textContent = 'Sound OFF';
    }
  }

  // Auto-start on first ANY user interaction
  function onFirstInteraction() {
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
    document.removeEventListener('scroll', onFirstInteraction);
    if (!started) startAudio();
  }
  document.addEventListener('click', onFirstInteraction);
  document.addEventListener('keydown', onFirstInteraction);
  document.addEventListener('touchstart', onFirstInteraction, {passive:true});
  document.addEventListener('scroll', onFirstInteraction, {passive:true});

  // Toggle button
  var _btn = document.getElementById('audio-toggle');
  if (_btn) {
    _btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!playing) { startAudio(); } else { stopAudio(); }
    });
  }

  // Section tones
  var ST={hero:261.63,about:329.63,experience:196,projects:293.66,skills:440,contact:246.94};
  if ('IntersectionObserver' in window) {
    var _so = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting&&playing) tone(ST[e.target.id]||261.63,1.5,0.024); });
    },{threshold:0.3});
    document.querySelectorAll('section[id]').forEach(function(s){ _so.observe(s); });
  }

  // Nav micro-click
  document.querySelectorAll('.nav-links a,.btn-primary,.btn-outline,.filter-btn').forEach(function(el){
    el.addEventListener('click', function(){ tone(392,0.13,0.02); });
  });

}());
