-- Create votes table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(submission_id, user_id)
);

-- Enable RLS
alter table public.votes enable row level security;

-- RLS Policies
create policy "votes_select_all"
  on public.votes for select
  using (true);

create policy "votes_insert_own"
  on public.votes for insert
  with check (auth.uid() = user_id);

create policy "votes_delete_own"
  on public.votes for delete
  using (auth.uid() = user_id);

-- Function to update submission score when vote is added/removed
create or replace function public.update_submission_score()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.submissions
    set score = score + 1
    where id = new.submission_id;
  elsif TG_OP = 'DELETE' then
    update public.submissions
    set score = score - 1
    where id = old.submission_id;
  end if;
  return null;
end;
$$;

create trigger votes_update_score
  after insert or delete on public.votes
  for each row
  execute function public.update_submission_score();
