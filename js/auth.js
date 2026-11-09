const Auth = {
  // Simple hash for demo (NOT for production - Django will handle real hashing)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'cybershield_salt_v1');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  validateUsername(username) {
    if (!username || username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be at most 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers and underscores';
    return null;
  },

  validatePassword(password) {
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  async register(username, password, confirmPassword) {
    const userErr = this.validateUsername(username);
    if (userErr) return { success: false, error: userErr };

    const passErr = this.validatePassword(password);
    if (passErr) return { success: false, error: passErr };

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const users = Storage.getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' };
    }

    const hashed = await this.hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashed,
      role: username.toLowerCase() === 'admin' ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    Storage.saveUsers(users);

    // Auto login
    const { password: _, ...safeUser } = newUser;
    Storage.setCurrentUser(safeUser);

    return { success: true, user: safeUser };
  },

  async login(username, password) {
    if (!username || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }

    const users = Storage.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is suspended' };
    }

    const hashed = await this.hashPassword(password);
    if (user.password !== hashed) {
      return { success: false, error: 'Invalid username or password' };
    }

    const { password: _, ...safeUser } = user;
    Storage.setCurrentUser(safeUser);

    return { success: true, user: safeUser };
  },

  logout() {
    Storage.setCurrentUser(null);
    window.location.href = 'index.html';
  },

  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = 'pages/dashboard.html';
      return false;
    }
    return true;
  }
};

// Password toggle helper
function setupPasswordToggles() {
  document.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      }
    });
  });
}