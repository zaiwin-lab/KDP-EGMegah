-- ============================================================================
-- Land2Home Concierge — schema and row-level security
-- Run in the Supabase SQL editor, or: supabase db push
--
-- Access model
--   member : sees only their own profile, land, application, project and
--            everything hanging off that project. Can write their own draft
--            data and upload documents. Can never write a payment or a
--            verification field.
--   kobis  : journey coordination. Reads everything in the org, records
--            technical verification, publishes progress updates.
--   kpsm   : membership and payment governance. The only role that can move
--            a payment release to authorised or paid.
--   egmh   : the builder. Reads the projects it is assigned to, submits
--            progress updates and payment claims, records rectification.
--
-- Every table carries org_id so one deployment can serve several
-- cooperative/builder pairs without a schema change.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── enums ───────────────────────────────────────────────────────────────────
do $$ begin
  create type portal_role as enum ('member', 'kobis', 'kpsm', 'egmh');
exception when duplicate_object then null; end $$;

do $$ begin
  create type stage_key as enum ('land', 'home', 'plan', 'build', 'inspection', 'keys');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('unverified', 'pending', 'verified', 'query');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum
    ('draft', 'submitted', 'in_review', 'site_assessment', 'quotation_issued', 'approved', 'declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_stage_status as enum
    ('not_due', 'claim_submitted', 'technical_verification', 'awaiting_authorisation', 'authorised', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type defect_status as enum ('open', 'in_progress', 'resolved');
exception when duplicate_object then null; end $$;

-- ── tenancy and identity ────────────────────────────────────────────────────
create table if not exists orgs (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  short_name   text not null,
  cooperative  text not null,
  builder      text not null,
  operator     text not null,
  created_at   timestamptz not null default now()
);

-- Mirrors auth.users, adding the portal role. Written by an admin or a
-- trigger on sign-up, never by the member.
create table if not exists user_accounts (
  id            uuid primary key references auth.users (id) on delete cascade,
  org_id        uuid not null references orgs (id) on delete cascade,
  email         text not null,
  role          portal_role not null,
  display_name  text not null,
  job_title     text,
  created_at    timestamptz not null default now()
);
create index if not exists user_accounts_org_idx on user_accounts (org_id);

-- Helper functions used by every policy below. SECURITY DEFINER so a policy
-- can read user_accounts without recursing through its own policy.
create or replace function auth_role() returns portal_role
language sql stable security definer set search_path = public as $$
  select role from user_accounts where id = auth.uid();
$$;

create or replace function auth_org() returns uuid
language sql stable security definer set search_path = public as $$
  select org_id from user_accounts where id = auth.uid();
$$;

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth_role() in ('kobis', 'kpsm', 'egmh'), false);
$$;

-- The profile belonging to the signed-in member, if any.
create or replace function my_profile_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from member_profiles where user_id = auth.uid();
$$;

-- ── member profile: captured once, reused everywhere ────────────────────────
create table if not exists member_profiles (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references orgs (id) on delete cascade,
  user_id               uuid not null unique references auth.users (id) on delete cascade,
  full_name             text not null,
  ic_number             text not null,
  membership_no         text not null,
  membership_status     verification_status not null default 'unverified',
  membership_verified_at timestamptz,
  email                 text not null,
  phone                 text,
  address_line1         text,
  address_line2         text,
  postcode              text,
  town                  text,
  state                 text,
  employer              text,
  monthly_income        numeric(12,2),
  household_size        int,
  co_applicant_name     text,
  co_applicant_ic       text,
  preferred_language    text not null default 'en',
  -- Consent is recorded per purpose with the time it was given.
  consents              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (org_id, membership_no)
);
create index if not exists member_profiles_org_idx on member_profiles (org_id);

create table if not exists land_parcels (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references orgs (id) on delete cascade,
  profile_id          uuid not null references member_profiles (id) on delete cascade,
  title_no            text not null,
  lot_no              text,
  district            text,
  state               text,
  area_sq_ft          numeric(12,2),
  tenure              text,
  ownership           text,
  road_access         boolean default false,
  power_nearby        boolean default false,
  water_nearby        boolean default false,
  verification_status verification_status not null default 'unverified',
  verified_by         text,
  verified_at         timestamptz,
  verification_note   text,
  created_at          timestamptz not null default now()
);
create index if not exists land_parcels_profile_idx on land_parcels (profile_id);

create table if not exists applications (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs (id) on delete cascade,
  profile_id      uuid not null references member_profiles (id) on delete cascade,
  land_id         uuid references land_parcels (id) on delete set null,
  reference       text not null unique,
  house_type      text,
  custom_brief    text,
  budget_band     text,
  financing_route text,
  target_start    date,
  status          application_status not null default 'draft',
  -- Auto-save: where the member left off, so they can resume later.
  last_step       int not null default 1,
  completed_steps int[] not null default '{}',
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists applications_profile_idx on applications (profile_id);
-- Catches a member starting a second application while one is live.
create unique index if not exists applications_one_live_per_member
  on applications (profile_id)
  where status not in ('declined');

-- ── project and construction ────────────────────────────────────────────────
create table if not exists projects (
  id                 uuid primary key default gen_random_uuid(),
  org_id             uuid not null references orgs (id) on delete cascade,
  profile_id         uuid not null references member_profiles (id) on delete cascade,
  application_id     uuid not null references applications (id) on delete restrict,
  reference          text not null unique,
  house_type         text not null,
  house_name         text not null,
  built_up_sq_ft     numeric(10,2),
  site_label         text,
  district           text,
  state              text,
  contract_sum       numeric(14,2) not null,
  contract_signed_at timestamptz,
  started_at         date,
  target_handover    date,
  current_stage      stage_key not null default 'plan',
  construction_phase text,
  overall_progress   int not null default 0 check (overall_progress between 0 and 100),
  schedule_status    text not null default 'on_schedule',
  coordinator_name   text,
  coordinator_role   text,
  coordinator_phone  text,
  coordinator_email  text,
  site_supervisor    text,
  created_at         timestamptz not null default now()
);
create index if not exists projects_profile_idx on projects (profile_id);

-- Which EGMH users may act on which project.
create table if not exists project_assignments (
  project_id uuid not null references projects (id) on delete cascade,
  user_id    uuid not null references user_accounts (id) on delete cascade,
  primary key (project_id, user_id)
);

create or replace function assigned_to_project(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from project_assignments where project_id = p and user_id = auth.uid());
$$;

create table if not exists milestones (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references orgs (id) on delete cascade,
  project_id    uuid not null references projects (id) on delete cascade,
  sequence      int not null,
  title         text not null,
  member_title  text not null,
  expected_date date,
  actual_date   date,
  status        text not null default 'not_started',
  weight        int not null default 10,
  unique (project_id, sequence)
);

create table if not exists progress_updates (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references orgs (id) on delete cascade,
  project_id            uuid not null references projects (id) on delete cascade,
  reported_on           date not null,
  technical_summary     text,
  work_completed        text,
  current_work          text,
  next_activity         text,
  expected_next_date    date,
  delay_reason          text,
  milestone_id          uuid references milestones (id) on delete set null,
  photos                jsonb not null default '[]'::jsonb,
  -- The member-facing wording. Assisted drafting is allowed; a person
  -- always reviews it before published flips to true.
  member_summary        text not null,
  member_summary_source text not null default 'manual',
  submitted_by          text not null,
  verified_by           text,
  verified_at           timestamptz,
  published             boolean not null default false,
  created_at            timestamptz not null default now()
);
create index if not exists progress_updates_project_idx on progress_updates (project_id, reported_on desc);

-- ── KPSM-managed staged payment ─────────────────────────────────────────────
create table if not exists payment_stages (
  id                 uuid primary key default gen_random_uuid(),
  org_id             uuid not null references orgs (id) on delete cascade,
  project_id         uuid not null references projects (id) on delete cascade,
  sequence           int not null check (sequence between 1 and 4),
  title              text not null,
  member_description text not null,
  percentage         numeric(5,2) not null,
  amount             numeric(14,2) not null,
  status             payment_stage_status not null default 'not_due',
  claim_submitted_at timestamptz,
  claim_reference    text,
  evidence_note      text,
  verified_by        text,
  verified_at        timestamptz,
  authorised_by      text,
  authorised_at      timestamptz,
  paid_at            timestamptz,
  payment_reference  text,
  member_notified_at timestamptz,
  unique (project_id, sequence)
);

-- Authorisation and payment are human acts. This trigger refuses to let
-- either state be reached without a named authorising officer, whatever
-- the calling code does.
create or replace function enforce_payment_authorisation()
returns trigger language plpgsql as $$
begin
  if new.status in ('authorised', 'paid') and coalesce(new.authorised_by, '') = '' then
    raise exception 'A payment release cannot be authorised without a named authorising officer';
  end if;
  if new.status = 'paid' and new.authorised_at is null then
    raise exception 'A payment cannot be recorded before it has been authorised';
  end if;
  return new;
end $$;

drop trigger if exists payment_authorisation_guard on payment_stages;
create trigger payment_authorisation_guard
  before insert or update on payment_stages
  for each row execute function enforce_payment_authorisation();

-- ── documents ───────────────────────────────────────────────────────────────
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs (id) on delete cascade,
  profile_id  uuid not null references member_profiles (id) on delete cascade,
  project_id  uuid references projects (id) on delete set null,
  kind        text not null,
  title       text not null,
  file_name   text not null,
  -- Path inside the private `member-documents` storage bucket.
  storage_path text,
  size_kb     int,
  uploaded_at timestamptz not null default now(),
  uploaded_by text not null,
  valid_until date,
  status      text not null default 'pending_review',
  verified_by text,
  verified_at timestamptz,
  -- Assisted extraction. reviewed=false means no one has confirmed it yet,
  -- and nothing in here counts as verified either way.
  extraction  jsonb
);
create index if not exists documents_profile_idx on documents (profile_id, uploaded_at desc);

-- ── inspection, defects, handover, warranty ─────────────────────────────────
create table if not exists inspections (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references orgs (id) on delete cascade,
  project_id    uuid not null unique references projects (id) on delete cascade,
  scheduled_for timestamptz,
  completed_at  timestamptz,
  inspector     text,
  status        text not null default 'not_scheduled',
  checklist     jsonb not null default '[]'::jsonb
);

create table if not exists defects (
  id                   uuid primary key default gen_random_uuid(),
  org_id               uuid not null references orgs (id) on delete cascade,
  project_id           uuid not null references projects (id) on delete cascade,
  reference            text not null,
  area                 text not null,
  description          text not null,
  reported_by          text not null,
  reported_on          date not null default current_date,
  status               defect_status not null default 'open',
  priority             text not null default 'routine',
  photos               jsonb not null default '[]'::jsonb,
  rectification_note   text,
  rectification_photos jsonb not null default '[]'::jsonb,
  resolved_on          date,
  member_confirmed     boolean not null default false,
  unique (project_id, reference)
);

create table if not exists handovers (
  id                      uuid primary key default gen_random_uuid(),
  org_id                  uuid not null references orgs (id) on delete cascade,
  project_id              uuid not null unique references projects (id) on delete cascade,
  status                  text not null default 'not_ready',
  appointment_at          timestamptz,
  location                text,
  attendees               jsonb not null default '[]'::jsonb,
  keys_released_at        timestamptz,
  defects_liability_until date,
  notes                   text
);

create table if not exists warranty_items (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs (id) on delete cascade,
  project_id uuid not null references projects (id) on delete cascade,
  item       text not null,
  provider   text not null,
  covers     text not null,
  until      date not null
);

create table if not exists warranty_requests (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references orgs (id) on delete cascade,
  project_id    uuid not null references projects (id) on delete cascade,
  reference     text not null,
  raised_on     date not null default current_date,
  category      text not null,
  description   text not null,
  status        defect_status not null default 'open',
  response_note text,
  scheduled_for timestamptz,
  unique (project_id, reference)
);

-- ── notifications and audit ─────────────────────────────────────────────────
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs (id) on delete cascade,
  profile_id uuid not null references member_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  title      text not null,
  body       text not null,
  channel    text not null,
  read       boolean not null default false,
  link       text
);
create index if not exists notifications_profile_idx on notifications (profile_id, created_at desc);

