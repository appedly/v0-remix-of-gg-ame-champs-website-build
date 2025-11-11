-- Create waitlist table for early access signups
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  referral_source text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- RLS Policies
create policy "waitlist_insert_all"
  on public.waitlist for insert
  with check (true);

-- Only admins can view waitlist
create policy "waitlist_select_admin"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
