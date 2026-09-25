## Project: The Builder

React + TypeScript SPA built with Vite, TailwindCSS, and Biome. Deployed to GitHub Pages. i18n is custom (no i18next) with EN/ID JSON locales.

### Stack
- React 19, TypeScript, Vite
- TailwindCSS
- Biome (formatter/linter)
- react-hook-form + zod
- Firebase (Auth, Firestore, Storage, Analytics/GA4)
- Ant Design (antd) + lucide-react — admin portal UI only (see Admin portal)

### Key directories
- `src/pages/` public pages
- `src/pages/admin/` admin portal pages
- `src/components/` shared UI
- `src/components/forms/` input components
- `src/i18n/` locales + provider
- `src/hooks/` per-API hooks
- `src/lib/` infra helpers (firebase, analytics)

### i18n
- Locales: `src/i18n/locales/en.json`, `src/i18n/locales/id.json`
- Types: `src/i18n/translations.ts`
- Provider: `src/i18n/I18nProvider.tsx`
- Any new copy should be added in both locales and types updated.

### Routing
- App routes in `src/App.tsx`
- 404 page: `src/pages/NotFoundPage.tsx`. `vite-plugins/prerender.ts` writes `dist/404.html` (copy of the prerendered home page) for SPA routing on GitHub Pages, and prerenders all public routes listed in `vite-plugins/publicPaths.ts` (mirrors `src/App.tsx` and `public/sitemap.xml`, excludes `/admin/**`) into static `dist/<path>/index.html` files so those routes serve real HTML on first request instead of a 404.

### Admin portal
- Routes under `/admin/**` guarded by `AdminGuard`.
- Admin pages in `src/pages/admin/`.
- Admin header uses dropdown (Profile/Password/Sign out).
- Products: no separate create/edit pages — `src/pages/admin/ProductsPage.tsx` opens `src/components/ProductFormDrawer.tsx` (antd `Drawer`) for both create (`product: null`) and edit (`product: Product`). Edit reuses the row data already loaded by the table, no extra fetch.
- UI built with Ant Design (`antd`) — `Form`/`Form.Item` used only as a layout shell (`onSubmitCapture={handleSubmit(fn)}`, no `name`/`rules`); `react-hook-form` + zod remain the only validation mechanism. **Wire every antd `Input`/`Input.Password`/`Input.TextArea` field via RHF's `Controller`, never a raw `register()` spread** — antd's `Input` forwards a custom `InputRef` object (`{focus, blur, input: HTMLInputElement, ...}`), not a native `HTMLInputElement`, so `register()`'s ref can't read `.value` at submit and every field silently validates as empty (real bug hit and fixed once already). Icons from `lucide-react`.
- Admin pages, `AdminHeader`, and antd/lucide-react are all lazy-loaded (`React.lazy` in `src/App.tsx` and `src/components/Layout.tsx`) so the public site's bundle doesn't pay for admin-only dependencies. Keep new admin components behind these lazy boundaries rather than importing them eagerly from a public-reachable module.
- Test env needs a `ResizeObserver` polyfill for antd overlays (`src/test/setup.ts`).

### Forms & validation
- Use `react-hook-form` + zod schemas.
- Schemas live in `src/schemas/` with input/output types (e.g., `ApplyFormValuesInput` / `ApplyFormValues`).
- Shared form components:
  - `TextInput` supports `errorMessage` and renders red border + helper text.
  - `SelectBox` supports `errorMessage` and placeholder.

### Firebase
- App config: `src/lib/firebase.ts` (`getFirebaseApp()`, lazy singleton, null if config incomplete).
- Auth: `src/lib/firebaseAuth.ts` (`getFirebaseAuth()`). Admin login, profile update (`displayName`), password update. Session hook: `useFirebaseSession` (`{ user, checking, isAuthenticated }`). No role/claims — any signed-in user is treated as admin.
- Firestore: `src/lib/firebaseDb.ts` (`getFirestoreDb()`). Single `products` collection, doc id = `crypto.randomUUID()`, `created_at` stored as ISO string (not a Timestamp).
- Storage: `src/lib/firebaseStorage.ts` (`getFirebaseStorage()`). Product thumbnails at `products/<uuid>.<ext>`, public read. Deletion uses `ref(storage, downloadURL)` + `deleteObject` — no URL parsing needed.
- Hooks (one per API call):
  - `useGetProducts`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`
  - `useUploadProductThumbnail`, `useDeleteProductThumbnail`
- Product delete also removes thumbnail from storage (orchestrated by the caller).
- Analytics: `src/lib/analytics.ts`, route tracking via `src/components/AnalyticsTracker.tsx`, disabled in dev (`import.meta.env.MODE !== "production"`).
- Security rules: `firestore.rules` + `storage.rules` (public read, `request.auth != null` for write), deployed manually via `firebase deploy --only storage,firestore:rules` (config in `firebase.json`/`.firebaserc`, not part of CI). Use `--only storage` (not `storage:rules`) since this project has no named storage deploy target — `storage:rules` only works with a target set up via `firebase target:apply`.
- Admin accounts are created manually via Firebase Console → Authentication (no bootstrap script).
- Env keys:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID`

### GitHub Pages deployment
- Workflow: `.github/workflows/deploy.yml`
- Uses `VITE_BASE_PATH=/${{ github.event.repository.name }}/`
- If deploy blocked by env protection, allow branch in GitHub Pages environment settings.

### CSS/layout
- `container-page` class sets max width.
- For mobile overflow: ensure flex items have `min-w-0` and inputs/selects use `w-full`.
- Use `TextInput`/`SelectBox` to keep width responsive.

### Toasts
- Global toast provider: `src/components/ToastProvider.tsx` (solid color tones)
- Use `useToast().showToast(message, { tone })` for success/error/info.

### Notes
- Avoid `any` and type casts; prefer explicit input/output types from zod.
- Public pages: if you add new text fields, prefer `TextInput`; for selects use `SelectBox`. Admin pages use antd's `Input`/`Select`/etc. directly instead (see Admin portal).

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
