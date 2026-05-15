# Roman's Toolbox

Roman's Toolbox is a lightweight static website that serves as a single launch pad for personal tools, utilities, and side projects.

## What it includes

- A responsive directory of tool links grouped by category.
- Night/Day theme toggle with saved preference in `localStorage`.
- Expand/collapse controls for each section with saved state.
- Tool filtering by section.

## Project structure

```text
.
├── index.html      # Main page and tool listings
├── styles.css      # Theme, layout, and responsive styling
├── script.js       # Theme, section toggles, and filters
├── package.json    # Project metadata
└── README.md
```

## Run locally

You can open `index.html` directly, or serve the site locally:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Deployment

This project is fully static and can be deployed on any static hosting platform (Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Browser storage keys

- Theme mode: `roman-toolbox-theme-mode`
- Section open/closed state: `roman-toolbox-section-state`
