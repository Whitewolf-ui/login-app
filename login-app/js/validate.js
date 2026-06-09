const RULES = {
  username: [
    { test: v => v.trim().length > 0,               msg: 'Username is required.' },
    { test: v => v.trim().length >= 3,              msg: 'Must be at least 3 characters.' },
    { test: v => v.trim().length <= 30,             msg: 'Must be 30 characters or fewer.' },
    { test: v => /^[a-zA-Z0-9_]+$/.test(v.trim()), msg: 'Only letters, numbers, and underscores allowed.' },
  ],
  password: [
    { test: v => v.length > 0,    msg: 'Password is required.' },
    { test: v => v.length >= 6,   msg: 'Must be at least 6 characters.' },
    { test: v => v.length <= 128, msg: 'Password is too long.' },
  ],
};

function validateField(field, value) {
  for (const rule of (RULES[field] || [])) {
    if (!rule.test(value)) return { valid: false, message: rule.msg };
  }
  return { valid: true, message: '' };
}

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '' };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return { score, label: ['','Weak','Fair','Good','Strong'][score] };
}

function renderFieldError(input, errEl, message) {
  if (message) {
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    errEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${message}`;
  } else {
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    errEl.innerHTML = '';
  }
}
