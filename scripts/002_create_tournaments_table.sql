-- Create tournaments table
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  game text not null,
  prize_pool text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'ended', 'cancelled')),
  max_participants integer,
  rules jsonb,
  thumbnail_url text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.tournaments enable row level security;

-- RLS Policies
create policy "tournaments_select_all"
  on public.tournaments for select
  using (true);

create policy "tournaments_insert_admin"
  on public.tournaments for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "tournaments_update_admin"
  on public.tournaments for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "tournaments_delete_admin"
  on public.tournaments for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create trigger for updated_at
create trigger tournaments_updated_at
  before update on public.tournaments
  for each row
  execute function public.handle_updated_at();
