document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Contact sheet gallery (bento layout) ----------
     Each frame maps to a named grid-area (a–h) defined in the CSS bento
     template. Sizing is already handled by the .frame / .frame--x CSS
     rules, so swapping an image here is the only thing you ever need to
     touch. */
  const frames = [
    { area: 'a', label: 'Portrait · 01',    draw: '<img src="images/pexels-eberhardgross-443446.jpg" alt="Portrait session">' }, // wide
    { area: 'b', label: 'Detail · 02',      draw: '<img src="images/pexels-icon0-130154.jpg" alt="Detail shot">' },  // small
    { area: 'c', label: 'Golden Hour · 03', draw: '<img src="images/pexels-jplenio-10781049.jpg" alt="Golden hour lighting">' },   // tall
    { area: 'd', label: 'Candid · 04',      draw: '<img src="images/pexels-jplenio-10781049.jpg" alt="Candid moment">' },   // tall
    { area: 'e', label: 'Wedding · 05',     draw: '<img src="images/pexels-jplenio-10781049.jpg" alt="Wedding ceremony">' },  // big feature
    { area: 'f', label: 'Event · 06',       draw: '<img src="images/pexels-jplenio-10781049.jpg" alt="Event coverage">' },    // tall
    { area: 'g', label: 'Portrait · 07',    draw: '<img src="images/pexels-eberhardgross-443446.jpg" alt="Portrait session">' }, // wide
    { area: 'h', label: 'Candid · 08',      draw: '<img src="images/pexels-jplenio-10781049.jpg" alt="Candid moment">' },   // small
  ];

  const sheet = document.getElementById('contactSheet');
  if (sheet) {
    frames.forEach(f => {
      const div = document.createElement('div');
      div.className = `frame frame--${f.area}`;
      div.setAttribute('data-label', f.label);
      div.innerHTML = f.draw;
      sheet.appendChild(div);
    });
  }

  /* ---------- Gallery parallax ----------
     Each image drifts slightly inside its own tile as the page scrolls.
     Movement is capped to a % of the tile's own height (via --parallax-y),
     so it never reveals empty space, however tall or short the tile is. */
  initGalleryParallax();

  function initGalleryParallax() {
    const tiles = document.querySelectorAll('#contactSheet .frame');
    if (!tiles.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      tiles.forEach(tile => {
        const rect = tile.getBoundingClientRect();
        // how far the tile's center is from the viewport's center
        const centerOffset = (rect.top + rect.height / 2) - vh / 2;
        const ratio = centerOffset / vh;
        // cap movement to ~10% of the tile's own height, so tall and short tiles both stay safe
        const maxShift = rect.height * 0.1;
        const shift = Math.max(-maxShift, Math.min(maxShift, ratio * maxShift * -2));
        tile.style.setProperty('--parallax-y', `${shift.toFixed(1)}px`);
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Film-strip cursor trail ---------- */
  initCursorTrail();

  function initCursorTrail() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || coarsePointer) return;

    const dotCount = 7;
    const dots = [];
    for (let i = 0; i < dotCount; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-dot';
      document.body.appendChild(el);
      dots.push({ el, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }

    let mouseX = dots[0].x;
    let mouseY = dots[0].y;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
    });

    function animate() {
      let targetX = mouseX;
      let targetY = mouseY;
      dots.forEach((dot, i) => {
        dot.x += (targetX - dot.x) * 0.3;
        dot.y += (targetY - dot.y) * 0.3;
        dot.el.style.left = `${dot.x}px`;
        dot.el.style.top = `${dot.y}px`;
        dot.el.style.setProperty('--dot-scale', (1 - (i / dotCount) * 0.65).toFixed(2));
        dot.el.style.setProperty('--dot-opacity', active ? (0.55 - (i / dotCount) * 0.5).toFixed(2) : 0);
        targetX = dot.x;
        targetY = dot.y;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ---------- Before / after slider ---------- */
  initBeforeAfter();

  function initBeforeAfter() {
    const slider = document.getElementById('baSlider');
    const after = document.getElementById('baAfter');
    const handle = document.getElementById('baHandle');
    if (!slider || !after || !handle) return;

    function setPosition(percent) {
      const clamped = Math.max(0, Math.min(100, percent));
      after.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = `${clamped}%`;
      handle.setAttribute('aria-valuenow', Math.round(clamped));
    }

    function percentFromEvent(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    let dragging = false;

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      setPosition(percentFromEvent(e.clientX));
      slider.setPointerCapture(e.pointerId);
    });
    slider.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      setPosition(percentFromEvent(e.clientX));
    });
    slider.addEventListener('pointerup', () => { dragging = false; });
    slider.addEventListener('pointerleave', () => { dragging = false; });

    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') { setPosition(current - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPosition(current + 5); e.preventDefault(); }
    });

    setPosition(50);
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const slides = Array.from(track.querySelectorAll('.testimonial'));
    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current === -1) current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }

    let autoplay = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);

    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo((current + 1) % slides.length), 5500);
    });
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      if (!name) return;
      status.textContent = `Thanks, ${name.split(' ')[0]} — we'll write back within a day or two.`;
      form.reset();
    });
  }

  /* ---------- Scroll reveal for sections ---------- */
  const revealTargets = document.querySelectorAll('section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(sec => {
      sec.style.opacity = 0;
      sec.style.transform = 'translateY(24px)';
      sec.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      io.observe(sec);
    });
    // hero should already be visible on load
    const hero = document.getElementById('hero');
    if (hero) { hero.style.opacity = 1; hero.style.transform = 'translateY(0)'; }
  }
});