create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'admin');
create type public.cart_status as enum ('active', 'converted', 'abandoned');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled');
create type public.prescription_status as enum ('pending', 'approved', 'rejected', 'not_required');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  label text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text,
  country text not null default 'India',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  phone text,
  email text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text,
  country text not null default 'India',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.medicines (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  generic_name text,
  brand_name text,
  description text,
  form text,
  strength text,
  pack_size text,
  requires_prescription boolean not null default false,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  available_quantity integer not null default 0 check (available_quantity >= 0),
  price numeric(12, 2) not null check (price >= 0),
  mrp numeric(12, 2) check (mrp is null or mrp >= 0),
  delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
  is_available boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (pharmacy_id, medicine_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status public.cart_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index carts_one_active_per_user on public.carts(user_id) where status = 'active';

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  inventory_id uuid not null references public.inventory(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, inventory_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  cart_id uuid references public.carts(id) on delete set null,
  delivery_location_id uuid references public.locations(id) on delete set null,
  status public.order_status not null default 'pending',
  prescription_status public.prescription_status not null default 'not_required',
  delivery_address jsonb,
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(12, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  inventory_id uuid references public.inventory(id) on delete set null,
  medicine_id uuid not null references public.medicines(id) on delete restrict,
  pharmacy_id uuid references public.pharmacies(id) on delete set null,
  medicine_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  storage_path text not null,
  status public.prescription_status not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_medicines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, medicine_id)
);

create index locations_user_id_idx on public.locations(user_id);
create index medicines_category_id_idx on public.medicines(category_id);
create index inventory_medicine_id_idx on public.inventory(medicine_id);
create index inventory_pharmacy_id_idx on public.inventory(pharmacy_id);
create index cart_items_cart_id_idx on public.cart_items(cart_id);
create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index prescriptions_user_id_idx on public.prescriptions(user_id);
create index saved_medicines_user_id_idx on public.saved_medicines(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['users', 'locations', 'pharmacies', 'categories', 'medicines', 'inventory', 'carts', 'cart_items', 'orders', 'prescriptions'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.locations enable row level security;
alter table public.pharmacies enable row level security;
alter table public.categories enable row level security;
alter table public.medicines enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.prescriptions enable row level security;
alter table public.saved_medicines enable row level security;

create policy "Users can view their profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their locations" on public.locations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Anyone can view pharmacies" on public.pharmacies for select using (true);
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Anyone can view medicines" on public.medicines for select using (true);
create policy "Anyone can view available inventory" on public.inventory for select using (is_available = true);

create policy "Users manage their carts" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their cart items" on public.cart_items for all using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
) with check (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

create policy "Users view their orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create their orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users view their order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create policy "Users manage their prescriptions" on public.prescriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their saved medicines" on public.saved_medicines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);