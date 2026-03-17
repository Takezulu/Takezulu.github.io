(function () {
  var canvas = document.getElementById('wave-canvas');
  var ctx = canvas.getContext('2d');
  var w, h, frame = 0;
  var mouse = { x: 0, y: 0, active: false };
  var scrollY = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('scroll', function () {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  });

  function drawWaves() {
    ctx.clearRect(0, 0, w, h);
    var t = frame * 0.006;
    var heroProgress = Math.max(0, 1 - scrollY / (h * 0.8));

    var layers = [
      { amp: 35, freq: 0.002, speed: 0.8, y: h * 0.72, alpha: 0.035, color: '26, 138, 107' },
      { amp: 25, freq: 0.003, speed: 1.2, y: h * 0.77, alpha: 0.025, color: '43, 58, 92' },
      { amp: 18, freq: 0.004, speed: 1.6, y: h * 0.82, alpha: 0.02, color: '34, 184, 138' },
    ];

    for (var l = 0; l < layers.length; l++) {
      var layer = layers[l];
      var a = layer.alpha * (0.3 + heroProgress * 0.7);
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var x = 0; x <= w; x += 2) {
        var mouseInfluence = mouse.active ? Math.sin((x - mouse.x) * 0.004) * 12 * Math.max(0, 1 - Math.abs(x - mouse.x) / (w * 0.4)) : 0;
        var y = layer.y + Math.sin(x * layer.freq + t * layer.speed) * layer.amp + mouseInfluence;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(' + layer.color + ', ' + a + ')';
      ctx.fill();
    }

    var particleCount = Math.min(40, Math.floor(w / 45));
    for (var i = 0; i < particleCount; i++) {
      var px = ((i * 137.5 + frame * 0.2) % w);
      var py = h * 0.25 + Math.sin(px * 0.008 + t * 1.5) * h * 0.25;
      var sz = 0.8 + Math.sin(i + t * 2) * 0.6;
      var al = (0.06 + Math.sin(i * 2 + t * 2) * 0.05) * heroProgress;
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 184, 138, ' + al + ')';
      ctx.fill();
    }

    for (var j = 0; j < 15; j++) {
      var nx = ((j * 97.3 + frame * 0.15) % w);
      var ny = h * 0.4 + Math.cos(nx * 0.006 + t) * h * 0.15;
      var na = 0.03 * heroProgress;
      ctx.beginPath();
      ctx.arc(nx, ny, 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(61, 82, 128, ' + na + ')';
      ctx.fill();
    }

    frame++;
    requestAnimationFrame(drawWaves);
  }
  drawWaves();

  var sections = document.querySelectorAll('.section');
  var dots = document.querySelectorAll('.scroll-dot');
  var navLinks = document.querySelectorAll('.nav-links a');
  var nav = document.getElementById('nav');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-block').forEach(function (el) {
    revealObserver.observe(el);
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = Array.from(sections).indexOf(entry.target);
        updateIndicators(idx);
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  function updateIndicators(idx) {
    dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', parseInt(a.getAttribute('data-idx')) === idx);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      sections[i].scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  var toggle = document.getElementById('nav-toggle');
  var navLinksEl = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  updateIndicators(0);

  var cards = document.querySelectorAll('.glass-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(26, 138, 107, 0.06), rgba(20, 20, 31, 0.6))';
    });
    card.addEventListener('mouseleave', function () {
      card.style.background = 'rgba(20, 20, 31, 0.6)';
    });
  });
})();
