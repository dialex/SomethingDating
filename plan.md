# Dating Guide PWA — Implementation Plan

## Current State

The app is live at https://dialex.github.io/DatingGuide/ with:
- PWA shell (manifest, service worker, install banner)
- Placeholder 5-step workflow with dummy content
- Auto-deploy via GitHub Actions on push to `main`

---

## Phase 1 — Refactor: split monolith into testable files ✅

- [x] Extract CSS → `css/styles.css`
- [x] Extract workflow data → `js/workflow.js`
- [x] Extract install banner logic → `js/install.js`
- [x] Extract app logic → `js/app.js` (entry point, wires up events)
- [x] `index.html` is now HTML-only, loads CSS and JS externally
- [x] Service worker updated to cache new file paths (`dating-guide-v2`)
- [x] Playwright tests added for render and navigation behaviour
- [x] `package.json` added (devDependencies only), `Makefile` updated with `install` and `test` targets

---

## Phase 2 — Replace Workflow Content

The current placeholder steps must be replaced with 9 steps distilled from `AdamSomethingGuide.pdf`.

### Planned Steps

| # | Step Title | Core Theme |
|---|-----------|------------|
| 1 | Prepare Yourself | Fix yourself first — confidence, social skills, looks, lifestyle |
| 2 | Find the Right Person | Where to meet people, online vs offline, reading the room |
| 3 | Start a Conversation | How to open, what to say, staying in the interaction |
| 4 | Get Their Number | When and how to ask, what it means, what to text after |
| 5 | Make the Date | Planning, logistics, what counts as a date |
| 6 | The First Date | Behavior, activities, how to tell if it's going well |
| 7 | After the Date | Follow-up, second date, texting cadence |
| 8 | Survive the Relationship | Communication, conflict, keeping attraction alive |
| 9 | Handle a Breakup | When to end it, how to do it, how to recover |

### What needs changing in `index.html`

1. Replace the `steps` array — the main data structure driving the whole app
2. Each step object needs:
   - `title` — short name (shown in card header and progress bar)
   - `instructions` — array of bullet strings (shown as checklist items)
   - Optional: `tip` — a callout quote from the book
3. Update progress bar logic if step count changes (currently hardcoded to 5, needs to handle 9)
4. Bump `CACHE_NAME` in `service-worker.js` (e.g. `dating-guide-v2`) so installed users get the update

### Content notes (from PDF analysis)

- Adam's tone is blunt, practical, no-nonsense — keep instruction copy short and direct
- Each step should have 4–7 actionable bullet points, not paragraphs
- Avoid self-help fluff; the book earns trust by being honest about hard truths
- Steps 1–4 are pre-date; steps 5–7 are the date itself; steps 8–9 are relationship/aftermath

---

## Phase 3 — Polish (optional, later)

- [ ] Add step-specific icons or emoji to cards
- [ ] Persist progress in `localStorage` so users can close and return
- [ ] Add a "share" button for each step
- [ ] Dark mode support
