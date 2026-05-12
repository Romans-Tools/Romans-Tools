// Lightweight helper for year stamp consistency
const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const modeToggleBtn = document.getElementById('mode-toggle');
const root = document.documentElement;

root.classList.add('night-mode');
if (modeToggleBtn) {
  modeToggleBtn.textContent = 'Day Mode';
  modeToggleBtn.setAttribute('aria-pressed', 'true');
  modeToggleBtn.addEventListener('click', () => {
    const nightEnabled = root.classList.toggle('night-mode');
    modeToggleBtn.textContent = nightEnabled ? 'Day Mode' : 'Night Mode';
    modeToggleBtn.setAttribute('aria-pressed', String(nightEnabled));
  });
}

const sectionButtons = document.querySelectorAll('.section-toggle-btn');
sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-toggle-target');
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? 'Expand' : 'Collapse';
    target.hidden = expanded;
  });
});
