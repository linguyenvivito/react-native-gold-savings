create extension if not exists pgcrypto;

create table if not exists public.assets (
id uuid primary key default gen_random_uuid(),
code text not null unique,
name text not null,
base_unit text not null default 'gram',
qty_scale smallint not null default 8,
created_at timestamptz not null default now()
);

create table if not exists public.market_prices (
id bigserial primary key,
asset_id uuid not null references public.assets(id) on delete cascade,
bid_price numeric(20,6) not null check (bid_price > 0),
ask_price numeric(20,6) not null check (ask_price > 0),
mid_price numeric(20,6) generated always as ((bid_price + ask_price)/2.0) stored,
source text not null,
as_of timestamptz not null,
created_at timestamptz not null default now()
);

create index if not exists idx_market_prices_asset_asof
on public.market_prices(asset_id, as_of desc);

create table if not exists public.cash_accounts (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
currency text not null default 'VND',
balance_available numeric(20,6) not null default 0 check (balance_available >= 0),
balance_locked numeric(20,6) not null default 0 check (balance_locked >= 0),
created_at timestamptz not null default now(),
unique(user_id, currency)
);

create table if not exists public.gold_accounts (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
asset_id uuid not null references public.assets(id) on delete cascade,
qty_available numeric(20,8) not null default 0 check (qty_available >= 0),
qty_locked numeric(20,8) not null default 0 check (qty_locked >= 0),
created_at timestamptz not null default now(),
unique(user_id, asset_id)
);

create type public.order_side as enum ('BUY','SELL');
create type public.order_type as enum ('MARKET','LIMIT');
create type public.order_status as enum ('PENDING','PARTIALLY_FILLED','FILLED','CANCELLED','REJECTED');

create table if not exists public.orders (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
asset_id uuid not null references public.assets(id),
side public.order_side not null,
order_type public.order_type not null default 'MARKET',
quantity numeric(20,8) not null check (quantity > 0),
limit_price numeric(20,6),
status public.order_status not null default 'PENDING',
note text,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
check (
(order_type = 'MARKET' and limit_price is null) or
(order_type = 'LIMIT' and limit_price is not null and limit_price > 0)
)
);

create index if not exists idx_orders_user_created
on public.orders(user_id, created_at desc);

create table if not exists public.order_fills (
id uuid primary key default gen_random_uuid(),
order_id uuid not null references public.orders(id) on delete cascade,
fill_qty numeric(20,8) not null check (fill_qty > 0),
fill_price numeric(20,6) not null check (fill_price > 0),
fee_amount numeric(20,6) not null default 0 check (fee_amount >= 0),
fee_currency text not null default 'VND',
filled_at timestamptz not null default now()
);

create index if not exists idx_fills_order
on public.order_fills(order_id, filled_at desc);

create type public.ledger_direction as enum ('DEBIT','CREDIT');
create type public.ledger_account_type as enum ('CASH','GOLD');

create table if not exists public.ledger_entries (
id bigserial primary key,
user_id uuid not null references auth.users(id) on delete cascade,
account_type public.ledger_account_type not null,
account_id uuid not null,
direction public.ledger_direction not null,
amount numeric(20,8) not null check (amount > 0),
code text not null,
ref_type text not null,
ref_id uuid,
created_at timestamptz not null default now()
);

create index if not exists idx_ledger_user_created
on public.ledger_entries(user_id, created_at desc);

create table if not exists public.holding_lots (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
asset_id uuid not null references public.assets(id),
source_fill_id uuid references public.order_fills(id),
acquired_qty numeric(20,8) not null check (acquired_qty > 0),
remaining_qty numeric(20,8) not null check (remaining_qty >= 0),
acquired_price numeric(20,6) not null check (acquired_price > 0),
acquired_at timestamptz not null default now()
);

create index if not exists idx_lots_user_asset
on public.holding_lots(user_id, asset_id, acquired_at asc);

RLS policies (strict per-user)
alter table public.cash_accounts enable row level security;
alter table public.gold_accounts enable row level security;
alter table public.orders enable row level security;
alter table public.order_fills enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.holding_lots enable row level security;

create policy cash_owner_select on public.cash_accounts
for select using (user_id = auth.uid());

create policy gold_owner_select on public.gold_accounts
for select using (user_id = auth.uid());

create policy orders_owner_select on public.orders
for select using (user_id = auth.uid());

create policy fills_owner_select on public.order_fills
for select using (
exists (
select 1 from public.orders o
where o.id = order_fills.order_id and o.user_id = auth.uid()
));