/* ================================================================
   TSIM — script.js
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFaq();
  initPortfolioFilters();
  initTestimonialsCarousel();
  initContactForm();
  initBackToTop();
  initImageFallback();
});

/* ================================================================
   NAV — fond au scroll + lien actif
================================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ================================================================
   MENU MOBILE
================================================================ */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;

  const closeMenu = () => {
    burger.classList.remove('is-active');
    mobile.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ================================================================
   REVEAL AU SCROLL
================================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .process__step, .portfolio__item, .feature, .team__card, .faq__item, .about__grid, .features__grid'
  );
  targets.forEach(el => el.setAttribute('data-reveal', ''));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ================================================================
   COMPTEURS ANIMES (stats hero)
================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  let done = false;
  const runAll = () => {
    if (done) return;
    done = true;
    counters.forEach(animate);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        runAll();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    counters.forEach(el => observer.observe(el.closest('.hero__stats') || el));
  } else {
    runAll();
  }

  // Filet de sécurité : si la section est déjà visible au chargement (mobile).
  setTimeout(() => {
    const statsBox = document.querySelector('.hero__stats');
    if (statsBox) {
      const rect = statsBox.getBoundingClientRect();
      if (rect.top < window.innerHeight) runAll();
    }
  }, 400);
}

/* ================================================================
   FAQ ACCORDEON
================================================================ */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  const openItem = (item) => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    btn.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  };
  const closeItem = (item) => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    btn.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = null;
  };

  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(closeItem);
      if (!isOpen) openItem(item);
    });
  });

  // Ouvre la première question par défaut.
  const first = items[0];
  if (first && first.querySelector('.faq__question').getAttribute('aria-expanded') === 'true') {
    openItem(first);
  }

  window.addEventListener('resize', () => {
    items.forEach(item => {
      const btn = item.querySelector('.faq__question');
      if (btn.getAttribute('aria-expanded') === 'true') openItem(item);
    });
  });
}

/* ================================================================
   FILTRES PORTFOLIO / REALISATIONS
================================================================ */
function initPortfolioFilters() {
  const buttons = document.querySelectorAll('.portfolio__filter');
  const items = document.querySelectorAll('.portfolio__item');
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });
}

/* ================================================================
   CARROUSEL TEMOIGNAGES
================================================================ */
function initTestimonialsCarousel() {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let perView = getPerView();
  let index = 0;
  let autoplayId = null;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 860) return 1;
    if (w <= 1080) return 2;
    return 4;
  }

  function pageCount() {
    return Math.max(1, slides.length - perView + 1);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pageCount(); i++) {
      const dot = document.createElement('span');
      if (i === index) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    const slideWidth = slides[0].getBoundingClientRect().width + 26;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = ((i % pageCount()) + pageCount()) % pageCount();
    update();
  }

  function next() { goTo(index + 1); }

  function restartAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = setInterval(next, 5500);
  }

  buildDots();
  update();
  restartAutoplay();

  window.addEventListener('resize', () => {
    const newPerView = getPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      index = 0;
      buildDots();
    }
    update();
  });

  track.addEventListener('mouseenter', () => autoplayId && clearInterval(autoplayId));
  track.addEventListener('mouseleave', restartAutoplay);
}

/* ================================================================
   FORMULAIRE DE CONTACT
================================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const validators = {
    fname: (v) => v.trim().length >= 2,
    fphone: (v) => /^[0-9\s+().-]{8,}$/.test(v.trim()),
    femail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    ftype: (v) => v.trim().length > 0,
    fconsent: (v, el) => el.checked,
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('is-visible');
    let isValid = true;

    Object.keys(validators).forEach(name => {
      const el = form.elements[name];
      if (!el) return;
      const group = el.closest('.form__group') || el.closest('.form__checkbox');
      const value = el.type === 'checkbox' ? el.checked : el.value;
      const valid = validators[name](String(value), el);
      if (group) group.classList.toggle('is-invalid', !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Démo : pas de backend, on simule l'envoi.
    success.classList.add('is-visible');
    form.reset();
    form.querySelectorAll('.is-invalid').forEach(g => g.classList.remove('is-invalid'));
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      const group = el.closest('.form__group') || el.closest('.form__checkbox');
      if (group) group.classList.remove('is-invalid');
    });
  });
}

/* ================================================================
   BOUTON RETOUR EN HAUT
================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   FALLBACK IMAGES (si une image externe ne charge pas)
================================================================ */
function initImageFallback() {
  const icon = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23d1a565" stroke-width="1.3"><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/></svg>'
  );
  const placeholder = `data:image/svg+xml,${icon}`;

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function handler() {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = 'true';
      this.src = placeholder;
      this.classList.add('img-fallback');
    }, { once: true });
  });
}
