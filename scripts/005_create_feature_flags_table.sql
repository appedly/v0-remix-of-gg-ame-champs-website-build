-- Create feature_flags table
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.feature_flags enable row level security;

-- RLS Policies
create policy "feature_flags_select_all"
  on public.feature_flags for select
  using (true);

create policy "feature_flags_insert_admin"
  on public.feature_flags for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "feature_flags_update_admin"
  on public.feature_flags for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "feature_flags_delete_admin"
  on public.feature_flags for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create trigger for updated_at
create trigger feature_flags_updated_at
  before update on public.feature_flags
  for each row
  execute function public.handle_updated_at();

-- Insert default feature flags
insert into public.feature_flags (key, enabled, description)
values
  ('pre_launch_mode', true, 'Enable pre-launch mode with coming soon tournaments'),
  ('user_submissions', false, 'Allow users to submit clips'),
  ('public_voting', false, 'Allow public voting on submissions'),
  ('leaderboards', false, 'Show leaderboards')
on conflict (key) do nothing;
