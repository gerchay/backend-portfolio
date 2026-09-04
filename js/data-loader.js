const DATA_FILES = {
  profile: 'data/profile.json',
  navigation: 'data/navigation.json',
  about: 'data/about.json',
  experience: 'data/experience.json',
  caseStudies: 'data/case-studies.json',
  expertise: 'data/expertise.json',
  education: 'data/education.json'
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

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || '';
  });
}

function makeLink(label, href, className) {
  if (!href) {
    const disabled = document.createElement('span');
    disabled.className = `${className} is-disabled`;
    disabled.textContent = label;
    disabled.setAttribute('aria-disabled', 'true');
    disabled.title = 'Link will be added in a later phase';
    return disabled;
  }

  const link = document.createElement('a');
  link.className = className;
  link.href = href;
  link.textContent = label;
  if (href.startsWith('mailto:')) {
    link.setAttribute('aria-label', `${label} — opens your email client`);
  }
  if (href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${label} — opens in a new tab`);
  }
  return link;
}

function makeTag(label, className = 'tag') {
  const tag = document.createElement('li');
  tag.className = className;
  tag.textContent = label;
  return tag;
}

function renderNavigation(data) {
  if (!Array.isArray(data?.links)) return;
  const desktop = document.querySelector('.desktop-nav-links');
  const mobile = document.querySelector('.mobile-nav-links');
  [desktop, mobile].forEach((container) => {
    if (!container) return;
    container.replaceChildren();
    data.links.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = item.href;
      link.textContent = item.label;
      container.appendChild(link);
    });
  });

  const mobileLanguage = document.querySelector('.mobile-language-slot');
  if (mobileLanguage) {
    const label = document.createElement('span');
    label.textContent = 'Language';
    const options = document.createElement('strong');
    options.textContent = 'EN | ES';
    options.setAttribute('aria-label', 'Language selector placeholder');
    mobileLanguage.replaceChildren(label, options);
  }
}

function renderProfile(data) {
  if (!data) return;
  setText('.hero-name, .footer-name', data.name);
  setText('.hero-role, .footer-role', data.role);
  setText('.hero-specialization', data.specialization);
  setText('.hero-description', data.description);
  setText('.availability span:last-child', data.availability);

  const photo = document.querySelector('.hero-photo');
  if (photo && data.photo?.src) {
    photo.src = data.photo.src;
    photo.alt = data.photo.alt || '';
  }

  const actions = document.querySelector('.hero-actions');
  if (actions) {
    actions.replaceChildren(
      makeLink('View Experience', '#experience', 'button button-primary'),
      makeLink('Download CV', data.links?.cv, 'button button-secondary'),
      makeLink('Email Me', data.links?.email ? `mailto:${data.links.email}` : '', 'button button-tertiary')
    );
  }

  const professionalLinks = [
    { label: 'GitHub', href: data.links?.github },
    { label: 'LinkedIn', href: data.links?.linkedin }
  ];
  document.querySelectorAll('.hero-socials, .footer-links').forEach((container) => {
    container.replaceChildren(...professionalLinks.map((item) => makeLink(item.label, item.href, 'text-link')));
  });

  const contactTitle = document.querySelector('.contact-title');
  const contactCopy = document.querySelector('.contact-copy');
  if (contactTitle) contactTitle.textContent = data.contact?.title || '';
  if (contactCopy) contactCopy.textContent = data.contact?.description || '';
  const contactActions = document.querySelector('.contact-actions');
  if (contactActions) {
    contactActions.replaceChildren(
      makeLink('Email Me', data.links?.email ? `mailto:${data.links.email}` : '', 'button button-primary'),
      makeLink('GitHub', data.links?.github, 'button button-secondary'),
      makeLink('LinkedIn', data.links?.linkedin, 'button button-secondary')
    );
  }
}

function renderAbout(data) {
  if (!data) return;
  setText('.about-summary', data.summary);
  const grid = document.querySelector('.highlight-grid');
  if (!grid || !Array.isArray(data.highlights)) return;
  grid.replaceChildren();
  data.highlights.forEach((highlight) => {
    const card = document.createElement('article');
    card.className = 'highlight-card';
    const value = document.createElement('strong');
    value.textContent = highlight.value;
    const label = document.createElement('span');
    label.textContent = highlight.label;
    card.append(value, label);
    grid.appendChild(card);
  });
}

function renderExperience(data) {
  if (!data) return;
  setText('.experience-intro', data.intro);
  const list = document.querySelector('.experience-list');
  if (!list || !Array.isArray(data.items)) return;
  list.replaceChildren();

  data.items.forEach((entry) => {
    const article = document.createElement('article');
    article.className = `experience-card${entry.featured ? ' featured' : ''}`;
    const marker = document.createElement('div');
    marker.className = 'timeline-marker';
    marker.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    content.className = 'experience-content';
    const meta = document.createElement('div');
    meta.className = 'experience-meta';
    const company = document.createElement('p');
    company.className = 'company-name';
    company.textContent = entry.company;
    const dates = document.createElement('p');
    dates.className = 'dates';
    dates.textContent = entry.dates;
    meta.append(company, dates);
    const role = document.createElement('h3');
    role.textContent = entry.role;
    content.append(meta, role);
    if (entry.location) {
      const location = document.createElement('p');
      location.className = 'location';
      location.textContent = entry.location;
      content.appendChild(location);
    }
    const summary = document.createElement('p');
    summary.className = 'card-summary';
    summary.textContent = entry.summary;
    content.appendChild(summary);
    if (entry.leadership) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'Leadership';
      content.appendChild(badge);
    }
    if (Array.isArray(entry.achievements) && entry.achievements.length) {
      const achievements = document.createElement('ul');
      achievements.className = 'achievement-list';
      entry.achievements.forEach((item) => achievements.appendChild(makeTag(item, 'achievement-item')));
      content.appendChild(achievements);
    }
    if (Array.isArray(entry.technologies) && entry.technologies.length) {
      const technologies = document.createElement('ul');
      technologies.className = 'tag-list';
      entry.technologies.forEach((item) => technologies.appendChild(makeTag(item)));
      content.appendChild(technologies);
    }
    article.append(marker, content);
    list.appendChild(article);
  });
}

function renderCaseStudies(data) {
  if (!data) return;
  setText('.work-intro', data.intro);
  const grid = document.querySelector('.case-study-grid');
  if (!grid || !Array.isArray(data.items)) return;
  grid.replaceChildren();

  data.items.forEach((item) => {
    const article = document.createElement('article');
    article.className = `case-study-card${item.featured ? ' featured' : ''}`;
    const top = document.createElement('div');
    top.className = 'case-study-top';
    const type = document.createElement('span');
    type.className = 'case-type';
    type.textContent = item.type;
    top.appendChild(type);
    if (item.private) {
      const nda = document.createElement('span');
      nda.className = 'badge badge-private';
      nda.textContent = 'Private / NDA';
      top.appendChild(nda);
    }
    const title = document.createElement('h3');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.className = 'card-summary';
    description.textContent = item.shortDescription;
    const context = document.createElement('p');
    context.className = 'case-context';
    context.textContent = item.context;
    const tagList = document.createElement('ul');
    tagList.className = 'tag-list';
    [...(item.technologies || []), ...(item.architectureTags || [])].forEach((tag) => tagList.appendChild(makeTag(tag)));
    article.append(top, title, description, context, tagList);
    grid.appendChild(article);
  });
}

function renderExpertise(data) {
  if (!data) return;
  setText('.expertise-intro', data.intro);
  const grid = document.querySelector('.expertise-grid');
  if (!grid || !Array.isArray(data.categories)) return;
  grid.replaceChildren();
  data.categories.forEach((category, index) => {
    const article = document.createElement('article');
    article.className = 'expertise-card';
    const number = document.createElement('span');
    number.className = 'expertise-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3');
    title.textContent = category.name;
    const list = document.createElement('ul');
    list.className = 'capability-list';
    (category.capabilities || []).forEach((capability) => list.appendChild(makeTag(capability, 'capability-item')));
    article.append(number, title, list);
    grid.appendChild(article);
  });
}

function renderEducation(data) {
  const list = document.querySelector('.education-list');
  if (!list || !Array.isArray(data?.items)) return;
  list.replaceChildren();
  data.items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'education-card';
    const institution = document.createElement('p');
    institution.className = 'institution';
    institution.textContent = item.institution;
    const degree = document.createElement('h3');
    degree.textContent = item.degree;
    article.append(institution, degree);
    if (item.status) {
      const status = document.createElement('span');
      status.className = 'badge';
      status.textContent = item.status;
      article.appendChild(status);
    }
    list.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const entries = await Promise.all(Object.entries(DATA_FILES).map(async ([name, path]) => [name, await loadJson(name, path)]));
  const data = Object.fromEntries(entries);
  renderNavigation(data.navigation);
  renderProfile(data.profile);
  renderAbout(data.about);
  renderExperience(data.experience);
  renderCaseStudies(data.caseStudies);
  renderExpertise(data.expertise);
  renderEducation(data.education);

  if (window.location.hash) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
});
