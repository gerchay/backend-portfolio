const DATA_FILES = {
  profile: 'data/profile.json',
  navigation: 'data/navigation.json',
  about: 'data/about.json',
  experience: 'data/experience.json',
  caseStudies: 'data/case-studies.json',
  expertise: 'data/expertise.json',
  education: 'data/education.json'
};

let portfolioData = null;

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

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function makeLink(label, href, className, messages) {
  if (!href) {
    const disabled = document.createElement('span');
    disabled.className = `${className} is-disabled`;
    disabled.textContent = label;
    disabled.setAttribute('aria-disabled', 'true');
    disabled.title = messages.ui.linkUnavailable;
    return disabled;
  }

  const link = document.createElement('a');
  link.className = className;
  link.href = href;
  link.textContent = label;
  if (href.startsWith('mailto:')) {
    link.setAttribute('aria-label', messages.accessibility.emailLink);
  }
  if (href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', interpolate(messages.accessibility.externalLink, { label }));
  }
  return link;
}

function makeTag(label, className = 'tag') {
  const tag = document.createElement('li');
  tag.className = className;
  tag.textContent = label;
  return tag;
}

function renderNavigation(data, messages) {
  if (!Array.isArray(data?.links)) return;
  document.querySelectorAll('.desktop-nav-links, .mobile-nav-links').forEach((container) => {
    container.replaceChildren();
    data.links.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = item.href;
      link.textContent = messages.navigation[item.id];
      container.appendChild(link);
    });
  });
}

function renderProfile(data, messages) {
  if (!data) return;
  setText('.hero-name, .footer-name', data.name);
  setText('.hero-role', messages.profile.role);
  setText('.footer-role', messages.footer.description);
  setText('.hero-specialization', messages.profile.specialization);
  setText('.hero-description', messages.profile.description);
  setText('.availability span:last-child', messages.profile.availability);

  const photo = document.querySelector('.hero-photo');
  if (photo && data.photo?.src) {
    photo.src = data.photo.src;
    photo.alt = messages.accessibility.photoAlt;
  }

  const actions = document.querySelector('.hero-actions');
  if (actions) {
    actions.replaceChildren(
      makeLink(messages.profile.actions.experience, '#experience', 'button button-primary', messages),
      makeLink(messages.profile.actions.cv, data.links?.cv, 'button button-secondary', messages),
      makeLink(messages.profile.actions.email, data.links?.email ? `mailto:${data.links.email}` : '', 'button button-tertiary', messages)
    );
  }

  const professionalLinks = [
    { label: 'GitHub', href: data.links?.github },
    { label: 'LinkedIn', href: data.links?.linkedin }
  ];
  document.querySelectorAll('.hero-socials, .footer-links').forEach((container) => {
    container.replaceChildren(...professionalLinks.map((item) => makeLink(item.label, item.href, 'text-link', messages)));
  });

  setText('.contact-title', messages.contact.title);
  setText('.contact-copy', messages.contact.description);
  const contactActions = document.querySelector('.contact-actions');
  if (contactActions) {
    contactActions.replaceChildren(
      makeLink(messages.contact.email, data.links?.email ? `mailto:${data.links.email}` : '', 'button button-primary', messages),
      makeLink('GitHub', data.links?.github, 'button button-secondary', messages),
      makeLink('LinkedIn', data.links?.linkedin, 'button button-secondary', messages)
    );
  }
}

function renderAbout(data, messages) {
  if (!data) return;
  setText('.about-summary', messages.about.summary);
  const grid = document.querySelector('.highlight-grid');
  if (!grid || !Array.isArray(data.highlights)) return;
  grid.replaceChildren();
  data.highlights.forEach((highlight) => {
    const card = document.createElement('article');
    card.className = 'highlight-card';
    const value = document.createElement('strong');
    value.textContent = highlight.value;
    const label = document.createElement('span');
    label.textContent = messages.about.highlights[highlight.id];
    card.append(value, label);
    grid.appendChild(card);
  });
}

function renderExperience(data, messages) {
  if (!data) return;
  setText('.experience-intro', messages.experience.intro);
  const list = document.querySelector('.experience-list');
  if (!list || !Array.isArray(data.items)) return;
  list.replaceChildren();

  data.items.forEach((entry) => {
    const copy = messages.experience.items[entry.id];
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
    dates.textContent = copy.dates;
    meta.append(company, dates);
    const role = document.createElement('h3');
    role.textContent = entry.role;
    content.append(meta, role);
    const summary = document.createElement('p');
    summary.className = 'card-summary';
    summary.textContent = copy.summary;
    content.appendChild(summary);
    if (entry.leadership) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = messages.ui.leadership;
      content.appendChild(badge);
    }
    if (Array.isArray(copy.achievements)) {
      const achievements = document.createElement('ul');
      achievements.className = 'achievement-list';
      copy.achievements.forEach((item) => achievements.appendChild(makeTag(item, 'achievement-item')));
      content.appendChild(achievements);
    }
    if (Array.isArray(entry.technologies)) {
      const technologies = document.createElement('ul');
      technologies.className = 'tag-list';
      entry.technologies.forEach((item) => technologies.appendChild(makeTag(item)));
      content.appendChild(technologies);
    }
    article.append(marker, content);
    list.appendChild(article);
  });
}

