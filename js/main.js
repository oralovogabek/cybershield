// Toast notifications
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); }
};

// Mobile menu
function setupMobileMenu() {
  const btn = document.querySelector('[data-mobile-menu]');
  const menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }
}

// Update nav based on auth state
function updateNavAuth() {
  const user = Auth.getCurrentUser();
  const guestEls = document.querySelectorAll('[data-guest]');
  const authEls = document.querySelectorAll('[data-auth]');
  const adminEls = document.querySelectorAll('[data-admin]');

  if (user) {
    guestEls.forEach(el => el.classList.add('hidden'));
    authEls.forEach(el => el.classList.remove('hidden'));
    if (user.role === 'admin') {
      adminEls.forEach(el => el.classList.remove('hidden'));
    } else {
      adminEls.forEach(el => el.classList.add('hidden'));
    }
    // Set username if present
    document.querySelectorAll('[data-username]').forEach(el => {
      el.textContent = user.username;
    });
  } else {
    guestEls.forEach(el => el.classList.remove('hidden'));
    authEls.forEach(el => el.classList.add('hidden'));
    adminEls.forEach(el => el.classList.add('hidden'));
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  Theme.init();
  await Language.init();
  setupMobileMenu();
  setupPasswordToggles();
  updateNavAuth();

  // Logout buttons
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
});