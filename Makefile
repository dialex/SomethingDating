.PHONY: dev skills-install skills-update audit

## Start a local dev server at http://localhost:3000/DatingGuide/
dev:
	npx serve . --listen 3000

## Restore skills from skills-lock.json (run this after cloning)
skills-install:
	npx skills install

## Update all installed skills to their latest versions
skills-update:
	npx skills update

## Run a Lighthouse PWA audit (requires `make dev` running in another terminal)
audit:
	npx lighthouse http://localhost:3000/DatingGuide/ --view
