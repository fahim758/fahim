/* =============================================
   FAHIM ISLAM PORTFOLIO — script.js
   Interactions, Animations & Functionality
   ============================================= */

'use strict';

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.classList.remove('dark-mode', 'light-mode');
body.classList.add(savedTheme + '-mode');
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  body.classList.toggle('dark-mode', !isDark);
  body.classList.toggle('light-mode', isDark);
  const newTheme = isDark ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  scrollProgress.style.width = progress + '%';
}, { passive: true });

// ===== STICKY NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < bottom) {
      navLinksList.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

// ===== TYPING ANIMATION =====
const typedEl = document.getElementById('typedText');
const words = ['SEO Expert', 'Content Writer', 'Rank Builder', 'Growth Hacker', 'Digital Marketer'];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeAnimation() {
  const current = words[wordIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 300;
  }
  setTimeout(typeAnimation, delay);
}
typeAnimation();

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start);
  }, 16);
}

// Trigger counters when hero is visible
const statNums = document.querySelectorAll('.stat-num');
let countersTriggered = false;
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ===== SKILL BARS ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===== AOS (Animate On Scroll) — CUSTOM =====
const aosElements = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

aosElements.forEach(el => aosObserver.observe(el));

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  const value = field.value.trim();

  if (!value) {
    error.textContent = message;
    field.style.borderColor = '#f87171';
    return false;
  }

  if (id === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      error.textContent = 'Please enter a valid email address.';
      field.style.borderColor = '#f87171';
      return false;
    }
  }

  error.textContent = '';
  field.style.borderColor = '';
  return true;
}

// Live validation
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    if (el.value.trim()) {
      document.getElementById(id + 'Error').textContent = '';
      el.style.borderColor = '';
    }
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isNameValid = validateField('name', 'nameError', 'Please enter your name.');
  const isEmailValid = validateField('email', 'emailError', 'Please enter your email.');
  const isSubjectValid = validateField('subject', 'subjectError', 'Please enter a subject.');
  const isMessageValid = validateField('message', 'messageError', 'Please write your message.');

  if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) return;

  // Simulate sending
  const btn = contactForm.querySelector('.btn-submit');
  const btnText = document.getElementById('submitText');
  btn.classList.add('loading');
  btnText.textContent = 'Sending...';

  await new Promise(resolve => setTimeout(resolve, 1800));

  btn.classList.remove('loading');
  btnText.textContent = 'Send Message';
  contactForm.reset();
  formSuccess.classList.add('show');

  setTimeout(() => formSuccess.classList.remove('show'), 6000);
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ===== NAVBAR LINK SMOOTH SCROLL OVERRIDE =====
// (handled above, no extra needed)

// ===== HERO IMAGE LAZY PARALLAX =====
window.addEventListener('scroll', () => {
  const heroPhoto = document.querySelector('.hero-photo');
  if (!heroPhoto) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroPhoto.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
}, { passive: true });

console.log('%c Fahim Islam Portfolio ✨', 'font-size:18px;color:#00d4ff;font-weight:bold;');
console.log('%c Built with 💙 for organic growth', 'color:#94a3b8;');
