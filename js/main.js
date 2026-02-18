/* =============================================================
   ComidApp.cl — Main JavaScript
   ============================================================= */

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---------- MOBILE MENU ---------- */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.style.display = menuOpen ? 'flex' : 'none';

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.style.display = 'none';
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---------- SMOOTH SCROLL (for older browsers) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- SCROLL ANIMATIONS (Intersection Observer) ---------- */
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling elements
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-animate]:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

animateElements.forEach(el => observer.observe(el));

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-q.open').forEach(other => {
      if (other !== btn) {
        other.classList.remove('open');
        other.parentElement.querySelector('.faq-a').classList.remove('open');
      }
    });

    // Toggle current
    btn.classList.toggle('open', !isOpen);
    answer.classList.toggle('open', !isOpen);
  });
});

/* ---------- CONTACT FORM → WHATSAPP ---------- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const local    = document.getElementById('f-local').value.trim();
  const nombre   = document.getElementById('f-nombre').value.trim();
  const telefono = document.getElementById('f-tel').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const mensaje  = document.getElementById('f-mensaje').value.trim();

  if (!local || !nombre || !telefono) return;

  const lines = [
    '👋 *Hola, me interesa ComidApp*',
    '',
    `🍽️ *Local:* ${local}`,
    `👤 *Nombre:* ${nombre}`,
    `📱 *WhatsApp:* ${telefono}`,
    email    ? `📧 *Email:* ${email}` : null,
    mensaje  ? `💬 *Mensaje:* ${mensaje}` : null,
    '',
    '— Enviado desde comidapp.cl'
  ].filter(Boolean).join('\n');

  // Replace this with the actual ComidApp WhatsApp number
  const waNumber = '56912345678';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;

  window.open(waUrl, '_blank');
});

/* ---------- ANIMATED NUMBER COUNTERS (hero trust) ---------- */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.trust-item strong');
      // We just let CSS handle the hero display; counters are optional enhancements
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroTrust = document.querySelector('.hero-trust');
if (heroTrust) heroObserver.observe(heroTrust);

/* ---------- CHART BAR ANIMATION ---------- */
// Animate the mini chart bars in hero on load
window.addEventListener('load', () => {
  const bars = document.querySelectorAll('.mc-bar');
  bars.forEach((bar, i) => {
    const targetHeight = bar.style.height;
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      bar.style.height = targetHeight;
    }, 800 + i * 80);
  });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- HERO VISUAL FLOATING ELEMENTS ---------- */
// Re-trigger notif animation occasionally for liveliness
let notifEl = document.querySelector('.notif-float');
if (notifEl) {
  setInterval(() => {
    notifEl.style.animation = 'none';
    void notifEl.offsetWidth; // trigger reflow
    notifEl.style.animation = '';
  }, 8000);
}
