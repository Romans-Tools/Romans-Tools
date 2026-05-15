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
const allToolTiles = document.querySelectorAll('.tool-grid .tool-tile');

if (statusFilterSelect && allToolTiles.length) {
  const applyStatusFilter = () => {
    const selectedStatus = statusFilterSelect.value;

    allToolTiles.forEach((tool) => {
      const toolStatus = tool.dataset.status || 'none';
      const shouldShow = selectedStatus === 'all' || toolStatus === selectedStatus;
      tool.hidden = !shouldShow;
    });
  };

  statusFilterSelect.addEventListener('change', applyStatusFilter);
  applyStatusFilter();
}


const adminToggleBtn = document.getElementById('admin-toggle');
const ADMIN_CODE = '205483';
let adminEnabled = false;

const adminStatuses = ['none', 'beta', 'wip', 'deprecated'];
const statusClassList = [
  'status-ribbon-beta',
  'status-ribbon-wip',
  'status-ribbon-deprecated'
];

const applyAdminStatus = (tile, status) => {
  tile.dataset.status = status;

  tile.classList.remove(...statusClassList);

  if (status === 'beta') tile.classList.add('status-ribbon-beta');
  if (status === 'wip') tile.classList.add('status-ribbon-wip');
  if (status === 'deprecated') tile.classList.add('status-ribbon-deprecated');

  if (status === 'none') {
    tile.classList.remove('status-ribbon');
  } else {
    tile.classList.add('status-ribbon');
  }
};

const enableAdminMode = () => {
  adminEnabled = true;
  if (adminToggleBtn) adminToggleBtn.setAttribute('aria-pressed', 'true');

  allToolTiles.forEach((tile) => {
    tile.classList.add('admin-editable');
    tile.addEventListener('click', handleAdminTileClick);
  });

  window.alert('Admin mode enabled. Click cards to cycle status: none → beta → wip → deprecated.');
};

const disableAdminMode = () => {
  adminEnabled = false;
  if (adminToggleBtn) adminToggleBtn.setAttribute('aria-pressed', 'false');

  allToolTiles.forEach((tile) => {
    tile.classList.remove('admin-editable');
    tile.removeEventListener('click', handleAdminTileClick);
  });
};

function handleAdminTileClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const tile = event.currentTarget;
  const current = tile.dataset.status || 'none';
  const index = adminStatuses.indexOf(current);
  const next = adminStatuses[(index + 1) % adminStatuses.length];

  applyAdminStatus(tile, next);
  if (statusFilterSelect) statusFilterSelect.dispatchEvent(new Event('change'));
}

if (adminToggleBtn) {
  adminToggleBtn.addEventListener('click', () => {
    if (adminEnabled) {
      disableAdminMode();
      return;
    }

    const enteredCode = window.prompt('Enter admin code to edit card statuses:');
    if (enteredCode === ADMIN_CODE) {
      enableAdminMode();
    } else if (enteredCode !== null) {
      window.alert('Incorrect code.');
    }
  });
}
