(() => {
  const STORAGE_KEY = 'portfolio-language';
  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = new Set(['en', 'es']);
  const localeCache = new Map();
  let currentLanguage = DEFAULT_LANGUAGE;
  let currentMessages = null;

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function mergeWithFallback(fallback, localized) {
    if (!isPlainObject(fallback) || !isPlainObject(localized)) {
      return localized === undefined ? fallback : localized;
    }

    const merged = { ...fallback };
    Object.keys(localized).forEach((key) => {
      merged[key] = mergeWithFallback(fallback[key], localized[key]);
    });
    return merged;
  }

  function getByPath(source, path) {
    return path.split('.').reduce((value, key) => value?.[key], source);
  }

  async function fetchLocale(language) {
    if (localeCache.has(language)) return localeCache.get(language);
    const response = await fetch(`locales/${language}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const messages = await response.json();
    localeCache.set(language, messages);
    return messages;
  }

  async function loadMessages(language) {
    let english;
    try {
      english = await fetchLocale(DEFAULT_LANGUAGE);
    } catch (error) {
      console.error('Unable to load the English locale:', error);
      throw error;
    }

    if (language === DEFAULT_LANGUAGE) return english;

    try {
      const localized = await fetchLocale(language);
      return mergeWithFallback(english, localized);
    } catch (error) {
      console.warn(`Unable to load the ${language} locale. Falling back to English:`, error);
      return english;
    }
  }

  function getStoredLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.has(stored) ? stored : DEFAULT_LANGUAGE;
    } catch (error) {
      console.warn('Unable to read the language preference. Using English:', error);
      return DEFAULT_LANGUAGE;
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('Unable to save the language preference:', error);
    }
  }

  function applyStaticTranslations(messages) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = getByPath(messages, element.dataset.i18n);
      if (typeof value === 'string') element.textContent = value;
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = getByPath(messages, element.dataset.i18nAriaLabel);
      if (typeof value === 'string') element.setAttribute('aria-label', value);
    });
  }

  function updateLanguageControls(language, messages) {
    document.querySelectorAll('[data-language]').forEach((button) => {
      const buttonLanguage = button.dataset.language;
      const isActive = buttonLanguage === language;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      const labelKey = buttonLanguage === 'es' ? 'switchToSpanish' : 'switchToEnglish';
      button.setAttribute('aria-label', messages.accessibility[labelKey]);
    });
  }

  function applyDocumentMetadata(language, messages) {
    document.documentElement.lang = language;
    document.title = messages.metadata.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = messages.metadata.description;
  }

  async function setLanguage(requestedLanguage, { persist = true } = {}) {
    const language = SUPPORTED_LANGUAGES.has(requestedLanguage) ? requestedLanguage : DEFAULT_LANGUAGE;
    const messages = await loadMessages(language);
    const resolvedLanguage = language === DEFAULT_LANGUAGE || localeCache.has(language) ? language : DEFAULT_LANGUAGE;

    currentLanguage = resolvedLanguage;
    currentMessages = messages;
    applyDocumentMetadata(resolvedLanguage, messages);
    applyStaticTranslations(messages);
    updateLanguageControls(resolvedLanguage, messages);
    if (persist) storeLanguage(resolvedLanguage);

    document.dispatchEvent(new CustomEvent('portfolio:languagechange', {
      detail: { language: resolvedLanguage, messages }
    }));

    return { language: resolvedLanguage, messages };
  }

  function bindLanguageControls() {
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.addEventListener('click', () => setLanguage(button.dataset.language));
    });
  }

  async function initialize() {
    bindLanguageControls();
    return setLanguage(getStoredLanguage(), { persist: false });
  }

  window.PortfolioI18n = {
    initialize,
    setLanguage,
    translate: (path) => getByPath(currentMessages, path),
    getLanguage: () => currentLanguage,
    getMessages: () => currentMessages,
    storageKey: STORAGE_KEY
  };
})();
