const root = document.documentElement;
const modeToggleBtn = document.getElementById('mode-toggle');
const MODE_STORAGE_KEY = 'roman-toolbox-theme-mode';
const SECTION_STATE_STORAGE_KEY = 'roman-toolbox-section-state';

const loadThemeMode = () => {
  try {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return saved === 'day' || saved === 'night' ? saved : 'night';
  } catch {
    return 'night';
  }
};

const saveThemeMode = (mode) => {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage write errors to avoid breaking UI interactions.
  }
};

const applyThemeMode = (mode) => {
  const nightEnabled = mode === 'night';
  root.classList.toggle('night-mode', nightEnabled);

  if (modeToggleBtn) {
    modeToggleBtn.textContent = nightEnabled ? 'Day Mode' : 'Night Mode';
    modeToggleBtn.setAttribute('aria-pressed', String(nightEnabled));
  }
};

applyThemeMode(loadThemeMode());

if (modeToggleBtn) {
  modeToggleBtn.addEventListener('click', () => {
    const nextMode = root.classList.contains('night-mode') ? 'day' : 'night';
    applyThemeMode(nextMode);
    saveThemeMode(nextMode);
  });
}

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
  const isExpandedByDefault = true;
  const initialExpanded = typeof savedExpanded === 'boolean' ? savedExpanded : isExpandedByDefault;

  button.setAttribute('aria-expanded', String(initialExpanded));
  button.textContent = initialExpanded ? 'Collapse' : 'Expand';
  target.hidden = !initialExpanded;

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
const sectionFilterSelect = document.getElementById('section-filter-select');
const allToolTiles = document.querySelectorAll('.tool-grid .tool-tile');

if (allToolTiles.length) {
  allToolTiles.forEach((tool) => {
    if (tool.dataset.section) return;

    const parentCard = tool.closest('.card[id]');
    if (parentCard) {
      tool.dataset.section = parentCard.id;
    }
  });

  const applyFilters = () => {
    const selectedSection = sectionFilterSelect ? sectionFilterSelect.value : 'all';
    const selectedStatus = statusFilterSelect.value;

    allToolTiles.forEach((tool) => {
      const toolStatus = tool.dataset.status || 'none';
      const toolSection = tool.dataset.section || 'all';
      const statusMatch = selectedStatus === 'all' || toolStatus === selectedStatus;
      const sectionMatch = selectedSection === 'all' || toolSection === selectedSection;
      tool.hidden = !(statusMatch && sectionMatch);
    });
  };

  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', applyFilters);
  }

  if (sectionFilterSelect) {
    sectionFilterSelect.addEventListener('change', applyFilters);
  }

  applyFilters();
}
