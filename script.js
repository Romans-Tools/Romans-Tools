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
const ADMIN_STATUS_STORAGE_KEY = 'roman-toolbox-admin-statuses';
const ADMIN_LAYOUT_STORAGE_KEY = 'roman-toolbox-admin-layout';
const ADMIN_SYNC_ENDPOINT = '/.netlify/functions/admin-state';
let adminEnabled = false;
let draggedTile = null;
let suppressAdminClickUntil = 0;

const adminStatuses = ['none', 'beta', 'wip', 'deprecated', 'silly'];
const statusClassList = [
  'status-ribbon-beta',
  'status-ribbon-wip',
  'status-ribbon-deprecated',
  'status-ribbon-silly'
];
const allToolGrids = document.querySelectorAll('.tool-grid');

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ensureTileIds = () => {
  allToolTiles.forEach((tile, index) => {
    if (!tile.dataset.toolId) {
      const title = tile.querySelector('h3')?.textContent?.trim();
      tile.dataset.toolId = title ? slugify(title) : `tool-${index + 1}`;
    }
  });
};

const applyAdminStatus = (tile, status) => {
  tile.dataset.status = status;

  tile.classList.remove(...statusClassList);

  if (status === 'beta') tile.classList.add('status-ribbon-beta');
  if (status === 'wip') tile.classList.add('status-ribbon-wip');
  if (status === 'deprecated') tile.classList.add('status-ribbon-deprecated');
  if (status === 'silly') tile.classList.add('status-ribbon-silly');

  if (status === 'none') {
    tile.classList.remove('status-ribbon');
  } else {
    tile.classList.add('status-ribbon');
  }
};

