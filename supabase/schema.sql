create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  phone text not null,
  memo text not null default '',
  date date not null,
  slot text not null,
  items jsonb not null,
  total int not null,
  status text not null default 'new' check (status in ('new','ok','done','cancel')),
  created_at timestamptz not null default now()
);
create index bookings_date_idx on public.bookings (date);

-- 開啟 RLS 且不建立任何 policy：anon key 完全讀寫不到，
-- 只有伺服器端（Cloudflare Functions）用 service_role key 才能存取。
alter table public.bookings enable row level security;
