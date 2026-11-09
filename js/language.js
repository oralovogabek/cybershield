const Language = {
  current: 'uz',
  translations: {},

  async init() {
    this.current = Storage.getLanguage() || 'uz';
    await this.load(this.current);
    this.apply();
    this.bindSelector();
  },

  async load(lang) {
    try {
      const res = await fetch(`locales/${lang}.json`);
      if (!res.ok) throw new Error('Failed to load locale');
      this.translations = await res.json();
      this.current = lang;
      Storage.setLanguage(lang);
    } catch (e) {
      console.error('Language load error:', e);
      if (lang !== 'en') {
        await this.load('en');
      }
    }
  },

  t(key) {
    const keys = key.split('.');
    let val = this.translations;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        return key;
      }
    }
    return val;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });

    // Update lang selector
    const select = document.querySelector('[data-lang-select]');
    if (select) select.value = this.current;

    document.documentElement.lang = this.current;
  },

  async set(lang) {
    await this.load(lang);
    this.apply();
  },

  bindSelector() {
    const select = document.querySelector('[data-lang-select]');
    if (select) {
      select.addEventListener('change', (e) => {
        this.set(e.target.value);
      });
    }
  }
};