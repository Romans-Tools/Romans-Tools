# Roman's Toolbox

Roman's Toolbox is a lightweight static website that serves as a launch pad for personal tools, utilities, and experiments.

## What it includes

- **Overview section** describing the toolbox purpose and status labels (WIP / BETA).
- **Available Tools** section with production-ready tools.
- **In Development** section for tools still being built and tested.
- **Entertainment** section for fun side projects.
- **Night/Day mode toggle** for quick theme switching.
- **Section expand/collapse controls** with state persistence using `localStorage`.

## Project structure

```text
.
├── index.html   # Page content and tool listings
├── styles.css   # Layout, theming, responsive styling
├── script.js    # Theme toggle + collapsible section behavior
└── README.md
```

## Run locally

Because this is a static site, you can open `index.html` directly in a browser, or serve it with a local HTTP server.

### Option 1: Open directly

- Double-click `index.html`.

### Option 2: Use Python HTTP server

```bash
python3 -m http.server 8080
```

Then visit: <http://localhost:8080>

## Deployment

This project can be deployed to any static host (for example Netlify, GitHub Pages, or Cloudflare Pages).

## Notes

- The page defaults to **night mode** on load.
- Expand/collapse state is saved in browser storage using the key:
  - `roman-toolbox-section-state`
