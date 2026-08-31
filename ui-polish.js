const DOCS = ['getting-started','workspace','agents','build-runtime','github-delivery','security'];
const LABELS = {
  en: {'getting-started':'Getting started',workspace:'Workspace',agents:'Agents & integrations','build-runtime':'Build & runtime','github-delivery':'GitHub delivery',security:'Security'},
  vi: {'getting-started':'Bắt đầu',workspace:'Workspace',agents:'Agents & tích hợp','build-runtime':'Build & runtime','github-delivery':'GitHub delivery',security:'Bảo mật'}
};
const THEME_KEY = 'velclaw-theme';
const LANG_KEY = 'velclaw-language';
function getLang() { return localStorage.getItem(LANG_KEY) || 'vi'; }
function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }
function initTheme() { setTheme(localStorage.getItem(THEME_KEY) || 'dark'); }
function bindThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  const update = () => { const dark = document.documentElement.dataset.theme !== 'light'; button.textContent = dark ? '☼' : '☾'; button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); };
  button.onclick = () => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); update(); };
  update();
}
function bindSearch() {
  const input = document.getElementById('doc-search');
  if (!input) return;
  const links = [...document.querySelectorAll('#sidebar-nav .side-link')];
  const cards = [...document.querySelectorAll('#cards .card')];
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    [...links, ...cards].forEach(el => { el.hidden = !!q && !el.textContent.toLowerCase().includes(q); });
  });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } });
}
function bindCopyButtons() {
  document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(decodeURIComponent(button.dataset.code || '')); } catch { return; }
    const original = button.textContent; button.textContent = button.dataset.copied || 'Copied'; button.classList.add('copied');
    setTimeout(() => { button.textContent = original; button.classList.remove('copied'); }, 1200);
  }));
}
initTheme();
document.addEventListener('DOMContentLoaded', () => { bindThemeToggle(); bindSearch(); bindCopyButtons(); });
window.VELCLAW_DOCS = DOCS;
window.VELCLAW_LABELS = LABELS;
