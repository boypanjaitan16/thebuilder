## Project: The Builder

React + TypeScript SPA built with Vite, TailwindCSS, and Biome. Deployed to GitHub Pages. i18n is custom (no i18next) with EN/ID JSON locales.

### Stack
- React 19, TypeScript, Vite
- TailwindCSS
- Biome (formatter/linter)
- react-hook-form + zod
- Supabase (auth + DB + storage)
- Firebase Analytics (GA4)

### Key directories
- `src/pages/` public pages
- `src/pages/admin/` admin portal pages
- `src/components/` shared UI
- `src/components/forms/` input components
- `src/i18n/` locales + provider
- `src/hooks/` per-API hooks
- `src/lib/` infra helpers (supabase, firebase, analytics)

### i18n
- Locales: `src/i18n/locales/en.json`, `src/i18n/locales/id.json`
- Types: `src/i18n/translations.ts`
- Provider: `src/i18n/I18nProvider.tsx`
- Any new copy should be added in both locales and types updated.

### Routing
- App routes in `src/App.tsx`
- 404 page: `src/pages/NotFoundPage.tsx` and `postbuild` copies `dist/index.html` to `dist/404.html` for SPA routing on GitHub Pages.

### Admin portal
- Routes under `/admin/**` guarded by `AdminGuard`.
- Admin pages in `src/pages/admin/`.
- Admin header uses dropdown (Profile/Password/Sign out).

### Forms & validation
- Use `react-hook-form` + zod schemas.
- Schemas live in `src/schemas/` with input/output types (e.g., `ApplyFormValuesInput` / `ApplyFormValues`).
- Shared form components:
  - `TextInput` supports `errorMessage` and renders red border + helper text.
  - `SelectBox` supports `errorMessage` and placeholder.

### Supabase
- Client: `src/lib/supabaseClient.ts`
- Auth: admin login, profile update, password update.
- Storage: product thumbnails uploaded to public bucket.
- Hooks (one per API call):
  - `useGetProducts`, `useGetProduct`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`
  - `useUploadProductThumbnail`, `useDeleteProductThumbnail`
- Product delete also removes thumbnail from storage.
- Thumbnail deletion uses URL parsing in `src/lib/supabaseStorage.ts`.

### Firebase Analytics
- Firebase config: `src/lib/firebase.ts`
- Analytics: `src/lib/analytics.ts`
- Route tracking: `src/components/AnalyticsTracker.tsx`
- Analytics disabled in dev (`import.meta.env.MODE !== "production"`).
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
- If you add new text fields, prefer `TextInput`; for selects use `SelectBox`.
