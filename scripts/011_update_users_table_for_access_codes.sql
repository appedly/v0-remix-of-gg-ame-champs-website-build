-- Add access_code_id column to users table
alter table public.users add column if not exists access_code_id uuid references public.access_codes(id) on delete set null;

-- Update waitlist table to track if user was added via access code
alter table public.waitlist add column if not exists access_code_used boolean default false;
