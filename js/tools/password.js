const PasswordTools = {
  checkStrength(password) {
    if (!password) return { score: 0, label: 'Empty', color: 'var(--text-muted)', tips: ['Enter a password'] };

    let score = 0;
    const tips = [];

    if (password.length >= 8) score += 1; else tips.push('Use at least 8 characters (12+ recommended)');
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1; else tips.push('Add lowercase letters');
    if (/[A-Z]/.test(password)) score += 1; else tips.push('Add uppercase letters');
    if (/[0-9]/.test(password)) score += 1; else tips.push('Add numbers');
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; else tips.push('Add symbols (!@#$%...)');

    // common patterns
    if (/^(123|password|qwerty|admin|letmein)/i.test(password)) {
      score = Math.max(0, score - 3);
      tips.push('Avoid common passwords');
    }
    if (/(.)\1{2,}/.test(password)) tips.push('Avoid repeated characters');

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent', 'Excellent'];
    const colors = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#10B981', '#06B6D4', '#06B6D4'];
    const idx = Math.min(score, labels.length - 1);

    if (tips.length === 0) tips.push('Great password!');

    return {
      score,
      max: 7,
      label: labels[idx],
      color: colors[idx],
      percent: Math.round((score / 7) * 100),
      tips
    };
  },

  generate(length = 16, opts = { upper: true, lower: true, numbers: true, symbols: true }) {
    let chars = '';
    if (opts.lower) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (opts.upper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (opts.numbers) chars += '23456789';
    if (opts.symbols) chars += '!@#$%^&*-_=+';
    if (!chars) chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  }
};