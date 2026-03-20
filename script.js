const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const themeToggle = document.getElementById('themeToggle');
const yearNode = document.getElementById('year');
const pdfModal = document.getElementById('pdfModal');
const pdfFrame = document.getElementById('pdfFrame');
const pdfClose = document.getElementById('pdfClose');
const pdfBackdrop = document.getElementById('pdfBackdrop');
const pdfOpenNew = document.getElementById('pdfOpenNew');
const THEME_KEY = 'aryan-portfolio-theme';

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);

  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
};

const savedTheme = localStorage.getItem(THEME_KEY);
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
applyTheme(savedTheme || preferredTheme);

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', () => {
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    themeToggle.classList.remove('is-animating');
    void themeToggle.offsetWidth;
    themeToggle.classList.add('is-animating');
    setTimeout(() => themeToggle.classList.remove('is-animating'), 340);
  });
}

[...document.querySelectorAll('.nav a')].forEach((link) => {
  link.addEventListener('click', () => {
    if (nav) nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  if (!nav || !menuToggle || !nav.classList.contains('open')) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  const clickedInsideNav = nav.contains(target);
  const clickedMenuButton = menuToggle.contains(target);
  if (!clickedInsideNav && !clickedMenuButton) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const openPdfModal = (src) => {
  if (!pdfFrame || !pdfOpenNew || !pdfModal) return;
  pdfFrame.src = src;
  pdfOpenNew.href = src;
  pdfModal.classList.add('open');
  pdfModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closePdfModal = () => {
  if (!pdfModal || !pdfFrame) return;
  pdfModal.classList.remove('open');
  pdfModal.setAttribute('aria-hidden', 'true');
  pdfFrame.src = '';
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-pdf]').forEach((button) => {
  button.addEventListener('click', () => {
    const src = button.getAttribute('data-pdf');
    openPdfModal(src);
  });
});

if (pdfClose) {
  pdfClose.addEventListener('click', closePdfModal);
}

if (pdfBackdrop) {
  pdfBackdrop.addEventListener('click', closePdfModal);
}
window.addEventListener('keydown', (event) => {
  if (pdfModal && event.key === 'Escape' && pdfModal.classList.contains('open')) {
    closePdfModal();
  }
});

const filterButtons = document.querySelectorAll('.filter-button');
const docCards = document.querySelectorAll('.doc-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.getAttribute('data-filter');

    docCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const shouldShow = filter === 'all' || categories.includes(filter);
      card.classList.toggle('hidden-by-filter', !shouldShow);
    });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
    });
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach((section) => spy.observe(section));
