# Lumière Studio — Photography & Videography Website

A premium photography/videography studio website with a full booking backend
and admin dashboard, built on React + TypeScript + Tailwind + Supabase.

If you're picking this project back up after a break, read **PROGRESS.md**
first — it tracks exactly what's built and what's left.

---

## 1. What this is

- **Public site** (`/`) — the original Bolt-built design, now with a working
  booking form that saves enquiries to a database.
- **Admin dashboard** (`/admin`) — password-protected. View bookings, change
  status, contact customers on WhatsApp, and edit the studio's public phone
  number / WhatsApp / email / socials without touching any code.

---

## 2. One-time setup

### Step 1 — Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New Project (free tier is fine).
2. Wait for it to finish provisioning (~2 minutes).

### Step 2 — Run the database schema
1. In your Supabase project, open **SQL Editor**.
2. Open `supabase/migrations/0001_init.sql` from this repo, copy all of it,
   paste into the SQL Editor, and click **Run**.
3. This creates all tables (bookings, business_settings, services, etc.),
   security rules, and a storage bucket for portfolio photos.

### Step 3 — Get your API keys
1. In Supabase: **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public key**.

### Step 4 — Configure the project
1. Copy `.env.example` to a new file named `.env`.
2. Paste in your values:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. Never commit `.env` to Git — it's already in `.gitignore`.

### Step 5 — Create your admin login
1. In Supabase: **Authentication → Users → Add User**.
2. Enter your email and a password. Confirm the email automatically (toggle
   "Auto Confirm User").
3. This is what you'll use to log in at `/admin/login`.

### Step 6 — Run it locally
```bash
npm install
npm run dev
```
Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin/login` for the admin dashboard.

---

## 3. Deploying the live website

The simplest free option is **Vercel** (also works with Netlify).

1. Push this repo to GitHub (if you haven't already: `git push`).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import
   your GitHub repo.
3. Vercel auto-detects it's a Vite project. Before deploying, add your
   environment variables (Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. You'll get a live URL like `your-project.vercel.app`.
5. To use your own domain (e.g. `lumierestudio.com`): Vercel → Settings →
   Domains → add it, then update your domain registrar's DNS records as
   Vercel instructs (usually just an A record or CNAME — takes a few
   minutes to a few hours to go live).

`vercel.json` (already in this repo) makes sure admin pages like
`/admin/bookings/123` work correctly after a page refresh.

---

## 4. Using the admin dashboard day-to-day

- **Log in** at `yourdomain.com/admin/login` with the email/password you
  created in Step 5 above.
- **Dashboard** — enquiry counts, upcoming confirmed events, recent
  enquiries, Google Sheets sync status.
- **Bookings** — search, filter by status/event type, sort, export to CSV.
  Click any booking to open its detail page: change status, message the
  customer on WhatsApp (pre-filled with their name and booking reference),
  add internal notes (never shown publicly), assign a team.
- **Settings** — change your phone number, WhatsApp number, email, address,
  business hours, and social links. These update the entire public website
  immediately — no code changes needed.

---

## 5. How to change your phone / WhatsApp number

Log into `/admin`, go to **Settings**, update the field, click **Save
Changes**. It updates everywhere at once: the hero, the floating WhatsApp
button, the contact section, the footer, and the booking success screen.

---

## 6. What's not built yet

See **PROGRESS.md** for the full list and technical notes. In short:
Google Sheets sync, email notifications, and content management (services /
packages / portfolio / testimonials) still need to be built. The database
tables and security rules for all of them already exist.

---

## 7. Project structure

```
src/
  components/       Public site sections (Hero, Contact, Footer, etc.)
  admin/
    pages/          Admin dashboard pages (Dashboard, Bookings, Settings)
    components/     Admin layout, status badge, auth guard
    lib/            Admin data-fetching, audit logging
  lib/               Supabase client, booking submission logic
  hooks/             useBusinessSettings (live contact info)
  types/database.ts  TypeScript types matching the DB schema
supabase/
  migrations/0001_init.sql   Full database schema + security rules
```

---

## 8. Local development commands

```bash
npm run dev         # local dev server
npm run build        # production build (also run before every deploy to catch errors)
npm run typecheck    # TypeScript check
npm run lint          # ESLint
```
