# The Builder agent guide

## Workspaces

- `apps/home`: public React/Vite app at `thebuilder.co.id`, including `/apply`, SEO metadata, sitemap, analytics, and prerendering.
- `apps/admin`: separate React/Vite app at `admin.thebuilder.co.id`. Its dashboard is `/`, sign-in is `/login`, and content routes start at `/articles`, `/products`, and `/advisory-requests`.
- `packages/shared`: private `@thebuilder/shared` package. Use explicit subpath exports for Firebase setup, data queries, types, i18n, dates, errors, toast, and loading UI. Each app owns its React Query hooks and creates its own QueryClient.
- Root `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`, and `firestore.indexes.json` apply to the same Firebase project for both apps.

Use Node 22 and pnpm 10.11.0. Run `pnpm install --frozen-lockfile`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:run`, and `pnpm run build` at the repo root. `pnpm run dev` starts both apps; use `pnpm dev:home` or `pnpm dev:admin` for one app. Root `.env` is loaded by both apps. Separate manual GitHub Actions workflows, `deploy-home.yml` and `deploy-admin.yml`, each build one app and deploy its Firebase Hosting target. `test.yml` runs lint, typecheck, and tests on every PR update and on manual runs.

Turbo orchestrates dev, typecheck, lint, CI tests, and build. Both app builds run on every invocation; the home build reads live Firestore articles for prerendering and the sitemap. When a new build-time environment variable is added, include it in Turbo's build inputs so strict environment mode passes it to Vite.

## React and UI

- Keep pages and their route subtrees in each app's `src/pages`. Shared UI belongs in `packages/shared` only when both apps actually use it.
- Public pages use Tailwind plus `TextInput` and `SelectBox` for new form fields. Admin pages use Ant Design. The public `/apply` route loads Ant Design lazily through `ApplyRoute`.
- For Ant Design `Input`, `Input.Password`, and `Input.TextArea`, use RHF `Controller`. Ant Design's custom `InputRef` breaks a raw `register()` ref at submit. Use Ant Design `Form` only as layout; validation is RHF plus zod.
- Admin article editing uses the full-page Tiptap editor; product create/edit uses `ProductFormDrawer`. Every admin page uses `AdminBreadcrumb`, rooted at `/`. Admin-to-public links use absolute `https://thebuilder.co.id` URLs.
- Use `lucide-react` icons. For brand icons missing from that set, embed the official SVG path inline instead of adding an icon package.
- Use `formatDate` and `nowIso` from `@thebuilder/shared/lib/date` for date display and Firestore timestamps. These functions use dayjs.
- Add new localized copy to both JSON locales in `packages/shared/src/i18n/locales` and update `translations.ts`.

## Firebase and data

- Get Firestore only through `getFirestoreDb()` from `@thebuilder/shared/lib/firebaseDb`; it starts App Check before the first request. Firestore is App Check enforced. During prerender, public Firestore hooks must skip queries and render loading state because headless Chrome has no valid token.
- Public data reads call `@thebuilder/shared/data/public`, whose article queries constrain `status == "PUBLISHED"` and product queries constrain `status == "ACTIVE"` in Firestore. Admin reads call `@thebuilder/shared/data/admin`. Anonymous reads need the query predicate, not a client-side filter.
- Keep `firestore.rules`, `firestore.indexes.json`, product/article types, and the corresponding queries aligned. Equality `where()` plus `orderBy()` on another field requires a composite index.
- Keep `firestore.rules` advisory-request payload validation synchronized with `apps/home/src/schemas/applySchema.ts` and `packages/shared/src/types/AdvisoryRequest.ts`.
- Firebase Auth treats any signed-in user as admin; there are no role claims. Storage deletion of product thumbnails and article covers is orchestrated by admin callers. Inline article images are not tracked for cleanup.
- Analytics runs only in home, is disabled in development, and sends manual page views. GA4 browser-history enhanced measurement must remain off.
- When adding third-party scripts, frames, or requests, update the CSP in both app `index.html` files. Keep reCAPTCHA Enterprise allowances for App Check.

## Build and hosting

- `apps/home/vite-plugins/publicPaths.ts` mirrors home routes and the static sitemap. The home build prerenders public paths and published article slugs into `apps/home/dist`, and writes `404.html` for unmatched URLs, including old `/admin/**` URLs.
- `apps/admin` is a SPA. Firebase Hosting rewrites unknown admin paths to its `index.html`. Both apps use root URL bases on separate origins.
- `firebase.json` defines two Hosting targets. Hosting deploys do not deploy Firestore/Storage rules or indexes; deploy those deliberately with the Firebase CLI when changed.
- Keep admin-only Ant Design/Tiptap code out of home imports. The home `/apply` route is the only intended Ant Design dependency in the public app.

## Agent docs

- Markdown issue tracker: `.scratch/<feature-slug>/`; see `docs/agents/issue-tracker.md`.
- Triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`; see `docs/agents/triage-labels.md`.
- Domain model: root `CONTEXT.md` and `docs/adr/`; see `docs/agents/domain.md`.
