-- Create submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  clip_url text not null,
  title text not null,
  description text,
  score integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tournament_id, user_id)
);

-- Enable RLS
alter table public.submissions enable row level security;

-- RLS Policies
create policy "submissions_select_all"
  on public.submissions for select
  using (true);

create policy "submissions_insert_own"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "submissions_update_own"
  on public.submissions for update
  using (auth.uid() = user_id);

-- Admins can update any submission
create policy "submissions_update_admin"
  on public.submissions for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "submissions_delete_own"
  on public.submissions for delete
  using (auth.uid() = user_id);

-- Admins can delete any submission
create policy "submissions_delete_admin"
  on public.submissions for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create trigger for updated_at
create trigger submissions_updated_at
  before update on public.submissions
  for each row
  execute function public.handle_updated_at();
