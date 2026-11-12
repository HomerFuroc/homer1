(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- editor-style line numbers in the left gutter ---- */
  var gutter = document.getElementById('gutter');
  if (gutter) {
    var count = Math.ceil(window.innerHeight / 26) + 1;
    for (var i = 1; i <= count; i++) {
      var s = document.createElement('span');
      s.textContent = (i < 10 ? '0' : '') + i;
      gutter.appendChild(s);
    }
  }

  /* ---- typing effect on the role line ---- */
  var typed = document.getElementById('typed');
  if (typed) {
    var full = 'BSIT Student from the University of the Cordilleras.';
    if (reduce) {
      typed.textContent = full;
    } else {
      var n = 0;
      (function type() {
        typed.textContent = full.slice(0, n++);
        if (n <= full.length) setTimeout(type, 38);
      })();
    }
  }

  /* ---- particle network that reacts to the mouse ---- */
  var canvas = document.getElementById('net');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, dpr, pts = [];
  var mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    var total = Math.min(110, Math.floor(window.innerWidth * window.innerHeight / 16000));
    pts = [];
    for (var i = 0; i < total; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    var link = 140 * dpr;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,.75)';
      ctx.fill();

      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < link) {
          ctx.strokeStyle = 'rgba(79,140,255,' + (0.28 * (1 - d / link)) + ')';
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
      if (md < 180 * dpr) {
        ctx.strokeStyle = 'rgba(139,92,246,' + (0.6 * (1 - md / (180 * dpr))) + ')';
        ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  window.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
