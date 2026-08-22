/*
  ============================================================
  Lumière Studio — Backend Foundation (Phase 1 & 2)
  ============================================================
  Tables: business_settings, bookings, services, packages,
          portfolio_items, testimonials, audit_logs
  All tables have Row Level Security enabled.
  Public (anon) role can only INSERT bookings and SELECT
  active/public content. Everything else requires an
  authenticated admin (Supabase Auth user).
*/

-- ------------------------------------------------------------
-- 1. business_settings  (single source of truth for contact info)
-- ------------------------------------------------------------
create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  studio_name text not null default 'Lumière Studio',
  tagline text not null default '',
  phone text not null default '',
  whatsapp text not null default '',       -- international format, digits only
  email text not null default '',
  address text not null default '',
  business_hours text not null default '',
  instagram_url text default '',
  facebook_url text default '',
  youtube_url text default '',
  service_area text default '',
  logo_url text default '',
  booking_reference_prefix text not null default 'LS',
  updated_at timestamptz not null default now()
);

-- Only one row should ever exist; seed it.
insert into business_settings (studio_name, tagline, phone, whatsapp, email, address, business_hours, service_area)
select 'Lumière Studio',
       'We don''t just capture moments. We turn them into stories.',
       '+91 98765 43210', '919876543210', 'hello@lumierestudio.example',
       'Mumbai, Maharashtra, India', 'Mon–Sat, 10 AM – 7 PM',
       'Mumbai, Maharashtra, India & destination worldwide'
where not exists (select 1 from business_settings);

alter table business_settings enable row level security;

create policy "public can read business settings"
  on business_settings for select
  to anon, authenticated
  using (true);

create policy "admins can update business settings"
  on business_settings for update
  to authenticated
  using (true) with check (true);

-- ------------------------------------------------------------
-- 2. booking reference sequence + generator
-- ------------------------------------------------------------
create sequence if not exists booking_reference_seq start 1;

create or replace function generate_booking_reference()
returns text
language plpgsql
as $$
declare
  prefix text;
  next_val bigint;
  yr text := to_char(now(), 'YYYY');
begin
  select booking_reference_prefix into prefix from business_settings limit 1;
  if prefix is null then
    prefix := 'LS';
  end if;
  next_val := nextval('booking_reference_seq');
  return prefix || '-' || yr || '-' || lpad(next_val::text, 4, '0');
end;
$$;

-- ------------------------------------------------------------
-- 3. bookings
-- ------------------------------------------------------------
create type booking_status as enum (
  'NEW', 'CONTACTED', 'DISCUSSION', 'QUOTATION_SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
);

create type sheet_sync_status as enum ('PENDING', 'SYNCED', 'FAILED');

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique default generate_booking_reference(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Customer
  customer_name text not null,
  phone text not null,
  whatsapp text,
  email text,

  -- Event
  event_type text not null,
  event_date date,
  event_end_date date,
  event_location text,
  number_of_functions int,
  expected_guests int,

  -- Services
  photography_required boolean not null default false,
  videography_required boolean not null default false,
  editing_required boolean not null default false,
  drone_required boolean not null default false,
  album_required boolean not null default false,
  reels_required boolean not null default false,

  -- Package
  package_type text,
  estimated_budget text,

  -- Requirements
  message text,
  special_requirements text,

  -- Management
  status booking_status not null default 'NEW',
  assigned_team text,
  internal_notes text,
  source text not null default 'website',

  -- Google Sheets sync
  sheet_sync_status sheet_sync_status not null default 'PENDING',
  sheet_sync_error text,
  last_sheet_sync_at timestamptz,

  -- basic server-side duplicate guard: same phone + same event_date within 2 min
  dedupe_key text
);

create index if not exists bookings_status_idx on bookings (status);
create index if not exists bookings_created_at_idx on bookings (created_at desc);
create index if not exists bookings_event_date_idx on bookings (event_date);
create index if not exists bookings_dedupe_idx on bookings (dedupe_key);

alter table bookings enable row level security;

-- Public can INSERT only (never read/update/delete)
create policy "public can submit bookings"
  on bookings for insert
  to anon
  with check (true);

-- Admins (any authenticated user) can do everything.
-- NOTE: tighten this later with a real admin-role check (see README).
create policy "admins can read bookings"
  on bookings for select to authenticated using (true);
create policy "admins can update bookings"
  on bookings for update to authenticated using (true) with check (true);
create policy "admins can delete bookings"
  on bookings for delete to authenticated using (true);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create trigger business_settings_set_updated_at
  before update on business_settings
  for each row execute function set_updated_at();

-- Basic duplicate-submission guard: reject an insert that exactly
-- matches phone + event_type + event_date submitted in the last 2 minutes.
create or replace function prevent_duplicate_booking()
returns trigger language plpgsql as $$
begin
  if exists (
    select 1 from bookings
    where phone = new.phone
      and event_type = new.event_type
      and coalesce(event_date, '1900-01-01') = coalesce(new.event_date, '1900-01-01')
      and created_at > now() - interval '2 minutes'
  ) then
    raise exception 'duplicate_booking';
  end if;
  return new;
end;
$$;

create trigger bookings_prevent_duplicate
  before insert on bookings
  for each row execute function prevent_duplicate_booking();

-- ------------------------------------------------------------
-- 4. services
-- ------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table services enable row level security;
create policy "public can read active services" on services for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
create policy "admins can manage services" on services for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 5. packages
-- ------------------------------------------------------------
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price text,                 -- nullable / "Contact for pricing" when null
  features text[] default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table packages enable row level security;
create policy "public can read active packages" on packages for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
create policy "admins can manage packages" on packages for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 6. portfolio_items
-- ------------------------------------------------------------
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,     -- Weddings, Pre-Wedding, Events, Portraits, Fashion, Models, Commercial, Videos
  media_type text not null default 'image', -- image | video
  media_url text not null,
  thumbnail_url text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table portfolio_items enable row level security;
create policy "public can read active portfolio" on portfolio_items for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
create policy "admins can manage portfolio" on portfolio_items for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 7. testimonials
-- ------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  event_type text,
  location text,
  review text not null,
  rating int check (rating between 1 and 5) default 5,
  photo_url text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy "public can read active testimonials" on testimonials for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
create policy "admins can manage testimonials" on testimonials for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 8. audit_logs (admin-only, never public)
-- ------------------------------------------------------------
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_email text,
  action text not null,
  record_table text,
  record_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
create policy "admins can read audit logs" on audit_logs for select to authenticated using (true);
create policy "admins can write audit logs" on audit_logs for insert to authenticated with check (true);

-- ------------------------------------------------------------
-- 9. Storage bucket for portfolio media (run once)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public can view portfolio media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio');

create policy "admins can upload portfolio media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

create policy "admins can manage portfolio media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio');

create policy "admins can delete portfolio media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');
