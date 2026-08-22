# Backend Upgrade — Progress Tracker

Keep this file updated as work continues. If Claude's context/tokens run out
mid-session, re-share this repo (with this file) in a new chat and say
"continue from PROGRESS.md" — everything needed to pick up is here.

## Status: Phases 1, 2, 3, 4, 6 done. Phase 5 (Google Sheets sync),
Phase 7 (email notifications) not started. Phase 8 (security hardening)
partially addressed (see notes below).

## ✅ Done

**Phase 1 — Backend foundation**
- `supabase/migrations/0001_init.sql` — full schema: `bookings`,
  `business_settings`, `services`, `packages`, `portfolio_items`,
  `testimonials`, `audit_logs`, `storage.buckets` (portfolio), RLS policies
  on every table, booking-reference generator (`LS-2026-0001` format),
  server-side duplicate-submission guard.
- `src/types/database.ts`, `src/lib/supabase.ts`, `.env.example`.

**Phase 2 — Booking system**
- `src/lib/bookings.ts` — validation + insert, typed result.
- `src/components/Contact.tsx` — wired to Supabase, loading state,
  success screen with reference + WhatsApp CTA.
- `src/hooks/useBusinessSettings.ts` — single source of truth for
  phone/WhatsApp/email/socials, wired into Contact, WhatsAppButton, Footer.

**Phase 3 — Admin dashboard (core, not content management)**
- `react-router-dom` added. Routes: `/` (public site, unchanged),
  `/admin/login`, `/admin` (dashboard), `/admin/bookings`,
  `/admin/bookings/:id`, `/admin/settings`.
- `src/admin/lib/AuthContext.tsx` — Supabase Auth session state, signIn/signOut.
- `src/admin/components/RequireAuth.tsx` — redirects to /admin/login if
  not authenticated.
- `src/admin/components/AdminLayout.tsx` — sidebar nav + mobile hamburger
  menu, matches ink/gold design system exactly (same card-surface,
  btn-primary, font-display classes as the public site).
- `src/admin/pages/LoginPage.tsx` — email/password login.
- `src/admin/pages/DashboardPage.tsx` — enquiry counts by status, upcoming
  confirmed events, recent enquiries, Google Sheets sync counts.
- `src/admin/pages/BookingsListPage.tsx` — search (name/reference/phone/
  email/location), filter by status + event type, sort (newest/oldest/
  event date), CSV export respecting current filters.
- `src/admin/pages/BookingDetailPage.tsx` — full customer/event/services
  view, status dropdown (writes immediately), assigned-team field,
  internal notes (admin-only, never public), WhatsApp Customer button
  (pre-filled message w/ name + booking reference), Call button, Sheets
  sync status display.
- `src/admin/lib/bookingsApi.ts` — fetchBookings, fetchBooking,
  updateBookingStatus/Notes/AssignedTeam, bookingsToCsv.
- `src/admin/lib/auditLog.ts` — useAuditLog() hook, wired into status
  changes, notes edits, team assignment, settings changes.
- `vercel.json` + `public/_redirects` — SPA rewrite rules so `/admin/...`
  routes don't 404 on refresh when deployed.

**Phase 4 — Business settings admin UI**
- `src/admin/pages/SettingsPage.tsx` — edit studio name, tagline, phone,
  WhatsApp, email, address, business hours, service area, social links,
  booking reference prefix. Saves directly to `business_settings` table;
  every public component reading `useBusinessSettings()` picks it up.

**Phase 6 — Content management (in progress: public wiring done, admin UI not)**
- `supabase/migrations/0002_services_icon_features.sql` — adds `icon_name`
  and `features text[]` columns to `services` so it can fully drive the
  public Services section (icon + bullet list), matching what
  `Services.tsx` already renders.
- `src/lib/iconRegistry.ts` — maps a `icon_name` string (stored in DB) to
  an actual Lucide icon component. Used by both the public site and (once
  built) the admin's icon picker.
- `src/hooks/usePublicContent.ts` — `useServices()`, `usePortfolio()`,
  `useTestimonials()`, `usePackages()`. Each reads its table
  (`is_active = true`, ordered by `display_order`) and falls back to the
  existing static data in `src/data/content.ts` / `src/data/portfolio.ts`
  if the table is empty or Supabase errors — so the public site never
  breaks even before any content rows exist.
- `src/components/Services.tsx`, `Portfolio.tsx`, `Testimonials.tsx` —
  now call these hooks instead of importing static arrays directly. No
  visual changes; same components, just live-data-backed.
- `src/admin/lib/storage.ts` — `uploadPortfolioMedia(file, category)`,
  uploads to the `portfolio` storage bucket (created in migration 0001)
  and returns a public URL. Not yet called from anywhere — needs the
  portfolio admin form.
- `src/admin/lib/contentApi.ts` — generic `fetchAll` / `createRow` /
  `updateRow` / `deleteRow` / `toggleActive` helpers, table-name-
  parameterized, ready to back CRUD pages for any of the four content
  tables.
- **Not yet built:** the actual admin pages/forms (add/edit/delete UI) for
  services, packages, portfolio (with image upload), and testimonials.
  `contentApi.ts` and `storage.ts` above are the data layer for this —
  next step is wiring them into pages under `src/admin/pages/`, e.g. one
  `ContentPage.tsx` with tabs, or four separate pages, plus a nav entry in
  `AdminLayout.tsx` and routes in `main.tsx`. `CustomPackages.tsx`
  (public) is a static "bespoke ideas" showcase, not a package list, and
  was intentionally left alone — packages have no public display slot yet
  if that's wanted, it'd need a new section, not a rewire of
  CustomPackages.

