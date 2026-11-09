create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  source jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads (lower(email));

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  shop_domain text not null unique,
  access_token_encrypted text,
  scopes text,
  connection_status text not null default 'pending',
  selected_plan text not null default 'free',
  build_status text not null default 'not_started',
  build_error text,
  connected_at timestamptz,
  build_started_at timestamptz,
  build_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shops_connection_status_check check (connection_status in ('pending', 'connected', 'revoked', 'error')),
  constraint shops_selected_plan_check check (selected_plan in ('free', 'premium_97', 'premium_47')),
  constraint shops_build_status_check check (build_status in ('not_started', 'queued', 'building', 'complete', 'error'))
);

create table if not exists funnel_events (
  id bigint generated always as identity primary key,
  lead_id uuid references leads(id) on delete set null,
  shop_id uuid references shops(id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_name_created_idx on funnel_events (event_name, created_at desc);
create index if not exists funnel_events_shop_idx on funnel_events (shop_id, created_at desc);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  shop_id uuid references shops(id) on delete set null,
  processor text not null,
  processor_transaction_id text not null unique,
  product_code text not null,
  amount_cents integer not null check (amount_cents >= 0),
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists build_jobs (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  plan text not null,
  status text not null default 'queued',
  progress integer not null default 0 check (progress between 0 and 100),
  current_step text,
  result jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists build_jobs_shop_created_idx on build_jobs (shop_id, created_at desc);