create table if not exists audit_records (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references orgs (id) on delete cascade,
  at               timestamptz not null default now(),
  actor_id         uuid references user_accounts (id) on delete set null,
  actor_name       text not null,
  actor_role       portal_role not null,
  action           text not null,
  entity           text not null,
  entity_ref       text not null,
  detail           text not null,
  human_authorised boolean not null default true
);
create index if not exists audit_records_at_idx on audit_records (at desc);

-- Audit records are append-only. Nothing may edit or delete history.
create or replace function refuse_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Audit records cannot be changed or deleted';
end $$;

drop trigger if exists audit_records_immutable on audit_records;
create trigger audit_records_immutable
  before update or delete on audit_records
  for each row execute function refuse_audit_mutation();

-- Default org_id from the acting user so no client has to send it.
create or replace function set_org_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.org_id is null then new.org_id := auth_org(); end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'member_profiles','land_parcels','applications','projects','milestones','progress_updates',
    'payment_stages','documents','inspections','defects','handovers','warranty_items',
    'warranty_requests','notifications','audit_records'
  ] loop
    execute format('drop trigger if exists set_org_id_trigger on %I', t);
    execute format('create trigger set_org_id_trigger before insert on %I for each row execute function set_org_id()', t);
  end loop;
end $$;

-- ============================================================================
-- Row-level security
-- ============================================================================

