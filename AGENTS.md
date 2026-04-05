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

## Current State

- `index.html` is a monolith — all markup, styles, JS logic, and data in one file.
- Before adding new behaviour, the code needs to be split into files by responsibility so it can be tested.
- Workflow content (the steps) is still placeholder — to be replaced with content from `AdamSomethingGuide.pdf`.

See `plan.md` for the implementation roadmap.
