# Roman's Toolbox

Roman's Toolbox is a lightweight static website that serves as a single launch pad for personal tools, utilities, and side projects.

## What it includes

Roman's Toolbox is designed to make it easy to discover, launch, and filter a growing set of projects in one place.

- **Centralized tool directory:** A responsive grid of links grouped into clear categories.
- **Status-aware browsing:** Filter tools by readiness (fully developed, deprecated, beta, work-in-progress, or entertainment).
- **Section-aware browsing:** Filter by category (Available Tools, In Development, Supporting, or Entertainment).
- **Saved interface preferences:** Theme mode and section expand/collapse states persist between visits.
- **Simple static architecture:** No backend required; everything runs client-side.

## Tool categories and listings

### Available Tools

Production-ready tools that are actively used for practical workflows.

- **SitRep Generator** - Builds structured situation reports for operations and incident updates.
- **Crew Watch** - Tracks Civil Air Patrol crew status, assignments, and availability on a mission-ready dashboard.
- **Staff Watch** *(Deprecated)* - Earlier standalone staff-tracking version retained for historical use.
- **Aviation Weather Decoder** - Converts aviation weather reports into plain-language summaries.
- **Training Scenario Builder** - Creates guided training scenarios for planning, facilitation, and review.
- **CAP Brand Tools** - Provides Civil Air Patrol branding and identity support resources.

### In Development

Tools currently being built, tested, and refined. Features and behavior may change.

- **CAP Certificate Generator** *(BETA)* - Guided certificate creation workflow, currently in concept/preview stage.
- **Ribbon Check** *(BETA)* - Quick reference utility for CAP uniform and ribbon guidance.
- **CAP Photo Meta Data Writer** *(BETA)* - Metadata editing for consistent photo archiving and publication.
- **Bulk File Renamer** *(BETA)* - Pattern-based batch file renaming for folder-wide naming consistency.
- **CAP Emblem Generator** *(BETA)* - Browser-based emblem design and customization tool.
- **Organizational Chart Generator** *(BETA)* - Rapid CAP-style org chart creation for planning and briefings.

### Supporting

Projects where Roman contributes support, maintenance, or partnership work.

- **Project Orion** - Mission-oriented web resources maintained as part of the Project Orion ecosystem.
- **Readiness Hub** - Centralized readiness and planning tools for operational preparation.

### Entertainment

Fun or novelty tools created primarily for humor, creativity, or informal engagement.

- **CAP Decision Maker** - Interactive scenario picker for light decision-making and team discussion.
- **Operations Status Board** - Vibe-style status board designed for fun operational-themed displays.
- **Who Is My Flight Release Officer?** - Quick lookup-style novelty utility framed around FRO identification.
- **CAP Bingo** - CAP-themed bingo game for events and casual play.
- **Mission Generator** - Randomized CAP-themed mission prompts for creative scenarios.
- **Impromptu Speeches** - Instant speaking prompts for practice, games, or meeting activities.

## Project structure

```text
.
├── index.html      # Main page and tool listings
├── styles.css      # Theme, layout, and responsive styling
├── script.js       # Theme, section toggles, and filters
├── package.json    # Project metadata
└── README.md
```
