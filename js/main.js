document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('mobile-menu');
  const panel = menu?.querySelector('.mobile-menu-panel');
  const toggle = document.querySelector('.menu-toggle');
  const closeButton = document.querySelector('.close-menu-btn');
  let returnFocusTo = null;

  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    requestAnimationFrame(() => returnFocusTo?.focus());
  };

  const openMenu = () => {
    if (!menu) return;
    returnFocusTo = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeButton?.focus();
  };

  toggle?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);
  menu?.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
  });
  panel?.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu();
  });

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-25% 0px -65%', threshold: 0 });

  document.querySelectorAll('main section[id]:not(#top)').forEach((section) => observer.observe(section));
});
