A PWA based on Adam Something's dating guide. Step-by-step mobile workflow navigator, installable on Android and iOS.

Live at: https://dialex.github.io/DatingGuide/

## Setup

After cloning, restore the Claude Code skills:

```bash
make skills-install
```

## Development

Start a local server (required for service workers to work):

```bash
make dev
```

Then open http://localhost:3000/DatingGuide/ in your browser.

> Use `localhost`, not `file://` — service workers require either `localhost` or HTTPS.

## Commands

| Command | Description |
|---|---|
| `make dev` | Local dev server at port 3000 |
| `make skills-install` | Restore AI skills from `skills-lock.json` |
| `make skills-update` | Update skills to latest versions |
| `make audit` | Lighthouse PWA audit (requires `make dev` running) |

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via GitHub Actions.

## Project structure

```
├── index.html          # App (single file — HTML, CSS, JS)
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
├── icon-192.png        # App icons
├── icon-512.png
├── Makefile            # Dev commands
├── skills-lock.json    # Installed Claude Code skills
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploy to GitHub Pages
```
