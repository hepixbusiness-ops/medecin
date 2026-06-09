/* ================================================================
   MEDICARE PREMIUM — script.js
================================================================ */

/* ================================================================
   1. NAVIGATION — scroll behavior + burger menu
================================================================ */
(function initNav() {
  const nav      = document.getElementById('nav');
  const burger   = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');

  /* Sticky scroll style */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Burger toggle */
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });

  /* Close mobile menu on link click */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', false);
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', true);
    });
  });

  /* Smooth scroll for all anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
})();

/* ================================================================
   2. DROPDOWN NAVIGATION
================================================================ */
(function initDropdown() {
  const item = document.querySelector('.nav__has-drop');
  const btn  = item?.querySelector('.nav__drop-btn');
  if (!item || !btn) return;

  const open  = () => { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
  const close = () => { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
  const toggle = () => item.classList.contains('is-open') ? close() : open();

  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

  /* Fermer en cliquant ailleurs */
  document.addEventListener('click', (e) => {
    if (!item.contains(e.target)) close();
  });

  /* Fermer avec Escape */
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  /* Fermer quand on clique sur un lien du dropdown */
  item.querySelectorAll('.nav__dropdown a').forEach(a => a.addEventListener('click', close));

  /* Fermer au scroll */
  window.addEventListener('scroll', close, { passive: true });
})();

/* ================================================================
   3. BACK TO TOP
================================================================ */
const backTop = document.getElementById('backToTop');
function toggleBackTop() {
  const show = window.scrollY > 500;
  backTop.hidden = !show;
}
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ================================================================
   3. SCROLL REVEAL — IntersectionObserver
================================================================ */
(function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.revealDelay || 0);
      setTimeout(() => el.classList.add('is-visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ================================================================
   4. ANIMATED COUNTERS
================================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.counter);
    const suffix   = el.dataset.suffix || '';
    const formatted = el.dataset.formatted === 'true';
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      const display  = formatted ? value.toLocaleString('fr-FR') : value;
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  counters.forEach(el => observer.observe(el));
})();

/* ================================================================
   5. TESTIMONIALS CAROUSEL
================================================================ */
(function initCarousel() {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsEl  = document.getElementById('testimonialsDots');
  if (!track) return;

  const slides  = track.querySelectorAll('.testimonial');
  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;

  /* Compute visible slides count */
  const getVisible = () => {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  };

  /* Build dots */
  const buildDots = () => {
    dotsEl.innerHTML = '';
    const visible = getVisible();
    const count = total - visible + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.className = 'testimonials__dot' + (i === current ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Témoignage ${i + 1}`);
      btn.setAttribute('aria-selected', i === current);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    }
  };

  const updateDots = () => {
    dotsEl.querySelectorAll('.testimonials__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current);
    });
  };

  const goTo = (idx) => {
    const visible = getVisible();
    const max = total - visible;
    current = Math.max(0, Math.min(idx, max));
    const slideWidth = slides[0].offsetWidth + 24; // gap 1.5rem = 24px
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    updateDots();
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* Auto-advance */
  const startAuto = () => {
    autoTimer = setInterval(() => {
      const visible = getVisible();
      const max = total - visible;
      goTo(current >= max ? 0 : current + 1);
    }, 5000);
  };
  const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

  /* Swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });

  /* Init & responsive rebuild */
  buildDots();
  goTo(0);
  startAuto();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(current); }, 200);
  });

  /* Pause on hover */
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', startAuto);
})();

/* ================================================================
   6. FAQ ACCORDION
================================================================ */
(function initFaq() {
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      /* Close all others */
      document.querySelectorAll('.faq__q').forEach(other => {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        const otherId = other.getAttribute('aria-controls');
        const otherAnswer = document.getElementById(otherId);
        if (otherAnswer) {
          slideUp(otherAnswer);
        }
      });

      /* Toggle current */
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        slideUp(answer);
      } else {
        btn.setAttribute('aria-expanded', 'true');
        slideDown(answer);
      }
    });
  });

  function slideDown(el) {
    el.hidden = false;
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.opacity = '0';
    el.style.transition = 'height .35s cubic-bezier(.16,1,.3,1), opacity .3s';
    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + 'px';
      el.style.opacity = '1';
    });
    el.addEventListener('transitionend', () => {
      el.style.height = 'auto';
      el.style.overflow = '';
    }, { once: true });
  }

  function slideUp(el) {
    el.style.height = el.offsetHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.transition = 'height .3s cubic-bezier(.4,0,.2,1), opacity .25s';
    requestAnimationFrame(() => {
      el.style.height = '0';
      el.style.opacity = '0';
    });
    el.addEventListener('transitionend', () => {
      el.hidden = true;
      el.style.height = '';
      el.style.overflow = '';
      el.style.opacity = '';
    }, { once: true });
  }
})();

/* ================================================================
   7. CONTACT FORM VALIDATION
================================================================ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const rules = {
    firstName: { required: true, label: 'Le prénom' },
    lastName:  { required: true, label: 'Le nom' },
    email:     { required: true, email: true, label: "L'email" },
    phone:     { required: true, label: 'Le téléphone' },
    consent:   { checkbox: true, label: 'Le consentement' },
  };

  const showError = (field, msg) => {
    const input = form.elements[field];
    if (!input) return;
    const errorEl = input.closest('.form-field')?.querySelector('.form-error');
    input.classList.add('has-error');
    if (errorEl) errorEl.textContent = msg;
  };

  const clearError = (field) => {
    const input = form.elements[field];
    if (!input) return;
    const errorEl = input.closest('.form-field')?.querySelector('.form-error');
    input.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  };

  /* Live validation on blur */
  Object.keys(rules).forEach(field => {
    const input = form.elements[field];
    if (!input) return;
    input.addEventListener('blur', () => validate(field));
    input.addEventListener('input', () => clearError(field));
  });

  const validate = (field) => {
    const rule  = rules[field];
    const input = form.elements[field];
    if (!input || !rule) return true;

    if (rule.checkbox) {
      if (!input.checked) { showError(field, `${rule.label} est requis.`); return false; }
    } else {
      const val = input.value.trim();
      if (rule.required && !val) { showError(field, `${rule.label} est requis.`); return false; }
      if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(field, "Veuillez saisir un email valide."); return false;
      }
    }
    clearError(field);
    return true;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(field => { if (!validate(field)) valid = false; });
    if (!valid) return;

    /* Simulate async submit */
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
    }, 1200);
  });
})();

/* ================================================================
   8. GALLERY — lightbox simple
================================================================ */
(function initGallery() {
  const items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  /* Create overlay */
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image agrandie');
  overlay.style.cssText = `
    display:none; position:fixed; inset:0; z-index:200;
    background:rgba(2,10,30,.92); backdrop-filter:blur(10px);
    align-items:center; justify-content:center; cursor:zoom-out;
    padding:2rem;
  `;

  const img = document.createElement('img');
  img.style.cssText = 'max-width:90vw; max-height:88vh; border-radius:12px; box-shadow:0 32px 80px rgba(0,0,0,.5); object-fit:contain;';
  img.alt = '';

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.style.cssText = `
    position:absolute; top:1.5rem; right:1.5rem;
    width:44px; height:44px; border-radius:50%;
    background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.25);
    color:white; font-size:1.25rem; display:flex; align-items:center;
    justify-content:center; cursor:pointer; transition:.2s;
  `;
  closeBtn.textContent = '✕';

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  const open = (src, alt) => {
    img.src = src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=800');
    img.alt = alt;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    const imgEl = item.querySelector('img');
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => open(imgEl.src, imgEl.alt));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => { if (e.key === 'Enter') open(imgEl.src, imgEl.alt); });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ================================================================
   9. PARALLAX SUBTLE — hero image
================================================================ */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroImg = document.querySelector('.hero__bg-img');
  if (!heroImg) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    if (scrolled > window.innerHeight) return;
    heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ================================================================
   10. SERVICE CARDS — tilt on mouse move
================================================================ */
(function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 900) return;

  document.querySelectorAll('.service-card, .doctor-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
