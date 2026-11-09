const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Users (demo - later replaced by backend)
  getUsers() {
    return this.get('cybershield_users', []);
  },

  saveUsers(users) {
    this.set('cybershield_users', users);
  },

  getCurrentUser() {
    return this.get('cybershield_current_user', null);
  },

  setCurrentUser(user) {
    if (user) {
      this.set('cybershield_current_user', user);
    } else {
      this.remove('cybershield_current_user');
    }
  },

  // Theme
  getTheme() {
    return this.get('cybershield_theme', 'dark');
  },

  setTheme(theme) {
    this.set('cybershield_theme', theme);
  },

  // Language
  getLanguage() {
    return this.get('cybershield_lang', 'uz');
  },

  setLanguage(lang) {
    this.set('cybershield_lang', lang);
  }
};