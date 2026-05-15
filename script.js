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

const SECTION_STATE_STORAGE_KEY = 'roman-toolbox-section-state';

const loadSectionState = () => {
  try {
    const raw = localStorage.getItem(SECTION_STATE_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const saveSectionState = (state) => {
  try {
    localStorage.setItem(SECTION_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors to avoid breaking UI interactions.
  }
};

const sectionState = loadSectionState();
const sectionButtons = document.querySelectorAll('.section-toggle-btn');

sectionButtons.forEach((button) => {
  const targetId = button.getAttribute('data-toggle-target');
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  const savedExpanded = sectionState[targetId];
  if (typeof savedExpanded === 'boolean') {
    button.setAttribute('aria-expanded', String(savedExpanded));
    button.textContent = savedExpanded ? 'Collapse' : 'Expand';
    target.hidden = !savedExpanded;
  }

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !expanded;

    button.setAttribute('aria-expanded', String(nextExpanded));
    button.textContent = nextExpanded ? 'Collapse' : 'Expand';
    target.hidden = !nextExpanded;

    sectionState[targetId] = nextExpanded;
    saveSectionState(sectionState);
  });
});

const statusFilterSelect = document.getElementById('status-filter-select');
const inDevelopmentTools = document.querySelectorAll('#in-development-tools .tool-tile');

if (statusFilterSelect && inDevelopmentTools.length) {
  const applyStatusFilter = () => {
    const selectedStatus = statusFilterSelect.value;

    inDevelopmentTools.forEach((tool) => {
      const toolStatus = tool.dataset.status || 'none';
      const shouldShow = selectedStatus === 'all' || toolStatus === selectedStatus;
      tool.hidden = !shouldShow;
    });
  };

  statusFilterSelect.addEventListener('change', applyStatusFilter);
  applyStatusFilter();
}
