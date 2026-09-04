function renderPortfolio(data) {
  const section = document.getElementById('portfolio');
  const grid = section?.querySelector('.portfolio-grid');
  if (!section || !grid) return;

  const title = section.querySelector('.section-title');
  if (title) title.textContent = data.title || 'Portfolio';

  grid.replaceChildren();
  if (!Array.isArray(data.items) || data.items.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'Portfolio content will be added in a later phase.';
    grid.appendChild(emptyState);
    return;
  }
}

window.renderPortfolio = renderPortfolio;
