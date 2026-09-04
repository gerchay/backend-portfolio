function showTabContent(tabPane) {
  if (!tabPane) return;
  tabPane.querySelectorAll('.timeline-item, .portfolio-item').forEach((element) => {
    element.classList.add('fade-in');
  });
}

function setupTabNavigation() {
  const mainButtons = [...document.querySelectorAll('.tab-navigation .tab-btn')];
  const panes = [...document.querySelectorAll('.tab-pane')];
  const mobileNavigation = document.querySelector('.mobile-nav-links');
  const menu = document.querySelector('.mobile-menu-overlay');
  const menuToggle = document.querySelector('.menu-toggle');

  if (!mainButtons.length || !panes.length) return;

  const activateTab = (targetId) => {
    mainButtons.forEach((button) => {
      const isActive = button.dataset.tab === targetId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    panes.forEach((pane) => {
      const isActive = pane.id === targetId;
      pane.classList.toggle('active', isActive);
      pane.hidden = !isActive;
      if (isActive) showTabContent(pane);
    });

    mobileNavigation?.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.tab === targetId);
    });
  };

  mainButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  if (mobileNavigation) {
    mobileNavigation.replaceChildren();
    mainButtons.forEach((button) => {
      const link = document.createElement('a');
      link.href = `#${button.dataset.tab}`;
      link.dataset.tab = button.dataset.tab;
      link.className = 'mobile-nav-link';
      link.textContent = button.textContent;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activateTab(button.dataset.tab);
        closeMobileMenu();
      });
      mobileNavigation.appendChild(link);
    });
  }

  const initialButton = mainButtons.find((button) => button.classList.contains('active')) || mainButtons[0];
  activateTab(initialButton.dataset.tab);

  function closeMobileMenu() {
    if (!menu) return;
    menu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  window.closePortfolioMenu = closeMobileMenu;
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu-overlay');
  const closeButton = document.querySelector('.close-menu-btn');

  const closeMenu = () => window.closePortfolioMenu?.();

  menuToggle?.addEventListener('click', () => {
    menu?.classList.add('show');
    menu?.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
  });

  closeButton?.addEventListener('click', closeMenu);
  menu?.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
});
