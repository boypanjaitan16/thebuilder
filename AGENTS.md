## Project: The Builder

React + TypeScript SPA built with Vite, TailwindCSS, and Biome. Deployed to GitHub Pages. i18n is custom (no i18next) with EN/ID JSON locales.

### Stack
- React 19, TypeScript, Vite
- TailwindCSS
- Biome (formatter/linter)
- react-hook-form + zod
- Firebase (Auth, Firestore, Storage, Analytics/GA4)
- Ant Design (antd) — admin portal UI only (see Admin portal)
- lucide-react — icons, used anywhere (admin and public pages alike); for a brand/logo icon it doesn't have (it deliberately excludes those), embed the official SVG path inline (e.g. from simple-icons.org, MIT licensed) rather than adding a whole icon package as a dependency — see `src/components/ShareButtons.tsx`
- Tiptap — article body rich-text editor, admin portal only (see Admin portal)
- dayjs — the only library used for date manipulation/formatting (see `src/lib/date.ts`); don't reach for raw `Date`/`Intl.DateTimeFormat` methods

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
- Articles: full pages instead of a Drawer (`src/pages/admin/ArticleFormPage.tsx`, routes `/admin/articles/new` and `/admin/articles/:articleId/edit`) — a Tiptap rich-text editor needs more room than a 480px drawer. One component handles both create/edit modes (mirrors the Drawer's consolidation, just as a page); edit mode fetches by id via `useGetArticle` since a full-page route can be reached directly/reloaded, unlike Product's in-memory row reuse. Status is `DRAFT`/`PUBLISHED` (`src/types/Article.ts`, `src/schemas/articleSchema.ts`). Body content is edited with Tiptap (`@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-image`; StarterKit already bundles `Link`, don't add `@tiptap/extension-link` separately) via `src/components/ArticleEditor.tsx`, wired to RHF through `Controller` (`content: field.value` / `onChange: field.onChange`, editor content stored as HTML). Known limitation: images embedded inline in the article body aren't tracked for Storage cleanup (only the cover image is) — deleting/replacing them leaves orphaned files; a real fix needs a media-library feature.
- UI built with Ant Design (`antd`) — `Form`/`Form.Item` used only as a layout shell (`onSubmitCapture={handleSubmit(fn)}`, no `name`/`rules`); `react-hook-form` + zod remain the only validation mechanism. **Wire every antd `Input`/`Input.Password`/`Input.TextArea` field via RHF's `Controller`, never a raw `register()` spread** — antd's `Input` forwards a custom `InputRef` object (`{focus, blur, input: HTMLInputElement, ...}`), not a native `HTMLInputElement`, so `register()`'s ref can't read `.value` at submit and every field silently validates as empty (real bug hit and fixed once already). Icons from `lucide-react`.
- Admin pages, `AdminHeader`, and `antd` are all lazy-loaded (`React.lazy` in `src/App.tsx` and `src/components/Layout.tsx`) so the public site's bundle doesn't pay for admin-only dependencies. Keep new admin components behind these lazy boundaries rather than importing them eagerly from a public-reachable module. `lucide-react` is the exception — it's used on public pages too (e.g. `ShareButtons`) and tree-shakes per icon regardless of which bundle imports it, so importing it eagerly on a public page doesn't drag `antd` or other admin-only code along with it.
- Test env needs a `ResizeObserver` polyfill for antd overlays (`src/test/setup.ts`).
- Navigation: every admin page renders `src/components/AdminBreadcrumb.tsx` (antd `Breadcrumb`, always rooted at "Admin" → `/admin`) instead of a "Back to X" button — pass the page's trail via `items={[{label, to?}]}` (omit `to` for the current page). Don't add standalone back buttons to new admin pages; extend the breadcrumb trail instead.
- Dates: use `formatDate`/`nowIso` from `src/lib/date.ts` (dayjs, `id` locale) for any date display or `created_at`/`updated_at` generation — don't call `new Date()`/`toLocaleDateString`/`Intl.DateTimeFormat` directly.

### Forms & validation
- Use `react-hook-form` + zod schemas.
- Schemas live in `src/schemas/` with input/output types (e.g., `ApplyFormValuesInput` / `ApplyFormValues`).
- Shared form components:
  - `TextInput` supports `errorMessage` and renders red border + helper text.
  - `SelectBox` supports `errorMessage` and placeholder.

### Firebase
- App config: `src/lib/firebase.ts` (`getFirebaseApp()`, lazy singleton, null if config incomplete).
- Auth: `src/lib/firebaseAuth.ts` (`getFirebaseAuth()`). Admin login, profile update (`displayName`), password update. Session hook: `useFirebaseSession` (`{ user, checking, isAuthenticated }`). No role/claims — any signed-in user is treated as admin.
- Firestore: `src/lib/firebaseDb.ts` (`getFirestoreDb()`). `products` and `articles` collections, doc id = `crypto.randomUUID()`, `created_at`/`updated_at` stored as ISO strings (not Timestamps). Article reads allow drafts for signed-in users only (`resource.data.status == 'PUBLISHED' || request.auth != null` in `firestore.rules`). The public site (`src/pages/InsightsPage.tsx`, `src/pages/ArticleDetailPage.tsx`) reads published articles via `useGetPublishedArticles`/`useGetArticleBySlug` (`src/hooks/`) — **both explicitly add `where("status", "==", "PUBLISHED")` to the query**, not just a client-side filter. This isn't optional: Firestore's rule engine rejects an anonymous `list`/`query` read outright unless the query is provably constrained to only match documents the rule allows — an unfiltered `collection(db, "articles")` query would fail for a signed-out visitor the moment any draft exists. Never reuse the admin-only `useGetArticles`/`useGetArticle` (no status filter, relies on the caller being signed in) on a public page.
- Storage: `src/lib/firebaseStorage.ts` (`getFirebaseStorage()`). Product thumbnails at `products/<uuid>.<ext>`, article images at `articles/<uuid>.<ext>`, both public read. Deletion uses `ref(storage, downloadURL)` + `deleteObject` — no URL parsing needed.
- Hooks (one per API call):
  - `useGetProducts`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`
  - `useUploadProductThumbnail`, `useDeleteProductThumbnail`
  - `useGetArticles`, `useGetArticle`, `useCreateArticle`, `useUpdateArticle`, `useDeleteArticle`
  - `useUploadArticleImage`, `useDeleteArticleImage` (cover image only — see Articles note above)
- Product/article delete also removes thumbnail/cover image from storage (orchestrated by the caller).
- Analytics: `src/lib/analytics.ts`, route tracking via `src/components/AnalyticsTracker.tsx`, disabled in dev (`import.meta.env.MODE !== "production"`).
- Security rules: `firestore.rules` + `storage.rules` (public read, `request.auth != null` for write), deployed manually via `firebase deploy --only storage,firestore:rules` (config in `firebase.json`/`.firebaserc`, not part of CI). Use `--only storage` (not `storage:rules`) since this project has no named storage deploy target — `storage:rules` only works with a target set up via `firebase target:apply`.
- Composite indexes: `firestore.indexes.json` (referenced from `firebase.json`), deployed via `firebase deploy --only firestore:indexes`. **Any query combining an equality `where()` with `orderBy()` on a *different* field needs one** (e.g. `useGetPublishedArticles`'s `where("status","==","PUBLISHED").orderBy("created_at","desc")`) — equality-only compound queries (multiple `where()`, no `orderBy` on an unrelated field, like `useGetArticleBySlug`'s slug+status lookup) don't. Without the index, the query rejects with a `failed-precondition` error at runtime (not a rules/permission error, and Firestore doesn't log it to the console on its own) — if a public Firestore-backed page silently shows an error/empty state with no console output and no failed network request, check for this first, then check the exact error message in `error` state (add a temporary `console.log`, since the UI intentionally shows a generic message instead of the raw Firebase error).
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