alter table orgs               enable row level security;
alter table user_accounts      enable row level security;
alter table member_profiles    enable row level security;
alter table land_parcels       enable row level security;
alter table applications       enable row level security;
alter table projects           enable row level security;
alter table project_assignments enable row level security;
alter table milestones         enable row level security;
alter table progress_updates   enable row level security;
alter table payment_stages     enable row level security;
alter table documents          enable row level security;
alter table inspections        enable row level security;
alter table defects            enable row level security;
alter table handovers          enable row level security;
alter table warranty_items     enable row level security;
alter table warranty_requests  enable row level security;
alter table notifications      enable row level security;
alter table audit_records      enable row level security;

-- orgs / accounts
create policy orgs_read on orgs for select using (id = auth_org());
create policy accounts_self on user_accounts for select using (id = auth.uid() or org_id = auth_org() and is_staff());

-- profile
create policy profiles_member_read on member_profiles for select
  using (user_id = auth.uid() or (org_id = auth_org() and is_staff()));
create policy profiles_member_write on member_profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_staff_write on member_profiles for update
  using (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'));
create policy profiles_insert on member_profiles for insert
  with check (user_id = auth.uid() or auth_role() in ('kobis', 'kpsm'));

-- land
create policy land_read on land_parcels for select
  using (profile_id = my_profile_id() or (org_id = auth_org() and is_staff()));
create policy land_member_write on land_parcels for all
  using (profile_id = my_profile_id() and verification_status <> 'verified')
  with check (profile_id = my_profile_id());
create policy land_staff_write on land_parcels for update
  using (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'));

-- application
create policy applications_read on applications for select
  using (profile_id = my_profile_id() or (org_id = auth_org() and is_staff()));
create policy applications_member_write on applications for all
  using (profile_id = my_profile_id() and status in ('draft', 'submitted'))
  with check (profile_id = my_profile_id());
create policy applications_staff_write on applications for update
  using (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'));

-- project: the member sees theirs, EGMH sees what it is assigned
create policy projects_read on projects for select
  using (
    profile_id = my_profile_id()
    or (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'))
    or (auth_role() = 'egmh' and assigned_to_project(id))
  );
create policy projects_staff_write on projects for update
  using (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'));

create policy assignments_read on project_assignments for select
  using (user_id = auth.uid() or is_staff());

-- Everything hanging off a project inherits that project's visibility.
create or replace function can_see_project(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from projects pr
    where pr.id = p
      and (
        pr.profile_id = my_profile_id()
        or (pr.org_id = auth_org() and auth_role() in ('kobis', 'kpsm'))
        or (auth_role() = 'egmh' and assigned_to_project(pr.id))
      )
  );
$$;

create policy milestones_read on milestones for select using (can_see_project(project_id));
create policy milestones_write on milestones for all
  using (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'))
  with check (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'));

-- A member only ever sees a published update.
create policy progress_member_read on progress_updates for select
  using (can_see_project(project_id) and (published or is_staff()));
create policy progress_egmh_write on progress_updates for insert
  with check (can_see_project(project_id) and auth_role() = 'egmh');
-- Only KOBIS may publish; EGMH may correct its own draft while unpublished.
create policy progress_publish on progress_updates for update
  using (can_see_project(project_id) and (auth_role() = 'kobis' or (auth_role() = 'egmh' and not published)));

-- Payments: everyone involved can read; only the right role can move each step.
create policy payments_read on payment_stages for select using (can_see_project(project_id));
create policy payments_egmh_claim on payment_stages for update
  using (can_see_project(project_id) and auth_role() = 'egmh' and status in ('not_due', 'claim_submitted'));
create policy payments_kobis_verify on payment_stages for update
  using (can_see_project(project_id) and auth_role() = 'kobis'
         and status in ('claim_submitted', 'technical_verification'));
create policy payments_kpsm_authorise on payment_stages for update
  using (can_see_project(project_id) and auth_role() = 'kpsm');

-- Documents: a member reads and uploads their own; staff read and verify.
create policy documents_read on documents for select
  using (profile_id = my_profile_id() or (org_id = auth_org() and is_staff()));
create policy documents_member_insert on documents for insert
  with check (profile_id = my_profile_id());
create policy documents_member_update on documents for update
  using (profile_id = my_profile_id() and status = 'pending_review')
  with check (profile_id = my_profile_id());
create policy documents_staff_update on documents for update
  using (org_id = auth_org() and auth_role() in ('kobis', 'kpsm'));

create policy inspections_read on inspections for select using (can_see_project(project_id));
create policy inspections_write on inspections for all
  using (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'))
  with check (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'));

create policy defects_read on defects for select using (can_see_project(project_id));
create policy defects_member_raise on defects for insert
  with check (can_see_project(project_id));
create policy defects_member_confirm on defects for update
  using (can_see_project(project_id) and auth_role() = 'member' and status = 'resolved');
create policy defects_staff_update on defects for update
  using (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'));

create policy handovers_read on handovers for select using (can_see_project(project_id));
create policy handovers_write on handovers for update
  using (can_see_project(project_id) and (auth_role() in ('kobis', 'kpsm') or auth_role() = 'member'));

create policy warranty_items_read on warranty_items for select using (can_see_project(project_id));
create policy warranty_requests_read on warranty_requests for select using (can_see_project(project_id));
create policy warranty_requests_raise on warranty_requests for insert
  with check (can_see_project(project_id));
create policy warranty_requests_update on warranty_requests for update
  using (can_see_project(project_id) and auth_role() in ('kobis', 'egmh'));

create policy notifications_read on notifications for select
  using (profile_id = my_profile_id() or (org_id = auth_org() and is_staff()));
create policy notifications_mark_read on notifications for update
  using (profile_id = my_profile_id()) with check (profile_id = my_profile_id());
create policy notifications_staff_insert on notifications for insert
  with check (org_id = auth_org() and is_staff());

-- Audit: staff read the whole trail, a member reads entries about their
-- own project. Inserts are allowed; the trigger above blocks edits.
create policy audit_read on audit_records for select
  using ((org_id = auth_org() and is_staff()) or actor_id = auth.uid());
create policy audit_insert on audit_records for insert
  with check (org_id = auth_org());

-- ============================================================================
-- Private document storage
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('member-documents', 'member-documents', false)
on conflict (id) do nothing;

-- Objects are stored under <profile_id>/<document_id>-<file name>, so the
-- first path segment is what the policies check.
create policy "member reads own documents" on storage.objects for select
  using (bucket_id = 'member-documents' and (storage.foldername(name))[1] = my_profile_id()::text);

create policy "member uploads own documents" on storage.objects for insert
  with check (bucket_id = 'member-documents' and (storage.foldername(name))[1] = my_profile_id()::text);

create policy "staff read member documents" on storage.objects for select
  using (bucket_id = 'member-documents' and is_staff());
