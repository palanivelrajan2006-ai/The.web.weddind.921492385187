-- Adds fields needed to fully drive the public Services section from the
-- database (icon selection + bullet-point feature list), matching what
-- src/components/Services.tsx already renders.

alter table services add column if not exists icon_name text not null default 'Camera';
alter table services add column if not exists features text[] not null default '{}';
