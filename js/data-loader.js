const DATA_FILES = {
  profile: 'data/profile.json',
  navigation: 'data/navigation.json',
  about: 'data/about.json',
  resume: 'data/resume.json',
  portfolio: 'data/portfolio.json'
};

async function loadJson(name, path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Unable to load ${name} data from ${path}:`, error);
    return null;
  }
}

function renderProfile(data) {
  if (!data) return;
  document.querySelectorAll('.name').forEach((element) => {
    element.textContent = data.name || 'Your Name';
  });
  document.querySelectorAll('.title').forEach((element) => {
    element.textContent = data.title || 'Senior Backend Engineer';
  });
  const footer = document.querySelector('.footer');
  if (footer) footer.textContent = data.footer || 'Backend Portfolio';
}

function renderNavigation(data) {
  const container = document.querySelector('.tab-navigation');
  if (!container || !Array.isArray(data?.tabs)) return;

  container.replaceChildren();
  container.setAttribute('role', 'tablist');
  data.tabs.forEach((tab) => {
    if (!document.getElementById(tab.id)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tab-btn${tab.active ? ' active' : ''}`;
    button.dataset.tab = tab.id;
    button.textContent = tab.title;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', tab.id);
    container.appendChild(button);
  });
}

function renderAbout(data) {
  const section = document.getElementById('about');
  if (!section || !data) return;
  const title = section.querySelector('.section-title');
  const description = section.querySelector('.about-text');
  if (title) title.textContent = data.title || 'About';
  if (description) description.textContent = data.description || '';
}

function createTimelineItem(primary, secondary, period, description) {
  const item = document.createElement('div');
  item.className = 'timeline-item';

  const dot = document.createElement('div');
  dot.className = 'timeline-dot';
  dot.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'timeline-content';
  const heading = document.createElement('h4');
  heading.textContent = primary;
  content.appendChild(heading);

  if (secondary) {
    const secondaryText = document.createElement('p');
    secondaryText.className = 'company';
    secondaryText.textContent = secondary;
    content.appendChild(secondaryText);
  }
  if (period) {
    const periodText = document.createElement('p');
    periodText.className = 'period';
    periodText.textContent = period;
    content.appendChild(periodText);
  }
  if (description) {
    const descriptionText = document.createElement('p');
    descriptionText.className = 'description';
    descriptionText.textContent = description;
    content.appendChild(descriptionText);
  }

  item.append(dot, content);
  return item;
}

function renderResume(data) {
  const section = document.getElementById('resume');
  if (!section || !data) return;
  const title = section.querySelector('.section-title');
  if (title) title.textContent = data.title || 'Resume';

  const timelines = section.querySelectorAll('.timeline');
  const collections = [data.experience, data.education];
  timelines.forEach((timeline, index) => {
    timeline.replaceChildren();
    const entries = Array.isArray(collections[index]) ? collections[index] : [];
    entries.forEach((entry) => {
      timeline.appendChild(createTimelineItem(
        entry.title || entry.degree || '',
        entry.company || entry.institution || '',
        entry.period || '',
        entry.description || ''
      ));
    });

    if (entries.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'Content pending.';
      timeline.appendChild(emptyState);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([name, path]) => [name, await loadJson(name, path)])
  );
  const data = Object.fromEntries(entries);

  renderProfile(data.profile);
  renderNavigation(data.navigation);
  renderAbout(data.about);
  renderResume(data.resume);
  window.renderPortfolio?.(data.portfolio || { title: 'Portfolio', items: [] });
  setupTabNavigation();
});
