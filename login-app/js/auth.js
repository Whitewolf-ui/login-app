'use strict';

const USER_STORE = { student: 'Pass@123', admin: 'Admin@2024' };

const $ = id => document.getElementById(id);
const loginSection   = $('loginSection');
const successSection = $('successSection');
const usernameInput  = $('username');
const passwordInput  = $('password');
const usernameError  = $('username-error');
const passwordError  = $('password-error');
const loginBtn       = $('loginBtn');
const loginBtnText   = $('loginBtnText');
const spinner        = $('spinner');
const pwStrengthEl   = $('password-strength');
const pwLabel        = $('pwLabel');
const bars           = [$('bar1'), $('bar2'), $('bar3'), $('bar4')];
const toast          = $('toast');
const toastMsg       = $('toastMsg');
const toastIcon      = $('toastIcon');

let loading = false, toastTimer = null;

function fakeAuth(username, password) {
  return new Promise(resolve => setTimeout(() => {
    const stored = USER_STORE[username];
    if (!stored)           resolve({ ok: false, reason: 'username' });
    else if (stored !== password) resolve({ ok: false, reason: 'password' });
    else                   resolve({ ok: true });
  }, 1400));
}

function setLoading(on) {
  loading = on;
  loginBtn.disabled = on;
  spinner.style.display    = on ? 'block' : 'none';
  loginBtnText.textContent = on ? 'Signing in…' : 'Sign in';
}

function showToast(message, type) {
  clearTimeout(toastTimer);
  toastMsg.textContent = message;
  toast.className = `toast ${type}`;
  toastIcon.innerHTML = type === 'success'
    ? '<polyline points="20 6 9 17 4 12"/>'
    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

function updateBars(score) {
  const cls = ['','weak','fair','good','strong'][score];
  bars.forEach((b, i) => { b.className = 'pw-bar'; if (i < score) b.classList.add(cls); });
}

function validateUsername() {
  const r = validateField('username', usernameInput.value);
  renderFieldError(usernameInput, usernameError, r.valid ? '' : r.message);
  return r.valid;
}

function validatePassword() {
  const r = validateField('password', passwordInput.value);
  renderFieldError(passwordInput, passwordError, r.valid ? '' : r.message);
  return r.valid;
}

async function handleLogin() {
  if (loading) return;
  const okU = validateUsername();
  const okP = validatePassword();
  if (!okU || !okP) { if (!okU) usernameInput.focus(); else passwordInput.focus(); return; }

  setLoading(true);
  const { ok, reason } = await fakeAuth(usernameInput.value.trim(), passwordInput.value);
  setLoading(false);

  if (ok) {
    showToast(`Welcome, ${usernameInput.value.trim()}!`, 'success');
    setTimeout(() => {
      loginSection.classList.add('hidden');
      successSection.classList.remove('hidden');
      $('welcomeName').textContent = usernameInput.value.trim();
    }, 500);
  } else if (reason === 'username') {
    renderFieldError(usernameInput, usernameError, 'No account found with this username.');
    usernameInput.focus();
  } else {
    renderFieldError(passwordInput, passwordError, 'Incorrect password. Please try again.');
    passwordInput.value = '';
    pwStrengthEl.style.display = 'none';
    updateBars(0);
    passwordInput.focus();
  }
}

function handleReset() {
  usernameInput.value = '';
  passwordInput.value = '';
  $('remember').checked = false;
  renderFieldError(usernameInput, usernameError, '');
  renderFieldError(passwordInput, passwordError, '');
  pwStrengthEl.style.display = 'none';
  updateBars(0);
  setLoading(false);
  usernameInput.focus();
}

$('loginBtn').addEventListener('click', handleLogin);
$('resetBtn').addEventListener('click', handleReset);
$('logoutBtn').addEventListener('click', () => {
  successSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  handleReset();
});

$('togglePw').addEventListener('click', () => {
  const hidden = passwordInput.type === 'password';
  passwordInput.type = hidden ? 'text' : 'password';
  $('eyeOpen').style.display   = hidden ? 'none' : '';
  $('eyeClosed').style.display = hidden ? '' : 'none';
  $('togglePw').setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
});

$('forgotBtn').addEventListener('click', () => showToast('Password reset is handled by your course coordinator.', 'error'));
$('registerLink').addEventListener('click', () => showToast('New accounts are created by your course coordinator.', 'error'));

usernameInput.addEventListener('input', validateUsername);
passwordInput.addEventListener('focus', () => { pwStrengthEl.style.display = 'flex'; });
passwordInput.addEventListener('input', () => {
  validatePassword();
  const { score, label } = passwordStrength(passwordInput.value);
  updateBars(score);
  pwLabel.textContent = label;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !loginSection.classList.contains('hidden')) handleLogin();
});

(function buildDots() {
  const grid = document.querySelector('.dots-grid');
  if (!grid) return;
  for (let i = 0; i < 30; i++) {
    const d = document.createElement('span');
    d.style.cssText = `display:block;width:3px;height:3px;border-radius:50%;background:rgba(196,164,107,${(0.1+Math.random()*0.25).toFixed(2)})`;
    grid.appendChild(d);
  }
})();