const loadAdminStatuses = () => {
  try {
    const raw = localStorage.getItem(ADMIN_STATUS_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const saveAdminStatuses = (statusMap) => {
  try {
    localStorage.setItem(ADMIN_STATUS_STORAGE_KEY, JSON.stringify(statusMap));
  } catch {
    // Ignore storage write errors to avoid interrupting admin edits.
  }
};

const loadRemoteAdminState = async () => {
  try {
    const response = await fetch(ADMIN_SYNC_ENDPOINT, { method: 'GET' });
    if (!response.ok) return null;

    const payload = await response.json();
    if (!payload || typeof payload !== 'object') return null;
    return payload;
  } catch {
    return null;
  }
};

const saveRemoteAdminState = async () => {
  const payload = {
    statuses: toolStatusState,
    layout: loadAdminLayout()
  };

  try {
    await fetch(ADMIN_SYNC_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Ignore remote sync errors and preserve local behavior.
  }
};

const loadAdminLayout = () => {
  try {
    const raw = localStorage.getItem(ADMIN_LAYOUT_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const saveAdminLayout = (layoutState) => {
  try {
    localStorage.setItem(ADMIN_LAYOUT_STORAGE_KEY, JSON.stringify(layoutState));
  } catch {
    // Ignore storage write errors to avoid interrupting admin edits.
  }
};

const restoreAdminLayout = () => {
  const layoutState = loadAdminLayout();
  const sectionIds = Object.keys(layoutState);

  sectionIds.forEach((sectionId) => {
    const grid = document.querySelector(`#${sectionId} .tool-grid`);
    const tileIds = layoutState[sectionId];
    if (!grid || !Array.isArray(tileIds)) return;

    tileIds.forEach((tileId) => {
      const tile = document.querySelector(`.tool-tile[data-tool-id="${tileId}"]`);
      if (tile) grid.appendChild(tile);
    });
  });
};

const persistAdminLayout = () => {
  const layoutState = {};

  document.querySelectorAll('.card[id]').forEach((card) => {
    const grid = card.querySelector('.tool-grid');
    if (!grid) return;

    const tileIds = Array.from(grid.querySelectorAll('.tool-tile'))
      .map((tile) => tile.dataset.toolId)
      .filter(Boolean);
    layoutState[card.id] = tileIds;
  });

  saveAdminLayout(layoutState);
  void saveRemoteAdminState();
};

const handleGridDragOver = (event) => {
  if (!adminEnabled || !draggedTile) return;
  event.preventDefault();
};

const handleGridDrop = (event) => {
  if (!adminEnabled || !draggedTile) return;
  event.preventDefault();

  const grid = event.currentTarget;
  grid.appendChild(draggedTile);
  persistAdminLayout();
};

const toolStatusState = loadAdminStatuses();
ensureTileIds();
restoreAdminLayout();

allToolTiles.forEach((tile, index) => {
  const storageKey = tile.dataset.toolId || String(index);
  const savedStatus = toolStatusState[storageKey];
  if (adminStatuses.includes(savedStatus)) {
    applyAdminStatus(tile, savedStatus);
  }
});

const enableAdminMode = () => {
  adminEnabled = true;
  if (adminToggleBtn) adminToggleBtn.setAttribute('aria-pressed', 'true');

  allToolTiles.forEach((tile) => {
    tile.classList.add('admin-editable');
    tile.setAttribute('draggable', 'true');
    tile.addEventListener('click', handleAdminTileClick);
    tile.addEventListener('dragstart', handleTileDragStart);
    tile.addEventListener('dragend', handleTileDragEnd);
  });
  allToolGrids.forEach((grid) => {
    grid.classList.add('admin-dropzone');
    grid.addEventListener('dragover', handleGridDragOver);
    grid.addEventListener('drop', handleGridDrop);
  });

  window.alert('Admin mode enabled. Click cards to cycle status: none → beta → wip → deprecated → silly.');
};

const disableAdminMode = () => {
  adminEnabled = false;
  if (adminToggleBtn) adminToggleBtn.setAttribute('aria-pressed', 'false');

  allToolTiles.forEach((tile) => {
    tile.classList.remove('admin-editable');
    tile.removeAttribute('draggable');
    tile.removeEventListener('click', handleAdminTileClick);
    tile.removeEventListener('dragstart', handleTileDragStart);
    tile.removeEventListener('dragend', handleTileDragEnd);
  });
  allToolGrids.forEach((grid) => {
    grid.classList.remove('admin-dropzone');
    grid.removeEventListener('dragover', handleGridDragOver);
    grid.removeEventListener('drop', handleGridDrop);
  });
};

function handleTileDragStart(event) {
  draggedTile = event.currentTarget;
  event.dataTransfer.effectAllowed = 'move';
  event.currentTarget.classList.add('is-dragging');
}

function handleTileDragEnd(event) {
  event.currentTarget.classList.remove('is-dragging');
  draggedTile = null;
  suppressAdminClickUntil = Date.now() + 200;
}

function handleAdminTileClick(event) {
  if (Date.now() < suppressAdminClickUntil) return;
  event.preventDefault();
  event.stopPropagation();

  const tile = event.currentTarget;
  const current = tile.dataset.status || 'none';
  const index = adminStatuses.indexOf(current);
  const next = adminStatuses[(index + 1) % adminStatuses.length];

  applyAdminStatus(tile, next);
  const tileIndex = Array.from(allToolTiles).indexOf(tile);
  const storageKey = tile.dataset.toolId || String(tileIndex);
  toolStatusState[storageKey] = next;
  saveAdminStatuses(toolStatusState);
  void saveRemoteAdminState();
  if (statusFilterSelect) statusFilterSelect.dispatchEvent(new Event('change'));
}

const initializeRemoteAdminState = async () => {
  const remoteState = await loadRemoteAdminState();
  if (!remoteState) return;

  if (remoteState.statuses && typeof remoteState.statuses === 'object') {
    Object.assign(toolStatusState, remoteState.statuses);
    saveAdminStatuses(toolStatusState);
  }

  if (remoteState.layout && typeof remoteState.layout === 'object') {
    saveAdminLayout(remoteState.layout);
    restoreAdminLayout();
  }

  allToolTiles.forEach((tile, index) => {
    const storageKey = tile.dataset.toolId || String(index);
    const savedStatus = toolStatusState[storageKey];
    if (adminStatuses.includes(savedStatus)) {
      applyAdminStatus(tile, savedStatus);
    }
  });

  if (statusFilterSelect) statusFilterSelect.dispatchEvent(new Event('change'));
};

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

void initializeRemoteAdminState();
