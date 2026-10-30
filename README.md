# The Builder

React and TypeScript monorepo with two Vite apps and one private shared package, managed with pnpm and Turborepo.

| Workspace | Production URL | Purpose |
| --- | --- | --- |
| `apps/home` | `https://thebuilder.co.id` | Public site, `/apply`, analytics, sitemap, prerendered routes |
| `apps/admin` | `https://admin.thebuilder.co.id` | Admin portal, sign-in, content and request management |
| `packages/shared` | — | Firebase setup, public/admin data queries, domain types, i18n, shared UI |

The apps use the same Firebase project (`the-builder-12fe5`) and separate Hosting sites. Shared data entrypoints are `@thebuilder/shared/data/public` and `@thebuilder/shared/data/admin`; public reads must keep the Firestore status predicates required by `firestore.rules`.

## Local development

1. Use Node 22 and pnpm 10.11.0, then run `pnpm install --frozen-lockfile` in the repo root.
2. Copy `.env.example` to `.env` and supply the Firebase web app values. Both Vite apps load this root file. For local Firestore access, register an App Check debug token and set `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` only in `.env`.
3. Run `pnpm run dev` to start both apps: home at `http://127.0.0.1:5173` and admin at `http://127.0.0.1:5174`. Use `pnpm dev:home` or `pnpm dev:admin` to start only one app.

`pnpm run typecheck`, `pnpm run lint`, `pnpm run test:run`, and `pnpm run build` run through Turbo from the root. The build includes typechecking and writes `apps/home/dist` and `apps/admin/dist`. Turbo does not cache either app build; both run on every invocation. The home build fetches published article slugs through the public Firestore query for prerendering and the sitemap, so a network connection is needed for the full production output. CI sets `REQUIRE_PUBLISHED_ARTICLES=true` so a failed query stops deployment instead of silently omitting article routes. `pnpm test` still starts Vitest in watch mode.

## Firebase Hosting setup and cutover

The repo maps Hosting target `home` to the default site `the-builder-12fe5` and target `admin` to `the-builder-12fe5-admin`. Create the admin site in the Firebase project before the first deployment. Keep the existing Firestore and Storage rules and indexes in this project.

Each app has its own manual deploy workflow: [deploy-home](.github/workflows/deploy-home.yml) and [deploy-admin](.github/workflows/deploy-admin.yml). Each one runs lint and tests, builds only its app, and deploys only its Hosting target. Both need the existing `VITE_FIREBASE_*` GitHub secrets and a `FIREBASE_SERVICE_ACCOUNT` secret containing a Hosting deploy service account JSON key. For the first cutover, run both workflows on the same revision and verify both before changing DNS.

The [test workflow](.github/workflows/test.yml) runs lint, typecheck, and tests on every pull request, again on each push to it, and on manual runs. It does not build or use secrets.

Before switching production domains:

Run the [interactive cutover guide](scripts/firebase-hosting-cutover.sh) from the repository root with `bash scripts/firebase-hosting-cutover.sh`. It walks through site creation, authorized domains, deploy credentials, verification, and the DNS change.

1. Verify the apps on their Firebase `web.app` domains. Reload a nested admin URL and test login, content CRUD, `/apply`, public article/product reads, and image upload.
2. Add `admin.thebuilder.co.id` to Firebase Auth authorized domains and the reCAPTCHA Enterprise key's allowed domains. Keep `thebuilder.co.id` and local development domains on that key.
3. Connect `thebuilder.co.id` to the home Hosting site and `admin.thebuilder.co.id` to the admin site. Apply the exact TXT, A/AAAA, or CNAME records shown in the Firebase custom-domain wizard and wait for both SSL certificates to become connected.
4. Confirm public URLs, `/admin/**` 404 on the public domain, admin direct-route reloads, and GA4 page views only from home. Firebase Hosting release history and the previous GitHub Pages configuration provide rollback paths if cutover fails.

Admin URLs now start at the subdomain root: `/`, `/login`, `/products`, `/articles`, and so on. Old `thebuilder.co.id/admin/**` URLs return the public site's 404 page. Because the admin origin changes, administrators sign in again and language preference stored in local storage starts independently there.

For the Firebase procedures, see the official [multisite](https://firebase.google.com/docs/hosting/multisites), [custom-domain](https://firebase.google.com/docs/hosting/custom-domain), and [Hosting GitHub Action](https://github.com/FirebaseExtended/action-hosting-deploy) documentation.