**Docs**
- `README.md` rewritten: Supabase project setup, running the migration,
  creating an admin user, local dev, Vercel deployment + custom domain,
  day-to-day admin usage, "how to change your phone number".

**Build health:** `npm run typecheck` ✅  `npm run build` ✅ (verified in
container before handing off — re-verify after every future change).

## ⏭️ Not started yet (in spec order)

- **Phase 6 remainder — admin CRUD UI**: build pages to add/edit/delete/
  reorder rows in `services`, `packages`, `portfolio_items` (with image
  upload via `uploadPortfolioMedia`), `testimonials`. Data layer
  (`contentApi.ts`, `storage.ts`) is ready; only the forms/pages are
  missing. This is the natural next task.
- **Phase 5 — Google Sheets sync**: needs a Supabase Edge Function (Google
  service-account key must never reach the frontend). `sheet_sync_status` /
  `sheet_sync_error` / `last_sheet_sync_at` columns already exist on
  `bookings`. Not implemented: the Edge Function, the call to it after
  booking insert, or the retry mechanism for failed syncs.
- **Phase 6 — Content management**: admin CRUD UI for `services`,
  `packages`, `portfolio_items` (incl. image upload to the `portfolio`
  storage bucket already created), `testimonials`. Tables + RLS exist;
  public site now reads live from all four (see above) — only the admin
  forms are missing.
- **Phase 7 — Email notifications**: admin-new-booking email +
  customer-confirmation email. Needs an email provider (Resend/SendGrid)
  wired into a Supabase Edge Function, called from `submitBooking()`
  after a successful insert.
- **Phase 8 — Security hardening pass**: current RLS policies grant
  full admin access to *any* authenticated Supabase user (see comments
  in `0001_init.sql`) — fine for a single-admin studio, but if more staff
  logins are added later, add a real `admin_users` role table and update
  the policies to check membership instead of just `auth.role() =
  'authenticated'`. Also not yet added: rate limiting and CAPTCHA/honeypot
  on the public booking form (currently only the 2-minute duplicate-guard
  trigger protects against spam/double-submits).

## Design system notes (for whoever builds Phase 5+)
- Colors: `ink-*` / `gold-*` in `tailwind.config.js`. Never introduce new
  colors. Reusable classes in `src/index.css`: `.container-px`,
  `.section-py`, `.eyebrow`, `.heading-display`, `.btn-primary`,
  `.btn-ghost`, `.card-surface`. The admin dashboard already follows this
  — copy its patterns for any new admin page.
- `src/config/studio.ts` is the legacy static config, kept only as a
  fallback in `useBusinessSettings()` if Supabase isn't configured yet.

## Deployment prerequisites (owner still needs to do)
1. Create a Supabase project, run `supabase/migrations/0001_init.sql`.
2. Copy `.env.example` → `.env`, fill in Supabase URL/anon key.
3. Create an admin user in Supabase Auth (Authentication → Users → Add User).
4. `npm install && npm run dev` to test locally.
5. Push to GitHub, deploy on Vercel (env vars added there too), point your
   domain at it. Full steps in README.md.

## Phase 6 sub-checkpoint: Testimonials admin done
- `src/admin/pages/TestimonialsAdminPage.tsx` — add/edit/delete, show/hide
  toggle, rating stars, display order. Route: `/admin/content/testimonials`.
  Nav link added to AdminLayout.
- Next piece: Packages admin page (same pattern, apply to `packages` table).
  Then Services (needs icon picker from iconRegistry.ts). Then Portfolio
  (needs image upload via storage.ts — most complex, do last).

## Phase 6 sub-checkpoint: Packages admin done (piece 2/4)
- `src/admin/pages/PackagesAdminPage.tsx` — add/edit/delete, features as
  one-per-line textarea (stored as text[]), featured toggle, show/hide.
  Route: `/admin/content/packages`. Nav link added.
- Next piece: Services admin (needs icon picker from iconRegistry.ts).

## Phase 6 sub-checkpoint: Services admin done (piece 3/4)
- `src/admin/pages/ServicesAdminPage.tsx` — add/edit/delete, icon picker
  (grid of buttons from iconRegistry.ts), features one-per-line, show/hide.
  Route: `/admin/content/services`. Nav link added.
- Last piece remaining: Portfolio admin (image upload via storage.ts,
  category select, image vs video type). This is the biggest of the four
  — do it as its own checkpoint, don't combine with anything else.


## Phase 6 sub-checkpoint: Portfolio admin done (piece 4/4) — PHASE 6 COMPLETE
- `src/admin/pages/PortfolioAdminPage.tsx` — add/edit/delete, category
  select, image/video type toggle, direct file upload via
  uploadPortfolioMedia() (or paste a URL manually), thumbnail upload for
  videos, grid view with show/hide. Route: `/admin/content/portfolio`.
  Nav link added — admin sidebar now has Dashboard, Bookings, Services,
  Portfolio, Testimonials, Packages, Settings.
- All four content types (services, portfolio, testimonials, packages)
  now have full admin CRUD. Public site already reads all of them live
  (from the Phase 6 first checkpoint) with static-data fallback.
- Verified: typecheck + build pass.

**Phase 6 is done end-to-end.** Next priorities in spec order: Phase 5
(Google Sheets sync — needs a Supabase Edge Function) or Phase 7 (email
notifications — same, needs an Edge Function + email provider). Both
need external service credentials the owner will have to provide
(Google service account / email API key), so the code can be built now
but won't be *testable* until those are supplied.