function renderCaseStudies(data, messages) {
  if (!data) return;
  setText('.work-intro', messages.caseStudies.intro);
  setText('.work-confidentiality', messages.caseStudies.confidentialityNote);
  const grid = document.querySelector('.case-study-grid');
  if (!grid || !Array.isArray(data.items)) return;
  grid.replaceChildren();

  data.items.forEach((item) => {
    const copy = messages.caseStudies.items[item.id];
    const article = document.createElement('article');
    article.className = `case-study-card${item.featured ? ' featured' : ''}`;
    article.id = item.id;
    const top = document.createElement('div');
    top.className = 'case-study-top';
    const type = document.createElement('span');
    type.className = 'case-type';
    type.textContent = copy.type;
    top.appendChild(type);
    if (item.private) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-private';
      badge.textContent = messages.ui.privateWork;
      top.appendChild(badge);
    }
    const title = document.createElement('h3');
    title.textContent = copy.title;
    const description = document.createElement('p');
    description.className = 'card-summary';
    description.textContent = copy.shortDescription;
    const context = document.createElement('div');
    context.className = 'case-context';
    const company = document.createElement('span');
    company.textContent = item.company || copy.company;
    const separator = document.createElement('span');
    separator.textContent = '·';
    separator.setAttribute('aria-hidden', 'true');
    const role = document.createElement('span');
    role.textContent = item.role;
    context.append(company, separator, role);
    const contextDescription = document.createElement('p');
    contextDescription.className = 'case-context-description';
    contextDescription.textContent = copy.context;
    const architectureLabel = document.createElement('p');
    architectureLabel.className = 'case-label';
    architectureLabel.textContent = messages.ui.architecture;
    const architectureTags = document.createElement('ul');
    architectureTags.className = 'tag-list architecture-tags';
    (item.architectureHighlights || []).forEach((tag) => architectureTags.appendChild(makeTag(tag, 'tag architecture-tag')));
    const technologiesLabel = document.createElement('p');
    technologiesLabel.className = 'case-label';
    technologiesLabel.textContent = messages.ui.technologies;
    const technologies = document.createElement('ul');
    technologies.className = 'tag-list';
    (item.technologies || []).forEach((tag) => technologies.appendChild(makeTag(tag)));
    const details = document.createElement('details');
    details.className = 'case-details';
    const detailsToggle = document.createElement('summary');
    detailsToggle.textContent = messages.ui.readCaseStudy;
    const detailsContent = document.createElement('div');
    detailsContent.className = 'case-details-content';

    [
      [messages.ui.problem, copy.problem],
      [messages.ui.contribution, copy.contribution],
      [messages.ui.outcome, copy.outcome]
    ].forEach(([headingText, bodyText]) => {
      const section = document.createElement('section');
      const heading = document.createElement('h4');
      heading.textContent = headingText;
      const body = document.createElement('p');
      body.textContent = bodyText;
      section.append(heading, body);
      detailsContent.appendChild(section);
    });

    const note = document.createElement('p');
    note.className = 'case-confidentiality-note';
    note.textContent = messages.caseStudies.confidentialityNote;
    detailsContent.appendChild(note);
    details.append(detailsToggle, detailsContent);
    article.append(top, title, description, context, contextDescription, architectureLabel, architectureTags, technologiesLabel, technologies, details);
    grid.appendChild(article);
  });
}

function renderExpertise(data, messages) {
  if (!data) return;
  setText('.expertise-intro', messages.expertise.intro);
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
    title.textContent = messages.expertise.categories[category.id];
    const list = document.createElement('ul');
    list.className = 'capability-list';
    (category.capabilities || []).forEach((capability) => list.appendChild(makeTag(capability, 'capability-item')));
    article.append(number, title, list);
    grid.appendChild(article);
  });
}

function renderEducation(data, messages) {
  const list = document.querySelector('.education-list');
  if (!list || !Array.isArray(data?.items)) return;
  list.replaceChildren();
  data.items.forEach((item) => {
    const copy = messages.education.items[item.id];
    const article = document.createElement('article');
    article.className = 'education-card';
    const institution = document.createElement('p');
    institution.className = 'institution';
    institution.textContent = item.institution;
    const degree = document.createElement('h3');
    degree.textContent = copy.degree;
    article.append(institution, degree);
    if (item.status && copy.status) {
      const status = document.createElement('span');
      status.className = 'badge';
      status.textContent = copy.status;
      article.appendChild(status);
    }
    list.appendChild(article);
  });
}

function renderPortfolio(data, messages) {
  renderNavigation(data.navigation, messages);
  renderProfile(data.profile, messages);
  renderAbout(data.about, messages);
  renderExperience(data.experience, messages);
  renderCaseStudies(data.caseStudies, messages);
  renderExpertise(data.expertise, messages);
  renderEducation(data.education, messages);
}

document.addEventListener('portfolio:languagechange', (event) => {
  if (portfolioData) renderPortfolio(portfolioData, event.detail.messages);
});

document.addEventListener('DOMContentLoaded', async () => {
  const locale = await window.PortfolioI18n.initialize();
  const entries = await Promise.all(Object.entries(DATA_FILES).map(async ([name, path]) => [name, await loadJson(name, path)]));
  portfolioData = Object.fromEntries(entries);
  renderPortfolio(portfolioData, locale.messages);

  if (window.location.hash) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
});
