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

## Content style rules

All step content in `workflow.js` must follow these rules:

- **Titles**: sentence case (e.g. "Sort your appearance", not "Sort Your Appearance").
- **Instructions**: start with an imperative verb. Use plain sentences ending with a period.
- **Multiple sentences**: preferred over colons, semicolons, or em-dashes to join clauses. Split them.
- **Parentheses**: used only for clarifications or examples (e.g. "any exercise counts (running, walking, gym)").
- **No em-dashes** (`—`), **no colons** introducing explanations, **no semicolons**.

## Project Structure

```
├── index.html              # HTML structure only
├── css/
│   └── styles.css          # All visual styles
├── js/
│   ├── workflow.js         # Section and step data — pure data, no DOM
│   ├── install.js          # Install banner and modal logic
│   └── app.js              # App logic: render, navigate, section routing; entry point
├── tests/
│   ├── render.spec.js      # Playwright rendering tests
│   └── navigation.spec.js  # Playwright navigation tests
├── playwright.config.js    # Playwright config (serves via `npx serve`)
├── package.json            # Dev dependencies only (Playwright)
├── service-worker.js       # Offline caching (cache-first strategy)
├── manifest.json           # PWA manifest (also source of truth for version)
└── .githooks/
    └── pre-commit          # Auto-bumps patch version in manifest.json and service-worker.js
```

## Current State

- App has a home screen with four sections in a 2×2 grid: Intro, Meeting, Dating, Keeping.
- All four sections are fully implemented with content from `AdamSomethingGuide.pdf`.
- At the end of each section, "Next phase" returns the user to the home screen.
- Version is auto-incremented on every commit via the pre-commit hook.
