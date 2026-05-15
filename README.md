# Roman's Toolbox

Roman's Toolbox is a lightweight static website that acts as a launch pad for personal tools, utilities, and side-project experiments.

## Features

- **Curated tool sections** for production tools, in-progress work, and entertainment projects.
- **Night/Day theme toggle** for quick visual switching.
- **Expandable/collapsible sections** with browser persistence via `localStorage`.
- **Admin editing mode** for updating card status and ordering.
- **Cross-device admin sync** through a Netlify Function backed by Netlify Blobs.

## Project structure

```text
.
├── index.html                    # Page markup and tool listings
├── styles.css                    # Layout, themes, responsive styles
├── script.js                     # UI interactions and admin sync calls
├── netlify/
│   └── functions/
│       └── admin-state.js        # Shared admin state API (GET/PUT)
├── package.json                  # Node dependencies for Netlify Function runtime
└── README.md
```

## Local development

You can run this project in two ways:

### 1) Static preview only (no shared admin sync)

Open `index.html` directly in your browser, or serve the directory with a simple HTTP server:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

> Note: Shared admin sync depends on the Netlify Function endpoint and will not persist across devices in this mode.

### 2) Netlify dev (recommended for full behavior)

Use Netlify CLI so the site and `/.netlify/functions/admin-state` run together:

```bash
npm install
npx netlify dev
```

## Deployment

Deploy to any static host for basic site functionality. For cross-device admin sync, deploy on **Netlify** with Functions enabled.

### Admin state API

The function `/.netlify/functions/admin-state` supports:

- `GET` → returns saved admin state or defaults:
  - `{ "statuses": {}, "layout": {} }`
- `PUT` → saves state payload:
  - `{ "statuses": { ... }, "layout": { ... } }`

State is stored in a Netlify Blobs store:

- Store name: `roman-toolbox`
- Key: `admin-state`

## Notes

- The page defaults to **night mode** on load.
- Section open/closed state is stored in browser local storage under:
  - `roman-toolbox-section-state`
