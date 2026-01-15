# The Builder — SPA

Single-page site for The Builder, a strategic advisory practice focused on organizational resilience, leadership continuity, and human risk. Built with React, TypeScript, Vite, Tailwind CSS, classNames, react-hook-form, and zod. Biome is used for linting/formatting.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build the production bundle
- `npm run preview` — preview the built app locally
- `npm run lint` — run Biome checks
- `npm run format` — apply Biome formatting

## Deployment

GitHub Pages workflow lives at `.github/workflows/deploy.yml`. It builds on pushes to `main` and deploys the `dist` artifact to Pages. The Vite `base` is set to `/TheBuilder/`; update `vite.config.ts` if your repository name differs.
