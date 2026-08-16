// ===== DIAGONAL SPIRAL CARD ENTRANCE =====
(function () {
  var pm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (pm.matches || !('IntersectionObserver' in window)) return;

  var cards = Array.from(document.querySelectorAll(
    '.project-card,.exp-card,.timeline-card,.cert-card,.about-card'
  ));

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var idx = cards.indexOf(el);
      el.style.setProperty('--sp-sign', idx % 2 === 0 ? '1' : '-1');
      setTimeout(function () { el.classList.add('spiral-entered'); }, (idx % 5) * 75);
      obs.unobserve(el);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  cards.forEach(function (c) { obs.observe(c); });
}());

// ===== 8D SPATIAL AUDIO ENGINE =====
(function init8DAudio() {
  var pm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (pm.matches) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  var ctx8 = null, master = null, reverbNode = null;
  var pannerL = null, pannerR = null;
  var bgNodes = [], bgIntervals = [], playing = false;
  var panAngle = 0;

  // Convolution reverb — hall impulse
  function makeReverb(actx, duration, decay) {
    var rate = actx.sampleRate;
    var len = Math.floor(rate * duration);
    var buf = actx.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    var conv = actx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  // Continuous 8D pan rotation
  function startPanRotation() {
    var iv = setInterval(function () {
      if (!playing || !ctx8) { clearInterval(iv); return; }
      panAngle += 0.013;
      var pan = Math.sin(panAngle);
      var elev = Math.cos(panAngle * 0.4) * 0.12;
      if (pannerL) pannerL.gain.setTargetAtTime(0.5 + pan * 0.46 + elev, ctx8.currentTime, 0.1);
      if (pannerR) pannerR.gain.setTargetAtTime(0.5 - pan * 0.46 - elev, ctx8.currentTime, 0.1);
    }, 55);
    bgIntervals.push(iv);
  }

  function makeOsc8(freq, type, vol, detune) {
    var o = ctx8.createOscillator();
    var g = ctx8.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune || 0;
    g.gain.value = vol;
    o.connect(g);
    g.connect(reverbNode);
    o.start();
    bgNodes.push(o, g);
  }

  function pulse8(freq, dur, vol) {
    if (!ctx8 || !playing) return;
    dur = dur || 0.6; vol = vol || 0.038;
    var o = ctx8.createOscillator();
    var g = ctx8.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx8.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx8.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx8.currentTime + dur);
    o.connect(g);
    g.connect(reverbNode);
    o.start();
    o.stop(ctx8.currentTime + dur + 0.1);
  }

  function startBGM8() {
    ctx8 = new AC();
    master = ctx8.createGain();
    master.gain.value = 0;
    master.connect(ctx8.destination);

    // Hall reverb
    reverbNode = makeReverb(ctx8, 3.8, 2.6);

    // Stereo split → 8D panning gains → merge
    var splitter = ctx8.createChannelSplitter(2);
    var merger = ctx8.createChannelMerger(2);
    pannerL = ctx8.createGain(); pannerL.gain.value = 0.5;
    pannerR = ctx8.createGain(); pannerR.gain.value = 0.5;
    reverbNode.connect(splitter);
    splitter.connect(pannerL, 0);
    splitter.connect(pannerR, 1);
    pannerL.connect(merger, 0, 0);
    pannerR.connect(merger, 0, 1);
    merger.connect(master);

    // Chorus for stereo width
    var cDelay = ctx8.createDelay(0.05);
    cDelay.delayTime.value = 0.024;
    var cGain = ctx8.createGain(); cGain.gain.value = 0.2;
    var cLFO = ctx8.createOscillator();
    var cLFOG = ctx8.createGain();
    cLFO.frequency.value = 0.38; cLFOG.gain.value = 0.007;
    cLFO.connect(cLFOG); cLFOG.connect(cDelay.delayTime); cLFO.start();
    reverbNode.connect(cDelay); cDelay.connect(cGain); cGain.connect(master);
    bgNodes.push(cDelay, cGain, cLFO, cLFOG);

    // Fade in over 4s
    master.gain.linearRampToValueAtTime(0.24, ctx8.currentTime + 4);
    playing = true;

    // Layer 1 — deep sub bass drone C2
    makeOsc8(65.41, 'sine', 0.065, 0);
    makeOsc8(65.41, 'sine', 0.032, 4);
    makeOsc8(65.41, 'sine', 0.018, -4);

    // Layer 2 — Cm9 warm pads
    [130.81, 155.56, 196.00, 233.08, 293.66, 311.13, 392.00].forEach(function (f, i) {
      makeOsc8(f, 'sine', 0.024, i % 2 === 0 ? 6 : -6);
      makeOsc8(f * 2, 'sine', 0.011, i % 2 === 0 ? -3 : 3);
    });

    // Layer 3 — high shimmer triangles
    [523.25, 659.25, 783.99, 987.77, 1046.50].forEach(function (f, i) {
      makeOsc8(f, 'triangle', 0.007, i * 3);
    });

    // Layer 4 — breath LFO on master gain
    var bLFO = ctx8.createOscillator();
    var bG = ctx8.createGain();
    bLFO.frequency.value = 0.07; bG.gain.value = 0.045;
    bLFO.connect(bG); bG.connect(master.gain); bLFO.start();
    bgNodes.push(bLFO, bG);

    // Layer 5 — binaural theta beat (6 Hz diff) A2
    var bL = ctx8.createOscillator();
    var bR = ctx8.createOscillator();
    var bGL = ctx8.createGain(); bGL.gain.value = 0.02;
    var bGR = ctx8.createGain(); bGR.gain.value = 0.02;
    var bMerge = ctx8.createChannelMerger(2);
    bL.frequency.value = 110.00;
    bR.frequency.value = 116.00; // 6 Hz binaural beat = theta focus
    bL.type = 'sine'; bR.type = 'sine';
    bL.connect(bGL); bR.connect(bGR);
    bGL.connect(bMerge, 0, 0);
    bGR.connect(bMerge, 0, 1);
    bMerge.connect(master);
    bL.start(); bR.start();
    bgNodes.push(bL, bR, bGL, bGR, bMerge);

    // Layer 6 — second binaural alpha beat (10 Hz) on D3
    var aL = ctx8.createOscillator();
    var aR = ctx8.createOscillator();
    var aGL = ctx8.createGain(); aGL.gain.value = 0.014;
    var aGR = ctx8.createGain(); aGR.gain.value = 0.014;
    var aMerge = ctx8.createChannelMerger(2);
    aL.frequency.value = 146.83;
    aR.frequency.value = 156.83; // 10 Hz alpha
    aL.type = 'sine'; aR.type = 'sine';
    aL.connect(aGL); aR.connect(aGR);
    aGL.connect(aMerge, 0, 0);
    aGR.connect(aMerge, 0, 1);
    aMerge.connect(master);
    aL.start(); aR.start();
    bgNodes.push(aL, aR, aGL, aGR, aMerge);

    // Layer 7 — slow spatial sweep LFO on reverb wet
    var swLFO = ctx8.createOscillator();
    var swG = ctx8.createGain();
    swLFO.frequency.value = 0.22; swG.gain.value = 0.012;
    swLFO.connect(swG); swG.connect(master.gain); swLFO.start();
    bgNodes.push(swLFO, swG);

    // Data pulse rhythm ~2.3s
    var pNotes = [261.63, 196.00, 293.66, 349.23, 440.00, 246.94, 329.63];
    bgIntervals.push(setInterval(function () {
      pulse8(pNotes[Math.floor(Math.random() * pNotes.length)], 0.75, 0.034);
    }, 2300));

    // Signature motif every 15s: data→insight→decision→impact→future
    bgIntervals.push(setInterval(function () {
      [[261.63,0],[329.63,0.65],[392.00,1.3],[246.94,2.1],[523.25,3.0]].forEach(function (fd) {
        setTimeout(function () { pulse8(fd[0], 1.2, 0.048); }, fd[1] * 1000);
      });
    }, 15000));

    // Start 8D rotation
    startPanRotation();
  }

  function stopBGM8() {
    if (!ctx8) return;
    playing = false;
    master.gain.linearRampToValueAtTime(0, ctx8.currentTime + 2);
    bgIntervals.forEach(clearInterval);
    bgIntervals = [];
    setTimeout(function () {
      bgNodes.forEach(function (n) { try { n.disconnect(); } catch (e) {} });
      bgNodes = [];
      ctx8.close();
      ctx8 = null;
    }, 2600);
  }

  // Section tones on scroll
  var secTones = {
    hero: 261.63, about: 329.63, experience: 196.00,
    projects: 293.66, skills: 440.00, contact: 246.94
  };
  if ('IntersectionObserver' in window) {
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && playing) pulse8(secTones[e.target.id] || 261.63, 1.5, 0.026);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('section[id]').forEach(function (s) { sObs.observe(s); });
  }

  // Nav micro-click
  document.querySelectorAll('.nav-links a,.btn-primary,.btn-outline,.filter-btn').forEach(function (el) {
    el.addEventListener('click', function () { pulse8(392.00, 0.14, 0.022); });
  });

  // Toggle button
  var btn = document.getElementById('audio-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!playing) {
        startBGM8();
        btn.classList.add('audio-on');
        btn.setAttribute('aria-label', 'Mute audio');
        btn.querySelector('.audio-label').textContent = 'Sound ON';
      } else {
        stopBGM8();
        btn.classList.remove('audio-on');
        btn.setAttribute('aria-label', 'Enable audio');
        btn.querySelector('.audio-label').textContent = 'Sound OFF';
      }
    });
  }
}());
