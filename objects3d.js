/* ============================================================
   objects3d.js — Big transparent 3D spiral/geometric objects
   Runs on its own canvas, z-index:-1 (behind everything)
   Smooth, slow, premium — never disturbs existing UI
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var oc = document.createElement('canvas');
  oc.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:-1',           /* behind everything */
    'pointer-events:none',
    'will-change:transform'
  ].join(';');
  document.body.appendChild(oc);

  var ox = oc.getContext('2d');
  var ow = window.innerWidth, oh = window.innerHeight;
  var pr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    ow = window.innerWidth; oh = window.innerHeight;
    oc.width  = Math.floor(ow * pr);
    oc.height = Math.floor(oh * pr);
    oc.style.width  = ow + 'px';
    oc.style.height = oh + 'px';
    ox.setTransform(pr, 0, 0, pr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  var COLS = [
    [124, 58,  237],   // violet
    [6,   182, 212],   // cyan
    [236, 72,  153],   // pink
    [16,  185, 129],   // emerald
    [245, 158, 11],    // amber
    [99,  102, 241],   // indigo
  ];

  var scrollY = 0;
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
  }, { passive: true });

  /* ── helpers ── */
  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  /* ================================================================
     OBJECT TYPES
     Each object has: x,y (normalised 0-1), phase, speed, color
     They move very slowly — premium ambient feel
  ================================================================ */

  /* 1. Big Archimedean Spiral */
  function Spiral(opts) {
    this.nx     = opts.nx;      // normalised x 0-1
    this.ny     = opts.ny;
    this.turns  = opts.turns  || 3.5;
    this.maxR   = opts.maxR   || 180;
    this.rot    = opts.rot    || 0;
    this.rotSpd = opts.rotSpd || 0.0008;
    this.col    = opts.col;
    this.alpha  = opts.alpha  || 0.07;
    this.lw     = opts.lw     || 1.2;
    this.drift  = opts.drift  || 0;   // vertical drift speed
    this.driftY = 0;
  }
  Spiral.prototype.update = function (t) {
    this.rot    += this.rotSpd;
    this.driftY += this.drift;
    if (this.driftY > oh * 0.15) this.driftY = -oh * 0.15;
  };
  Spiral.prototype.draw = function () {
    var cx = this.nx * ow;
    var cy = this.ny * oh + this.driftY + scrollY * 0.04;
    var steps = 220;
    ox.save();
    ox.translate(cx, cy);
    ox.rotate(this.rot);
    ox.globalAlpha = this.alpha;
    ox.strokeStyle = rgba(this.col, 1);
    ox.lineWidth   = this.lw;
    ox.beginPath();
    for (var i = 0; i <= steps; i++) {
      var angle = (i / steps) * this.turns * Math.PI * 2;
      var r     = this.maxR * (angle / (this.turns * Math.PI * 2));
      var px    = Math.cos(angle) * r;
      var py    = Math.sin(angle) * r;
      i === 0 ? ox.moveTo(px, py) : ox.lineTo(px, py);
    }
    ox.stroke();
    // second counter-rotating strand
    ox.rotate(Math.PI * 0.15);
    ox.globalAlpha = this.alpha * 0.5;
    ox.beginPath();
    for (var j = 0; j <= steps; j++) {
      var ang2 = (j / steps) * this.turns * Math.PI * 2;
      var r2   = this.maxR * 0.7 * (ang2 / (this.turns * Math.PI * 2));
      ox.lineTo(Math.cos(-ang2) * r2, Math.sin(-ang2) * r2);
    }
    ox.stroke();
    ox.restore();
  };

  /* 2. 3D Wireframe Torus (simulated with ellipses) */
  function Torus(opts) {
    this.nx    = opts.nx;
    this.ny    = opts.ny;
    this.R     = opts.R    || 120;   // major radius
    this.r     = opts.r    || 38;    // tube radius
    this.rotX  = opts.rotX || 0;
    this.rotY  = opts.rotY || 0;
    this.rotZ  = opts.rotZ || 0;
    this.spdX  = opts.spdX || 0.003;
    this.spdY  = opts.spdY || 0.002;
    this.spdZ  = opts.spdZ || 0.001;
    this.col   = opts.col;
    this.alpha = opts.alpha || 0.06;
    this.segs  = 28;
    this.drift = opts.drift || 0;
    this.driftY = 0;
  }
  Torus.prototype.update = function () {
    this.rotX  += this.spdX;
    this.rotY  += this.spdY;
    this.rotZ  += this.spdZ;
    this.driftY += this.drift;
    if (Math.abs(this.driftY) > oh * 0.12) this.drift *= -1;
  };
  Torus.prototype.draw = function () {
    var cx = this.nx * ow;
    var cy = this.ny * oh + this.driftY + scrollY * 0.03;
    var segs = this.segs;
    ox.save();
    ox.translate(cx, cy);
    ox.globalAlpha = this.alpha;
    ox.strokeStyle = rgba(this.col, 1);
    ox.lineWidth   = 0.9;
    // draw latitude rings
    for (var i = 0; i < segs; i++) {
      var phi = (i / segs) * Math.PI * 2;
      var cx3 = (this.R + this.r * Math.cos(phi)) * Math.cos(this.rotY);
      var cy3 = (this.R + this.r * Math.cos(phi)) * Math.sin(this.rotY);
      var cz3 = this.r * Math.sin(phi);
      // project to 2D with simple perspective
      var fov  = 600;
      var z    = cz3 * Math.cos(this.rotX) - cy3 * Math.sin(this.rotX) + fov;
      var px2  = cx3 * fov / z;
      var py2  = (cz3 * Math.sin(this.rotX) + cy3 * Math.cos(this.rotX)) * fov / z;
      var rProj = this.r * 0.6 * fov / z;
      if (rProj < 1) continue;
      ox.beginPath();
      ox.ellipse(px2, py2, rProj, rProj * Math.abs(Math.cos(this.rotX)), this.rotZ, 0, Math.PI * 2);
      ox.stroke();
    }
    ox.restore();
  };

  /* 3. Big Wireframe Icosphere (geodesic sphere) */
  function Icosphere(opts) {
    this.nx    = opts.nx;
    this.ny    = opts.ny;
    this.R     = opts.R    || 140;
    this.rotX  = opts.rotX || 0;
    this.rotY  = opts.rotY || 0;
    this.spdX  = opts.spdX || 0.0015;
    this.spdY  = opts.spdY || 0.002;
    this.col   = opts.col;
    this.alpha = opts.alpha || 0.055;
    this.drift = opts.drift || 0;
    this.driftY = 0;
    // icosahedron vertices
    var t = (1 + Math.sqrt(5)) / 2;
    this.verts = [
      [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
      [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
      [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
    ].map(function (v) {
      var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
      return [v[0]/len, v[1]/len, v[2]/len];
    });
    this.edges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],
      [1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],
      [3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,8],[7,10],
      [8,9],[10,11]
    ];
  }
  Icosphere.prototype.update = function () {
    this.rotX  += this.spdX;
    this.rotY  += this.spdY;
    this.driftY += this.drift;
    if (Math.abs(this.driftY) > oh * 0.1) this.drift *= -1;
  };
  Icosphere.prototype.project = function (v) {
    // rotate Y
    var x1 = v[0]*Math.cos(this.rotY) + v[2]*Math.sin(this.rotY);
    var y1 = v[1];
    var z1 = -v[0]*Math.sin(this.rotY) + v[2]*Math.cos(this.rotY);
    // rotate X
    var x2 = x1;
    var y2 = y1*Math.cos(this.rotX) - z1*Math.sin(this.rotX);
    var z2 = y1*Math.sin(this.rotX) + z1*Math.cos(this.rotX);
    var fov = 500, z3 = z2 + 3;
    return [x2 * this.R * fov / (z3 * fov + this.R),
            y2 * this.R * fov / (z3 * fov + this.R)];
  };
  Icosphere.prototype.draw = function () {
    var cx = this.nx * ow;
    var cy = this.ny * oh + this.driftY + scrollY * 0.025;
    ox.save();
    ox.translate(cx, cy);
    ox.globalAlpha = this.alpha;
    ox.strokeStyle = rgba(this.col, 1);
    ox.lineWidth   = 0.8;
    var verts = this.verts;
    var self  = this;
    this.edges.forEach(function (e) {
      var p1 = self.project(verts[e[0]]);
      var p2 = self.project(verts[e[1]]);
      ox.beginPath();
      ox.moveTo(p1[0], p1[1]);
      ox.lineTo(p2[0], p2[1]);
      ox.stroke();
    });
    ox.restore();
  };

  /* 4. Helix Coil (vertical, scroll-reactive) */
  function Helix(opts) {
    this.nx     = opts.nx;
    this.ny     = opts.ny;
    this.height = opts.height || oh * 0.6;
    this.R      = opts.R      || 55;
    this.turns  = opts.turns  || 5;
    this.phase  = opts.phase  || 0;
    this.spdP   = opts.spdP   || 0.004;
    this.col    = opts.col;
    this.col2   = opts.col2   || opts.col;
    this.alpha  = opts.alpha  || 0.08;
  }
  Helix.prototype.update = function () {
    this.phase += this.spdP;
  };
  Helix.prototype.draw = function () {
    var cx = this.nx * ow;
    var cy = this.ny * oh - this.height / 2 + scrollY * 0.05;
    var steps = 160;
    ox.save();
    ox.translate(cx, cy);
    // strand A
    ox.beginPath();
    ox.globalAlpha = this.alpha;
    for (var i = 0; i <= steps; i++) {
      var t   = i / steps;
      var y   = t * this.height;
      var ang = t * this.turns * Math.PI * 2 + this.phase;
      var x   = Math.cos(ang) * this.R;
      i === 0 ? ox.moveTo(x, y) : ox.lineTo(x, y);
    }
    var g1 = ox.createLinearGradient(0, 0, 0, this.height);
    g1.addColorStop(0,   rgba(this.col,  0));
    g1.addColorStop(0.3, rgba(this.col,  1));
    g1.addColorStop(0.7, rgba(this.col2, 1));
    g1.addColorStop(1,   rgba(this.col2, 0));
    ox.strokeStyle = g1;
    ox.lineWidth   = 1.1;
    ox.stroke();
    // strand B (offset π)
    ox.beginPath();
    ox.globalAlpha = this.alpha * 0.6;
    for (var j = 0; j <= steps; j++) {
      var t2  = j / steps;
      var y2  = t2 * this.height;
      var ang2 = t2 * this.turns * Math.PI * 2 + this.phase + Math.PI;
      var x2  = Math.cos(ang2) * this.R;
      j === 0 ? ox.moveTo(x2, y2) : ox.lineTo(x2, y2);
    }
    ox.strokeStyle = rgba(this.col2, 1);
    ox.lineWidth   = 0.7;
    ox.stroke();
    // rungs
    ox.globalAlpha = this.alpha * 0.4;
    for (var k = 0; k <= steps; k += 10) {
      var tk   = k / steps;
      var yk   = tk * this.height;
      var angk = tk * this.turns * Math.PI * 2 + this.phase;
      ox.beginPath();
      ox.moveTo(Math.cos(angk)          * this.R, yk);
      ox.lineTo(Math.cos(angk + Math.PI)* this.R, yk);
      ox.strokeStyle = rgba(COLS[k % COLS.length], 1);
      ox.lineWidth   = 0.5;
      ox.stroke();
    }
    ox.restore();
  };

  /* ── Instantiate objects ── */
  var isMobile = ow < 768;
  var objects = [];

  // Big spirals — corners and edges
  objects.push(new Spiral({ nx:0.08, ny:0.25, turns:4,   maxR:isMobile?100:200, rotSpd:0.0006, col:COLS[0], alpha:0.07, lw:1.0, drift:0.12 }));
  objects.push(new Spiral({ nx:0.92, ny:0.55, turns:3.5, maxR:isMobile?80:170,  rotSpd:-0.0007,col:COLS[1], alpha:0.065,lw:0.9, drift:-0.1 }));
  objects.push(new Spiral({ nx:0.5,  ny:0.8,  turns:3,   maxR:isMobile?70:150,  rotSpd:0.0005, col:COLS[2], alpha:0.055,lw:0.8, drift:0.08 }));
  if (!isMobile) {
    objects.push(new Spiral({ nx:0.18, ny:0.72, turns:4.5, maxR:160, rotSpd:-0.0005, col:COLS[3], alpha:0.05, lw:0.8, drift:0.09 }));
    objects.push(new Spiral({ nx:0.82, ny:0.2,  turns:3,   maxR:130, rotSpd:0.0008,  col:COLS[4], alpha:0.05, lw:0.8, drift:-0.07 }));
  }

  // Tori
  objects.push(new Torus({ nx:0.15, ny:0.45, R:isMobile?70:130, r:isMobile?22:40, spdX:0.003, spdY:0.002, spdZ:0.001, col:COLS[1], alpha:0.065, drift:0.08 }));
  objects.push(new Torus({ nx:0.85, ny:0.7,  R:isMobile?60:110, r:isMobile?18:34, spdX:0.002, spdY:0.003, spdZ:0.002, col:COLS[0], alpha:0.06,  drift:-0.09 }));
  if (!isMobile) {
    objects.push(new Torus({ nx:0.5, ny:0.35, R:100, r:30, spdX:0.0025, spdY:0.0015, spdZ:0.003, col:COLS[5], alpha:0.05, drift:0.06 }));
  }

  // Icospheres
  objects.push(new Icosphere({ nx:0.25, ny:0.6,  R:isMobile?80:150, spdX:0.0012, spdY:0.0018, col:COLS[2], alpha:0.055, drift:0.07 }));
  objects.push(new Icosphere({ nx:0.75, ny:0.35, R:isMobile?70:130, spdX:0.0018, spdY:0.0012, col:COLS[4], alpha:0.05,  drift:-0.06 }));
  if (!isMobile) {
    objects.push(new Icosphere({ nx:0.6, ny:0.75, R:120, spdX:0.0015, spdY:0.002, col:COLS[3], alpha:0.045, drift:0.05 }));
  }

  // Helices — left and right edges
  objects.push(new Helix({ nx:0.04, ny:0.5, height:oh*0.7, R:isMobile?20:40, turns:5, spdP:0.003, col:COLS[0], col2:COLS[1], alpha:0.1 }));
  objects.push(new Helix({ nx:0.96, ny:0.5, height:oh*0.7, R:isMobile?20:40, turns:5, spdP:-0.003,col:COLS[2], col2:COLS[3], alpha:0.09 }));
  if (!isMobile) {
    objects.push(new Helix({ nx:0.5, ny:0.5, height:oh*0.5, R:30, turns:4, spdP:0.002, col:COLS[4], col2:COLS[5], alpha:0.06 }));
  }

  /* ── Animation loop ── */
  var t = 0;
  function loop() {
    ox.clearRect(0, 0, ow, oh);
    t++;
    for (var i = 0; i < objects.length; i++) {
      objects[i].update(t);
      objects[i].draw();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

}());
