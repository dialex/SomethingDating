# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local dev server on port 3000 (required — file:// won't work)
npm test             # Run all Playwright tests
npm run test:ui      # Interactive Playwright test UI
npm run test:install # Install Playwright browser binaries (run once after clone)
npm run skills:install # Restore Claude Code skills from skills-lock.json
```

Run a single test file:
```bash
npx playwright test tests/navigation.spec.js
```

## Architecture

No framework, no build step. Plain HTML + CSS + vanilla JS, deployed to GitHub Pages.

**Data flow:** `index.html` loads `js/app.js` as an ES module → `app.js` imports `sections` from `js/workflow.js` → renders views based on module-level state → re-renders on user interaction.

**State** lives in `app.js` as module-level variables (`view`, `currentSectionId`, `currentStep`). Two views: `home` (2×2 section grid) and `section` (step-by-step workflow).

**Key files:**
- `js/workflow.js` — pure data only (`sections[]` with nested `steps[]` and `instructions[]`), no DOM
- `js/app.js` — all rendering and navigation logic
- `js/install.js` — PWA install banner (platform-aware: iOS vs Android)
- `service-worker.js` — cache-first offline strategy; `CACHE_NAME` must be bumped when assets change
- `manifest.json` — source of truth for app version (also synced in `service-worker.js`)

**Version** is auto-incremented on every commit via `.githooks/pre-commit` (patch bump in `manifest.json` and `service-worker.js`).

## Testing

- Write the test before the implementation (TDD).
- Test behaviour, not implementation — tests must not break on internal refactors.
- Playwright tests run against `http://localhost:3000` (config auto-starts the server).

## Content style (for `workflow.js`)

- **Titles**: sentence case (`"Sort your appearance"`, not `"Sort Your Appearance"`)
- **Instructions**: start with an imperative verb, end with a period
- **No** em-dashes (`—`), colons introducing explanations, or semicolons — split into multiple sentences instead
- **Parentheses** only for clarifications or examples

## Deployment

Pushes to `main` auto-deploy to `https://dialex.github.io/DatingGuide/` via GitHub Actions. The service worker uses `/DatingGuide/` as the path prefix for all cached assets.
