# Agent Guidelines

Rules and context for AI agents working in this repository.

## Installed Skills

| Skill | Purpose |
|---|---|
| `pwa-development` | Service workers, caching strategies, manifest, offline support |
| `playwright-testing` | End-to-end browser testing |
| `test-driven-development` | TDD workflow and practices |

Run `make skills-install` to restore these after cloning.

## Code Structure

- **Files** contain closely related code with a single, well-defined purpose (encapsulation).
- **Folders** group files by area of responsibility.
- Avoid mixing concerns in the same file (e.g. data, logic, and presentation should live separately).

## Testing

- **Write the test before the implementation** (TDD).
- Follow the **test pyramid**: prefer unit tests, fall back to integration, use end-to-end only when lower levels can't cover it.
- **Test behaviour, not implementation.** If the internals are refactored but the outcome is the same, tests must not need to change.

## Project Context

This is a PWA — a single-page mobile app that guides users through a dating workflow step by step.

- No framework. Plain HTML, CSS, vanilla JS.
- Deployed to GitHub Pages at `https://dialex.github.io/DatingGuide/`.
- Pushes to `main` auto-deploy via GitHub Actions.
- Service worker path prefix: `/DatingGuide/` (GitHub Pages subpath).
- When updating cached assets, bump `CACHE_NAME` version in `service-worker.js`.

## Project Structure

```
├── index.html              # HTML structure only
├── css/
│   └── styles.css          # All visual styles
├── js/
│   ├── workflow.js         # Workflow data (steps array) — pure data, no DOM
│   ├── install.js          # Install banner and modal logic
│   └── app.js              # App logic: render, navigate, reset; entry point
├── tests/
│   └── app.spec.js         # Playwright end-to-end tests
├── playwright.config.js    # Playwright config (serves via `npx serve`)
├── package.json            # Dev dependencies only (Playwright)
├── Makefile                # Dev commands (install, dev, test, audit, skills)
├── service-worker.js       # Offline caching (cache-first strategy)
├── manifest.json           # PWA manifest
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy to GitHub Pages on push to main
```

## Current State

- Code is split by responsibility: data, logic, presentation, styles.
- Workflow content (the steps) is still placeholder — to be replaced with content from `AdamSomethingGuide.pdf`.
- Basic Playwright tests cover render and navigation behaviour.

See `plan.md` for the implementation roadmap.
