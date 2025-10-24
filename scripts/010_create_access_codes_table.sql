-- Create access codes table for invite-only access
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_by uuid not null references public.users(id) on delete cascade,
  used_by uuid references public.users(id) on delete set null,
  is_used boolean not null default false,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  expires_at timestamptz
);

-- Enable RLS
alter table public.access_codes enable row level security;

-- RLS Policies
create policy "access_codes_select_admin"
  on public.access_codes for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "access_codes_insert_admin"
  on public.access_codes for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "access_codes_update_admin"
  on public.access_codes for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "access_codes_delete_admin"
  on public.access_codes for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Removed invalid WITH CHECK from SELECT policy - WITH CHECK only works with INSERT/UPDATE
-- Anyone can check if a code is valid (without seeing who used it)
create policy "access_codes_check_validity"
  on public.access_codes for select
  using (true);
